最短漢米爾頓路徑問題 (I) - 數學模式說明
===

###### tags: `TSP` `Hamiltonian Path` `Operations Research`

![TSP 示意圖](/posts/shp-intro/tsp.png)

## 前言
傳統的 __旅行推銷員問題 (The Traveling Salesman/Salesperson Problem)__ 是指從某一起點出發，經過所有節點後，最後再回到起點，也就是起訖點一致。但如果今天給定起點跟終點，且起訖點不同的情況下，我們有沒有辦法找到一條同樣可以經過所有節點的路徑呢？如果說給定一個起點跟一個終點，真的存在一條可以經過所有節點的路徑，這條路徑就稱之為 __漢米爾頓路徑 (Hamiltonian Path)__。

在現實世界中的路徑規劃，假設每個點之間彼此都能互相來往，在此情況下一定能找到一條漢米爾頓路徑，而這個假設基本上也能符合大部分的應用情境。漢米爾頓路徑可能會有兩條或以上，通常我們比較感興趣的是找出 __最短漢米爾頓路徑 (Shortest Hamiltonian Path, SHP)__。


## 模式說明
漢米爾頓路徑跟旅行推銷員問題相當類似，因此在模式的長相也很接近。我們先回顧一下旅行推銷員的數學規劃模式建立考量的點：

__旅行推銷員問題 (The Traveling Salesman/Salesperson Problem, TSP)__
- 目標式：最小化旅行距離 / 時間 / 成本
- 限制式 1：每個節點只能有一個流入 (flow in)
- 限制式 2：每個節點只能有一個流出 (flow out)
- 限制式 3：消除子迴圈 (Subtour Elimination)

故 TSP 的數學規劃模式如下：
<!-- latex 中的 & 表對齊的位置 -->
$$
\begin{align}
    \min \space\space &\sum_{i}\sum_{j}c_{ij}x_{ij} \nonumber \\
    \text{s.t.}\space\space &\sum_{i}x_{ij} = 1\\
    &\sum_{j}x_{ij} = 1\\
    &u_{i} - u_{j} + nx_{ij} \leq n - 1\\
    &x_{ij} \in {\{0, 1\}}, \space\space\forall i,j = 1,2,\cdots n \nonumber\\
    &u_{i}, u_{j} \geq 0, \space\space\forall i,j = 1,2,\cdots n, \space\space\forall i \neq j \nonumber
\end{align}
$$

而在 __最短漢米爾頓路徑問題 (The Shortest Hamiltonian Path Problem, SHPP)__，我們需要將 TSP 的限制式 1 跟限制式 2 進行調整：

> __*在限制式 1 的部分，除了起點外，每個節點只能有一個流入，且起點的流入為 0。
> 在限制式 2 的部分，除了終點外，每個節點只能有一個流出，且終點的流出為 0。*__

故 SHPP 的數學規劃模式如下，相較於 TSP，多加上了兩條限制式：
<!-- latex 中的 & 表對齊的位置 -->
$$
\begin{align}
    \min \space\space &\sum_{i}\sum_{j}c_{ij}x_{ij} \nonumber \\
    \text{s.t.}\space\space &\sum_{i}x_{ij} = 1\\
    &\sum_{j}x_{ij} = 1\\
    &\sum_{i}x_{i1} = 0\\
    &\sum_{j}x_{nj} = 0\\
    &u_{i} - u_{j} + nx_{ij} \leq n - 1\\
    &x_{ij} \in {\{0, 1\}}, \space\space\forall i,j = 1,2,\cdots n \nonumber\\
    &u_{i}, u_{j} \geq 0, \space\space\forall i,j = 1,2,\cdots n, \space\space\forall i \neq j \nonumber
\end{align}
$$

