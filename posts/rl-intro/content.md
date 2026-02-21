---
title: Introduction to Reinforcement Learning
date: 2024-09-12
lang: en
category: Tech
popularity: 60
excerpt: An introduction to reinforcement learning fundamentals — from Markov Decision Processes to reward discounting and algorithm taxonomy.
cover: /posts/rl-intro/rl-workflow.jpg
cover_backdrop: false
---

Introduction to Reinforcement Learning
===

##### Highlights: Reinforcement Learning, Markov Decision Process, Deep Q-Network, Policy Optimization

![](/posts/rl-intro/rl-workflow.jpg "Source: Sutton & Barto (2018), Reinforcement Learning: An Introduction (2nd Edition)")

## Introduction

In machine learning, we commonly encounter supervised learning, unsupervised learning, and semi-supervised learning. **Reinforcement Learning (RL)**, on the other hand, is a paradigm where an agent learns by extensively interacting with an environment, gaining experience from those interactions. There is no labeled data in RL — instead, the agent follows its past experience and a human-designed **reward function** to discover the optimal policy.

The theory behind reinforcement learning dates back to the 1980s, but it remained largely dormant due to limited computational power. It wasn't until 2013, when Google DeepMind combined deep neural networks (DNNs) with traditional Q-Learning to produce **Deep Q-Network (DQN)**, that reinforcement learning re-emerged with a fresh and powerful new face.

Before formally introducing reinforcement learning, two important concepts must be understood.


## Markov Property (MP)

The [Markov Property](https://en.wikipedia.org/wiki/Markov_property) is defined as follows:

> When a stochastic process has the property that, given the present state and all past states, the conditional probability distribution of future states depends only on the current state — in other words, conditioned on the present, the future is independent of the past — then the process is said to possess the Markov property.

In short, the Markov property means **the next state depends only on the current state** — this is known as the **memoryless** property. A stochastic process that satisfies the Markov property is called a **Markov process**, of which the [Markov chain](https://en.wikipedia.org/wiki/Markov_chain) is the most well-known example.


## Markov Decision Process (MDP)

A **Markov Decision Process (MDP)** is a stochastic process that satisfies the Markov property. It is a generalization of the Markov chain, describing how the next state $s'$ depends only on the current state $s$ and the chosen action $a$.

A Markov chain describes purely the stochastic process of state transitions — the next state $s'$ depends only on the current state $s$. An MDP, however, adds the notion of **action selection** $A = \{a_1, \ldots, a_n\},\ n \in \mathbb{Z}$ and **immediate reward** $R = \{r_1, \ldots, r_n\},\ n \in \mathbb{Z}$. Conversely, if each state has only one available action (i.e., $|A_k| = 1$ for all $k$), the MDP degenerates into a Markov chain.

> Reinforcement learning assumes the problem satisfies the Markov Decision Process. Therefore, before applying RL to a problem, one should first verify whether the problem itself satisfies the MDP conditions — or design experiments to transform it into one.


## Common Terminology

Here are some commonly used terms that will be helpful for the discussion that follows:

- **Agent**: The entity that interacts with the environment. Think of it as a proxy that perceives and makes decisions on behalf of the operator.
- **Environment**: A (usually simulated) world in which the agent interacts. What the environment represents depends on the problem at hand.
- **State**: The agent perceives/observes the current environment and extracts important features to determine the current state.
- **Action**: Based on the current state, the agent uses a policy network to choose which action to take.
- **Reward**: After the agent executes an action, it receives a reward signal indicating how good or bad that action was in that particular state. This is sometimes also referred to as the "return" in the literature.
- **Episode**: Agent-environment interactions are organized into episodes. The goal is to maximize the total reward accumulated in each episode. Episode lengths may be fixed or variable, depending on the problem.
- **Policy**: The basis for the agent's action selection — it is a function. In deep RL, the policy is represented by a deep neural network (DNN). The agent feeds the current state as input to the network, which outputs the action to take.


## Reinforcement Learning in Detail

### Workflow

At a high level, reinforcement learning works as follows:

1. The **agent** perceives/observes the **environment** and determines the current **state** ($s$).
2. The agent outputs the optimal **action** ($a$) according to the current **policy**.
3. The environment provides a corresponding **reward** ($r$) and transitions to the **next state** ($s'$).
4. Repeat steps 1–3 until the **episode** ends.

The exact details vary depending on the specific algorithm. RL algorithms are diverse, but they can be broadly classified in two ways:

### By Parameter Update Strategy

- **Policy-Based**: e.g., REINFORCE
- **Value-Based**: e.g., SARSA, the DQN family (DDQN, D3QN, etc.)
- **Actor-Critic**: e.g., A2C, A3C, DDPG, PPO, SAC, etc.

### By Training Paradigm

- **On-Policy**: e.g., REINFORCE, SARSA, etc.
- **Off-Policy**: e.g., DQN, DDPG, PPO, etc.

You might find these terms confusing at first — What is Policy-Based? What is Actor-Critic? Why are there different training paradigms?

Don't worry — just get a rough impression for now. The key takeaway is that **regardless of the algorithm, the objective is the same**:

> **Maximize the cumulative reward per episode!**

In conventional machine learning, the objective is typically to minimize a loss function. In reinforcement learning, the objective becomes **maximizing the cumulative reward per episode**. Suppose one episode consists of $T$ steps. Following the RL workflow described above, the process looks roughly like this:

- At step 1, the cumulative return is: $G_1 = r_1 + r_2 + \cdots + r_T = \sum_{i=1}^{T} r_i$
- At step 2, the cumulative return is: $G_2 = r_2 + r_3 + \cdots + r_T = \sum_{i=2}^{T} r_i$
- By induction, the cumulative return at step $t$ is:

$$
G_t = r_t + r_{t+1} + \cdots + r_T = \sum_{i=t}^{T} r_i
$$

We use $G_t$ to assess the quality of the action taken at step $t$.


### Reward Discount Factor

Suppose at step $t$, the agent executes an action and receives an immediate reward $r_t$. As stated above, we use $G_t$ to evaluate the quality of that action. However, if an episode is very long — spanning hundreds or even thousands of steps — actions taken far in the future may have little relation to the action taken now. Should we still consider all future rewards equally?

To address this, reinforcement learning introduces the **reward discount factor** ($\gamma$), a floating-point number between 0 and 1 that represents how much we value future rewards:

$$
G_t = r_t + \gamma \, r_{t+1} + \gamma^2 \, r_{t+2} + \cdots = \sum_{k=0}^{T-t} \gamma^k \, r_{t+k}
$$

- If $\gamma = 1$: every future reward is treated as equally important.
- If $\gamma = 0$: only the immediate reward at the current step is considered.

The smaller the $\gamma$, the more "short-sighted" the trained agent becomes. In practice, $\gamma$ is commonly set to **0.9**, **0.95**, or **0.99**.


## Conclusion

That covers the fundamental concepts of reinforcement learning. Even at this introductory level, there is already quite a lot of ground to cover. Hopefully this article provides a solid foundation for understanding the RL literature and more advanced topics such as policy gradient methods, value function approximation, and modern actor-critic architectures.


## Further Reading
- Sutton, R. S., & Barto, A. G. (2018). *Reinforcement Learning: An Introduction* (2nd ed.). MIT Press.
- [OpenAI Spinning Up — Introduction to RL](https://spinningup.openai.com/en/latest/spinningup/rl_intro.html)
