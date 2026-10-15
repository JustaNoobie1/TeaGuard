import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import Icon from "./Icon";
import { DISEASE_INFO, MODEL_DETAILS } from "./diseaseData";

const API_URL = "http://localhost:8000/predict";
const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const IMAGE_EXTENSION = /\.(jpe?g|png|webp)$/i;

const PHOTO_GUIDANCE = [
  {
    icon: "focus",
    title: "Frame one leaf",
    text: "Keep the full leaf edge visible and remove background clutter.",
  },
  {
    icon: "sun",
    title: "Use even light",
    text: "Avoid deep shade, harsh glare, and strong color casts.",
  },
  {
    icon: "camera",
    title: "Hold steady",
    text: "Make spots, edges, and surface texture sharp enough to inspect.",
  },
];

function isAcceptedImage(file) {
  return Boolean(
    file &&
      (ACCEPTED_IMAGE_TYPES.has(file.type) ||
        (!file.type && IMAGE_EXTENSION.test(file.name))),
  );
}

function safeAccent(color) {
  return /^#[0-9a-f]{6}$/i.test(color || "") ? color : "#1f5d3b";
}

function confidenceMessage(value) {
  if (value >= 90) return "High model confidence. Review the highlighted evidence before acting.";
  if (value >= 70) return "Moderate model confidence. Compare the highlighted regions carefully.";
  return "Lower model confidence. Seek expert verification before taking action.";
}

function SeverityBadge({ severity }) {
  const value = severity || "Unknown";
  const key = value.toLowerCase().replace(/[^a-z]+/g, "-");

  return <span className={`severity-badge severity-${key}`}>{value} severity</span>;
}

