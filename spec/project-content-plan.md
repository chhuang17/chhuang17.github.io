# Project Content Plan & Questions

This document outlines the proposed structure for the three new project pages. Before writing the content, I have listed specific questions for each project to ensure accuracy.

---

## 1. Project: RMA Return Forecasting
**Path**: `project/rma-forecasting/content.md`

### Proposed Structure
1.  **Overview**: The business problem (inventory vs. factory capacity) and the impact of accurate forecasting.
2.  **The Challenge**: Why rule-based or previous methods failed (e.g., phase-out products, long-term drift).
3.  **Solution Architecture**:
    *   Data processing (Source integration).
    *   Modeling strategy (Model types used, why 1-6m vs 7-12m).
    *   Phased rollout strategy.
4.  **Key Results**: Quantitative improvements (Accuracy %) and qualitative wins (Trust from stakeholders).

### ❓ Questions for Will (RMA)
1.  **Model Specifics**: You mentioned "multi-horizon". Did you use a single model outputting a vector (e.g., one model predicts t+1 to t+6), or separate models for each horizon? What specific algorithms did you use (XGBoost, Prophet, LSTM, or statistical methods)?
2.  **"Phase-out" Challenge**: How specifically did you handle "phase-out" products? Did you use "similarity-based" forecasting (using history of similar past products) or some other technique?
3.  **Stakeholder Friction**: What was the biggest objection from the supply chain team when you first proposed the ML model? How did you convince them to trust the 1-6 month pilot?

---

## 2. Project: MLOps & Production Engineering
**Path**: `project/mlops-pipeline/content.md`

### Proposed Structure
1.  **Overview**: The transition from manual notebook execution to a robust, automated platform.
2.  **Architecture Diagram (Text description)**:
    *   **Orchestrator**: Airflow on K8s (The "Brain").
    *   **Experimentation**: MLflow Tracking + Optuna (The "Lab").
    *   **Registry & Serving**: MLflow Registry -> Dynamic loading (The "Factory").
3.  **Key Feature: Automated Retraining**: How drift detection triggers retraining or how it's scheduled.
4.  **Key Feature: Dynamic Loading**: How the production service knows which model version to load without downtime.

### ❓ Questions for Will (MLOps)
1.  **Dynamic Loading**: How exactly does the inference service pick the new model? Does it poll the MLflow Registry for the "Production" tag? Or does Airflow push a config update to the service?
2.  **Drift Detection**: You mentioned monitoring drift. Did you implement a specific check (e.g., PSI, KL Divergence) using *Evidently AI* (or similar) inside the Airflow pipeline? Or was it a separate monitoring dashboard?
3.  **Optuna Integration**: Was Optuna used *every time* the model retrained (fully automated HPO), or only during the development phase? (Automated HPO in production can be risky/expensive, so I want to clarify).

---

## 3. Project: Logistics & Route Optimization
**Path**: `project/logistics-optimization/content.md`

### Proposed Structure
1.  **Overview**: The "Last Mile" problem—high variability, human constraints, and cost pressure.
2.  **The Human Factor**: Why standard algorithms failed (Drivers have tacit knowledge).
3.  **Methodology**:
    *   **Clustering**: The custom "Driver-Centric" clustering logic (Spatio-temporal).
    *   **Optimization**: How Google OR-Tools was configured (Constraints: Time windows, Capacity).
4.  **Outcome**: Efficiency gains vs. Driver satisfaction.

### ❓ Questions for Will (Logistics)
1.  **The "Driver Interview" Insight**: Can you give me **one specific example** of a rule you learned from a driver that you coded into the clustering algorithm? (e.g., "Don't cross this specific bridge at 5 PM" or "Group these two buildings together because they share a loading dock").
2.  **Constraint Hardness**: In OR-Tools, were the time windows "Hard" (must meet) or "Soft" (penalty if missed)? This affects the complexity significantly.
3.  **Input Data**: Did you have access to real-time GPS locations for dynamic re-routing, or was this a "Planning" tool run the night before (Static VRP)?

---