<!-- 以上這些東西，可以直接利用 [Google OR-Tools 提供的範例程式碼](https://colab.research.google.com/github/google/or-tools/blob/stable/examples/notebook/constraint_solver/vrp_starts_ends.ipynb?hl=zh-tw) 並稍作修改，即可求解漢米爾頓路徑 [(說明點此)](https://developers.google.com/optimization/routing/routing_tasks?hl=zh-tw#setting_start_and_end_locations_for_routes)。

用圖片來說明更加實在，假設起點、終點，及其他節點的位置如下圖所示，我們將所有點編號為 1-11，點 1 為起點，點 11 為終點。 -->


## 消除子迴圈 (Subtour Elimination)
如果是初學 TSP 的讀者，也許會對消除子迴圈限制式感到相當困惑。為什麼要加上消除子迴圈限制式呢？如果不加諸此一限制式，又會有什麼結果？

我們以 SHPP 為例，以下為不加上消除子迴圈限制式的數學規劃模式：
$$
\begin{align}
    \min \space\space &\sum_{i}\sum_{j}c_{ij}x_{ij} \nonumber \\
    \text{s.t.}\space\space &\sum_{i}x_{ij} = 1\\
    &\sum_{j}x_{ij} = 1\\
    &\sum_{i}x_{i1} = 0\\
    &\sum_{j}x_{nj} = 0\\
    &\space\forall i,j = 1,2,\cdots n
\end{align}
$$

我們可以對這個模式求解，同樣也能求得一組最佳解，接著將結果繪製如下：

![](https://hackmd.io/_uploads/SyeqgMrAta.png)
<br>


除了起點跟終點外，每個節點都滿足一個流入跟一個流出，且起點只有流出，終點只有流入，確實滿足上面所有的限制式，但顯然這樣的結果並非我們要的。這些四處自成一組小圈圈的稱之為子迴圈 (或稱子迴路, subtour)。因此，我們希望能夠將每個子迴圈打破，讓他們通通串在一起。常見的消除子迴圈方式有兩種，以下分別說明：

### 窮舉法
沿用上面的圖方便說明，假設所有的點集合 $V=\{1,2,\cdots,11\}$，我們可以從中任選至少兩點，且不等於 $V$ 的子集 $S$，即 $\forall S\subsetneq V,\space |S|\geq 2$。

依上述定義，如 $S_{1}=\{2,5,7\}$、$S_{2}=\{3,8\}$、$S_{3}=\{1,4,9,10,11\}$ 等都屬於合法子集；而像是 $S_{4}=\{5\}$ 或 $S_{5}=\{6\}$ 就不是合法子集。

窮舉法的想法相當簡單，就是任選 $m$ 個點，也就是 $|S|=m$，這 $m$ 個點之間至多只能存在 $m-1$ 條路徑，寫成數學式就長下面這樣：

$$
\sum_{i\in S,\space j\in S,\space i\neq j} x_{ij}\leq |S|,\space \forall S\subsetneq V,\space |S|\geq 2
$$

但此法的缺點是當求解的點愈多，子迴圈限制式的數量會呈指數成長。假設共有 $n$ 個點，則需要 $2^{n}-n-2$ 條子迴圈限制式。
<!-- https://youtu.be/-m7ASCB0a8E?si=fumzy2GTaNJ3k4EF -->

### MTZ 限制式 (Miller-Tucker-Zemlin Constraints)
由 Miller, Tucker, Zemlin 三位學者共同提出，在此限制式中，再引入決策變數 $u_{i}$，$\forall i = 1, 2, \cdots n$，$u_{i} \geq 0$ 且 $\space u_{i} \in \mathcal{N}$。這個 __$u_{i}$ 是次序的概念，表示點 $i$ 是路徑中的第幾個被訪問的點__，舉例來說，$u_{2}=8$ 表示點 2 是路徑中第 8 個被訪問的點；$u_{5}=3$ 表示點 5 是路徑中第 3 個被訪問的點。

在 TSP 問題中，需要再加上以下三條限制式，也就是所謂的 MTZ 限制式：
$$
\begin{align}
    &u_{1} = 1\\
    &2 \leq u_{i} \leq n \\
    &u_{i} - u_{j} + nx_{ij} \leq n - 1
\end{align}
$$

- $u_{1} = 1$ 表示點 1 是第 1 個被訪問的點，換句話說，點 1 就是起點。
- $2 \leq u_{i} \leq n$ 是用來界定 $u_{i}$ 的範圍，$u_{i}$ 從 2 開始的原因是因為，我們已經處理完起點的部分了 (即 $u_{1} = 1$)。
- $u_{i} - u_{j} + nx_{ij} \leq n - 1$：
<br>
    - 先將原式移項得 $u_{i} - u_{j} + 1 \leq n (1 - x_{ij})$，方便後續說明。
    - 已知：$x_{ij} \in \{0,1\}$，若 $x_{ij}=1$，表示點 $i$ 到點 $j$ 有一條可行路徑，且順序為先經過點 $i$，再經過點 $j$，也就是 $u_{i} + 1 = u_{j}$。
    - __Case 1: 點 $i$ 到點 $j$ 存在一條可行路徑__，代入限制式得：$$u_{i} - (u_{i}+1) + 1 \leq n (1-1) \Rightarrow 0 \leq 0$$
    - __Case 2: 點 $i$ 到點 $j$ 之間沒有可行路徑__，代入限制式得：$$u_{i} - u_{j} + 1 \leq n (1-0) \Rightarrow u_{i} - u_{j} + 1 \leq n$$
    - __Case 2__，又可以分成兩種情況：
        - $u_{i} < u_{j}$，則 LHS 必 $\leq 0$，又 $0 \leq n$，故限制式恆成立。
        - $u_{i} > u_{j}$，則 LHS 必 $\leq n-1$，又 $n-1 \leq n$，故限制式恆成立。
        
上面的說明有點抽象，舉個實際的例子可能比較好懂。假設經過最佳化求解之漢米爾頓路徑如下，圓圈內的數字表示編號：
<br>
![](https://hackmd.io/_uploads/H1cT2ERFa.png)
<br>

由上圖之結果，最佳化求解後之路徑為 $1-8-6-7-10-9-2-3-4-5-11$，因此：
$$
\begin{align}
&u_{1}=1, &x_{18}=1 \space;\\
&u_{2}=8, &x_{86}=1 \space;\\
&u_{3}=6, &x_{67}=1 \space;\\
&u_{4}=7, &x_{710}=1 \space;\\
&u_{5}=10, &x_{109}=1 \space;\\
&u_{6}=9, &x_{92}=1 \space;\\
&u_{7}=2, &x_{23}=1 \space;\\
&u_{8}=3, &x_{34}=1 \space;\\
&u_{9}=4, &x_{45}=1 \space;\\
&u_{10}=5, &x_{511}=1 \space;\\
&u_{11}=11
\end{align}
$$

將以上的結果代入限制式，讀者可以嘗試看看，在違反限制式的情況下，就會產生子迴圈。

## 延伸閱讀
[最短漢米爾頓路徑問題 (II) - 使用 Google OR-Tools 實作](https://hackmd.io/MhrvcvzRRziumlRCMfm6FQ)

<!-- ## 實際案例
(一) 貪婪算法：求最短路徑
![](https://hackmd.io/_uploads/SkuoTh4fT.png)

(二) 最短漢米爾頓路徑
![](https://hackmd.io/_uploads/H1A86h4Ma.png) -->
