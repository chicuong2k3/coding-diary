---
title: 'Chương 2: Đại số tuyến tính (Linear algebra)'
date: 2025-01-22
tags: ["MATHEMATICS FOR MACHINE LEARNING"]
---

::: latex
:::

Khi hình thức hóa các khái niệm trực quan, một cách tiếp cận phổ biến là xác định một tập hợp các đối tượng cùng với các quy tắc thao tác trên chúng - đó là ý nghĩa của đại số. **Đại số tuyến tính** (Linear algebra) nghiên cứu các **vectơ** (vector) và các quy tắc để cộng, nhân vô hướng và thao tác với chúng.

Trong chương này, chúng ta sử dụng ký hiệu in đậm cho **vectơ**, ví dụ $\mathbf{x}$, $\mathbf{y}$ (thay vì $\vec{x}$, $\vec{y}$). Một **vectơ** là một đối tượng mà ta có thể cộng với **vectơ** khác và nhân với một số vô hướng, kết quả thu được vẫn là một **vectơ**. Từ góc nhìn trừu tượng, mọi đối tượng thỏa hai tính chất này (đối tượng nhân với vô hướng hoặc cộng với đối tượng cùng loại đều cho ra đối tượng cùng loại) đều được coi là **vectơ**. Dưới đây là một vài ví dụ quen thuộc:

- **Vectơ** hình học: Ví dụ về vectơ này có lẽ đã quen thuộc từ toán học và vật lý ở bậc phổ thông.  Vectơ hình học là các đoạn thẳng có hướng, có thể được vẽ (ít nhất là trong không gian hai chiều). Hai vectơ hình học $\vec{x}$, $\vec{y}$ có thể được cộng lại sao cho:

$$
\vec{x} + \vec{y} = \vec{z}
$$
trong đó $\vec{z}$ là một vectơ hình học khác.  
Hơn nữa, phép nhân một vectơ với một số vô hướng $\lambda \in \mathbb{R}$, tức $\lambda \vec{x}$, cũng tạo ra một vectơ hình học. Trên thực tế, đó là vectơ ban đầu được co giãn theo hệ số $\lambda$.

Vì vậy, vectơ hình học là những ví dụ cụ thể của khái niệm vectơ đã được giới thiệu trước đó. Việc diễn giải vectơ dưới dạng vectơ hình học cho phép chúng ta sử dụng trực giác về **hướng** và **độ lớn** để suy luận về các phép toán toán học.
- Đa thức: Đa thức cũng là vectơ. Hai đa thức có thể được cộng với nhau và kết quả là một đa thức khác; chúng cũng có thể được nhân với một số vô hướng $\lambda \in \mathbb{R}$, và kết quả vẫn là một đa thức. Do đó, đa thức là những vectơ. 
Lưu ý rằng đa thức rất khác với vectơ hình học. Trong khi vectơ hình học là các "hình vẽ" cụ thể, thì đa thức là các khái niệm trừu tượng. Tuy nhiên, cả hai đều là vectơ theo nghĩa đã mô tả trước đó.
- Tín hiệu âm thanh: Tín hiệu âm thanh được biểu diễn dưới dạng một chuỗi các số. Ta có thể cộng các tín hiệu âm thanh lại với nhau, và tổng của chúng là một tín hiệu âm thanh mới. Nếu ta co giãn (nhân vô hướng) một tín hiệu âm thanh, ta cũng thu được một tín hiệu âm thanh khác. Vì vậy, tín hiệu âm thanh cũng là một loại vectơ.
- Các phần tử của $\mathbb{R}^n$ là vectơ: Các phần tử của $\mathbb{R}^n$ (bộ gồm $n$ số thực) là vectơ. $\mathbb{R}^n$ trừu tượng hơn đa thức, và đây là khái niệm mà cuốn sách này tập trung vào. Ví dụ,

$$
\mathbf{a} =
\begin{bmatrix}
1 \\
2 \\
3
\end{bmatrix}
\in \mathbb{R}^3
$$

là một bộ ba số. Khi cộng hai vectơ $\mathbf{a}, \mathbf{b} \in \mathbb{R}^n$ theo từng thành phần, ta thu được một vectơ khác $\mathbf{c} \in \mathbb{R}^n$. Tương tự, khi nhân $\mathbf{a} \in \mathbb{R}^n$ với một số vô hướng $\lambda \in \mathbb{R}$, ta thu được vectơ đã được co giãn $\lambda \mathbf{a} \in \mathbb{R}^n$.