function AppNavigation({ activeView, onNavigate, isDisabled }) {
  const items = [
    { id: "analysis", label: "Analysis", icon: "leaf" },
    { id: "history", label: "History", icon: "history" },
    { id: "model", label: "Model info", icon: "info" },
  ];

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <button className="brand" type="button" disabled={isDisabled} onClick={() => onNavigate("analysis")}>
          <span className="brand-mark" aria-hidden="true">
            <Icon name="leaf" size={22} />
          </span>
          <span className="brand-copy">
            <strong>TeaGuard</strong>
            <small>Leaf diagnostic workspace</small>
          </span>
        </button>

        <nav className="primary-nav" aria-label="Primary navigation">
          {items.map((item) => (
            <button
              className={`nav-action ${activeView === item.id ? "is-active" : ""}`}
              key={item.id}
              type="button"
              disabled={isDisabled}
              aria-current={activeView === item.id ? "page" : undefined}
              onClick={() => onNavigate(item.id)}
            >
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

function WorkflowSteps({ hasImage, isAnalyzing }) {
  const current = isAnalyzing ? 2 : hasImage ? 2 : 1;

  return (
    <ol className="workflow-steps" aria-label="Analysis steps">
      {["Photo", "Analyze", "Evidence"].map((label, index) => {
        const step = index + 1;
        const state = step < current ? "is-complete" : step === current ? "is-current" : "";
        return (
          <li className={`step ${state}`} key={label} aria-current={state === "is-current" ? "step" : undefined}>
            <span>{step}</span>
            {label}
          </li>
        );
      })}
    </ol>
  );
}

function PhotoGuide({ isAnalyzing }) {
  if (isAnalyzing) {
    return (
      <aside className="photo-guide analysis-status" role="status" aria-live="polite">
        <span className="guide-icon analysis-icon">
          <Icon name="microscope" size={24} />
        </span>
        <h2>Analyzing leaf</h2>
        <p>TeaGuard is classifying the condition and preparing the Grad-CAM explanation.</p>
        <div className="skeleton" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="local-note">Keep this page open while the local prediction service responds.</div>
      </aside>
    );
  }

  return (
    <aside className="photo-guide" aria-labelledby="photo-guide-title">
      <h2 id="photo-guide-title">Take a useful photo</h2>
      <p>Clear source material makes the prediction and explanation easier to review.</p>
      <ul className="guide-list">
        {PHOTO_GUIDANCE.map((tip) => (
          <li className="guide-item" key={tip.title}>
            <span className="guide-icon">
              <Icon name={tip.icon} size={20} />
            </span>
            <div>
              <strong>{tip.title}</strong>
              <span>{tip.text}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="local-note">Your image is sent to the local TeaGuard service for analysis.</div>
    </aside>
  );
}

function EvidenceFigure({ title, imageUrl, alt, caption, onExpand, unavailable }) {
  return (
    <figure className="evidence-figure">
      <div className="evidence-header">
        <h3>{title}</h3>
        <button
          className="icon-button"
          type="button"
          aria-label={`Enlarge ${title.toLowerCase()}`}
          disabled={!imageUrl}
          onClick={onExpand}
        >
          <Icon name="expand" size={19} />
          <span>Enlarge</span>
        </button>
      </div>
      <div className="image-frame">
        {imageUrl ? (
          <img className="evidence-image" src={imageUrl} alt={alt} />
        ) : (
          <div className="empty-state compact">
            <Icon name="image" size={24} />
            <p>{unavailable}</p>
          </div>
        )}
      </div>
      <figcaption className="evidence-caption">{caption}</figcaption>
    </figure>
  );
}

function GuidanceList({ items }) {
  return (
    <ol className="guidance-list">
      {items.map((item) => (
        <li className="guidance-item" key={item.heading}>
          <strong>{item.heading}</strong>
          <p>{item.detail}</p>
        </li>
      ))}
    </ol>
  );
}

function ManagementGuidance({ disease }) {
  const info = DISEASE_INFO[disease];
  if (!info) return null;

  return (
    <section className="guidance-section" aria-labelledby="guidance-title">
      <div className="section-heading">
        <div>
          <h2 id="guidance-title">Management considerations</h2>
          <p>Educational reference only. Open what you need and verify locally before acting.</p>
        </div>
      </div>

      <details className="guidance-details" open>
        <summary className="guidance-summary">
          <span>
            <Icon name="info" size={20} />
            Cause and context
          </span>
          <Icon name="chevronDown" size={20} className="summary-chevron" />
        </summary>
        <div className="guidance-body">
          <p>{info.cause}</p>
        </div>
      </details>

      <details className="guidance-details">
        <summary className="guidance-summary">
          <span>
            <Icon name="leaf" size={20} />
            {info.prevention.title}
          </span>
          <Icon name="chevronDown" size={20} className="summary-chevron" />
        </summary>
        <div className="guidance-body">
          <GuidanceList items={info.prevention.items} />
        </div>
      </details>

      <details className="guidance-details">
        <summary className="guidance-summary">
          <span>
            <Icon name="microscope" size={20} />
            {info.treatment.title}
          </span>
          <Icon name="chevronDown" size={20} className="summary-chevron" />
        </summary>
        <div className="guidance-body">
          <div className="guidance-caution">
            <Icon name="alert" size={20} />
            <p>
              The entries below are unvalidated reference content, not a treatment prescription. Verify products, rates, timing, protective equipment, and local label requirements with a qualified agricultural officer.
            </p>
          </div>
          <GuidanceList items={info.treatment.items} />
        </div>
      </details>
    </section>
  );
}

function ResultReport({ result, image, gradcamUrl, resultHeadingRef, onExpand, onReset }) {
  const confidence = Math.max(0, Math.min(100, result.confidence));

  return (
    <article
      className="result-report"
      aria-labelledby="result-title"
      style={{ "--condition-accent": safeAccent(result.color) }}
    >
      <section className="result-summary">
        <div className="result-identity">
          <h1 className="result-title" id="result-title" ref={resultHeadingRef} tabIndex="-1">
            {result.disease}
          </h1>
          <div className="result-subline">
            <span>Predicted condition</span>
            <SeverityBadge severity={result.severity} />
          </div>
        </div>

        <div className="confidence-panel">
          <div className="confidence-row">
            <span>Model confidence</span>
            <strong>{confidence.toFixed(2)}%</strong>
          </div>
          <div
            className="confidence-track"
            role="progressbar"
            aria-label="Model confidence"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={Number(confidence.toFixed(2))}
          >
            <span className="confidence-fill" style={{ width: `${confidence}%` }} />
          </div>
          <p>{confidenceMessage(confidence)}</p>
        </div>

        <div className="result-actions">
          <button className="button button-secondary" type="button" onClick={onReset}>
            <Icon name="refresh" size={18} />
            Analyze another leaf
          </button>
        </div>
      </section>

      <section className="evidence-section" aria-labelledby="evidence-title">
        <div className="evidence-heading section-heading">
          <div>
            <h2 id="evidence-title">Inspect the model evidence</h2>
            <p>Compare the submitted photo with the regions that influenced this prediction.</p>
          </div>
        </div>

        <div className="comparison-grid">
          <EvidenceFigure
            title="Original leaf"
            imageUrl={image}
            alt="Original tea leaf submitted for analysis"
            caption="The exact photo sent to TeaGuard. Its original proportions are preserved."
            unavailable="The original image is unavailable."
            onExpand={(event) => onExpand("original", event)}
          />
          <EvidenceFigure
            title="Model attention"
            imageUrl={gradcamUrl}
            alt={`Grad-CAM visualization for the ${result.disease} prediction`}
            caption={`Warmer colors mark regions that most influenced the ${result.disease} prediction.`}
            unavailable="The API did not return a Grad-CAM image for this result."
            onExpand={(event) => onExpand("gradcam", event)}
          />
        </div>
      </section>

      <section className="next-step" aria-labelledby="next-step-title">
        <span className="guide-icon">
          <Icon name="arrowRight" size={21} />
        </span>
        <div>
          <h2 id="next-step-title">Recommended next step</h2>
          <p>{result.recommendation || "Review the leaf with a qualified agricultural officer."}</p>
          <small>Use this model output as decision support, not as a substitute for local expert assessment.</small>
        </div>
      </section>

      <ManagementGuidance disease={result.disease} />

      <div className="report-close">
        <div>
          <strong>Ready to check another specimen?</strong>
          <span>Your prediction history will stay available for this session.</span>
        </div>
        <button className="button button-primary" type="button" onClick={onReset}>
          <Icon name="refresh" size={18} />
          Analyze another leaf
        </button>
      </div>
    </article>
  );
}

function HistoryView({ history, onNewAnalysis }) {
  return (
    <section className="secondary-view" aria-labelledby="history-title">
      <div className="section-heading">
        <div>
          <h1 id="history-title">Prediction history</h1>
          <p>Recent analyses from this browser session, newest first.</p>
        </div>
        <button className="button button-primary" type="button" onClick={onNewAnalysis}>
          <Icon name="leaf" size={18} />
          Analyze a new leaf
        </button>
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          <span className="guide-icon">
            <Icon name="history" size={24} />
          </span>
          <h2>No analyses yet</h2>
          <p>Your completed predictions will appear here during this session.</p>
          <button className="button button-secondary" type="button" onClick={onNewAnalysis}>
            Start the first analysis
          </button>
        </div>
      ) : (
        <ol className="history-list">
          {history.map((item) => (
            <li className="history-item" key={item.id}>
              <div className="history-main">
                <span className="history-icon">
                  <Icon name="leaf" size={19} />
                </span>
                <div>
                  <strong>{item.disease}</strong>
                  <span>{item.name}</span>
                </div>
              </div>
              <div className="history-meta">
                <SeverityBadge severity={item.severity} />
                <strong>{item.confidence.toFixed(2)}%</strong>
                <span>{item.time}</span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function ModelInfoView() {
  return (
    <section className="secondary-view" aria-labelledby="model-title">
      <div className="section-heading">
        <div>
          <h1 id="model-title">Model information</h1>
          <p>Technical context for interpreting a TeaGuard result.</p>
        </div>
      </div>

      <div className="model-sheet">
        <dl>
          {MODEL_DETAILS.map((item) => (
            <div className="model-row" key={item.label}>
              <dt className="model-term">{item.label}</dt>
              <dd className="model-value">{item.value}</dd>
            </div>
          ))}
        </dl>
        <div className="model-note">
          <Icon name="info" size={21} />
          <div>
            <h2>How to read Grad-CAM</h2>
            <p>
              Grad-CAM highlights image regions that influenced a prediction. It explains model attention, not biological causation, and should be reviewed with the original leaf image.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ImageDialog({ dialogRef, closeButtonRef, view, image, gradcamUrl, disease, onViewChange, onClose }) {
  const showingGradcam = view === "gradcam";
  const source = showingGradcam ? gradcamUrl : image;
  const title = showingGradcam ? "Model attention" : "Original leaf";
  const caption = showingGradcam
    ? `Warmer colors show the regions that most influenced the ${disease || "current"} prediction.`
    : "The original leaf photo submitted to TeaGuard, shown without cropping.";

  return (
    <dialog
      className="image-dialog"
      ref={dialogRef}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-caption"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
    >
      <div className="dialog-shell">
        <div className="dialog-header">
          <h2 id="dialog-title">{title}</h2>
          <div className="dialog-tabs" role="group" aria-label="Choose image view">
            <button
              className={`dialog-tab ${!showingGradcam ? "is-active" : ""}`}
              type="button"
              aria-pressed={!showingGradcam}
              onClick={() => onViewChange("original")}
            >
              Original
            </button>
            <button
              className={`dialog-tab ${showingGradcam ? "is-active" : ""}`}
              type="button"
              aria-pressed={showingGradcam}
              disabled={!gradcamUrl}
              onClick={() => onViewChange("gradcam")}
            >
              Model attention
            </button>
          </div>
          <button className="button button-quiet" type="button" ref={closeButtonRef} onClick={() => dialogRef.current?.close()}>
            <Icon name="close" size={18} />
            Close
          </button>
        </div>
        <div className="dialog-image-wrap">
          {source && <img className="dialog-image" src={source} alt={showingGradcam ? `Enlarged Grad-CAM view for ${disease}` : "Enlarged original tea leaf"} />}
        </div>
        <p className="dialog-caption" id="dialog-caption">{caption}</p>
      </div>
    </dialog>
  );
}

export default function TeaGuardApp() {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [gradcamUrl, setGradcamUrl] = useState(null);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState("analysis");
  const [history, setHistory] = useState([]);
  const [dialogView, setDialogView] = useState(null);

  const fileInputRef = useRef(null);
  const chooseButtonRef = useRef(null);
  const resultHeadingRef = useRef(null);
  const errorRef = useRef(null);
  const previewUrlRef = useRef(null);
  const dragDepthRef = useRef(0);
  const dialogRef = useRef(null);
  const dialogCloseRef = useRef(null);
  const dialogTriggerRef = useRef(null);
  const requestStateRef = useRef({ id: 0, controller: null });
  const isAnalyzingRef = useRef(false);

  useEffect(() => {
    return () => {
      const activeRequest = requestStateRef.current;
      requestStateRef.current = { id: activeRequest.id + 1, controller: null };
      activeRequest.controller?.abort();
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  useEffect(() => {
    if (result) resultHeadingRef.current?.focus();
  }, [result]);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  useEffect(() => {
    if (dialogView && dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
      requestAnimationFrame(() => dialogCloseRef.current?.focus());
    }
  }, [dialogView]);

  const handleFile = useCallback((file) => {
    if (isAnalyzingRef.current) return;

    if (!isAcceptedImage(file)) {
      setError("Choose a JPG, PNG, or WEBP image and try again.");
      return;
    }

    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const nextPreview = URL.createObjectURL(file);
    previewUrlRef.current = nextPreview;

    setImage(nextPreview);
    setImageFile(file);
    setResult(null);
    setGradcamUrl(null);
    setError(null);
    setActiveView("analysis");
  }, []);

  const openFilePicker = useCallback(() => {
    if (isAnalyzingRef.current) return;
    fileInputRef.current?.click();
  }, []);

  const resetAnalysis = useCallback(() => {
    if (isAnalyzingRef.current) return;

    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = null;
    setImage(null);
    setImageFile(null);
    setResult(null);
    setGradcamUrl(null);
    setError(null);
    setIsAnalyzing(false);
    setActiveView("analysis");
    if (fileInputRef.current) fileInputRef.current.value = "";
    requestAnimationFrame(() => chooseButtonRef.current?.focus());
  }, []);

  const handleAnalyze = async () => {
    if (!imageFile || isAnalyzingRef.current) return;

    const requestId = requestStateRef.current.id + 1;
    const controller = new AbortController();
    const submittedFile = imageFile;
    requestStateRef.current.controller?.abort();
    requestStateRef.current = { id: requestId, controller };
    isAnalyzingRef.current = true;

    setIsAnalyzing(true);
    setResult(null);
    setGradcamUrl(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", submittedFile);

      const response = await fetch(API_URL, { method: "POST", body: formData, signal: controller.signal });
      const data = await response.json().catch(() => ({}));

      if (requestStateRef.current.id !== requestId) return;

      if (!response.ok || data.status !== "success") {
        throw new Error(data.detail || data.error || data.message || `Prediction failed (HTTP ${response.status}).`);
      }

      const prediction = data.prediction;
      if (!prediction?.class_name || typeof prediction.confidence !== "number" || !Number.isFinite(prediction.confidence)) {
        throw new Error("The prediction service returned an incomplete result. Please try another image.");
      }

      const formattedResult = {
        disease: prediction.class_name,
        confidence: prediction.confidence * 100,
        severity: prediction.severity,
        color: prediction.color,
        recommendation: prediction.recommendation,
      };

      setResult(formattedResult);
      setGradcamUrl(prediction.gradcam_url || null);
      setHistory((previous) => [
        {
          id: `${Date.now()}-${submittedFile.name}`,
          name: submittedFile.name,
          time: new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date()),
          ...formattedResult,
        },
        ...previous.slice(0, 9),
      ]);
    } catch (requestError) {
      if (requestError.name === "AbortError" || requestStateRef.current.id !== requestId) return;
      console.error("TeaGuard prediction error:", requestError);
      setError(`${requestError.message || "The prediction service could not be reached."} Check that the FastAPI server is running, then try again.`);
    } finally {
      if (requestStateRef.current.id === requestId) {
        requestStateRef.current = { id: requestId, controller: null };
        isAnalyzingRef.current = false;
        setIsAnalyzing(false);
      }
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    dragDepthRef.current = 0;
    setIsDragging(false);
    if (isAnalyzingRef.current) return;
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) handleFile(droppedFile);
  };

  const openImageDialog = (view, event) => {
    if (view === "gradcam" && !gradcamUrl) return;
    dialogTriggerRef.current = event.currentTarget;
    setDialogView(view);
  };

  const handleDialogClose = () => {
    setDialogView(null);
    requestAnimationFrame(() => dialogTriggerRef.current?.focus());
  };

  const startNewFromSecondary = () => {
    resetAnalysis();
  };

  const handleNavigate = (view) => {
    if (isAnalyzingRef.current) return;
    setActiveView(view);
  };

  return (
    <div className="app-shell">
      <AppNavigation activeView={activeView} onNavigate={handleNavigate} isDisabled={isAnalyzing} />

      <main className="page-shell">
        {activeView === "analysis" && (
          <>
            {!result && (
              <>
                <div className="workspace-intro">
                  <div className="workspace-copy">
                    <h1>Analyze a tea leaf</h1>
                    <p>Upload one clear photo to classify its condition and inspect where the model focused.</p>
                  </div>
                  <WorkflowSteps hasImage={Boolean(image)} isAnalyzing={isAnalyzing} />
                </div>

                {error && (
                  <div className="inline-alert" role="alert" ref={errorRef} tabIndex="-1">
                    <Icon name="alert" size={21} />
                    <div>
                      <strong>Analysis could not be completed</strong>
                      <p>{error}</p>
                    </div>
                  </div>
                )}

                <section className="upload-workbench" aria-label="Leaf photo setup" aria-busy={isAnalyzing}>
                  <div className="specimen-panel">
                    <div
                      className={`drop-surface ${isDragging ? "is-dragging" : ""} ${image ? "has-image" : ""} ${isAnalyzing ? "is-busy" : ""}`}
                      onDragEnter={(event) => {
                        event.preventDefault();
                        if (isAnalyzingRef.current) return;
                        dragDepthRef.current += 1;
                        setIsDragging(true);
                      }}
                      onDragOver={(event) => {
                        event.preventDefault();
                        event.dataTransfer.dropEffect = isAnalyzingRef.current ? "none" : "copy";
                      }}
                      onDragLeave={(event) => {
                        event.preventDefault();
                        if (isAnalyzingRef.current) return;
                        dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
                        if (dragDepthRef.current === 0) setIsDragging(false);
                      }}
                      onDrop={handleDrop}
                    >
                      {image ? (
                        <div className="selected-preview">
                          <img className="preview-image" src={image} alt="Selected tea leaf preview" />
                          <div className="preview-toolbar">
                            <div className="file-meta">
                              <span className="guide-icon">
                                <Icon name="image" size={19} />
                              </span>
                              <div>
                                <strong>{imageFile.name}</strong>
                                <span>Photo ready for analysis</span>
                              </div>
                            </div>
                            <div className="preview-actions">
                              <button
                                className="button button-secondary"
                                type="button"
                                ref={chooseButtonRef}
                                disabled={isAnalyzing}
                                onClick={openFilePicker}
                              >
                                <Icon name="upload" size={18} />
                                Replace photo
                              </button>
                              <button
                                className="button button-primary"
                                type="button"
                                disabled={isAnalyzing}
                                onClick={handleAnalyze}
                              >
                                <Icon name={isAnalyzing ? "microscope" : "arrowRight"} size={18} />
                                {isAnalyzing ? "Analyzing leaf" : "Analyze leaf"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="upload-empty">
                          <span className="upload-symbol">
                            <Icon name="leaf" size={34} />
                          </span>
                          <h2>Choose a leaf photo</h2>
                          <p>Drag and drop a photo here, or choose one from your device.</p>
                          <button
                            className="button button-primary"
                            type="button"
                            ref={chooseButtonRef}
                            onClick={openFilePicker}
                          >
                            <Icon name="upload" size={18} />
                            Choose photo
                          </button>
                          <small>JPG, PNG, or WEBP · one leaf per image</small>
                        </div>
                      )}
                    </div>

                    <input
                      className="visually-hidden"
                      ref={fileInputRef}
                      type="file"
                      tabIndex={-1}
                      disabled={isAnalyzing}
                      accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                      aria-label="Choose a tea leaf photo"
                      onChange={(event) => {
                        if (isAnalyzingRef.current) return;
                        const selectedFile = event.target.files?.[0];
                        if (selectedFile) handleFile(selectedFile);
                        event.target.value = "";
                      }}
                    />
                  </div>

                  <PhotoGuide isAnalyzing={isAnalyzing} />
                </section>
              </>
            )}

            {result && (
              <ResultReport
                result={result}
                image={image}
                gradcamUrl={gradcamUrl}
                resultHeadingRef={resultHeadingRef}
                onExpand={openImageDialog}
                onReset={resetAnalysis}
              />
            )}
          </>
        )}

        {activeView === "history" && <HistoryView history={history} onNewAnalysis={startNewFromSecondary} />}
        {activeView === "model" && <ModelInfoView />}
      </main>

      <footer className="site-footer">
        <span>TeaGuard</span>
        <span>Explainable AI for tea leaf disease detection</span>
        <span>KCGI Master's Project</span>
      </footer>

      <ImageDialog
        dialogRef={dialogRef}
        closeButtonRef={dialogCloseRef}
        view={dialogView}
        image={image}
        gradcamUrl={gradcamUrl}
        disease={result?.disease}
        onViewChange={setDialogView}
        onClose={handleDialogClose}
      />
    </div>
  );
}
