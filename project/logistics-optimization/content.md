---
title: Logistics & Route Optimization
date: 2024-05-15
popularity: 85
excerpt: Solving Open VRP with custom spatio-temporal clustering and Google OR-Tools. Optimized for human-in-the-loop constraints.
cover_backdrop: false
---

Logistics & Route Optimization
===

##### Highlights: Operations Research, Google OR-Tools, Custom Clustering, Open VRP

## Project Overview

Last-mile delivery is widely considered the most expensive and inefficient part of the supply chain. For a gas cylinder delivery operation, the challenge is compounded by hard physical constraints: vehicles have limited capacity, drivers start from their homes (not a central depot), and cylinders must typically be swapped (full for empty), requiring returns to a replenishment truck.

I developed a dynamic routing engine that solves this **Open Vehicle Routing Problem (Open VRP)**, optimizing daily routes for fleet drivers while respecting the tacit, real-world rules they follow.

## The Challenge

Standard VRP solvers (like pure Google OR-Tools) often fail in practice because they treat constraints too rigidly.
*   **Fragmented Time Windows**: A customer might request "11:00–14:00", but strictly adhering to this might force a driver to zigzag across the city, bypassing neighboring stops scheduled for "08:00–12:00".
*   **Capacity & Replenishment**: Drivers conceptually split their day into "Morning" and "Afternoon" shifts, visiting a mobile depot (larger truck) in between to reload. Modeling this "mid-route refill" is computationally complex.

## Technical Solution

### 1. Hybrid Optimization Strategy
To balance mathematical optimality with operational reality, I implemented a two-stage approach:

*   **Stage 1: Domain-Driven Clustering (The Heuristic Layer)**
    Drivers prefer to clear a district completely before moving on. I developed a **Spatio-Temporal Clustering Algorithm** to mimic this behavior.
    *   **Logic**: Instead of treating time windows as hard constraints, we group orders primarily by **location proximity**, with time as a secondary "soft" factor.
    *   **Result**: If 4 orders are in District A (Morning) and 1 is in District A (Noon), the algorithm groups them. This allows the driver to clear District A efficiently, even if it means arriving slightly early/late for one stop—a trade-off operationally preferred over returning to District A hours later.

### 2. Constraint Solving with Google OR-Tools
Once clusters (logical "shifts") are defined, I used **Google OR-Tools** to solve the **Shortest Hamiltonian Path** within each cluster.
*   **Routing**: Optimizes the sequence of stops to minimize travel distance.
*   **Refill Logic**: The algorithm calculates existing load vs. demand. When capacity is predicted to hit zero, it dynamically inserts a "Refill Stop" at the nearest available depot location, effectively modeling the "Morning → Refill → Afternoon" workflow.

### 3. Dynamic Re-Planning
Unlike static routes planned once per night, delivery entails uncertainty (traffic, delays).
*   **Recalculation**: The engine re-optimizes the remaining path after every completed delivery.
*   **Adaptability**: If a driver runs slower than expected, the system can dynamically suggest skipping a distant stop or moving up a refill.

## Impact

*   **Operational Feasibility**: By incorporating the "Soft Time Window" clustering, route adherence improved significantly because the generated plans matched the drivers' mental models.
*   **Efficiency**: Reduced total fleet travel distance by optimizing the sequence of drops and the strategic location of refill stops.
*   **Scalability**: The automated system replaced manual dispatching, allowing the fleet to handle higher order volumes without adding dispatch staff.