Việc xem vectơ như các phần tử của $\mathbb{R}^n$ còn có một lợi ích khác: nó tương ứng khá tự nhiên với các mảng số thực trên máy tính. Nhiều ngôn ngữ lập trình hỗ trợ các phép toán trên mảng, cho phép triển khai thuận tiện các thuật toán liên quan đến phép toán vectơ. Tuy nhiên, cần cẩn thận kiểm tra xem các phép toán trên mảng đó có thực sự tương ứng với các phép toán vectơ hay không khi cài đặt trên máy tính.

Đại số tuyến tính tập trung vào những điểm tương đồng giữa các khái niệm vectơ này: ta có thể cộng chúng và nhân chúng với các số vô hướng. Trong cuốn sách này, chúng tôi chủ yếu tập trung vào các vectơ trong $\mathbb{R}^n$, vì hầu hết các thuật toán trong đại số tuyến tính đều được xây dựng trong $\mathbb{R}^n$.

Ở Chương 8, ta sẽ thấy rằng dữ liệu thường được biểu diễn dưới dạng các vectơ trong $\mathbb{R}^n$. Trong sách này, chúng tôi tập trung vào các không gian vectơ hữu hạn chiều (finite-dimensional vector spaces); trong trường hợp đó, tồn tại một sự tương ứng 1:1 giữa bất kỳ loại vectơ nào và $\mathbb{R}^n$. Khi thuận tiện, chúng tôi sẽ sử dụng trực giác về vectơ hình học và xem xét các thuật toán dựa trên mảng.
vector
Một khái niệm quan trọng là **tính đóng** (closure) của một tập: bắt đầu từ một tập **vectơ đơn vị** (unit vector) và thực hiện các phép cộng/tỉ lệ, tập các vectơ (set of vectors) có thể sinh ra là gì? Câu trả lời dẫn đến khái niệm không gian **vectơ** (vector space). Không gian **vectơ** và các tính chất của nó là nền tảng cho nhiều phép toán trong máy học.

Phần còn lại của chương bày các khái niệm cơ bản: **hệ phương trình tuyến tính** (system of linear equations), **ma trận** (matrix) và các phép toán trên **ma trận**, **không gian nghiệm** (solution space), **cơ sở** (basis) và các phép biến đổi cần thiết cho các ứng dụng máy học.

![Hình 2.2: Sơ đồ tư duy (mind map) về các khái niệm được giới thiệu trong chương này, cùng với vị trí mà chúng được sử dụng ở các phần khác của cuốn sách.](/images/Mathematics-for-Machine-Learning/_page_19_Figure_1.png)


## 2.1 Hệ phương trình tuyến tính (system of linear equations)

**Hệ phương trình tuyến tính** (system of linear equations) là trung tâm của **đại số tuyến tính**. Nhiều bài toán thực tế có thể được mô tả dưới dạng **hệ phương trình tuyến tính**, và **đại số tuyến tính** cung cấp công cụ để phân tích và giải các hệ này.

**Ví dụ 2.1 (Bài toán phân phối tài nguyên).**

Giả sử một công ty sản xuất n sản phẩm $N^1, ..., N^n$ bằng cách sử dụng m loại tài nguyên $R^1, ..., R^m$. Để sản xuất một đơn vị sản phẩm $N^j$ cần $a_{ij}$ đơn vị tài nguyên $R^i$ $(i = 1,...,m; j = 1,...,n)$. Nếu có $$b^i$$ đơn vị tài nguyên $$R^i$$ sẵn có, ta muốn tìm số lượng $x_1,...,x_n$ sản phẩm để sử dụng tối ưu tài nguyên, lý tưởng là không dư thừa.

Việc tiêu thụ tài nguyên $R^i$ bởi kế hoạch sản xuất $x_1,...,x_n$ là:

$$
a_{i1}x_1 + \cdots + a_{in}x_n \tag{2.2}
$$

Do đó, một kế hoạch sản xuất tối ưu $(x_1, \ldots, x_n) \in \mathbb{R}^n$ phải thỏa mãn hệ phương trình sau:

$$
\begin{aligned}
a_{11}x_1 + \cdots + a_{1n}x_n &= b_1 \\
\vdots \qquad\qquad\qquad\quad & \vdots \\
a_{m1}x_1 + \cdots + a_{mn}x_n &= b_m
\end{aligned}
$$

Ta gọi đây là dạng tổng quát (general form) của **hệ phương trình tuyến tính**; **nghiệm** (solution) của hệ là các n-tuple ($x_1$,...,$x_n$) thỏa các phương trình trên.

**Ví dụ 2.2.** Xét hệ

$$
\begin{aligned}
x_1 + x_2 + x_3 &= 3 \quad (1) \\
x_1 - x_2 + 2x_3 &= 2 \quad (2) \\
2x_1 + 3x_3 &= 1 \quad (3)
\end{aligned}
\tag{2.4}
$$

