# Work Focus Content Specification & Project Page Plan

## 1. Work Focus Strategy
**Decision**: We will retain the current three pillars:
1.  **RMA Return Forecasting** (Business Impact & Stakeholder Mgmt)
2.  **MLOps & Monitoring** (Engineering Scalability)
3.  **Logistics Optimization** (Domain Knowledge & OR)

**Reasoning**:
-   **Why not Deep RL?** While your thesis on Deep RL (DDPG) is impressive, you correctly identified that it was a simulation/research project, not a deployed production system. Highlighting it as a primary "Work Focus" alongside your professional deployment work might blur the line between academic research and production engineering. It is better placed in the **Education** section (where it currently is), serving as a strong signal of your theoretical depth without overpromising on deployment experience in that specific domain.
-   **Why these three?** They form a perfect triangle for a Senior MLE:
    -   *RMA*: Shows you can solve business problems and manage stakeholders.
    -   *MLOps*: Shows you can build reliable systems (Airflow/K8s).
    -   *Logistics*: Shows you can handle complex logic and optimization (OR), not just "fit functions".

## 2. Directory Structure Update
The `Work Focus` section on the About page will link to three new detailed project pages.

```text
project/
├── rma-forecasting/       # New
│   ├── index.html
│   └── content.md
├── mlops-pipeline/        # New
│   ├── index.html
│   └── content.md
├── logistics-optimization/# New
│   ├── index.html
│   └── content.md
└── highway-traffic-forecast/ # Existing
```

## 3. Detailed Content Drafts

### A. RMA Return Forecasting
**Path**: `project/rma-forecasting/content.md` (and associated `index.html`)
**Title in Card**: **RMA Return Forecasting**
**Summary**: "Multi-horizon models for inventory and capacity planning. A phased rollout—starting with 1-6 month predictions to validate business value before scaling to 7-12 month horizons—successfully bridging the gap between data science and supply chain operations."
**Target Link**: `/project/rma-forecasting/`

### B. MLOps & Production Engineering
**Path**: `project/mlops-pipeline/content.md` (and associated `index.html`)
**Title in Card**: **MLOps & Production Engineering**
**Summary**: "Scalable pipelines on Kubernetes. Architected automated retraining workflows with **Airflow**, integrated **Optuna** for hyperparameter tuning, and used **MLflow Model Registry** to ensure every deployment is versioned, reproducible, and monitored for drift."
**Target Link**: `/project/mlops-pipeline/`

### C. Logistics & Route Optimization
**Path**: `project/logistics-optimization/content.md` (and associated `index.html`)
**Title in Card**: **Logistics & Route Optimization**
**Summary**: "Domain-driven algorithmic solutions. Solved complex Vehicle Routing Problems (VRP) by combining **Google OR-Tools** with **custom spatio-temporal clustering**—logic directly derived from interviews with drivers—to ensure operational feasibility."
**Target Link**: `/project/logistics-optimization/`

---

## 4. Next Steps
1.  Update `about/index.html` with the new summaries and links above.
2.  Create the folders and `content.md` / `index.html` files for each project based on the narratives in previous versions of this spec.
