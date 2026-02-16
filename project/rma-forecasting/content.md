---
title: Multi-Horizon RMA Return Forecasting
date: 2024-12-01
excerpt: Multi-horizon forecasting system designed for inventory and capacity planning. A phased rollout bridged the gap between data science and supply chain operations.
cover_backdrop: false
---

Multi-Horizon RMA Return Forecasting
===

##### Highlights: Time-Series Forecasting, iTransformer, XGBoost, Supply Chain Operations

## Project Overview

Supply chain efficiency relies on accurate demand sensing. For a global hardware manufacturer, anticipating Return Merchandise Authorization (RMA) volumes is critical—not just for customer service staffing, but for inventory management of replacement units and long-term factory capacity planning.

I led the technical development and scaling of a production forecasting system that predicts return volumes across two distinct time horizons:
*   **1-6 Months**: Supporting immediate inventory allocation and logistics planning.
*   **7-12 Months**: Enabling long-term factory capacity reservation and material procurement.

## The Challenge

Forecasting returns is inherently noisy. Return rates fluctuate based on product launches, seasonal sales spikes, and warranty expirations. The existing rule-based methods struggled to adapt to these non-linear patterns, leading to either inventory shortages (customer dissatisfaction) or overstocking (capital tie-up).

A key complexity was the diversity of the product portfolio. High-volume consumer products (Fitness & Outdoor) behaved very differently from specialized, lower-volume industrial variants (Marine & Aviation), requiring a differentiated modeling strategy.

## Technical Solution

### Hybrid Modeling Architecture

To address the data disparity between product lines, I architected a hybrid solution deploying four distinct production models (2 Segments × 2 Horizons):

1.  **High-Volume Segment (FIT/OUT)**:
    *   **Scope**: Fitness and Outdoor products (Massive transactional data).
    *   **Architecture**: **iTransformer** (Transformer-based Time Series Forecasting).
    *   **Rationale**: The complex temporal dependencies and seasonal interactions in consumer behavior required a model capable of capturing long-range definitions. The Transformer architecture outperformed traditional methods in catching these signals.

2.  **Low-Volume Segment (MRN/AVN)**:
    *   **Scope**: Marine and Aviation products (Specialized, sparse data).
    *   **Architecture**: **XGBoost** (Gradient Boosting).
    *   **Rationale**: These industrial lines generated significantly fewer return events. Deep learning models would likely overfit on such small datasets. XGBoost provided a robust, lightweight alternative that performed exceptionally well on the available tabular features.

### Strategic Implementation

*   **Unified Pipeline**: Despite the different underlying algorithms, both segments ultimately feed into a unified inference pipeline. This abstraction allows the supply chain team to consume predictions through a single interface without worrying about the underlying model complexity.
*   **Phase-Out Handling**: Rather than building brittle manual rules for end-of-life products, we leveraged the **generalization power of Machine Learning**. By training on historical lifecycle data, the iTransformer and XGBoost models naturally learned the "decay curves" associated with phase-out products, reducing the need for manual adjustment.

## Impact & Results

*   **Operational Trust**: The system's phased rollout—proving value with the 1-6 month horizon before expanding to 7-12 months—built necessary trust with skeptical stakeholders.
*   **Automation**: Replaced manual spreadsheet estimations with an automated pipeline, freeing up hundreds of hours of analyst time annually.
*   **Scalability**: The modular design allows for easy integration of new product lines or adjustment of forecasting horizons as business needs evolve.