---
title: 'Chương 1: Giới thiệu'
date: 2025-01-21
tags: ["MATHEMATICS FOR MACHINE LEARNING"]
---


::: latex
:::

**Máy học** (Machine Learning) là thiết kế các **thuật toán** (algorithms) tự động trích xuất thông tin có giá trị từ **dữ liệu** (data). Sự nhấn mạnh ở đây là "tự động", tức là **máy học** quan tâm đến các phương pháp có mục đích chung có thể áp dụng cho nhiều bộ **dữ liệu** (data), đồng thời tạo ra thứ gì đó có ý nghĩa. Có ba khái niệm cốt lõi của **máy học**: **dữ liệu** (data), **mô hình** (model) và **học tập** (learning).

Vì **máy học** vốn được điều khiển bằng **dữ liệu** (data) nên **dữ liệu** là thành phần cốt lõi của **máy học**. Mục tiêu của **máy học** là thiết kế các phương pháp có mục đích chung để trích xuất các **mẫu** (pattern) có giá trị từ **dữ liệu** (data), lý tưởng nhất là không cần nhiều chuyên gia nghiệp vụ. Ví dụ: với một lượng lớn tài liệu (ví dụ: sách trong nhiều thư viện), phương pháp **máy học** có thể được sử dụng để tự tìm các **chủ đề** (topics) liên quan được chia sẻ trên các tài liệu. Để đạt được mục tiêu này, chúng tôi thiết kế các **mô hình** (model) thường liên quan đến quá trình tạo **dữ liệu** (data), tương tự như mô hình hóa **tập dữ liệu** (dataset) mà chúng tôi được cung cấp. Ví dụ: trong cài đặt **hồi quy** (regression setting), **mô hình** sẽ mô tả một **hàm** (function) mà ánh xạ (map) **đầu vào** (input) với **đầu ra** có giá trị thực (real-valued output). Một **mô hình** được cho là có thể học hỏi từ **dữ liệu** nếu **hiệu suất** (performance) của nó đối với một nhiệm vụ nhất định được cải thiện sau khi **dữ liệu** được tính đến (be taken into account). Mục tiêu là tìm ra những **mô hình** tốt có khả năng **khái quát hóa** (generalize) tốt những **dữ liệu** chưa được nhìn thấy mà chúng ta có thể quan tâm trong tương lai. **Học** (learning) có thể được hiểu là cách để tự động tìm ra các **mẫu** (pattern) và **cấu trúc** (structure) trong **dữ liệu** bằng cách tối ưu hóa các **tham số** (parameters) của **mô hình**.

Mặc dù **máy học** đã chứng kiến nhiều câu chuyện thành công và có sẵn phần mềm để thiết kế cũng như **huấn luyện** (train) các hệ thống **máy học** phong phú và linh hoạt, nhưng chúng tôi tin rằng nền tảng **toán học** (mathematical foundations) của **máy học** là quan trọng để hiểu các nguyên tắc cơ bản mà dựa trên đó các hệ thống **máy học** phức tạp hơn được xây dựng. Hiểu được những nguyên tắc này có thể tạo điều kiện thuận lợi cho việc tạo ra các giải pháp **máy học** mới, hiểu và **gỡ lỗi** (debug) các phương pháp tiếp cận hiện có cũng như tìm hiểu về các **giả định** (assumptions) và **hạn chế** (limitations) vốn có của các phương pháp mà chúng ta đang làm việc.

## Tìm từ ngữ cho trực giác

