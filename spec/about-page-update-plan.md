｀# About Page Update Specification

## 1. Analysis of Current Status vs. Resume

### Current `about/index.html`
- **Intro**: Placeholder text "From Engineering to Data".
- **Quotes**: Placeholder "I see machine learning as...".
- **Experience**:
    - Garmin (Aug 2024 - Present): Generic description.
    - Gastom (Jul 2023 - Aug 2024): Generic description.
    - "Traffic Engineering (Before 2023)": Very vague.
- **Education**: Missing.
- **Highlights**: Placeholder numbers (KPIs).

### Resume Content
- **Current Role**: BI Engineer at Garmin. Focus on *Production ML*, *d MLOps*, *Automated Retraining*, *Forecasting (RMA)*.
- **Previous Role**: Data Scientist at Gastom. Focus on *Logistics Optimization*, *OR-Tools*, *ETA Prediction*, *Clustering*.
- **Early Career**: Transportation Engineer at CECI (Sep 2022 - Jun 2023). Statistical analysis, traffic flow.
- **Education**: M.S. in Civil Engineering (NTU), B.S. in Transportation Management.

## 2. Recommendations & Content Strategy

### A. Experience & Education Section
**Action**: Add the Education section.
**Reasoning**:
1.  **Non-CS Background Context**: Your background in Transportation Engineering (Civil Eng) is a strength, not a weakness. It highlights strong foundations in *systems thinking*, *optimization*, and *statistics*—core skills for an MLE, especially in operations/supply chain domains.
2.  **Seniority**: While you are targeting Senior MLE, 4 years of experience is on the border. Showing a relevant Master's degree helps solidify your analytical depth.
3.  **Narrative**: It completes the story of "Engineering to Data" by showing where the engineering mindset came from.

**Proposed Structure**:
- Keep the Timeline for **Experience** (Garmin -> Gastom -> CECI).
- Add a distinct **Education** block (side-by-side or below Experience).

### B. Selected Highlights (KPIs)
**Action**: **Retain but Pivot to Engineering/System Metrics.**
**Reasoning**:
- Since you don't have public hard business KPIs (and real ones might be sensitive), focus on *Engineering/MLOps Impact* which is perfect for a Senior MLE role.
- Senior MLEs are judged on *scalability*, *reliability*, and *system maturity*.

**Proposed Metrics (Qualitative/Engineering focused)**:
1.  **System Scale**: "Multi-Horizon Forecasting" (Managed pipelined for 1-12 month predictions).
2.  **Automation**: "Automated Retraining" (Optuna + MLflow integration).
3.  **Reliability**: "Drift Detection" (Production monitoring with Evidently/Custom solutions).
4.  **Optimization**: "Logistics Efficiency" (OR-Tools implementation for real-world routing).

*If you prefer to remove it:* Replace it with a "Tech Stack / Toolbelt" visual, but you already have a "Skills" section. So re-purposing "Highlights" to "Key Technical Deliverables" is better.

### C. Text & Copywriting Proposals

#### 1. Quote (The "Philosophy")
*Current*: "I see machine learning as system design..."
*Suggestion*:
> "Models are only 10% of the solution. The real challenge—and value—is in the system that feeds, monitors, and serves them. I build resilient ML systems that turn uncertainty into actionable operations."

#### 2. Intro: "From Engineering to Data"
*Context*: Connecting Traffic Engineering -> optimizing flows -> Data Science.
*Draft*:
> **From Traffic Flows to Data Pipelines**
>
> My journey started in traffic engineering—optimizing physical networks where reliability is non-negotiable. I spent my early career analyzing signal timing and bottleneck formation.
>
> I soon realized that the core problems: **forecasting demand**, **optimizing limited resources**, and **managing uncertainty**, are universal. Today, I apply those same engineering principles to data science. I don't just train models; I build end-to-end ML systems that solve complex operational problems—from predicting supply chain returns to optimizing last-mile logistics.

---

## 3. Implementation Plan (Files to Edit)

### `about/index.html`

**1. Update Quote & Intro:**
- Replace the current placeholder quote with the "System Design" focused one above.
- Update the "From Engineering to Data" text to reflect the transition from Traffic Eng -> ML clearly.

**2. Update Experience List:**
- **Garmin**: Update details to mention "RMA forecasting", "MLOps pipelines", "Automated retraining".
- **Gastom**: Update details to mention "Route optimization", "OR-Tools", "ETA prediction".
- **CECI (New)**: Replace the generic "Traffic Engineering" item with "Transportation Engineer at CECI". Mention "Statistical analysis" and "Python automation".

**3. Add Education Section:**
- Add a simple list or block for "National Taiwan University" (M.S.) and "Tamkang University" (B.S.) below the experience list or in a side column.

**4. Refine Selected Highlights:**
- Change labels to:
    - **Production Pipelines**: "End-to-End MLOps"
    - **Optimization**: "Route & Inventory Logic"
    - **Forecasting**: "Multi-Horizon Models"
    - **Scale**: "Automated Retraining"
