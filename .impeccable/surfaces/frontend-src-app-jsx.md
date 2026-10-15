---
version: 1
slug: "frontend-src-app-jsx"
primary_target: "frontend/src/App.jsx"
related_targets: ["frontend/src/App.css"]
---

# TeaGuard analysis workspace

- Mode: Operate
- Scope: `frontend/src/App.jsx` and its presentation styles
- Audience: tea growers, agricultural officers, and researchers
- Job: upload one leaf photo, understand the prediction and confidence, inspect model attention, then act on concise guidance
- Primary action: choose a useful photo and analyze it
- Constraints: preserve the FastAPI contract, one confidence conversion, image proportions, real result data, prediction history, and secondary Model Info access
- Memorable moment: a paired evidence viewer keeps the original leaf and Grad-CAM explanation aligned, then opens either in one accessible comparison dialog
- Unresolved: detailed management copy has no confirmed jurisdictional or expert validation

## Direction contract

THESIS: TeaGuard is a field specimen record brought to life, not a generic AI dashboard; the leaf and the diagnostic task own the surface while utility navigation recedes.

OWN-WORLD: Warm field-paper ground, near-white work surfaces, forest-green shell and actions, ink-dark text, moss neutrals, amber caution, one workhorse sans, fine rules, modest corners, restrained shadow, and consistent outline icons.

STORY: The user first learns how to capture a useful specimen, selects a photo, sees it in place, runs analysis, reads condition and confidence, compares original and model attention, then opens only the management detail they need.

FIRST VIEWPORT: A 64px utility header sits above a compact task heading and a 7/5 workbench: the large upload or preview tray on the left, three short photo notes on the right, and the dominant action inside the active work surface. Results replace setup with an evidence-first report.

FORM: Field Specimen Record, ranked 1 of 7 grounded directions and selected from seed `268cbcf8`; the chosen code-led sketch is `.impeccable/mocks/decision/model-pick.html`.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