Một thách thức mà chúng ta thường xuyên gặp phải trong máy học là các khái niệm và từ ngữ rất khó hiểu và một thành phần cụ thể của hệ thống máy học có thể được trừu tượng hóa thành các khái niệm toán học khác nhau. Ví dụ: từ "thuật toán" được sử dụng theo ít nhất hai nghĩa khác nhau trong bối cảnh máy học. Theo nghĩa đầu tiên, chúng tôi sử dụng cụm từ "thuật toán máy học" để chỉ một hệ thống đưa ra dự đoán dựa trên dữ liệu đầu vào. Chúng tôi gọi các thuật toán này là các thuật toán dự đoán. Theo nghĩa thứ hai, chúng tôi sử dụng cùng một cụm từ "thuật toán máy học" để chỉ một hệ thống có khả năng điều chỉnh các tham số nội tại (internal parameters) của bộ dự đoán (predictor) sao cho nó hoạt động tốt trên các dữ liệu đầu vào chưa từng thấy trong tương lai. Ở đây chúng tôi gọi sự thích ứng này là hệ thống huấn luyện (training system).

::: info
Cuốn sách này sẽ không giải quyết các vấn đề mơ hồ, nhưng chúng tôi muốn nhấn mạnh ngay từ đầu rằng, tùy thuộc vào ngữ cảnh, những cách diễn đạt giống nhau có thể có nghĩa khác nhau. Tuy nhiên, chúng tôi cố gắng làm cho bối cảnh đủ rõ ràng để giảm mức độ mơ hồ.
:::

::: info
Phần đầu tiên của cuốn sách này giới thiệu các khái niệm và nền tảng toán học cần thiết để nói về ba thành phần chính của hệ thống máy học: dữ liệu, mô hình và học tập. Chúng ta sẽ phác thảo ngắn gọn các thành phần này ở đây và sẽ xem lại chúng trong Chương 8 sau khi đã thảo luận về các khái niệm toán học cần thiết.
:::

::: info
Mặc dù không phải tất cả dữ liệu đều là số nhưng việc xem xét dữ liệu ở định dạng số thường rất hữu ích. Trong cuốn sách này, chúng tôi giả định rằng dữ liệu đã được chuyển đổi một cách thích hợp thành dạng biểu diễn số phù hợp để đọc vào chương trình máy tính. Vì vậy, chúng tôi coi dữ liệu là vectơ.
:::

::: info
Một minh họa khác về mức độ tinh tế của từ ngữ, có (ít nhất) ba cách khác nhau để nghĩ về **vectơ** (vector): **vectơ** là một **mảng số** (number array) theo quan điểm khoa học máy tính, **vectơ** là mũi tên có hướng và độ lớn (quan điểm vật lý), và **vectơ** là đối tượng tuân theo phép cộng và chia tỷ lệ (quan điểm **toán học** (mathematical perspective)).
:::

Một **mô hình** (model) thường được sử dụng để mô tả một **quá trình tạo dữ liệu** (data-generating process), mô phỏng liên quan đến **tập dữ liệu** (dataset) hiện có. Do đó, các **mô hình** tốt cũng có thể được coi là phiên bản đơn giản hóa của quy trình tạo **dữ liệu** thực (chưa xác định), nắm bắt các khía cạnh có liên quan để lập **mô hình dữ liệu** (model the data) và trích xuất các **mẫu ẩn** (hidden patterns) từ nó. Sau đó, một **mô hình** tốt có thể được sử dụng để dự đoán điều gì sẽ xảy ra trong thế giới thực mà không cần thực hiện các thí nghiệm trong thế giới thực.

Bây giờ chúng ta đi đến mấu chốt của vấn đề, thành phần **học tập** (learning) của **máy học**. Giả sử chúng ta được cung cấp một **tập dữ liệu** (dataset) và một **mô hình** (model) phù hợp. **Huấn luyện mô hình** (training the model) có nghĩa là sử dụng **dữ liệu** có sẵn để **tối ưu hóa** (optimize) một số **tham số** (parameters) của **mô hình** liên quan đến **hàm tiện ích** (utility function) nhằm đánh giá mức độ **mô hình** dự đoán **dữ liệu huấn luyện** (training data). Hầu hết các **phương pháp huấn luyện** (training methods) có thể được coi là một cách tiếp cận tương tự như việc leo lên một ngọn đồi để đạt đến đỉnh cao. Trong sự tương tự này, đỉnh của ngọn đồi tương ứng với mức tối đa của một số **thước đo hiệu suất** (performance measure) mong muốn. Tuy nhiên, trên thực tế, chúng tôi quan tâm đến việc **mô hình** hoạt động tốt trên **dữ liệu không nhìn thấy** (unseen data). Thực hiện tốt **dữ liệu huấn luyện** (training data) chỉ có thể có nghĩa là chúng ta đã tìm ra cách tốt để **ghi nhớ** (memorize) dữ liệu. Tuy nhiên, điều này có thể không **khái quát** (generalize) tốt đối với **dữ liệu không nhìn thấy** và trong các ứng dụng thực tế, chúng ta thường cần đưa hệ thống **máy học** của mình vào những tình huống mà nó chưa từng gặp phải trước đây.