**không có nghiệm**: Cộng hai phương trình đầu tiên ta được  
$2x_1 + 3x_3 = 5$, điều này mâu thuẫn với phương trình thứ ba (3).

---

Xét hệ phương trình tuyến tính

$$
\begin{aligned}
x_1 + x_2 + x_3 &= 3 \quad (1) \\
x_1 - x_2 + 2x_3 &= 2 \quad (2) \\
x_2 + x_3 &= 2 \quad (3)
\end{aligned}
\tag{2.5}
$$

Từ phương trình (1) và (3) suy ra $x_1 = 1$.  
Từ (1) + (2) ta được $2x_1 + 3x_3 = 5$, suy ra $x_3 = 1$.  
Từ (3) tiếp theo ta có $x_2 = 1$.

Do đó, $(1, 1, 1)$ là nghiệm duy nhất và cũng là nghiệm duy nhất có thể của hệ (có thể kiểm tra lại bằng cách thay $(1, 1, 1)$ vào hệ phương trình).

---

Xét ví dụ thứ ba:

$$
\begin{aligned}
x_1 + x_2 + x_3 &= 3 \quad (1) \\
x_1 - x_2 + 2x_3 &= 2 \quad (2) \\
2x_1 + 3x_3 &= 5 \quad (3)
\end{aligned}
\tag{2.6}
$$

Vì $(1) + (2) = (3)$, nên phương trình thứ ba là **dư thừa** và có thể loại bỏ.  
Từ (1) và (2) ta thu được

$$
2x_1 = 5 - 3x_3, \qquad 2x_2 = 1 + x_3.
$$

Đặt $x_3 = a \in \mathbb{R}$ là một **biến tự do**, khi đó mọi bộ ba

$$
\left(
\frac{5}{2} - \frac{3}{2}a,\;
\frac{1}{2} + \frac{1}{2}a,\;
a
\right),
\quad a \in \mathbb{R}
$$

đều là nghiệm của hệ phương trình.

Nói chung, đối với một hệ phương trình tuyến tính với các hệ số thực, ta sẽ thu được **hoặc không có nghiệm**, **hoặc đúng một nghiệm**, **hoặc vô số nghiệm**.  
Hồi quy tuyến tính (Chương 9) giải quyết một biến thể của Ví dụ 2.1 trong trường hợp ta **không thể giải trực tiếp** hệ phương trình tuyến tính.

---

::: info
**Diễn giải hình học của các hệ phương trình tuyến tính**

Trong một hệ phương trình tuyến tính với hai biến $x_1, x_2$, mỗi phương trình tuyến tính xác định một **đường thẳng** trên mặt phẳng $x_1x_2$. Vì nghiệm của hệ phương trình phải thỏa mãn **tất cả** các phương trình đồng thời, nên **tập nghiệm** chính là **giao** của các đường thẳng này.

Tập giao đó có thể là:
- một **đường thẳng** (nếu các phương trình mô tả cùng một đường),
- một **điểm**,
- hoặc **rỗng** (khi các đường thẳng song song).

Một minh họa được cho trong Hình 2.3 với hệ phương trình

$$
\begin{aligned}
4x_1 + 4x_2 &= 5 \\
2x_1 - 4x_2 &= 1
\end{aligned}
\tag{2.8}
$$

trong đó không gian nghiệm là điểm $(x_1, x_2) = \left(1, \frac{1}{4}\right)$.

![Hình 2.3: Không gian nghiệm của một hệ gồm hai phương trình tuyến tính với hai biến có thể được diễn giải theo hình học như giao điểm của hai đường thẳng. Mỗi phương trình tuyến tính tương ứng với một đường thẳng.](/images/Mathematics-for-Machine-Learning/_page_21_Figure_1.png)

Tương tự, với **ba biến**, mỗi phương trình tuyến tính xác định một **mặt phẳng** trong không gian ba chiều. Khi lấy giao của các mặt phẳng này, tức là thỏa mãn tất cả các phương trình cùng lúc, ta có thể thu được một tập nghiệm là:
- một **mặt phẳng**,
- một **đường thẳng**,
- một **điểm**,
- hoặc **rỗng** (khi các mặt phẳng không có giao chung).
:::

::: info
**Dạng ma trận của hệ phương trình tuyến tính**

Để tiếp cận việc giải các hệ phương trình tuyến tính một cách có hệ thống, ta sẽ giới thiệu một ký hiệu gọn gàng và hữu ích. Ta gom các hệ số $a_{ij}$ thành các vectơ, rồi gom các vectơ đó thành **ma trận**. Nói cách khác, ta viết hệ phương trình trong (2.3) dưới dạng:

