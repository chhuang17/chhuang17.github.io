---
title: Shortest Hamiltonian Path
date: 2024-09-14
popularity: 70
excerpt: Mathematical formulation of the Shortest Hamiltonian Path problem, with TSP comparison and subtour elimination methods.
cover: /posts/shp-intro/tsp.png
cover_backdrop: false
---

The Shortest Hamiltonian Path Problem — Mathematical Formulation
===

##### Highlights: Traveling Salesman Problem, Hamiltonian Path, Operations Research

![](/posts/shp-intro/tsp.png "Traveling Salesman Problem: All points would be visited only once and finally return to the start point.")

## Introduction

The classic __Traveling Salesman Problem (TSP)__ asks: starting from a given origin, visit every node exactly once and return to the origin — i.e., the start and end points are the same. But what if we are given a distinct start and end point? Can we still find a path that visits every node exactly once?

If such a path exists, it is called a __Hamiltonian Path__. In real-world route planning, as long as every pair of nodes is reachable from each other (a reasonable assumption for most applications), a Hamiltonian path is guaranteed to exist. Since there may be more than one, we are typically interested in finding the __Shortest Hamiltonian Path (SHP)__.


## Mathematical Formulation

The Hamiltonian Path problem is closely related to the TSP, so their mathematical formulations share a similar structure. Let's first review the key considerations behind the TSP formulation:

__Traveling Salesman Problem (TSP)__
- Objective: Minimize total travel distance / time / cost
- Constraint 1: Each node has exactly one incoming arc (flow in)
- Constraint 2: Each node has exactly one outgoing arc (flow out)
- Constraint 3: Subtour Elimination

The integer programming formulation for the TSP is:

$$
\begin{aligned}
    \min\;& \sum_{i}\sum_{j}c_{ij}x_{ij} \\\\
    \text{s.t.}\;& \sum_{i}x_{ij} = 1 \\\\
    &\sum_{j}x_{ij} = 1 \\\\
    &u_{i} - u_{j} + nx_{ij} \leq n - 1 \\\\
    &x_{ij} \in {\{0, 1\}},\ \forall i,j = 1,2,\cdots n \\\\
    &u_{i}, u_{j} \geq 0,\ \forall i,j = 1,2,\cdots n,\ \forall i \neq j
\end{aligned}
$$

For the __Shortest Hamiltonian Path Problem (SHPP)__, we modify Constraints 1 and 2 as follows:

> __*Constraint 1: Every node except the origin must have exactly one incoming arc; the origin has zero incoming arcs.
> Constraint 2: Every node except the destination must have exactly one outgoing arc; the destination has zero outgoing arcs.*__

The SHPP formulation therefore adds two extra constraints compared to the TSP:

$$
\begin{aligned}
    \min\;& \sum_{i}\sum_{j}c_{ij}x_{ij} \\\\
    \text{s.t.}\;& \sum_{i}x_{ij} = 1 \\\\
    &\sum_{j}x_{ij} = 1 \\\\
    &\sum_{i}x_{i1} = 0 \\\\
    &\sum_{j}x_{nj} = 0 \\\\
    &u_{i} - u_{j} + nx_{ij} \leq n - 1 \\\\
    &x_{ij} \in {\{0, 1\}},\ \forall i,j = 1,2,\cdots n \\\\
    &u_{i}, u_{j} \geq 0,\ \forall i,j = 1,2,\cdots n,\ \forall i \neq j
\end{aligned}
$$


## Subtour Elimination

Readers new to TSP may find the subtour elimination constraint puzzling. Why is it necessary? What happens if we omit it?

Using the SHPP as an example, here is the formulation *without* subtour elimination:

$$
\begin{aligned}
    \min\;& \sum_{i}\sum_{j}c_{ij}x_{ij} \\\\
    \text{s.t.}\;& \sum_{i}x_{ij} = 1 \\\\
    &\sum_{j}x_{ij} = 1 \\\\
    &\sum_{i}x_{i1} = 0 \\\\
    &\sum_{j}x_{nj} = 0 \\\\
    &\ \forall i,j = 1,2,\cdots n
\end{aligned}
$$

Solving this model still yields an optimal solution. However, the result looks like this:

![](/posts/shp-intro/subtour-example.png "Example of the Subtour. This solution fulfills all constraints, but you might not be glad to see it.")
<br>