Hãy để chúng tôi tóm tắt các khái niệm chính về **máy học** mà chúng tôi đề cập trong cuốn sách này:

- Chúng ta biểu diễn **dữ liệu** (data) dưới dạng **vectơ** (vector). 
- Chúng ta chọn một **mô hình** (model) thích hợp, sử dụng quan điểm **xác suất** (probabilistic viewpoint) hoặc **tối ưu hóa** (optimization). 
- Chúng ta **học** (learn) từ **dữ liệu** có sẵn bằng cách sử dụng các **phương pháp tối ưu hóa số** (numerical optimization methods) với mục đích **mô hình** hoạt động tốt trên **dữ liệu** không được sử dụng cho **huấn luyện**.

## *Hai cách đọc cuốn sách này*

Chúng ta có thể xem xét hai chiến lược để hiểu toán học cho máy học:

- Bottom-up: Xây dựng các khái niệm từ cơ bản đến nâng cao. Đây thường là cách tiếp cận ưa thích trong các lĩnh vực kỹ thuật hơn, chẳng hạn như toán học. Chiến lược này có ưu điểm là người đọc luôn có thể dựa vào các khái niệm đã học trước đó của mình. Thật không may, đối với người thích thực chiến, nhiều khái niệm nền tảng bản thân chúng không đặc biệt thú vị và việc thiếu động lực có nghĩa là hầu hết các định nghĩa nền tảng đều nhanh chóng bị lãng quên.
- Top-down: Đi sâu từ nhu cầu thực tế đến các yêu cầu cơ bản hơn. Cách tiếp cận hướng đến mục tiêu này có ưu điểm là người đọc luôn biết lý do tại sao họ cần nghiên cứu một khái niệm cụ thể và có một lộ trình rõ ràng về kiến thức cần thiết. Nhược điểm của chiến lược này là kiến thức được xây dựng trên những nền tảng có khả năng lung lay và người đọc phải nhớ các thuật ngữ mà họ không có cách nào hiểu được.

Chúng tôi quyết định viết cuốn sách này theo cách mô-đun để tách các khái niệm cơ bản (toán học) khỏi các ứng dụng để có thể đọc cuốn sách này theo cả hai cách. Cuốn sách được chia thành hai phần, trong đó Phần I đặt nền tảng toán học và Phần II áp dụng các khái niệm từ Phần I vào một tập hợp các vấn đề cơ bản về máy học, tạo thành bốn trụ cột của máy học như minh họa trong Hình 1.1. Các chương trong Phần I chủ yếu được xây dựng dựa trên các chương trước, nhưng có thể bỏ qua chương và đọc lại nếu cần. Các chương trong Phần II không liên kết chặt chẽ với nhau nên có thể đọc theo bất kỳ thứ tự nào. Có nhiều con trỏ tiến và lùi giữa hai phần của cuốn sách để liên kết các khái niệm toán học với các thuật toán máy học.

Tất nhiên có nhiều hơn hai cách để đọc cuốn sách này. Hầu hết người đọc học bằng cách sử dụng kết hợp các phương pháp tiếp cận từ top-down và bottom-up, đôi khi xây dựng các kỹ năng toán học cơ bản trước khi thử các khái niệm phức tạp hơn, đồng thời lựa chọn các chủ đề dựa trên các ứng dụng của máy học.