$$
\begin{bmatrix}
a_{11} \\
\vdots \\
a_{m1}
\end{bmatrix} x_1
+
\begin{bmatrix}
a_{12} \\
\vdots \\
a_{m2}
\end{bmatrix} x_2
+ \cdots +
\begin{bmatrix}
a_{1n} \\
\vdots \\
a_{mn}
\end{bmatrix} x_n
=
\begin{bmatrix}
b_1 \\
\vdots \\
b_m
\end{bmatrix}
\tag{2.9}
$$

Tương đương với

$$
\begin{bmatrix}
a_{11} & \cdots & a_{1n} \\
\vdots & \ddots & \vdots \\
a_{m1} & \cdots & a_{mn}
\end{bmatrix}
\begin{bmatrix}
x_1 \\
\vdots \\
x_n
\end{bmatrix}
=
\begin{bmatrix}
b_1 \\
\vdots \\
b_m
\end{bmatrix}
\tag{2.10}
$$


Trong phần tiếp theo, chúng ta sẽ xem xét kỹ hơn các ma trận này và định nghĩa các quy tắc tính toán. Chúng ta sẽ quay lại việc giải các hệ phương trình tuyến tính ở Mục 2.3.
:::

## 2.2 Ma trận

**Ma trận** (matrix) là cách gọn để biểu diễn hệ tuyến tính và các ánh xạ tuyến tính (linear mappings) (hàm tuyến tính).

:::info 
**Định nghĩa 2.1 Ma trận**

Với m,n $$\in$$ $$\mathbb{N}$$, một **ma trận** thực kích thước $m \times n$ là một bảng số $a_{ij}$ sắp xếp thành m hàng và n cột:

$$
A =
\begin{bmatrix}
a_{11} & a_{12} & \cdots & a_{1n} \\
a_{21} & a_{22} & \cdots & a_{2n} \\
\vdots & \vdots & \ddots & \vdots \\
a_{m1} & a_{m2} & \cdots & a_{mn}
\end{bmatrix},
\qquad a_{ij} \in \mathbb{R}.
$$
:::

$\mathbb{R}^{m \times n}$ là tập hợp tất cả các ma trận kích thước $(m, n)$ với giá trị thực.  
Một ma trận $A \in \mathbb{R}^{m \times n}$ cũng có thể được biểu diễn tương đương như một vectơ $a \in \mathbb{R}^{mn}$ bằng cách **xếp chồng tất cả $n$ cột của ma trận lại thành một vectơ dài**.

Theo quy ước, **ma trận** kích thước $1 \times n$ được gọi là **vectơ** hàng, còn **ma trận**  $m \times 1$ được gọi là **vectơ** cột.

### 2.2.1 Cộng và nhân ma trận

Tổng của hai ma trận $A \in \mathbb{R}^{m \times n}$, $B \in \mathbb{R}^{m \times n}$ được định nghĩa là phép cộng **theo từng phần tử**, tức là

$$
A + B :=
\begin{bmatrix}
a_{11} + b_{11} & \cdots & a_{1n} + b_{1n} \\
\vdots & \ddots & \vdots \\
a_{m1} + b_{m1} & \cdots & a_{mn} + b_{mn}
\end{bmatrix}
\in \mathbb{R}^{m \times n}.
\tag{2.12}
$$

Với các ma trận $A \in \mathbb{R}^{m \times n}$, $B \in \mathbb{R}^{n \times k}$, các phần tử $c_{ij}$ của tích ma trận $C = AB \in \mathbb{R}^{m \times k}$ được tính bởi

$$
c_{ij} = \sum_{l=1}^{n} a_{il} b_{lj}, \qquad i = 1,\ldots,m,\; j = 1,\ldots,k.
\tag{2.13}
$$


Điều này có nghĩa là để tính phần tử $c_{ij}$, ta nhân các phần tử của **hàng thứ $i$ của $A$** với **cột thứ $j$ của $B$** rồi cộng chúng lại. Sau này, trong Mục 3.2, ta sẽ gọi phép toán này là **tích vô hướng** của hàng và cột tương ứng. Trong những trường hợp cần nhấn mạnh rằng ta đang thực hiện phép nhân, ta dùng ký hiệu $A \cdot B$ để chỉ phép nhân.

**Nhận xét.** Ma trận chỉ có thể nhân được nếu các kích thước "kề nhau" phù hợp. Ví dụ, một ma trận $n \times k$ có thể nhân với một ma trận $k \times m$ (từ bên trái):

$$
\underbrace{A}_{n \times k} \;
\underbrace{B}_{k \times m}
=
\underbrace{C}_{n \times m}.
\tag{2.14}
$$

