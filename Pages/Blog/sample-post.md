---
title: 'My first test page'
date: 2025-07-16
image: images/blake-logo.png
tags: ["machine-learning", "algebra"]
description: "Get to know the fundamentals of Blake, the static site generator."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
---

# Đại số tuyến tính

Để thể hiện các ý tưởng trực quan, toán học thường định nghĩa một tập các đối tượng kèm theo các quy tắc để thao tác với chúng. Cấu trúc như vậy gọi là một "đại số" (algebra).

Đại số tuyến tính (linear algebra) nghiên cứu các vectơ và các quy tắc đại số dùng để thao tác với chúng. Mặc dù vectơ thường xuất hiện đầu tiên dưới dạng vectơ hình học (geometric vectors) - biểu diễn như các mũi tên chỉ hướng và độ lớn - đại số tuyến tính xem xét một khái niệm vectơ tổng quát hơn.

Trong góc nhìn trừu tượng, một vectơ là bất kỳ đối tượng nào thoả hai tính chất cơ bản: có thể cộng với một vectơ khác, và có thể nhân với một vô hướng (scalar) để cho đối tượng cùng loại. Từ quan điểm đại số, bất kỳ đối tượng nào thoả hai tính chất này đều được xem là vectơ.

Vectơ hình học là một ví dụ cụ thể. Chúng có thể trực quan hoá dưới dạng đoạn thẳng có hướng, cộng với nhau để tạo ra vectơ mới, và có thể nhân với số thực. Diễn giải hình học này giúp xây dựng trực giác về phép cộng vectơ và phép nhân vô hướng.

---

## Biểu diễn toán học (Mathematical expressions)

**Ký hiệu vectơ (Vector notation)**

:::latex
$$
\mathbf{x}, \mathbf{y} \in \mathbb{V}
$$
:::

Ở đây $\mathbb{V}$ là một không gian vectơ (vector space).

**Phép cộng vectơ (Vector addition)**

:::latex
$$
\mathbf{x} + \mathbf{y} = \mathbf{z}
$$
:::

**Phép nhân vô hướng (Scalar multiplication)**

:::latex
$$
\lambda \mathbf{x}, \quad \lambda \in \mathbb{R}
$$
:::

**Tính đóng (closure properties)**

:::latex
$$
\mathbf{x} + \mathbf{y} \in \mathbb{V}
$$
:::

:::latex
$$
\lambda \mathbf{x} \in \mathbb{V}, \quad \lambda \in \mathbb{R}
$$
:::

---

Bên cạnh vectơ hình học, nhiều đối tượng khác cũng thoả hai tính chất trong định nghĩa vectơ.

Đa thức (polynomials) là một ví dụ: hai đa thức cộng lại được một đa thức, và nhân một đa thức với số thực vẫn là một đa thức. Tín hiệu âm thanh (audio signals) cũng là ví dụ khác: được biểu diễn dưới dạng dãy số, cộng hai tín hiệu cho tín hiệu mới, nhân với vô hướng cho tín hiệu cùng loại. Những ví dụ này cho thấy khái niệm vectơ rất phổ quát.

Khái niệm vectơ trong $\mathbb{R}^n$ là trọng tâm ứng dụng vì nó tương ứng trực tiếp với array trong máy tính.

Ví dụ, một vectơ trong $\mathbb{R}^3$ có thể viết như một cột:

:::latex
$$
\mathbf{a} = \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix} \in \mathbb{R}^3
$$
:::

---

## Một vài biểu thức bổ sung

**Nhân đa thức (Polynomial scaling)**

:::latex
$$
\lambda p(x), \quad \lambda \in \mathbb{R}
$$
:::

**Cộng vectơ trong $\mathbb{R}^n$**

:::latex
$$
\mathbf{a} + \mathbf{b} = \mathbf{c}, \quad \mathbf{a}, \mathbf{b}, \mathbf{c} \in \mathbb{R}^n
$$
:::

---

## Hệ phương trình tuyến tính (Systems of Linear Equations)

Hệ phương trình tuyến tính là một chủ đề cốt lõi trong đại số tuyến tính. Nhiều bài toán thực tế và trong học máy (machine learning) có thể biểu diễn dưới dạng hệ tuyến tính.

### Ví dụ: Lập kế hoạch sản xuất (Production Planning)

Giả sử công ty sản xuất các sản phẩm $N_1, \dots, N_n$ bằng các tài nguyên $R_1, \dots, R_m$. Để sản xuất một đơn vị sản phẩm $N_j$ cần $a_{ij}$ đơn vị tài nguyên $R_i$.

Nếu công ty sản xuất $x_1, \dots, x_n$ đơn vị của mỗi sản phẩm và có "nguồn cung" $b_i$ cho tài nguyên $R_i$, thì tổng tiêu thụ tài nguyên $R_i$ là:

:::latex
$$
a_{i1} x_1 + a_{i2} x_2 + \cdots + a_{in} x_n
$$
:::

Kế hoạch sản xuất tối ưu phải thoả hệ phương trình:

:::latex
$$
\begin{aligned}
 a_{11} x_1 + \cdots + a_{1n} x_n &= b_1 \\
 \vdots \quad & \\
 a_{m1} x_1 + \cdots + a_{mn} x_n &= b_m
\end{aligned}
$$
:::

Ở đây $a_{ij} \in \mathbb{R}$ và $b_i \in \mathbb{R}$. Ẩn số là $x_1, \dots, x_n$. Một vectơ $(x_1, \dots, x_n) \in \mathbb{R}^n$ mà thoả mọi phương trình là một nghiệm của hệ.

---

### Ví dụ: Vô nghiệm (No Solution)

Xét hệ:

:::latex
$$
\begin{aligned}
 x_1 + x_2 + x_3 &= 3 \\
 x_1 - x_2 + 2x_3 &= 2 \\
 2x_1 + 3x_3 &= 1
\end{aligned}
$$
:::

Cộng hai phương trình đầu cho ta $2x_1 + 3x_3 = 5$, mâu thuẫn với phương trình thứ ba - nên hệ vô nghiệm.

---

### Ví dụ: Nghiệm duy nhất (Unique Solution)

Xét hệ:

:::latex
$$
\begin{aligned}
 x_1 + x_2 + x_3 &= 3 \\
 x_1 - x_2 + 2x_3 &= 2 \\
 x_2 + x_3 &= 2
\end{aligned}
$$
:::

Từ phương trình thứ nhất và thứ ba suy ra $x_1 = 1$. Thay vào hai phương trình còn lại, ta được $x_2 = 1$, $x_3 = 1$.

Vậy nghiệm duy nhất là:

:::latex
$$
(x_1, x_2, x_3) = (1,1,1)
$$
:::

---

### Ví dụ: Vô số nghiệm (Infinitely Many Solutions)

Xét hệ:

:::latex
$$
\begin{aligned}
 x_1 + x_2 + x_3 &= 3 \\
 x_1 - x_2 + 2x_3 &= 2 \\
 2x_1 + 3x_3 &= 5
\end{aligned}
$$
:::

Ở đây phương trình thứ ba là tổng của hai phương trình đầu, nên phụ thuộc; chọn tham số tự do $a = x_3 \in \mathbb{R}$.

Khi đó:

:::latex
$$
\begin{aligned}
 x_1 &= \frac{5}{2} - \frac{3}{2} a \\
 x_2 &= \frac{1}{2} + \frac{1}{2} a
\end{aligned}
$$
:::

Ta có nghiệm tổng quát (dạng tham số):

:::latex
$$
\begin{bmatrix}
\frac{5}{2} - \frac{3}{2} a \\
\frac{1}{2} + \frac{1}{2} a \\
 a
\end{bmatrix}^{\top}, \quad a \in \mathbb{R}
$$
:::

Hệ có **vô số nghiệm**.

---

## Biểu diễn ma trận (Matrix formulation)

Tổng quát, hệ phương trình tuyến tính có thể viết dưới dạng ma trận:

:::latex
$$
\mathbf{A} \mathbf{x} = \mathbf{b}
$$
:::

với

:::latex
$$
\mathbf{A} = \begin{bmatrix} a_{11} & \cdots & a_{1n} \\
\vdots & \ddots & \vdots \\
 a_{m1} & \cdots & a_{mn} \end{bmatrix}, \quad
\mathbf{x} = \begin{bmatrix} x_1 \\
\vdots \\
 x_n \end{bmatrix}, \quad
\mathbf{b} = \begin{bmatrix} b_1 \\
\vdots \\
 b_m \end{bmatrix}
$$
:::

---

## Ma trận (Matrices)

Ma trận là công cụ trung tâm của đại số tuyến tính. Các phép toán cơ bản: cộng, nhân, chuyển vị (transpose), định thức (determinant), nghịch đảo (inverse) v.v.

**Cộng ma trận (Matrix addition)**

:::latex
$$
\mathbf{A} + \mathbf{B} = \begin{bmatrix} a_{11} + b_{11} & \cdots & a_{1n} + b_{1n} \\
\vdots & \ddots & \vdots \\
 a_{m1} + b_{m1} & \cdots & a_{mn} + b_{mn} \end{bmatrix}
$$
:::

**Nhân ma trận (Matrix multiplication)**

:::latex
$$
c_{ij} = \sum_{l=1}^{n} a_{il} b_{lj}
$$
:::

(Phép nhân chỉ được định nghĩa khi kích thước phù hợp.)

**Ma trận đơn vị (Identity matrix)**

:::latex
$$
\mathbf{I}_n = \begin{bmatrix} 1 & 0 & \cdots & 0 \\
0 & 1 & \cdots & 0 \\
\vdots & \vdots & \ddots & \vdots \\
0 & 0 & \cdots & 1 \end{bmatrix}
$$
:::

**Nghịch đảo (Inverse)**: $\mathbf{A}^{-1}$ là ma trận thoả $\mathbf{A}\mathbf{A}^{-1} = \mathbf{I}$ (nếu tồn tại).

---