Every node (except the origin and destination) satisfies the one-in, one-out constraint, the origin has only outgoing arcs, and the destination has only incoming arcs — all constraints are met. Yet the solution is clearly not what we want. The disconnected loops are called __subtours__. We need to break every subtour and link all nodes into a single path. Two common subtour elimination approaches are described below.

### Exhaustive Enumeration

Using the figure above, let the full node set be $V=\{1,2,\cdots,11\}$. We select every proper subset $S$ of $V$ with $|S|\geq 2$, i.e., $\forall S\subsetneq V,\space |S|\geq 2$.

For example, $S_{1}=\{2,5,7\}$, $S_{2}=\{3,8\}$, and $S_{3}=\{1,4,9,10,11\}$ are valid subsets, whereas $S_{4}=\{5\}$ or $S_{5}=\{6\}$ are not (too small).

The idea is straightforward: among any $m$ selected nodes ($|S|=m$), at most $m-1$ arcs may exist between them:

$$
\sum_{i\in S,\space j\in S,\space i\neq j} x_{ij}\leq |S|,\space \forall S\subsetneq V,\space |S|\geq 2
$$

The downside is that the number of subtour elimination constraints grows exponentially with the number of nodes. For $n$ nodes, we need $2^{n}-n-2$ such constraints.

### MTZ Constraints (Miller-Tucker-Zemlin)

Proposed by Miller, Tucker, and Zemlin, this formulation introduces auxiliary decision variables $u_{i}$, $\forall i = 1, 2, \cdots n$, where $u_{i} \geq 0$ and $u_{i} \in \mathcal{N}$. The variable **$u_{i}$ represents the visiting order of node $i$** — for example, $u_{2}=8$ means node 2 is the 8th node visited; $u_{5}=3$ means node 5 is the 3rd node visited.

For the TSP, the following three MTZ constraints are added:

$$
\begin{aligned}
    &u_{1} = 1 \\\\
    &2 \leq u_{i} \leq n \\\\
    &u_{i} - u_{j} + nx_{ij} \leq n - 1
\end{aligned}
$$

- $u_{1} = 1$: Node 1 is visited first — in other words, node 1 is the origin.
- $2 \leq u_{i} \leq n$: Bounds on $u_{i}$. The lower bound starts at 2 because the origin is already handled by $u_{1} = 1$.
- $u_{i} - u_{j} + nx_{ij} \leq n - 1$:
  - Rearranging: $u_{i} - u_{j} + 1 \leq n (1 - x_{ij})$.
  - Recall $x_{ij} \in \{0,1\}$. If $x_{ij}=1$, there is an arc from $i$ to $j$, meaning $i$ is visited immediately before $j$, so $u_{i} + 1 = u_{j}$.
  - **Case 1: Arc $(i, j)$ is used** — substituting gives: $$u_{i} - (u_{i}+1) + 1 \leq n (1-1) \Rightarrow 0 \leq 0$$
  - **Case 2: Arc $(i, j)$ is not used** — substituting gives: $$u_{i} - u_{j} + 1 \leq n (1-0) \Rightarrow u_{i} - u_{j} + 1 \leq n$$
    - If $u_{i} < u_{j}$, then LHS $\leq 0 \leq n$ — always satisfied.
    - If $u_{i} > u_{j}$, then LHS $\leq n-1 \leq n$ — always satisfied.

The above may feel abstract, so let's walk through a concrete example. Suppose the optimal Hamiltonian path is as follows (numbers inside circles are node IDs):
<br>
![](/posts/shp-intro/shp-solution.png)
<br>

From the figure, the optimal path is $1-8-6-7-10-9-2-3-4-5-11$, giving:

$$
\begin{aligned}
&u_{1}=1, &x_{18}=1 \; \\\\
&u_{2}=8, &x_{86}=1 \; \\\\
&u_{3}=6, &x_{67}=1 \; \\\\
&u_{4}=7, &x_{710}=1 \; \\\\
&u_{5}=10, &x_{109}=1 \; \\\\
&u_{6}=9, &x_{92}=1 \; \\\\
&u_{7}=2, &x_{23}=1 \; \\\\
&u_{8}=3, &x_{34}=1 \; \\\\
&u_{9}=4, &x_{45}=1 \; \\\\
&u_{10}=5, &x_{511}=1 \; \\\\
&u_{11}=11
\end{aligned}
$$

Try substituting these values into the constraints yourself — you'll see that violating the MTZ constraints would produce subtours.
