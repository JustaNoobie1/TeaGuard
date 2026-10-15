import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";

const projectRoot = resolve(process.cwd());
const reviewDir = join(projectRoot, ".impeccable", "review");
const appUrl = "http://127.0.0.1:5173/";
const chromePath = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
const uploadPath = join(projectRoot, "results", "gradcam_examples", "4._Helopeltis_pred_4._Helopeltis_1_95.3.jpg");
const gradcamPath = join(projectRoot, "backend", "static", "gradcam", "0e7175a04ba34fcd9753af02995d773e.png");
const profileDir = mkdtempSync(join(tmpdir(), "teaguard-qa-"));
const port = 9300 + Math.floor(Math.random() * 300);

mkdirSync(reviewDir, { recursive: true });

const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profileDir}`,
    "--disable-background-networking",
    "--disable-component-update",
    "--disable-default-apps",
    "--disable-extensions",
    "--disable-gpu",
    "--force-device-scale-factor=1",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    "about:blank",
  ],
  { stdio: "ignore", windowsHide: true },
);

const pause = (milliseconds) => new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

async function waitForDebugger() {
  const endpoint = `http://127.0.0.1:${port}/json/version`;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      return await fetchJson(endpoint);
    } catch {
      await pause(100);
    }
  }
  throw new Error("Chrome DevTools did not become available.");
}

function connect(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  const pending = new Map();
  const eventWaiters = new Map();
  const eventHandlers = new Map();
  let nextId = 1;

  socket.onmessage = (message) => {
    const payload = JSON.parse(message.data);
    if (payload.id) {
      const waiter = pending.get(payload.id);
      if (!waiter) return;
      pending.delete(payload.id);
      if (payload.error) waiter.reject(new Error(payload.error.message));
      else waiter.resolve(payload.result);
      return;
    }

    const waiters = eventWaiters.get(payload.method) || [];
    eventWaiters.delete(payload.method);
    waiters.forEach((resolveEvent) => resolveEvent(payload.params));
    (eventHandlers.get(payload.method) || []).forEach((handler) => handler(payload.params));
  };

  const opened = new Promise((resolveOpen, rejectOpen) => {
    socket.onopen = resolveOpen;
    socket.onerror = () => rejectOpen(new Error("Chrome DevTools WebSocket failed to open."));
  });

  return {
    opened,
    close: () => socket.close(),
    on(method, handler) {
      const handlers = eventHandlers.get(method) || [];
      handlers.push(handler);
      eventHandlers.set(method, handlers);
    },
    once(method, timeout = 10000) {
      return new Promise((resolveEvent, rejectEvent) => {
        const timer = setTimeout(() => rejectEvent(new Error(`Timed out waiting for ${method}`)), timeout);
        const waiters = eventWaiters.get(method) || [];
        waiters.push((params) => {
          clearTimeout(timer);
          resolveEvent(params);
        });
        eventWaiters.set(method, waiters);
      });
    },
    send(method, params = {}) {
      return new Promise((resolveCommand, rejectCommand) => {
        const id = nextId;
        nextId += 1;
        pending.set(id, { resolve: resolveCommand, reject: rejectCommand });
        socket.send(JSON.stringify({ id, method, params }));
      });
    },
  };
}

async function waitForSelector(cdp, selector, timeout = 12000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    const response = await cdp.send("Runtime.evaluate", {
      expression: `Boolean(document.querySelector(${JSON.stringify(selector)}))`,
      returnByValue: true,
    });
    if (response.result.value) return;
    await pause(100);
  }
  throw new Error(`Timed out waiting for ${selector}`);
}

async function setViewport(cdp, width, height, mobile) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile,
    screenWidth: width,
    screenHeight: height,
  });
  await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: mobile, maxTouchPoints: mobile ? 5 : 1 });
}

async function navigate(cdp) {
  const loaded = cdp.once("Page.loadEventFired");
  await cdp.send("Page.navigate", { url: appUrl });
  await loaded;
  await cdp.send("Runtime.evaluate", { expression: "document.fonts.ready", awaitPromise: true });
  await waitForSelector(cdp, ".app-shell");
  await pause(150);
}

async function screenshot(cdp, filename, fullPage = true) {
  let clip;
  if (fullPage) {
    const metrics = await cdp.send("Page.getLayoutMetrics");
    const size = metrics.cssContentSize || metrics.contentSize;
    clip = { x: 0, y: 0, width: Math.ceil(size.width), height: Math.ceil(size.height), scale: 1 };
  }
  const capture = await cdp.send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: fullPage,
    ...(clip ? { clip } : {}),
  });
  writeFileSync(join(reviewDir, filename), Buffer.from(capture.data, "base64"));
}

async function evaluateValue(cdp, expression) {
  const response = await cdp.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  return response.result.value;
}