![Hình 1.1: hồi quy, giảm kích thước, ước tính mật độ và phân loại](/images/Mathematics-for-Machine-Learning/_page_14_Figure_1.png)


### *Phần I là về Toán học*

Bốn trụ cột của máy học (four pillars of machine learning) mà chúng tôi đề cập trong cuốn sách này (xem Hình 1.1) yêu cầu nền tảng toán học vững chắc, được trình bày trong Phần I.

Chúng tôi biểu diễn **dữ liệu số** dưới dạng **vectơ** (vector) và biểu diễn một bảng chứa dữ liệu đó dưới dạng **ma trận** (matrix). Nghiên cứu **vectơ** và **ma trận** gọi là **đại số tuyến tính** (linear algebra) được chúng tôi giới thiệu ở Chương 2.

Cho hai **vectơ** (vector) biểu diễn hai đối tượng trong thế giới thực, chúng ta muốn đưa ra nhận định về sự **giống nhau** (similarity) của chúng. Ý tưởng là các **vectơ** tương tự nhau sẽ được dự đoán là có kết quả đầu ra tương tự bằng **thuật toán dự đoán** (predictive algorithm). Để hình thức hóa ý tưởng về sự **giống nhau** giữa các **vectơ**, chúng ta cần đưa ra các phép toán lấy hai **vectơ** làm đầu vào và trả về một giá trị số biểu thị sự **tương tự** (similarity) của chúng. Việc xây dựng **sự tương đồng** (similarity) và **khoảng cách** (distance) là trọng tâm của **hình học giải tích** (analytic geometry) và được thảo luận ở Chương 3.

Trong Chương 4, chúng tôi giới thiệu một số khái niệm cơ bản về **ma trận** (matrix) và **phân rã ma trận** (matrix decomposition). Một số phép toán trên **ma trận** cực kỳ hữu ích trong **máy học** và chúng cho phép **diễn giải** (interpretation) **dữ liệu** một cách trực quan và **học tập** (learning) hiệu quả hơn.

Chúng ta thường coi **dữ liệu** là những quan sát nhiễu của một số tín hiệu cơ bản thực sự. Chúng tôi hy vọng rằng bằng cách áp dụng **máy học**, chúng tôi có thể xác định được **tín hiệu** (signal) từ **nhiễu** (noise). Điều này đòi hỏi chúng ta phải có một ngôn ngữ để định lượng "**nhiễu**" nghĩa là gì. Chúng tôi cũng thường muốn có những **yếu tố dự báo** (predictive factors) cho phép chúng tôi thể hiện một số loại **độ không chắc chắn** (uncertainty), ví dụ: để định lượng (quantify) **độ tin cậy** (confidence) mà chúng tôi có về giá trị của **dự đoán** tại một **điểm dữ liệu thử nghiệm** (test data point) cụ thể. Định lượng độ không đảm bảo là lĩnh vực của **lý thuyết xác suất** (probability theory) và được đề cập trong Chương 6.

Để **huấn luyện** các **mô hình máy học**, chúng tôi thường tìm các **tham số** giúp tối đa hóa một số **thước đo hiệu suất** (performance measure). Nhiều kỹ thuật **tối ưu hóa** (optimization) yêu cầu khái niệm **gradient** (gradient), nó cho chúng ta biết hướng tìm kiếm lời giải. Chương 5 nói về **giải tích vectơ** (vector calculus) và chi tiết về **gradient** mà sau này chúng tôi sẽ sử dụng trong Chương 7, nơi chúng tôi nói về việc **tối ưu hóa** (optimization) để tìm **cực đại/cực tiểu** (maxima/minima) của **hàm số** (function).

### *Phần II nói về Machine Learning*

Phần thứ hai của cuốn sách giới thiệu bốn trụ cột của machine learning như trong Hình 1.1. Chúng tôi minh họa các khái niệm toán học được giới thiệu trong phần đầu của cuốn sách là nền tảng cho mỗi trụ cột như thế nào. Nói rộng ra, các chương được sắp xếp theo độ khó (theo thứ tự tăng dần).

