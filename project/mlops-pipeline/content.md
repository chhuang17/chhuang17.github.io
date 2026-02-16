---
title: Scalable MLOps Architecture on Kubernetes
date: 2025-07-30
popularity: 90
excerpt: Automated retraining pipelines using Airflow and MLflow. Featuring warm-start HPO and drift detection for delayed-label scenarios.
cover_backdrop: false
---

Scalable MLOps Architecture on Kubernetes
===

##### Highlights: MLOps, Kubernetes, Apache Airflow, Optuna, MLflow, Drift Detection

## Project Overview

Transitioning machine learning from "notebook experiments" to "production systems" requires robust infrastructure. In this project, I architected and implemented the end-to-end MLOps pipeline for our RMA forecasting system, ensuring that model training, versioning, and deployment were fully automated and reproducible.

The goal was to eliminate manual model updates and ensure that our forecasting service could self-correct as new data arrived, all while maintaining strict governance over which models were promoted to production.

## System Architecture

The pipeline is built on a cloud-native stack, leveraging **Kubernetes** for compute scaling and **Apache Airflow** for orchestration.

### 1. Orchestration & Compute
*   **Apache Airflow**: Acts as the central nervous system, scheduling retraining jobs based on data availability.
*   **KubernetesPodOperator**: Each step of the pipeline (Preprocessing, Training, Evaluation) runs in its own isolated Docker container on Kubernetes. This ensures dependency isolation—the deep learning models (iTransformer) and tree-based models (XGBoost) run in environments tailored to their specific libraries without conflict.

### 2. Automated Retraining with Warm-Start HPO
To maintain model performance over time, the system retrains automatically.
*   **Hyperparameter Optimization (HPO)**: Integrated **Optuna** to tune hyperparameters during every retraining cycle.
*   **Warm-Start Strategy**: To reduce computational cost and convergence time, we implement a "warm-start" mechanism. The search space is initialized using the best parameters from the *previous* production model, allowing the optimizer to fine-tune rather than searching from scratch every time.

### 3. Model Governance & Dynamic Serving
*   **Model Registry**: Every trained model is logged to **MLflow**. Candidates are evaluated against a holdout set, and only those beating the current champion are tagged as `Production`.
*   **Dynamic Loading**: The inference service is decoupled from the training pipeline. It automatically polls the MLflow Registry and loads the version tagged `Production`. This enables seamless updates—users get improved predictions immediately after a successful retrain without downtime or manual redeployment.

## Observability: The "Delayed Label" Challenge

In RMA forecasting, we face a "delayed label" problem: we predict returns for the next 6 months or even later, but we won't know the *actual* return numbers for 180+ days. This makes immediate training based on recent errors impossible.

*   **Drift Detection**: We implemented **Evidently AI** within the Airflow pipeline to monitor input data drift.
*   **Role of Drift**: Since we cannot retrain based on immediate error (labels are missing), drift detection serves as a **reliability signal**. If significant distribution shift is detected, it flags the forecast for manual review. This acts as an early warning system, prompting supply chain analysts to treat the specific predictions with caution.

## Impact

*   **Zero-Maintenance**: The pipeline runs autonomously, handling the entire lifecycle from data ingestion to model deployment.
*   **Reproducibility**: Every prediction can be traced back to a specific model version, dataset snapshot, and hyperparameter set.
*   **Efficiency**: The warm-start HPO strategy reduced training compute costs while ensuring models remained optimized for the latest trends.