Tích $BA$ không được xác định nếu $m \ne n$ vì các kích thước kề nhau không khớp.

**Nhận xét.** Phép nhân ma trận **không** được định nghĩa theo kiểu nhân từng phần tử, tức là nhìn chung
$c_{ij} \ne a_{ij} b_{ij}$ (kể cả khi kích thước của $A, B$ phù hợp). Kiểu nhân theo từng phần tử này thường xuất hiện trong các ngôn ngữ lập trình khi nhân các mảng (đa chiều) với nhau và được gọi là **tích Hadamard**.

**Ví dụ 2.3**

Với

$$
A =
\begin{bmatrix}
1 & 2 & 3 \\
3 & 2 & 1
\end{bmatrix}
\in \mathbb{R}^{2 \times 3},
\qquad
B =
\begin{bmatrix}
0 & 2 \\
1 & -1 \\
0 & 1
\end{bmatrix}
\in \mathbb{R}^{3 \times 2},
$$

ta thu được

$$
AB =
\begin{bmatrix}
1 & 2 & 3 \\
3 & 2 & 1
\end{bmatrix}
\begin{bmatrix}
0 & 2 \\
1 & -1 \\
0 & 1
\end{bmatrix}
=
\begin{bmatrix}
2 & 3 \\
2 & 5
\end{bmatrix}
\in \mathbb{R}^{2 \times 2},
\tag{2.15}
$$


và

$$
BA =
\begin{bmatrix}
0 & 2 \\
1 & -1 \\
0 & 1
\end{bmatrix}
\begin{bmatrix}
1 & 2 & 3 \\
3 & 2 & 1
\end{bmatrix}
=
\begin{bmatrix}
6 & 4 & 2 \\
-2 & 0 & 2 \\
3 & 2 & 1
\end{bmatrix}
\in \mathbb{R}^{3 \times 3}.
\tag{2.16}
$$


Từ ví dụ này, ta thấy phép nhân ma trận **không giao hoán**, tức là $AB \ne BA$.

:::info 
**Định nghĩa 2.2 Ma trận đơn vị**

Trong $\mathbb{R}^{n \times n}$, ta định nghĩa **ma trận đơn vị**

$$
I_n :=
\begin{bmatrix}
1 & 0 & \cdots & 0 \\
0 & 1 & \cdots & 0 \\
\vdots & \vdots & \ddots & \vdots \\
0 & 0 & \cdots & 1
\end{bmatrix}
\in \mathbb{R}^{n \times n},
\tag{2.17}
$$

là ma trận $n \times n$ có các phần tử trên đường chéo chính bằng 1 và các phần tử còn lại bằng 0.
:::

Một số tính chất cơ bản:

**Tính kết hợp**
$$
(AB)C = A(BC),
\tag{2.18}
$$

**Tính phân phối**
$$
(A + B)C = AC + BC, \qquad A(C + D) = AC + AD,
\tag{2.19}
$$

**Nhân với ma trận đơn vị**
$$
I_m A = A I_n = A.
\tag{2.20}
$$

Lưu ý rằng $I_m \ne I_n$ khi $m \ne n$.

---

### 2.2.2 Ma trận nghịch đảo và chuyển vị

:::info
**Định nghĩa 2.3 Ma trận nghịch đảo**

Xét một ma trận vuông $A \in \mathbb{R}^{n \times n}$. Nếu tồn tại ma trận $B \in \mathbb{R}^{n \times n}$ sao cho

$$
AB = I_n = BA,
$$

thì $B$ được gọi là **ma trận nghịch đảo** của $A$ và ký hiệu là $A^{-1}$.
:::

Không phải mọi ma trận $A$ đều có nghịch đảo. Nếu $A^{-1}$ tồn tại thì $A$ được gọi là **khả nghịch/không suy biến**; ngược lại, $A$ là **suy biến/không khả nghịch**. Khi tồn tại, nghịch đảo là **duy nhất**.

:::info
**Nhận xét (Tồn tại nghịch đảo của ma trận $2 \times 2$).**  
Xét

$$
A :=
\begin{bmatrix}
a_{11} & a_{12} \\
a_{21} & a_{22}
\end{bmatrix}
\in \mathbb{R}^{2 \times 2}.
\tag{2.21}
$$


Nếu ta nhân $A$ với

$$
A' :=
\begin{bmatrix}
a_{22} & -a_{12} \\
-a_{21} & a_{11}
\end{bmatrix},
\tag{2.22}
$$

ta thu được

$$
AA' =
\begin{bmatrix}
a_{11}a_{22} - a_{12}a_{21} & 0 \\
0 & a_{11}a_{22} - a_{12}a_{21}
\end{bmatrix}
=
(a_{11}a_{22} - a_{12}a_{21}) I.
\tag{2.23}
$$