Trong Chương 8, chúng tôi trình bày lại ba thành phần của máy học (dữ liệu, mô hình và ước tính tham số (parameter estimation)) theo kiểu toán học. Ngoài ra, chúng tôi cung cấp một số hướng dẫn để xây dựng các thiết lập thử nghiệm nhằm bảo vệ khỏi những đánh giá quá lạc quan (overly optimistic evaluations) về hệ thống máy học. Hãy nhớ lại rằng mục tiêu là xây dựng một công cụ dự đoán hoạt động tốt trên dữ liệu không nhìn thấy được.

Trong Chương 9, chúng ta sẽ xem xét kỹ hơn về **hồi quy tuyến tính** (linear regression). Mục tiêu là tìm các **hàm ánh xạ** (mapping functions) **đầu vào** $x \in \mathbf{R}$ với các **giá trị hàm được quan sát** tương ứng $y \in \mathbf{R}$ mà chúng ta có thể hiểu là **nhãn** (label) của **đầu vào** tương ứng. Chúng ta sẽ thảo luận về việc điều chỉnh **mô hình cổ điển** (classic model fitting) thông qua **khả năng tối đa** (maximum likelihood) và **ước tính hậu nghiệm tối đa** (maximum a posteriori estimation), cũng như **hồi quy tuyến tính Bayes** (Bayesian linear regression), trong đó chúng ta **tích hợp** (integrate) các **tham số** thay vì **tối ưu hóa** chúng.

Chương 10 tập trung vào việc **giảm kích thước** (dimensionality reduction), trụ cột thứ hai trong Hình 1.1, sử dụng **phân tích thành phần chính** (**Principal Component Analysis**, gọi tắt là **PCA**). Mục tiêu chính của việc **giảm kích thước** là tìm ra cách biểu diễn nhỏ gọn, có chiều thấp hơn của **dữ liệu** nhiều chiều $x \in \mathbf{R}^D$, thường dễ phân tích hơn dữ liệu gốc. Không giống như **hồi quy**, việc **giảm kích thước** chỉ liên quan đến việc **lập mô hình dữ liệu** (modeling the data) - không có **nhãn** (label) nào liên kết với điểm dữ liệu **x** (data point).

Trong Chương 11, chúng ta sẽ chuyển sang trụ cột thứ ba: **ước tính mật độ** (density estimation). Mục tiêu của **ước tính mật độ** là tìm **phân bố xác suất** (probability distribution) mô tả một **tập dữ liệu** nhất định. Chúng ta sẽ tập trung vào các **mô hình hỗn hợp Gaussian** (Gaussian mixture models, GMMs) cho mục đích này và chúng ta sẽ thảo luận về **sơ đồ lặp** (iterative scheme) để tìm các **tham số** (parameters) của **mô hình** này. Giống như trong việc **giảm kích thước**, không có **nhãn** nào được liên kết với các điểm **dữ liệu** $x \in \mathbf{R}^D$. Tuy nhiên, chúng tôi không tìm kiếm sự biểu diễn dữ liệu theo **chiều thấp** (low-dimensional representation of data). Thay vào đó, chúng tôi quan tâm đến **mô hình mật độ** (density model) mô tả **dữ liệu**.

Chương 12 kết thúc cuốn sách bằng sự thảo luận sâu sắc về vấn đề thứ tư: **phân loại** (classification). Chúng ta sẽ thảo luận về việc **phân loại** trong bối cảnh **Support Vector Machine (SVM)**. Tương tự như **hồi quy** (Chương 9), chúng ta có **đầu vào** **x** và **nhãn** tương ứng **y**. Tuy nhiên, không giống như **hồi quy**, trong đó các **nhãn** có giá trị thực, các **nhãn** trong **phân loại** là số nguyên (integers/categorical labels), cần được xử lý đặc biệt.



