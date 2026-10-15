# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Tea growers diagnosing visible problems on tea leaves.
- Agricultural officers supporting crop-health assessment and follow-up.
- Researchers reviewing model predictions and explainability output.

The product must support quick image-based analysis on both phones and desktop computers. The relative priority of these audiences and the exact field, office, or research setting remain open decisions.

## Product Purpose

TeaGuard is an existing tea-leaf diagnostic application. A user uploads a leaf photograph, runs an analysis, reviews the predicted condition and confidence, inspects a Grad-CAM explanation, and reads follow-up guidance.

Success means that users can complete this workflow clearly, understand what the model predicted and where it focused, and retain access to recent prediction history without losing existing functionality.

Whether TeaGuard is an academic prototype, a production field-support system, or both is not yet confirmed.

## Positioning

TeaGuard combines tea-leaf condition classification with a visual Grad-CAM explanation in the same workflow. It exposes prediction confidence, severity, a recommendation, and the model-attention overlay so that users can inspect the basis of a result rather than receiving an unexplained label alone.

## Operating Context

The core workflow is:

1. Upload a tea-leaf photograph.
2. Analyze it through the existing FastAPI service.
3. View the predicted condition, confidence, and severity.
4. Compare the original image with the Grad-CAM visualization.
5. Read the returned recommendation and retain the result in prediction history.

The current product is a React/Vite frontend backed by a local FastAPI inference service. It must remain responsive for phones and desktops.

## Capabilities and Constraints

- Preserve the existing FastAPI integration: `POST http://localhost:8000/predict`.
- Send the uploaded image as multipart form data using the field name `file`.
- Expect a successful response shaped as `{ status: "success", prediction: {...} }`.
- Read `class_name`, `confidence`, `severity`, `color`, `recommendation`, and `gradcam_url` from `prediction`.
- The API confidence value is in the range 0-1. Convert it to a percentage exactly once in the frontend.
- Preserve the original image proportions in both the source-image and Grad-CAM image panels.
- Preserve prediction history and all existing working behavior.
- The current classifier covers Tea algal leaf spot, Brown Blight, Gray Blight, Helopeltis, Red spider, Green mirid bug, and Healthy leaf.
- The implementation uses a ResNet50 model and Grad-CAM explainability.
- The geographic or regulatory market, production deployment target, image privacy/retention policy, and offline requirements are not yet confirmed.
- The validation status and jurisdictional suitability of detailed treatment guidance are not confirmed. Future work must not present that guidance as expert-validated or universally applicable without evidence.

## Brand Commitments

- Preserve the TeaGuard name and its green identity.
- Present TeaGuard as a professional agricultural diagnostic tool.
- Use readable typography, strong contrast, clear spacing, and a responsive phone-and-desktop layout.
- Preserve ResNet50 and Grad-CAM terminology where the model and explanation method are described.

The repository currently identifies TeaGuard as a KCGI Master's research project; whether that attribution must remain in every product surface is undecided.

## Evidence on Hand

- The repository contains the trained inference model at `backend/best_resnet50_inference.keras`.
- `README.md` reports 95% validation accuracy, 93.86% test accuracy, 92.29% macro F1, and 93.80% weighted F1.
- Supporting evaluation artifacts are available at `results/classification_report.png`, `results/confusion_matrix.png`, `results/accuracy_curves.png`, and `results/loss_curves.png`.
- Class-labelled Grad-CAM examples are available under `results/gradcam_examples/`.
- Application previews are available at `frontend/public/app_preview.png` and `frontend/public/app_preview_recommendations.png`.
- No repository evidence currently establishes agronomist review, source citations, label compliance, or a geographic jurisdiction for the detailed treatment instructions. Future work must not fabricate that validation.

## Product Principles

1. Make every prediction inspectable: pair the classification with confidence and a clear Grad-CAM explanation.
2. Preserve inference truth end to end: respect the API contract and transform confidence exactly once.
3. Optimize for legibility in real use: strong contrast, readable type, clear spacing, and responsive behavior are functional requirements.
4. Keep evidence and guidance distinct: communicate model output clearly without overstating diagnostic or treatment certainty.
5. Improve without breaking the workflow: retain working integration, image fidelity, history, and existing capabilities.

## Accessibility & Inclusion

The interface must use readable typography, strong contrast, clear spacing, and responsive layouts for phones and desktops. No formal accessibility conformance target, localization requirement, or assistive-technology requirement has yet been confirmed.