Do đó,

$$
A^{-1} =
\frac{1}{a_{11}a_{22} - a_{12}a_{21}}
\begin{bmatrix}
a_{22} & -a_{12} \\
-a_{21} & a_{11}
\end{bmatrix}
\tag{2.24}
$$

**khi và chỉ khi** $a_{11}a_{22} - a_{12}a_{21} \ne 0$.
:::

**Ví dụ 2.4 (Ma trận nghịch đảo)**

Hai ma trận

$$
A =
\begin{bmatrix}
1 & 2 & 1 \\
4 & 4 & 5 \\
6 & 7 & 7
\end{bmatrix},
\qquad
B =
\begin{bmatrix}
-7 & -7 & 6 \\
2 & 1 & -1 \\
4 & 5 & -4
\end{bmatrix}
\tag{2.25}
$$

là nghịch đảo của nhau vì $AB = I = BA$.

:::info
**Định nghĩa 2.4 (Chuyển vị)**

Với $A \in \mathbb{R}^{m \times n}$, ma trận $B \in \mathbb{R}^{n \times m}$ thỏa $b_{ij} = a_{ji}$ được gọi là **ma trận chuyển vị** của $A$, ký hiệu là $A^\top$.

Các tính chất quan trọng:

$$
AA^{-1} = I = A^{-1}A,
\tag{2.26}
$$

$$
(AB)^{-1} = B^{-1} A^{-1},
\tag{2.27}
$$

$$
(A + B)^{-1} \ne A^{-1} + B^{-1},
\tag{2.28}
$$

$$
(A^\top)^\top = A,
\tag{2.29}
$$

$$
(AB)^\top = B^\top A^\top,
\tag{2.30}
$$

$$
(A + B)^\top = A^\top + B^\top.
\tag{2.31}
$$
:::

:::info
**Định nghĩa 2.5 (Ma trận đối xứng)**

Một ma trận $A \in \mathbb{R}^{n \times n}$ được gọi là **đối xứng** nếu

$$
A = A^\top.
$$

Chỉ các ma trận vuông mới có thể là đối xứng. Nếu $A$ khả nghịch thì $A^\top$ cũng khả nghịch và

$$
(A^{-1})^\top = (A^\top)^{-1} = A^{-\top}.
$$

**Nhận xét.** Tổng của hai ma trận đối xứng luôn đối xứng, nhưng tích của chúng nói chung **không** đối xứng:

$$
\begin{bmatrix}
1 & 0 \\
0 & 0
\end{bmatrix}
\begin{bmatrix}
1 & 1 \\
1 & 1
\end{bmatrix}
=
\begin{bmatrix}
1 & 1 \\
0 & 0
\end{bmatrix}.
\tag{2.32}
$$
:::

### 2.2.3 Nhân ma trận với một số vô hướng

Với $A \in \mathbb{R}^{m \times n}$ và $\lambda \in \mathbb{R}$, ta có $\lambda A = K$ với $K_{ij} = \lambda a_{ij}$. Tức là $\lambda$ **co giãn** mọi phần tử của $A$.

Các tính chất:

**Tính kết hợp**
$$
(\lambda \psi) C = \lambda (\psi C),
$$

$$
\lambda (BC) = (\lambda B)C = B(\lambda C) = (BC)\lambda.
$$

**Tính phân phối**
$$
(\lambda + \psi) C = \lambda C + \psi C,
$$

$$
\lambda (B + C) = \lambda B + \lambda C.
$$

**Ví dụ 2.5 (Tính phân phối)**

Cho

$$
C :=
\begin{bmatrix}
1 & 2 \\
3 & 4
\end{bmatrix},
\tag{2.33}
$$

với mọi $\lambda, \psi \in \mathbb{R}$ ta có

$$
(\lambda + \psi) C =
\begin{bmatrix}
\lambda + \psi & 2\lambda + 2\psi \\
3\lambda + 3\psi & 4\lambda + 4\psi
\end{bmatrix}
= \lambda C + \psi C.
\tag{2.34}
$$


### 2.2.4 Biểu diễn gọn của hệ phương trình tuyến tính

Xét hệ

$$
\begin{aligned}
2x_1 + 3x_2 + 5x_3 &= 1 \\
4x_1 - 2x_2 - 7x_3 &= 8 \\
9x_1 + 5x_2 - 3x_3 &= 2
\end{aligned}
\tag{2.35}
$$

Sử dụng quy tắc nhân ma trận, ta có thể viết gọn hệ này dưới dạng

