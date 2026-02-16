# Final Project Content Spec

Based on the latest user interview, this document refines the content strategy for the three project pages.

## 1. RMA Return Forecasting
**Revised Architecture**:
*   **Segmentation**: Two distinct data segments based on product lifecycle/type:
    1.  **FIT/OUT** (Fitness/Outdoor products?): Uses **iTransformer** (Deep Learning for Time Series).
    2.  **MRN/AVN** (Marine/Aviation?): Uses **XGBoost** (Gradient Boosting) due to smaller dataset size.
*   **Modeling**: Total of 4 models (2 Segments x 2 Horizons [1-6m, 7-12m]).
*   **Phase-out Strategy**: No special handling; relied on the robust generalization of the core models (iTransformer/XGBoost) to handle these features naturally.
*   **Stakeholder Story**: The user joined *after* the initial 1-6m pilot was established. Their role was **scaling** this success: building the 7-12m models and the automated pipeline. The business trust came from the *operational time savings* and *decent initial accuracy* of the previous work, which the user then expanded and hardened.

## 2. MLOps & Production Engineering
**Revised Architecture**:
*   **Drift Detection (The "Delayed Label" Reality)**:
    *   **Tool**: *Evidently AI* running on Airflow `KubernetesPodOperator`.
    *   **Operational Reality**: Drift is logged to MLflow as a "Confidence Signal".
    *   *Honesty Strategy*: We will frame this as "Observability for Confidence". We won't lie about manual review processes that don't exist. Instead, we'll say: "Provides a reliability signal to stakeholders—alerting when data distribution shifts significantly from training, encouraging cautious interpretation of specific forecasts."
*   **HPO**:
    *   **Strategy**: *Warm-start Optuna*. Uses previous production params as the initial trial to reduce search time.
    *   **Frequency**: Runs on *every* retraining triggered by the schedule.
*   **Deployment**:
    *   **Mechanism**: Inference service pulls the model with `stage='Production'` tag from MLflow Registry.
    *   **Automation**: Retraining pipeline automatically promotes the new model to Production if it passes checks (implied).

## 3. Logistics & Route Optimization
**Revised Architecture (The most complex one)**:
*   **Problem Type**: **Open VRP** (Start from driver homes, not a single depot) + **Capacitated VRP** (Cylinders) + **Shortest Hamiltonian Path** (Traversal).
*   **The "Human Heuristic"**:
    *   Drivers mentally split the day into "Morning Shift" and "Afternoon Shift" based on capacity.
    *   **Mid-day Refill**: They visit one of 2-3 fixed depots to swap cylinders.
    *   algorithm needs to decide *which* depot and *when*.
*   **Clustering vs. Time Windows**:
    *   **Insight**: Strict time windows (e.g., 11-14) break efficiency if treated as hard constraints.
    *   **Solution**: "Soft" Clustering based on **Location Proximity** first, then Time.
    *   *Example*: If 4 orders are in District A (07-12) and 1 is in District A (11-14), the algorithm groups them to be delivered together (likely towards the end of the morning block), rather than leaving and coming back.
    *   **Role of OR-Tools**: Solves the *sequence* (TSP/Hamiltonian Path) within these smart clusters, and optimizes the "Refill Stop" insertion.
*   **Workflow**:
    *   Night before: Manual assignment of orders to drivers.
    *   User's Algo: Computes the optimal *sequence* and *refill strategy* for each driver.
    *   Dynamic Update: Re-calculates after every delivery to adjust for real-world delays.

---

## Action Plan for Content Writing

### RMA Page
*   **Highlight**: The **Hybrid Model Architecture** (Deep Learning vs. Tree-based). This is a strong technical differentiator—knowing when to use SOTA (iTransformer) vs. robust (XGBoost).
*   **Highlight**: The **Operational Expansion**. "Scaling from a pilot to a comprehensive system."

### MLOps Page
*   **Highlight**: **Warm-Start Optimization**. A smart engineering detail that shows pragmatism (cost/time saving) in automated retraining.
*   **Highlight**: **Observability in Delayed Feedback Loops**. Dealing with the reality that you can't retrain immediately on drift (because you don't know the true values yet).

### Logistics Page
*   **Highlight**: **Modeling Real-World Constraints**. The "Home Start" and "Mid-day Refill" logic is complex and interesting.
*   **Highlight**: **The "Soft" Time Window Clustering**. Explain *why* the pure mathematical solver failed (too rigid) and how the "Human-in-the-loop" heuristic (Clustering) solved it.