let cdp;
try {
  await waitForDebugger();
  const target = await fetchJson(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(appUrl)}`, { method: "PUT" });
  cdp = connect(target.webSocketDebuggerUrl);
  await cdp.opened;

  await Promise.all([
    cdp.send("Page.enable"),
    cdp.send("Runtime.enable"),
    cdp.send("DOM.enable"),
    cdp.send("Fetch.enable", { patterns: [{ urlPattern: "http://localhost:8000/predict", requestStage: "Request" }] }),
  ]);

  const gradcamDataUrl = `data:image/png;base64,${readFileSync(gradcamPath).toString("base64")}`;
  const mockResponse = {
    status: "success",
    prediction: {
      class_name: "Helopeltis",
      confidence: 0.953,
      severity: "High",
      color: "#b86e2f",
      recommendation: "Inspect for pest spread and apply pest management practices.",
      gradcam_url: gradcamDataUrl,
    },
  };

  cdp.on("Fetch.requestPaused", async (event) => {
    if (event.request.url === "http://localhost:8000/predict") {
      if (event.request.method === "OPTIONS") {
        await cdp.send("Fetch.fulfillRequest", {
          requestId: event.requestId,
          responseCode: 204,
          responseHeaders: [
            { name: "Access-Control-Allow-Origin", value: "*" },
            { name: "Access-Control-Allow-Methods", value: "POST, OPTIONS" },
            { name: "Access-Control-Allow-Headers", value: "*" },
          ],
        });
        return;
      }
      await pause(350);
      await cdp.send("Fetch.fulfillRequest", {
        requestId: event.requestId,
        responseCode: 200,
        responseHeaders: [
          { name: "Content-Type", value: "application/json" },
          { name: "Access-Control-Allow-Origin", value: "*" },
        ],
        body: Buffer.from(JSON.stringify(mockResponse)).toString("base64"),
      });
    } else {
      await cdp.send("Fetch.continueRequest", { requestId: event.requestId });
    }
  });

  await setViewport(cdp, 1440, 900, false);
  await navigate(cdp);
  await screenshot(cdp, "desktop.png");

  await setViewport(cdp, 390, 844, true);
  await navigate(cdp);
  await screenshot(cdp, "mobile.png");

  await setViewport(cdp, 1440, 900, false);
  await navigate(cdp);
  const documentNode = await cdp.send("DOM.getDocument", { depth: -1, pierce: true });
  const fileInput = await cdp.send("DOM.querySelector", {
    nodeId: documentNode.root.nodeId,
    selector: "input[type='file']",
  });
  await cdp.send("DOM.setFileInputFiles", { nodeId: fileInput.nodeId, files: [uploadPath] });
  await evaluateValue(
    cdp,
    `(() => { const input = document.querySelector('input[type="file"]'); input?.dispatchEvent(new Event('change', { bubbles: true })); return input?.files?.[0]?.name || null; })()`,
  );
  await waitForSelector(cdp, ".selected-preview");
  await pause(250);
  await screenshot(cdp, "desktop-selected.png");
  await setViewport(cdp, 390, 844, true);
  await pause(180);
  await screenshot(cdp, "mobile-selected.png");
  await setViewport(cdp, 1440, 900, false);
  await pause(180);
  const clickedAnalyze = await evaluateValue(
    cdp,
    `(() => { const button = [...document.querySelectorAll('button')].find((item) => item.textContent.trim() === 'Analyze leaf'); if (!button) return false; button.click(); return true; })()`,
  );
  if (!clickedAnalyze) throw new Error("Analyze leaf button was not available after selecting the fixture.");
  await waitForSelector(cdp, ".analysis-status");
  const busyMetrics = await evaluateValue(
    cdp,
    `(() => {
      const input = document.querySelector('input[type="file"]');
      const navButtons = [...document.querySelectorAll('.brand, .nav-action')];
      const actionButtons = [...document.querySelectorAll('.preview-actions button')];
      const originalName = document.querySelector('.file-meta strong')?.textContent;
      const transfer = new DataTransfer();
      transfer.items.add(new File(['replacement'], 'replacement.png', { type: 'image/png' }));
      document.querySelector('.drop-surface')?.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: transfer }));
      return {
        fileInputDisabled: input?.disabled,
        fileInputTabIndex: input?.tabIndex,
        navigationDisabled: navButtons.length > 0 && navButtons.every((button) => button.disabled),
        previewActionsDisabled: actionButtons.length > 0 && actionButtons.every((button) => button.disabled),
        droppedReplacementBlocked: document.querySelector('.file-meta strong')?.textContent === originalName,
      };
    })()`,
  );
  await waitForSelector(cdp, "#result-title");
  await pause(250);
  await screenshot(cdp, "desktop-result.png");

  const desktopMetrics = await evaluateValue(
    cdp,
    `(() => {
      const frames = [...document.querySelectorAll('.image-frame')].map((item) => {
        const rect = item.getBoundingClientRect();
        return { width: Math.round(rect.width), height: Math.round(rect.height) };
      });
      const targets = [...document.querySelectorAll('button')].map((item) => {
        const rect = item.getBoundingClientRect();
        return { name: item.textContent.trim(), width: Math.round(rect.width), height: Math.round(rect.height) };
      });
      const images = [...document.querySelectorAll('.evidence-image')].map((item) => {
        const rect = item.getBoundingClientRect();
        return { naturalWidth: item.naturalWidth, naturalHeight: item.naturalHeight, width: Math.round(rect.width), height: Math.round(rect.height), objectFit: getComputedStyle(item).objectFit };
      });
      const active = document.activeElement;
      const activeStyle = active ? getComputedStyle(active) : null;
      return {
        viewport: { width: innerWidth, height: innerHeight },
        scrollWidth: document.documentElement.scrollWidth,
        frames,
        images,
        focusedElement: active?.id || active?.textContent?.trim(),
        focusOutline: activeStyle ? activeStyle.outlineWidth + ' ' + activeStyle.outlineStyle : null,
        undersizedTargets: targets.filter((item) => item.width > 0 && item.height > 0 && (item.width < 44 || item.height < 44)),
      };
    })()`,
  );

  await evaluateValue(
    cdp,
    `(() => { const button = document.querySelector('button[aria-label="Enlarge original leaf"]'); button?.click(); return Boolean(button); })()`,
  );
  await waitForSelector(cdp, "dialog[open]");
  await pause(100);
  await screenshot(cdp, "desktop-dialog.png", false);
  const dialogMetrics = await evaluateValue(
    cdp,
    `(() => { const dialog = document.querySelector('dialog[open]'); return { open: Boolean(dialog), labelledBy: dialog?.getAttribute('aria-labelledby'), activeText: document.activeElement?.textContent?.trim() }; })()`,
  );
  await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
  await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
  await pause(100);

  const focusAfterDialogClose = await evaluateValue(cdp, "document.activeElement?.getAttribute('aria-label')");
  const historyClicked = await evaluateValue(
    cdp,
    `(() => { const button = [...document.querySelectorAll('button')].find((item) => item.textContent.trim() === 'History'); button?.click(); return Boolean(button); })()`,
  );
  if (historyClicked) await waitForSelector(cdp, "#history-title");
  const historyMetrics = await evaluateValue(cdp, `(() => ({ opened: Boolean(document.querySelector('#history-title')), entries: document.querySelectorAll('.history-item').length }))()`);

  const modelClicked = await evaluateValue(
    cdp,
    `(() => { const button = [...document.querySelectorAll('button')].find((item) => item.textContent.trim() === 'Model info'); button?.click(); return Boolean(button); })()`,
  );
  if (modelClicked) await waitForSelector(cdp, "#model-title");
  const modelMetrics = await evaluateValue(cdp, `(() => ({ opened: Boolean(document.querySelector('#model-title')) }))()`);

  await evaluateValue(
    cdp,
    `(() => { const button = [...document.querySelectorAll('button')].find((item) => item.textContent.trim() === 'Analysis'); button?.click(); return Boolean(button); })()`,
  );
  await waitForSelector(cdp, "#result-title");
  const secondaryViews = {
    history: historyMetrics,
    model: modelMetrics,
    returnedToResult: await evaluateValue(cdp, "Boolean(document.querySelector('#result-title'))"),
  };

  await setViewport(cdp, 390, 844, true);
  await pause(180);
  await screenshot(cdp, "mobile-result.png");
  const mobileMetrics = await evaluateValue(
    cdp,
    `(() => ({ viewport: { width: innerWidth, height: innerHeight }, scrollWidth: document.documentElement.scrollWidth, resultVisible: Boolean(document.querySelector('#result-title')), dialogOpen: Boolean(document.querySelector('dialog[open]')) }))()`,
  );

  await evaluateValue(
    cdp,
    `(() => { const button = document.querySelector('button[aria-label="Enlarge model attention"]'); button?.click(); return Boolean(button); })()`,
  );
  await waitForSelector(cdp, "dialog[open]");
  await pause(100);
  await screenshot(cdp, "mobile-dialog.png", false);
  const mobileDialogMetrics = await evaluateValue(
    cdp,
    `(() => ({ open: Boolean(document.querySelector('dialog[open]')), labelledBy: document.querySelector('dialog[open]')?.getAttribute('aria-labelledby'), viewport: { width: innerWidth, height: innerHeight }, scrollWidth: document.documentElement.scrollWidth }))()`,
  );
  await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
  await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
  await pause(100);

  const report = {
    appUrl,
    uploadFixture: basename(uploadPath),
    mockConfidenceInput: mockResponse.prediction.confidence,
    renderedConfidence: await evaluateValue(cdp, "document.querySelector('.confidence-row strong')?.textContent"),
    busyState: busyMetrics,
    desktop: desktopMetrics,
    mobile: mobileMetrics,
    dialog: { ...dialogMetrics, focusAfterClose: focusAfterDialogClose },
    mobileDialog: mobileDialogMetrics,
    secondaryViews,
  };
  writeFileSync(join(reviewDir, "qa-report.json"), `${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} finally {
  if (cdp) cdp.close();
  chrome.kill();
  const resolvedProfile = resolve(profileDir);
  const resolvedTemp = resolve(tmpdir());
  if (resolvedProfile.startsWith(`${resolvedTemp}\\`) || resolvedProfile.startsWith(`${resolvedTemp}/`)) {
    try {
      rmSync(resolvedProfile, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
    } catch {
      // Chrome can hold Windows profile locks briefly after exit; the OS temp directory can clean it later.
    }
  }
}