$$
\begin{bmatrix}
2 & 3 & 5 \\
4 & -2 & -7 \\
9 & 5 & -3
\end{bmatrix}
\begin{bmatrix}
x_1 \\
x_2 \\
x_3
\end{bmatrix}
=
\begin{bmatrix}
1 \\
8 \\
2
\end{bmatrix}.
\tag{2.36}
$$

Nói chung, một hệ phương trình tuyến tính có thể được biểu diễn gọn dưới dạng **$Ax = b$**, và tích $Ax$ là một tổ hợp tuyến tính của các cột của $A$. Chúng ta sẽ thảo luận chi tiết hơn về tổ hợp tuyến tính trong Mục 2.5.

## 2.3 Giải hệ phương trình tuyến tính

Trong (2.3), chúng ta đã giới thiệu dạng tổng quát của một hệ phương trình, tức là

$$
\begin{aligned}
a_{11}x_1 + \cdots + a_{1n}x_n &= b_1 \\
\vdots & \vdots \\
a_{m1}x_1 + \cdots + a_{mn}x_n &= b_m
\end{aligned}
\tag{2.37}
$$

trong đó $a_{ij} \in \mathbb{R}$ và $b_i \in \mathbb{R}$ là các hằng số đã biết, còn $x_j$ là các ẩn số,
với $i = 1,\ldots,m$, $j = 1,\ldots,n$.

Cho đến nay, chúng ta đã thấy rằng ma trận có thể được dùng như một cách gọn gàng để biểu diễn các hệ phương trình tuyến tính, sao cho ta có thể viết

$$
Ax = b
\tag{2.10}
$$

### 2.3.1 Nghiệm riêng và nghiệm tổng quát

Xét hệ phương trình

$$
\begin{bmatrix}
1 & 0 & 8 & -4 \\
0 & 1 & 2 & 12
\end{bmatrix}
\begin{bmatrix}
x_1 \\ x_2 \\ x_3 \\ x_4
\end{bmatrix}
=
\begin{bmatrix}
42 \\ 8
\end{bmatrix}
\tag{2.38}
$$

Một nghiệm của hệ là

$$
x =
\begin{bmatrix}
42 \\ 8 \\ 0 \\ 0
\end{bmatrix}
$$

Nghiệm này được gọi là **nghiệm riêng** (hay **nghiệm đặc biệt**).

### 2.3.2 Dạng bậc thang theo hàng (Row-Echelon Form)

Một ma trận được gọi là ở **dạng bậc thang theo hàng (REF)** nếu:

1. Tất cả các hàng chỉ gồm số 0 nằm ở cuối ma trận.
2. Hệ số khác 0 đầu tiên (pivot) của mỗi hàng nằm **bên phải** pivot của hàng phía trên.

### 2.3.3 Dạng bậc thang rút gọn theo hàng (Reduced Row-Echelon Form)

:::info
Một ma trận ở **dạng bậc thang rút gọn theo hàng (RREF)** nếu:

1. Nó đã ở dạng REF.
2. Mỗi pivot bằng 1.
3. Pivot là phần tử khác 0 duy nhất trong cột của nó.
:::

**Ví dụ (Dạng bậc thang rút gọn theo hàng)**

$$
A =
\begin{bmatrix}
1 & 3 & 0 & 0 & 3 \\
0 & 0 & 1 & 0 & 9 \\
0 & 0 & 0 & 1 & -4
\end{bmatrix}
\tag{2.49}
$$


### 2.3.4 Nghiệm tổng quát của hệ thuần nhất

Mọi nghiệm của hệ $Ax = 0$, với $x \in \mathbb{R}^5$, được cho bởi

$$
\left\{
x = \lambda_1
\begin{bmatrix}
3 \\ -1 \\ 0 \\ 0 \\ 0
\end{bmatrix}
+
\lambda_2
\begin{bmatrix}
3 \\ 0 \\ 9 \\ -4 \\ -1
\end{bmatrix}
\;\middle|\;
\lambda_1, \lambda_2 \in \mathbb{R}
\right\}
\tag{2.50}
$$

**Mẹo "Minus-1"**

Trong phần này, chúng ta giới thiệu một **mẹo thực hành** để đọc ra nghiệm $x$ của một **hệ phương trình tuyến tính thuần nhất**
$$
Ax = 0,
$$
trong đó $A \in \mathbb{R}^{k \times n}$ và $x \in \mathbb{R}^n$.

Trước hết, ta giả sử rằng $A$ đang ở **dạng bậc thang rút gọn theo hàng** (reduced row-echelon form – RREF) và **không có hàng nào toàn số 0**, tức là

$$
A =
\begin{bmatrix}
0 & \cdots & 0 & 1 & * & \cdots & * & 0 & * & \cdots & * & 0 & * & \cdots & * \\
\vdots & & & & & & & & & & & & & & \\
0 & \cdots & 0 & 0 & \cdots & 0 & 1 & * & \cdots & * \\
\vdots & & & & & & & & & & & & & & \\
0 & \cdots & 0 & 0 & \cdots & 0 & 0 & \cdots & 0 & 1 & * & \cdots & *
\end{bmatrix},
\tag{2.51}
$$

trong đó $*$ là các số thực bất kỳ, với các ràng buộc sau:

- Phần tử khác 0 đầu tiên trong mỗi hàng phải bằng 1 (pivot).
- Mọi phần tử khác trong cột chứa pivot đều bằng 0.

Các cột $j_1,\ldots,j_k$ chứa các pivot (được đánh dấu đậm trong sách) chính là các **vector đơn vị chuẩn**
$$
e_1,\ldots,e_k \in \mathbb{R}^k.
$$

Tiếp theo, ta **mở rộng ma trận này thành một ma trận vuông $n \times n$**, ký hiệu là $\tilde{A}$, bằng cách thêm $n-k$ hàng có dạng

$$
[\,0 \;\cdots\; 0 \; -1 \; 0 \;\cdots\; 0\,]
\tag{2.52}
$$

sao cho **đường chéo chính của ma trận mở rộng $\tilde{A}$ chỉ chứa 1 hoặc −1**.

Khi đó, **các cột của $\tilde{A}$ có −1 nằm trên đường chéo chính chính là các nghiệm của hệ thuần nhất**
$$
Ax = 0.
$$

Chính xác hơn, các cột này tạo thành **một cơ sở** (xem Mục 2.6.1) của **không gian nghiệm** của $Ax = 0$, không gian này về sau sẽ được gọi là **kernel** hay **null space** (xem Mục 2.7.3).

**Ví dụ 2.8 (Mẹo Minus-1)**

Xét lại ma trận trong (2.49), vốn đã ở dạng RREF:

$$
A =
\begin{bmatrix}
1 & 3 & 0 & 0 & 3 \\
0 & 0 & 1 & 0 & 9 \\
0 & 0 & 0 & 1 & -4
\end{bmatrix}.
\tag{2.53}
$$

Ta mở rộng ma trận này thành ma trận $5 \times 5$ bằng cách thêm các hàng dạng (2.52) tại những vị trí mà đường chéo chính chưa có pivot, và thu được

$$
\tilde{A} =
\begin{bmatrix}
1 & 3 & 0 & 0 & 3 \\
0 & -1 & 0 & 0 & 0 \\
0 & 0 & 1 & 0 & 9 \\
0 & 0 & 0 & 1 & -4 \\
0 & 0 & 0 & 0 & -1
\end{bmatrix}.
\tag{2.54}
$$

Từ dạng này, ta **có thể đọc ngay nghiệm của $Ax = 0$** bằng cách lấy các cột của $\tilde{A}$ có phần tử −1 trên đường chéo chính:

$$
\left\{
x \in \mathbb{R}^5 :
x =
\lambda_1
\begin{bmatrix}
3 \\ -1 \\ 0 \\ 0 \\ 0
\end{bmatrix}
+
\lambda_2
\begin{bmatrix}
3 \\ 0 \\ 9 \\ -4 \\ -1
\end{bmatrix},
\;
\lambda_1,\lambda_2 \in \mathbb{R}
\right\}
\tag{2.55}
$$

Kết quả này **hoàn toàn trùng với nghiệm trong (2.50)** mà trước đó ta thu được bằng "trực giác".

### 2.3.5 Tính ma trận nghịch đảo

Để tính ma trận nghịch đảo $A^{-1}$ của $A \in \mathbb{R}^{n \times n}$, ta cần tìm một ma trận $X$ sao cho

$$
AX = I_n.
$$

Khi đó $X = A^{-1}$. Ta có thể xem đây là một hệ phương trình tuyến tính đồng thời
$$
AX = I_n,
$$
trong đó
$$
X = [x_1 \mid \cdots \mid x_n].
$$

Sử dụng ký hiệu **ma trận mở rộng**, ta có

$$
\left[ A \mid I_n \right]
\;\Longrightarrow\;
\left[ I_n \mid A^{-1} \right].
\tag{2.56}
$$

Điều này có nghĩa là: **nếu đưa hệ phương trình mở rộng về dạng bậc thang rút gọn theo hàng, ta có thể đọc ra trực tiếp ma trận nghịch đảo ở vế phải**. Do đó, việc tìm ma trận nghịch đảo tương đương với việc giải các hệ phương trình tuyến tính.


