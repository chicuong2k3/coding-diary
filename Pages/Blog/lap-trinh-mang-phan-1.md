---
title: 'My first test page 3'
date: 2025-07-16
image: images/blake-logo.png
tags: ["non-technical", "personal", "career", "community"]
description: "Get to know the fundamentals of Blake, the static site generator."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
---

Trong thế giới hiện đại, gần như mọi ứng dụng phần mềm đều cần kết nối mạng.
Từ việc gửi một tin nhắn, gọi video, cho đến những hệ thống phân tán
khổng lồ trên nền tảng đám mây, tất cả đều được xây dựng dựa trên nền tảng của lập trình mạng.

Bài viết này sẽ dẫn dắt bạn từ những khái niệm nền tảng nhất, từ cách thức giao tiếp
trong mạng, vai trò của các giao thức (protocols), đến những mô hình thực tiễn như
client-server.

# 🔌 Mạng máy tính là gì?

Mạng máy tính (Computer Network) là một hệ thống gồm nhiều thiết bị
kết nối với nhau để chia sẻ tài nguyên và thông tin. Các thiết bị này có thể là máy tính,
máy chủ, router, switch, hoặc các thiết bị di động. Mạng máy tính có thể được phân loại
theo phạm vi:
- Mạng cá nhân (PAN - Personal Area Network): Kết nối các thiết bị cá nhân (bluetooth, usb).
- **Mạng cục bộ (LAN - Local Area Network):** Kết nối các thiết bị trong phạm vi nhỏ (gia đình, trường học).
- **Mạng đô thị (PAN - Metropolitan Area Network):** Kết nối các mạng LAN trong một khu vực rộng hơn như thành phố.
- **Mạng diện rộng (WAN - Wide Area Network):** Kết nối các mạng LAN qua khoảng cách lớn như quốc gia, châu lục (Internet là ví dụ điển hình).

# 🛠️ Các thiết bị mạng cơ bản

- **Network Interface Card (NIC):** Là phần cứng cho phép thiết bị kết nối vào mạng.
- **Router:** Thiết bị định tuyến, chuyển tiếp gói tin giữa các mạng khác nhau. Hỗ trợ
  NAT, firewall, và các giao thức định tuyến.
- **Switch:** Thiết bị chuyển mạch dựa trên địa chỉ MAC, kết nối các thiết bị trong cùng một mạng LAN.
- **Hub:** Thiết bị tập trung, phát sóng dữ liệu đến tất cả các cổng (ít dùng do kém hiệu quả).

# 📡 Lập trình mạng là gì?

Hiểu một cách đơn giản, lập trình mạng (Network Programming) là việc thiết kế và phát triển
các phần mềm có thể giao tiếp và trao đổi dữ liệu với nhau thông qua mạng máy tính. Mạng ở
đây có thể là mạng cục bộ (LAN), mạng diện rộng (WAN), hay rộng nhất chính là Internet.

Công thức then chốt để xây dựng một ứng dụng mạng thường được diễn giải là: <br>
`Lập trình mạng = Kiến thức mạng + Mô hình lập trình + Ngôn ngữ lập trình`

# 🌐 Ứng dụng thực tế của lập trình mạng

Bạn sẽ bắt gặp lập trình mạng trong hầu hết mọi ngóc ngách của công nghệ:
- **Ứng dụng Client-Server:** Mô hình kinh điển nhất, nơi máy khách (client) gửi
  yêu cầu và máy chủ (server) xử lý và phản hồi (các ứng dụng web, mobile app gọi API).
- **Dịch vụ Web (Web Services):** Cho phép các hệ thống phần mềm khác nhau, có thể được
  viết bằng các ngôn ngữ khác nhau, giao tiếp và chia sẻ dữ liệu một cách liền mạch.
- **Ứng dụng thời gian thực (Realtime):** Các ứng dụng chat, gọi thoại,
  hội nghị (Zoom, Teams) đều dựa vào lập trình mạng.
- **Internet of Things (IoT):** Hàng tỷ thiết bị thông minh
  (cảm biến, camera, thiết bị gia đình) thu thập và gửi dữ liệu về máy chủ để xử lý.
- **Dịch vụ đám mây (Cloud Services):** Nền tảng cung cấp sức mạnh tính toán, lưu trữ
  theo nhu cầu, có khả năng mở rộng để phục vụ hàng triệu người dùng.

# 📜 Giao thức mạng (Network Protocols)

Để các thiết bị từ nhiều nhà sản xuất, chạy các hệ điều hành khác nhau có thể hiểu nhau,
chúng cần một bộ quy tắc chung. Bộ quy tắc đó chính là giao thức mạng (Network Protocols).
Nó giống như việc hai người ở hai quốc gia khác nhau muốn nói chuyện, họ cần một ngôn ngữ
chung và một quy ước về cách thức giao tiếp. Trong thế giới máy tính, giao thức đảm bảo
dữ liệu được truyền đi một cách chính xác, đúng thứ tự và hiệu quả.

## Bộ giao thức TCP/IP - Bộ xương sống của Internet

TCP/IP không phải là một giao thức duy nhất, mà là một bộ giao thức (protocol suite)
hoạt động theo mô hình phân tầng đã trở thành nền tảng cho toàn bộ Internet.
Kiến trúc của nó thường được minh họa qua 5 tầng chính:
- **Tầng vật lý (Physical Layer):** Chịu trách nhiệm truyền tín hiệu điện, quang hoặc
  sóng vô tuyến thực tế qua môi trường vật lý (cáp đồng, cáp quang, sóng Wi-Fi,
  sóng radio). Nó quyết định cách dữ liệu được mã hóa và truyền trên phương tiện vật lý.
- **Tầng liên kết (Link Layer):** Quản lý việc truyền dữ liệu trên một liên kết
  vật lý cụ thể. Nó phát hiện lỗi truyền, đóng gói dữ liệu thành frame và
  điều khiển truy cập lên môi trường truyền dẫn (Ethernet, Wi-Fi, PPP).
- **Tầng mạng (Internet Layer):** Sử dụng giao thức IP để định tuyến các gói tin từ
  nguồn đến đích thông qua các router. Nó quan tâm đến địa chỉ và đường đi.
- **Tầng giao vận (Transport Layer):** Cung cấp dịch vụ truyền thông giữa các ứng dụng
  trên các máy chủ khác nhau. Hai giao thức quan trọng nhất là TCP và UDP.
- **Tầng ứng dụng (Application Layer):** Nơi các ứng dụng của người dùng
  (trình duyệt, email client) giao tiếp. Các giao thức phổ biến là HTTP, FTP, SMTP, DNS.

![Các tầng giao thức TCP/IP](network-layer.png)

## TCP và UDP

Hai giao thức quan trọng bậc nhất trong tầng giao vận là TCP và UDP,
mỗi loại phục vụ một mục đích khác nhau.

| Đặc điểm | TCP (Transmission Control Protocol) | UDP (User Datagram Protocol) |
| :--- | :--- | :--- |
| **Độ tin cậy** | **Đáng tin cậy (Reliable)**<br>• Đảm bảo dữ liệu gửi đi sẽ đến nơi<br>• Đảm bảo đúng thứ tự<br>• Có cơ chế truyền lại khi mất gói | **Không đáng tin cậy (Unreliable)**<br>• Không đảm bảo gói tin đến đích<br>• Không đảm bảo đúng thứ tự<br>• Không truyền lại khi mất gói |
| **Loại kết nối** | **Hướng kết nối (Connection-oriented)**<br>• Phải "bắt tay 3 bước" thiết lập kết nối<br>• Quản lý trạng thái kết nối | **Không kết nối (Connectionless)**<br>• Gửi dữ liệu ngay lập tức<br>• Không cần thiết lập kết nối trước |
| **Tốc độ** | **Tương đối chậm**<br>• Do cơ chế đảm bảo độ tin cậy<br>• Overhead lớn (header phức tạp)<br>• Cơ chế kiểm soát tắc nghẽn | **Rất nhanh**<br>• Ít overhead (header đơn giản)<br>• Không có độ trễ do thiết lập kết nối<br>• Không có cơ chế kiểm soát tắc nghẽn |
| **Ứng dụng** | **Khi tính toàn vẹn dữ liệu là quan trọng:**<br>• Web (HTTP/HTTPS)<br>• Email (SMTP/IMAP)<br>• Truyền file (FTP)<br>• Cơ sở dữ liệu phân tán | **Khi tốc độ quan trọng hơn độ chính xác:**<br>• Streaming video/audio<br>• Game online<br>• DNS lookup<br>• VoIP (thoại qua IP) |
| **Kiểm soát luồng** | **Có kiểm soát luồng**<br>• Điều chỉnh tốc độ truyền theo khả năng nhận<br>• Tránh gây quá tải cho receiver | **Không kiểm soát luồng**<br>• Gửi dữ liệu với tốc độ tối đa<br>• Có thể gây quá tải cho receiver |
| **Đảm bảo thứ tự** | **Đảm bảo thứ tự**<br>• Sắp xếp lại gói tin nếu đến sai thứ tự<br>• Số thứ tự (sequence number) | **Không đảm bảo thứ tự**<br>• Gói tin có thể đến không theo thứ tự<br>• Ứng dụng tự xử lý thứ tự nếu cần |

<br>

## Các giao thức tầng giao vận khác

Ngoài bộ đôi TCP/UDP, còn có những giao thức lai được thiết kế cho các nhu cầu chuyên biệt:
- **SCTP (Stream Control Transmission Protocol):** Kết hợp những điểm tốt nhất của TCP và UDP.
  Nó vừa đáng tin cậy, vừa hỗ trợ truyền nhiều luồng dữ liệu song song, rất lý tưởng cho
  việc truyền tải dữ liệu đa phương tiện và các ứng dụng viễn thông.
- **DCCP (Datagram Congestion Control Protocol):** Được thiết kế như một vùng đất trung gian
  giữa TCP và UDP. Nó phù hợp cho các ứng dụng cần nhiều hơn dịch vụ "cố gắng hết sức"
  của UDP nhưng không cần mức độ đảm bảo giao hàng chặt chẽ như TCP
  (như các ứng dụng truyền thông thời gian thực có thể chịu được một chút mất mát).

**Tại sao chúng ta cần nhiều giao thức ở tầng giao vận đến vậy?**

Câu trả lời nằm ở sự đa dạng của nhu cầu ứng dụng. Không có một giải pháp phù hợp cho tất cả.
Một ứng dụng cần sự hoàn hảo (gửi email), một ứng dụng khác lại cần tốc độ (game bắn súng).
Việc có nhiều lựa chọn cho phép các lập trình viên tối ưu hóa trải nghiệm người dùng
bằng cách chọn đúng công cụ cho đúng công việc.

## 🖥️ Các giao thức tầng ứng dụng

Nếu các tầng dưới (Giao vận, Mạng) là hệ thống đường ống và vận chuyển, thì **Tầng ứng dụng**
chính là nơi người dùng cuối thực sự tương tác. Các giao thức ở đây định nghĩa ngôn ngữ
mà các ứng dụng cụ thể sử dụng để nói chuyện với nhau.

Một số giao thức phổ biến:
- **HTTP/HTTPS:** Định nghĩa cách trình duyệt yêu cầu và máy chủ web cung cấp các trang web.
- **FTP (File Transfer Protocol):** Dùng để tải lên và tải xuống các tập tin.
- **SMTP (Simple Mail Transfer Protocol):** Chuyên trách việc gửi email đi.
- **IMAP/POP3:** Dùng để nhận và quản lý email từ máy chủ.
- **DNS (Domain Name System):** Dịch tên miền dễ nhớ (ví dụ như google.com) thành địa chỉ
  IP (ví dụ như 142.251.42.78).
- **WebSocket:** Giao tiếp hai chiều, thời gian thực. Cho phép máy chủ và client
  trao đổi dữ liệu ngay lập tức mà không cần client phải liên tục hỏi,
  rất quan trọng cho ứng dụng chat, bảng giá chứng khoán.

# 🤝 Các mô hình giao tiếp

Cách các ứng dụng được tổ chức để giao tiếp qua mạng có thể được phân loại thành
3 mô hình chính là Client-Server, Peer-to-Peer vầ Hybrid.

## Mô hình Client-Server

Mô hình Client-Server được xây dựng dựa trên nguyên lý phân chia nhiệm vụ rõ ràng.
Máy chủ (Server) đóng vai trò trung tâm, chuyên cung cấp tài nguyên hoặc dịch vụ và
luôn trong trạng thái sẵn sàng lắng nghe các yêu cầu đến, ví dụ như một web server hay
email server. Trong khi đó, Máy khách (Client) như trình duyệt web hay ứng dụng email,
là bên chủ động khởi tạo kết nối và gửi yêu cầu để sử dụng các dịch vụ đó.

Mô hình này mang lại ưu điểm nổi bật là tính tập trung, giúp cho việc quản lý,
bảo trì và nâng cấp hệ thống trở nên dễ dàng hơn. Dữ liệu và các quy tắc bảo mật
có thể được kiểm soát chặt chẽ tại một điểm, tăng cường an toàn cho toàn hệ thống.
Tuy nhiên, nó cũng tồn tại nhược điểm đáng kể đó là máy chủ có thể trở thành điểm
tắc nghẽn (single point of failure). Khi lượng yêu cầu từ máy khách vượt quá khả năng
xử lý của máy chủ, toàn bộ hệ thống có thể bị quá tải, và nếu máy chủ trung tâm gặp sự cố thì
dịch vụ sẽ ngừng hoạt động.

## Mô hình Peer-to-Peer (Mạng ngang hàng)

Khác biệt hoàn toàn với mô hình tập trung, mô hình Peer-to-Peer (P2P) cho phép các
thiết bị (peer) giao tiếp trực tiếp với nhau mà không cần thông qua một máy chủ trung tâm.
Trong mạng lưới này, mỗi node đều đóng cả hai vai trò vừa là client (để yêu cầu dữ liệu)
vừa là server (để cung cấp dữ liệu cho node khác).

Ưu điểm chính của mô hình này là khả năng mở rộng cực kỳ cao. Khi càng có nhiều node
tham gia vào mạng lưới, tổng tài nguyên và khả năng chịu tải của hệ thống không những
không giảm mà còn tăng lên. Hệ thống cũng không phụ thuộc vào một server duy nhất,
do đó loại bỏ được điểm yếu chết người của mô hình client-server. Ví dụ điển hình là
các mạng chia sẻ file như BitTorrent, hay kiến trúc ban đầu của Skype,
nơi các cuộc gọi thoại được thiết lập trực tiếp giữa những người dùng với nhau.
Nhược điểm của P2P nằm ở chỗ khó quản lý tập trung, vấn đề bảo mật phức tạp hơn,
và hiệu năng của mỗi node có thể không ổn định do phụ thuộc vào chất lượng kết nối của các peer khác.

## Mô hình Hybrid (Lai)

Để tận dụng những điểm mạnh của cả hai mô hình trên, mô hình Hybrid (Lai) đã ra đời.
Nó kết hợp linh hoạt giữa kiến trúc tập trung của Client-Server và tính phân tán của P2P.

Ưu điểm lớn nhất của mô hình lai là sự linh hoạt, cho phép tối ưu hóa từng phần
của ứng dụng. Các tác vụ đòi hỏi sự quản lý tập trung và bảo mật cao sẽ
được giao cho máy chủ, trong khi những tác vụ cần tốc độ và khả năng mở rộng
thì được xử lý theo cách ngang hàng. Ví dụ, một ứng dụng chat hiện đại có thể
sử dụng máy chủ để xác thực đăng nhập, lưu trữ danh bạ và tìm kiếm bạn bè
(theo mô hình Client-Server), nhưng các cuộc gọi thoại và video lại được truyền
trực tiếp giữa các thiết bị của người dùng (theo mô hình P2P) để giảm tải cho
máy chủ và giảm độ trễ. Nhược điểm của mô hình này là độ phức tạp trong thiết kế
và triển khai cao hơn, đòi hỏi lập trình viên phải quản lý đồng thời cả hai cơ chế giao tiếp.


# Địa chỉ IP và Subnetting

## Địa chỉ IP: "Số nhà" của thiết bị trong mạng

Địa chỉ IP (Internet Protocol) là một dãy số định danh duy nhất cho mỗi thiết bị
khi tham gia vào mạng máy tính, đóng vai trò như một "địa chỉ nhà" giúp các thiết
bị nhận diện và liên lạc với nhau. Mọi thiết bị kết nối mạng đều được gán một
địa chỉ IP riêng biệt trong phạm vi mạng của chúng. Một số địa chỉ IP có giá trị
toàn cầu trên Internet, trong khi số khác chỉ cần là duy nhất trong mạng nội bộ
của một tổ chức.

### IPv4

IPv4 (Internet Protocol version 4) là phiên bản đầu tiên của giao thức IP,
được sử dụng rộng rãi từ khi ra đời vào năm 1983 và vẫn phổ biến cho đến ngày nay.

- **Cấu trúc địa chỉ:** IPv4 sử dụng địa chỉ 32-bit, được biểu diễn dưới dạng
  bốn số thập phân (mỗi số từ 0–255) phân tách bằng dấu chấm, ví dụ: `192.168.1.10`.
- **Không gian địa chỉ:** Không gian 32-bit cho phép cung cấp khoảng 4,3 tỷ
  địa chỉ ($2^{32}$). Con số này từng được coi là rất lớn nhưng đã không còn đủ
  so với sự bùng nổ của Internet và số lượng thiết bị ngày càng tăng. Để ứng phó với
  tình trạng cạn kiệt, các kỹ thuật như NAT (Network Address Translation) cho phép
  nhiều thiết bị dùng chung một địa chỉ public IPv4, cùng với việc sử dụng các
  dải địa chỉ Private (nội bộ) đã được áp dụng.

### IPv6

IPv6 (Internet Protocol version 6) được phát triển để khắc phục triệt để
những hạn chế của IPv4, đặc biệt là vấn đề cạn kiệt địa chỉ.

- **Cấu trúc địa chỉ:** IPv6 sử dụng địa chỉ 128-bit, được biểu diễn bằng tám nhóm
  số hệ thập lục phân phân tách bằng dấu hai chấm,
  ví dụ: `2001:0db8:85a3:0000:0000:8a2e:0370:7334`. Địa chỉ IPv6 có thể được rút gọn
  bằng cách lược bỏ các số 0 đứng đầu hoặc thay thế chuỗi số 0 liên tiếp bằng `::`.
- **Không gian địa chỉ khổng lồ:** Không gian 128-bit cung cấp khoảng
  $3.4 \times 10^{38}$ địa chỉ ($2^{128}$), một con số gần như vô hạn, đủ để cung cấp cho
  mọi thiết bị hiện tại và tương lai.


## Subnetting - Chia mạng con

### Mạng con (Subnet) là gì?

Trong một mạng lớn, chúng ta thường chia nhỏ thành các mạng con (subnet) để
dễ quản lý - giống như việc chia một khu phố lớn thành nhiều ngõ nhỏ để dễ quản lý hơn.
Một subnet được định nghĩa là một phần của một mạng lớn hơn, được chia ra bằng
một **📍 địa chỉ mạng (Network Address)** và một **🎭 mặt nạ mạng con (Subnet Mask)**.
Các thiết bị trong cùng một subnet có thể giao tiếp trực tiếp với nhau mà không cần đi qua router,
còn các thiết bị ở subnet khác thì phải thông qua router để liên lạc.

Ví dụ, nếu một công ty có mạng gốc `192.168.1.0/24` được chia thành hai subnet
nhỏ hơn là `192.168.1.0/25` và `192.168.1.128/25`, thì:
- Máy trong dải `192.168.1.0 – 192.168.1.127` có thể giao tiếp trực tiếp với nhau.
- Máy có địa chỉ `192.168.1.130` sẽ phải qua router để liên lạc với địa chỉ `192.168.1.10`.

### Vì sao cần subnetting?

- Chia mạng lớn thành các phần nhỏ, dễ quản lý. Áp dụng các chính sách
  riêng biệt cho từng mạng con (phòng ban, chức năng).
- Cô lập các nhóm thiết bị, hạn chế lan truyền sự cố/ tấn công mạng.
  Kiểm soát lưu lượng truy cập giữa các mạng con bằng các quy tắc tường lửa.
- Phân bổ chính xác số lượng địa chỉ IP cần thiết, tránh lãng phí tài nguyên địa chỉ IPv4 có hạn.

### Subnet Mask và CIDR

#### Subnet Mask là gì?

Subnet Mask là dãy bit dùng để xác định phần địa chỉ dành
cho **mạng con** và phần dành cho **host (máy chủ)** trong một địa chỉ IP.
Trong mặt nạ, bit 1 biểu thị **phần mạng (network)**, còn bit 0 biểu thị phần **máy chủ (host)**.

Ví dụ, `255.255.255.128 = 11111111.11111111.11111111.10000000`
(tương đương với /25 theo kí hiệu CIDR)
có 25 bit 1 đầu tiên và 7 bit 0 sau cùng. Điều này nghĩa là 25 bit đầu trong địa chỉ IP
được dùng làm **định danh cho mạng con** và 7 bit cuối dùng định danh thiết bị.

#### CIDR Notation - Cách biểu diễn hiện đại

CIDR (Classless Inter-Domain Routing) là phương pháp biểu diễn địa chỉ IP
và subnet mask một cách ngắn gọn và linh hoạt. Nó thay thế cho hệ thống phân
lớp địa chỉ IP cũ vốn kém hiệu quả và thiếu linh hoạt.
Ở hệ thống phân lớp cũ, các mạng được chia thành các lớp cố định với kích thước cụ thể.
Chẳng hạn Class A là /8, Class B là /16, Class C là /24.
CIDR cho phép chia mạng theo cách linh hoạt hơn, không bị ràng buộc bởi các lớp cố định.

**Cấu trúc:** IP Address/Số bit mạng.

**Ví dụ:**
```text
192.168.10.0/25
- IP Address : 11000000.10101000.00001010.00000000 (192.168.10.0)
- Subnet Mask: 11111111.11111111.11111111.10000000 (255.255.255.128)
```


### Cách tính các thông số

#### Các khái niệm cơ bản

- **Địa chỉ mạng (Network Address):** Là địa chỉ đầu tiên trong dải địa chỉ của một subnet,
  được sử dụng để định danh mạng con.
- **Địa chỉ broadcast (Broadcast Address):** Là địa chỉ cuối cùng trong dải địa chỉ của một subnet,  
  được sử dụng để gửi dữ liệu đến tất cả các thiết bị trong mạng con đó.
- **Dải địa chỉ (Address Range):** Là tập hợp tất cả các địa chỉ IP có thể gán cho thiết bị trong một subnet.

#### Công thức tính toán

- **Số lượng mạng con (subnets):** Được tính bằng công thức $2^n$.
- **Số lượng máy chủ (hosts) trên mỗi mạng con:** Được tính bằng công thức $2^m - 2$.
    - Trong đó, `n` là số bit mượn từ phần host để tạo subnet, và `m` là số bit còn lại dành cho host.
    - Trừ 2 vì Network Address và Broadcast Address không thể gán cho thiết bị.
- **Dải địa chỉ (Address Range):** từ Network Address + 1 đến Broadcast Address - 1.

**Ví dụ: Mạng 192.168.1.0/24 có các thông số sau:**
```text
• Số bit host: 8 bit
• Số host tối đa: 2^8 - 2 = 254 máy
• Network Address: 192.168.1.0
• Broadcast Address: 192.168.1.255
• Dải IP khả dụng: 192.168.1.1 - 192.168.1.254
```

### Các kỹ thuật chia mạng con

- **Subnet cố định (Fixed-Length Subnetting):** Chia đều mạng lớn thành các subnet có kích thước bằng nhau.
- **Subnet biến thiên (VLSM - Variable Length Subnet Mask):** Cho phép các subnet có kích thước khác nhau tùy theo nhu cầu.


Giả sử một công ty được cấp mạng `192.168.1.0/24` (có 254 địa chỉ IP khả dụng) và
có 4 phòng ban với số máy tính khác nhau, cụ thể:
- Phòng IT: 60 máy
- Phòng Kinh doanh: 30 máy
- Phòng Kế toán: 14 máy
- Link router giữa các mạng: 2 máy

Thay vì để tất cả vào chung một mạng, họ có thể chia thành các mạng con nhỏ hơn,
mỗi mạng con dành cho một phòng ban, vừa đáp ứng đủ nhu cầu lại vừa tách biệt
về mặt quản lý và bảo mật.

Nếu chia subnet cố định:
```text
Phòng IT (60 máy): 192.168.1.0/26 (Số host tối đa là 62 máy)
Phòng Kinh doanh (30 máy): 192.168.1.64/26 (Số host tối đa là 62 máy)
Phòng Kế toán (14 máy): 192.168.1.128/26 (Số host tối đa là 62 máy)
Link router (2 máy): 192.168.1.192/26 (Số host tối đa là 62 máy)
```

- Tổng số IP sử dụng: 4 subnet × 64 IP = 256 IP
- Tổng số IP thực cần: 60 + 30 + 14 + 2 = 106 IP


Nếu chia subnet với VLSM:
```text
Phòng IT (60 máy): 192.168.1.0/26   (62 hosts)
Phòng Kinh doanh (30 máy): 192.168.1.64/27  (30 hosts)  
Phòng Kế toán (14 máy): 192.168.1.96/28  (14 hosts)
Link router (2 máy): 192.168.1.112/30 (2 hosts)
```

- Tổng số IP sử dụng: 64 + 32 + 16 + 4 = 116 IP
- Tổng số IP thực cần: 60 + 30 + 14 + 2 = 106 IP

# Định tuyến (Routing) và đồ hình mạng (Network Topology)

## Định tuyến - Routing

Định tuyến (Routing) trong mạng máy tính có thể được ví như một hệ thống định
vị toàn cầu dành cho dữ liệu. Mỗi gói tin khi di chuyển qua mạng giống như một
du khách cần tìm đường hiệu quả nhất từ điểm xuất phát đến đích. Các router đóng vai
trò như những trạm chỉ đường thông minh, sử dụng bảng định tuyến làm bản đồ
chi tiết và giao thức định tuyến như ngôn ngữ giao tiếp chung giữa các trạm.

Khi bạn gửi email cho bạn bè ở nước ngoài, email đó không đi thẳng từ máy tính
bạn đến máy tính họ mà thực hiện một hành trình phức tạp qua nhiều trạm trung chuyển.
Quá trình bắt đầu bằng việc dữ liệu được đóng gói thành các gói tin nhỏ, mỗi gói
mang theo "địa chỉ nhà" của đích đến. Router đầu tiên nhận gói tin sẽ tra cứu bảng
định tuyến để tìm tuyến đường tối ưu nhất, sau đó chuyển tiếp đến router kế tiếp.
Mỗi router trên đường đi tiếp tục lặp lại quá trình này cho đến khi
gói tin đến được đích cuối cùng.


Các giao thức định tuyến được chia thành hai nhóm chính: giao thức cổng nội bộ và
giao thức cổng ngoại bộ.

### Giao thức cổng nội bộ (IGP - Interior Gateway Protocol)

IGP dùng cho các mạng nội bộ như mạng doanh nghiệp hoặc mạng nhà cung cấp dịch vụ.
Một số giao thức IGP phổ biến bao gồm:
- **RIP (Routing Information Protocol):** hoạt động dựa trên số bước nhảy với giới
  hạn 15 hop, phù hợp cho mạng nhỏ nhưng chậm hội tụ.
- **OSPF (Open Shortest Path First):**  sử dụng cơ chế link-state, xây dựng bản đồ
  mạng đầy đủ và tính toán đường đi ngắn nhất bằng thuật toán Dijkstra, thích hợp
  cho mạng doanh nghiệp quy mô lớn.

### Giao thức cổng ngoại bộ (EGP - Exterior Gateway Protocol)

Giao thức cổng ngoại bộ với đại diện là BGP đóng vai trò là "giao thức định tuyến
của Internet", quản lý việc trao đổi thông tin định tuyến giữa các hệ thống
tự trị với khả năng áp dụng các chính sách định tuyến linh hoạt. Mỗi router duy trì
một bảng định tuyến chi tiết, ghi lại thông tin về các mạng đích, subnet mask,
gateway và interface tương ứng, cùng với các chỉ số định tuyến để đánh giá
và lựa chọn đường đi tối ưu, tạo nên một hệ thống mạng linh hoạt và đáng tin cậy
cho mọi kết nối Internet ngày nay.

### Định tuyến tĩnh (Static Routing) và định tuyến động (Dynamic Routing)

- Định tuyến tĩnh giống như sử dụng một tấm bản đồ đã được vẽ sẵn. Quản trị viên
  mạng phải cấu hình thủ công bảng định tuyến trên từng router. Ưu điểm của phương pháp này
  là đơn giản, dễ dự đoán đuờng đi và không tiêu tốn tài nguyên hệ thống cho việc
  trao đổi thông tin định tuyến. Tuy nhiên, nó thiếu linh hoạt và không thích hợp
  cho các mạng lớn hoặc thay đổi thường xuyên, vì mọi thay đổi đều phải được cập nhật.
- Định tuyến động giống như việc sử dụng một hệ thống GPS thông minh. Các router tự
  động trao đổi thông tin định tuyến với nhau và tính toán đường đi tối ưu dựa trên
  các thuật toán định tuyến. Ưu điểm là khả năng thích ứng nhanh với sự thay đổi của mạng,
  tự tìm đường đi mới khi có sự cố. Tuy nhiên, nó phức tạp hơn và tiêu tốn băng thông và CPU.
  Một số giao thức định tuyến động phổ biến bao gồm RIP, OSPF và BGP.

### Bảng định tuyến (Routing Table) và các chỉ số định tuyến (Routing Metrics)

#### Bảng định tuyến

Bảng định tuyến hoạt động như một tấm bản đồ chỉ đường nội bộ trong mỗi router,
chứa đựng toàn bộ thông tin cần thiết để dẫn lối cho các gói tin đến đúng đích.
Cấu trúc của bảng định tuyến bao gồm các mục chính như:
- Destination Network: Mạng đích cần đến.
- Subnet Mask: Mặt nạ mạng xác định phạm vi.
- Next-Hop: Địa chỉ IP của router kế tiếp.
- Exit Interface: Cổng giao tiếp để chuyển tiếp gói tin.
- Metric: Chỉ số đánh giá chất lượng đường đi.
- Administrative Distance: Độ ưu tiên của nguồn thông tin.

| Destination    | Netmask       | Gateway     | Interface | Metric | AD  |
|----------------|---------------|-------------|-----------|--------------|
| 192.168.1.0    | 255.255.255.0 | 192.168.2.1 | Eth0      | 10     | 90  |
| 10.0.0.0       | 255.0.0.0     | 192.168.2.2 | Eth1      | 5      | 110 |
| 0.0.0.0        | 0.0.0.0       | 203.0.113.1 | Eth2      | 1      | 1   |

Quá trình định tuyến diễn ra như sau: Khi một gói tin đến router thì router sẽ:
- Phân tích địa chỉ đích từ header của gói tin.
- So sánh địa chỉ đích với các entry trong bảng định tuyến để tìm ra entry phù hợp nhất (theo nguyên tắc longest prefix match).
- Chuyển tiếp gói tin đến Next-Hop hoặc qua Exit Interface theo thông tin tìm được.

Ví dụ, nếu một gói tin có địa chỉ đích là `192.168.1.50`, router sẽ so sánh với bảng định tuyến và
tìm thấy khớp với `192.168.1.0/24`. Sau đó, nó sẽ chuyển tiếp gói tin qua interface Eth0 đến next-hop `192.168.2.1`.

#### Chỉ số định tuyến (Routing Metrics)

Chỉ số định tuyến giúp router đánh giá và so sánh các đường đi khác nhau để chọn
ra tuyến đường tối ưu nhất. Các chỉ số phổ biến bao gồm:
- **Hop Count:** Số bước nhảy (router) mà gói tin phải đi qua để đến đích. Đường dẫn có
  số bước nhảy ít hơn được ưu tiên hơn. Được sử dụng trong giao thức RIP, IGRP.
- **Bandwidth:** Tốc độ truyền tải tối đa của đường dẫn. Đường dẫn có băng thông
  cao hơn được ưu tiên. Được sử dụng trong OSPF, EIGRP.
- **Delay:** Thời gian trễ để truyền gói tin qua đường dẫn. Đường dẫn có độ trễ thấp
  hơn được ưu tiên. Được sử dụng trong EIGRP. Đơn vị tính thường là micro giây (μs).
- **Load:** Mức độ sử dụng của đường dẫn. Đường dẫn ít tải hơn được ưu tiên.
  Tính bằng tỷ lệ phần trăm sử dụng băng thông (percentage utilization).
- **Reliability:** Tỷ lệ gói tin thành công trên đường dẫn. Đường dẫn đáng tin cậy hơn
  được ưu tiên. Được đo bằng thang điểm từ 0 đến 255, tính bằng tỷ lệ uptime.
- Cost: Chi phí sử dụng đường dẫn, thường dựa trên băng thông.
  Đường dẫn có chi phí thấp hơn được ưu tiên. Được sử dụng trong OSPF.

Một số công thức tính chỉ số phức hợp:
$$
\text{EIGRP Metric} = (K_1 \times \text{Bandwidth})
+ \left( K_2 \times \frac{\text{Bandwidth}}{256 - \text{Load}} \right)
+ (K_3 \times \text{Delay})
+ (K_4 \times \text{Reliability})
+ (K_5 \times \text{MTU})
  $$

$$
\text{Cost} = \frac{\text{Reference Bandwidth}}{\text{Interface Bandwidth}}
$$

### Quy trình định tuyến

Quy trình định tuyến bao gồm các bước chính sau:
1. Thu thập thông tin định tuyến thông qua:
- Định tuyến tĩnh: Quản trị viên cấu hình thủ công.
- Định tuyến động: Router trao đổi thông tin định tuyến qua giao thức OSPF, RIP, BGP.
- Mạng kết nối trực tiếp: Router tự động thêm các mạng trực tiếp kết nối vào bảng định tuyến.
2. Tính toán chỉ số định tuyến để đánh giá các đường đi. Mỗi routing protocol sử dụng
   thuật toán riêng để tính toán chỉ số. Ví dụ:
- RIP sử dụng hop count.
- OSPF sử dụng cost dựa trên băng thông.
- EIGRP sử dụng metric phức hợp.
3. So sánh và chọn tuyến đường tối ưu dựa trên chỉ số định tuyến. Thứ tự ưu tiên:
- Longest Prefix Match: Prefix dài nhất được ưu tiên.
- Administrative Distance (AD): AD thấp hơn được ưu tiên.
- Metric: Metric thấp hơn được ưu tiên.
  Ví dụ:
```text
Route A: 192.168.1.0/24 - Metric 10 - AD 90
Route B: 192.168.1.0/26 - Metric 20 - AD 90
-> Chọn Route B (prefix dài hơn)

Route C: 192.168.2.0/24 - Metric 5 - AD 110
Route D: 192.168.2.0/24 - Metric 10 - AD 90
-> Chọn Route D (AD thấp hơn)
```

## Đồ hình mạng (Network Topology)

Đồ hình mạng là sơ đồ thể hiện cách các thiết bị mạng
được kết nối và sắp xếp với nhau. Giống như bản vẽ kiến trúc của một tòa nhà,
topology định nghĩa cấu trúc vật lý hoặc logic của mạng, quyết định cách dữ liệu
di chuyển và tương tác giữa các thiết bị.

<img src="/topology.webp" alt="Các loại Network Topology" loading="lazy" />
<br>

Các loại đồ hình mạng phổ biến:
### Đồ hình sao (Star Topology)

Tất cả các thiết bị kết nối với một thiết bị
trung tâm (switch hoặc hub). Dữ liệu truyền từ thiết bị ngoại vi đến thiết bị trung tâm,
rồi từ đó chuyển tiếp đến thiết bị đích.

Ưu điểm:
- Dễ quản lý và lắp đặt.
- Nếu một thiết bị hỏng, các thiết bị khác vẫn hoạt động bình thường.

Nhược điểm:
- Phụ thuộc vào thiết bị trung tâm, nếu nó hỏng thì toàn bộ mạng sẽ bị gián đoạn.
- Chi phí cao hơn do cần nhiều cáp và thiết bị trung tâm.

Ứng dụng: Mạng LAN trong văn phòng, mạng gia đình.

### Đồ hình bus (Bus Topology)

Tất cả các thiết bị kết nối vào một trục cáp chính (backbone).
Dữ liệu truyền qua cáp chính và được tất cả các thiết bị trong mạng nhận nhưng chỉ thiết bị đích mới xử lý.
Bus topology sử dụng CSMA/CD (Carrier Sense Multiple Access with Collision Detection) để tránh xung đột dữ liệu.

Ưu điểm:
- Chi phí lắp đặt thấp do sử dụng ít cáp.
- Đơn giản, dễ lắp đặt cho mạng nhỏ.

Nhược điểm:
- Khó khăn trong việc xác định và khắc phục sự cố.
- Nếu một thiết bị hoặc cáp bị hỏng, toàn bộ mạng có thể bị gián đoạn.
- Hiệu suất giảm khi có nhiều thiết bị kết nối.
- Bảo mật thấp do dữ liệu truyền qua tất cả các thiết bị.

Ứng dụng: Mạng nhỏ, phòng thí nghiệm, các ứng dụng đặc thù trong công nghiệp.


### Đồ hình vòng (Ring Topology)

Các thiết bị kết nối thành một vòng khép kín, dữ liệu truyền theo một hướng duy nhất.
Mỗi thiết bị đóng vai trò như một bộ lặp (repeater), khuếch đại tín hiệu và chuyển tiếp dữ liệu đến thiết bị kế tiếp.
Ring topology sử dụng cơ chế token passing để kiểm soát quyền truyền dữ liệu,
nghĩa là chỉ thiết bị nào giữ token mới được phép gửi dữ liệu.

Ưu điểm:
- Không có xung đột dữ liệu do truyền theo một hướng.
- Hiệu suất ổn định ngay cả khi có nhiều thiết bị kết nối.
- Dễ quan lý và giám sát.

Nhược điểm:
- Sự cố ở một thiết bị có thể ảnh hưởng đến toàn bộ mạng.
- Khó khăn trong việc mở rộng mạng.
- Chi phí lắp đặt cao hơn do cần cáp đặc biệt và thiết bị hỗ trợ.

Ứng dụng: Mạng MAN, mạng trong các tòa nhà lớn.

### Đồ hình lưới (Mesh Topology)

Có hai loại: full mesh và partial mesh.
- Full mesh: Mỗi thiết bị kết nối trực tiếp với tất cả các thiết bị khác trong mạng.
- Partial mesh: Chỉ một số thiết bị quan trọng kết nối trực tiếp với nhau.

Ưu điểm:
- Độ tin cậy cao, nếu một kết nối hỏng, dữ liệu vẫn có thể đi qua các kết nối khác.
- Hiệu suất cao, ít có tắc nghẽn do nhiều đường truyền dữ liệu.
- Bảo mật tốt hơn do dữ liệu có thể đi qua nhiều đường khác nhau.

Nhược điểm:
- Chi phí lắp đặt và bảo trì cao do cần nhiều cáp và thiết bị.
- Phức tạp trong việc quản lý và cấu hình mạng.

Ứng dụng: Mạng không dây (Wi-Fi), data center, mạng quân sự.

### Đồ hình cây (Tree Topology)

Đồ hình cây là một mô hình hybrid, nó là sự kết hợp giữa đồ hình sao và đồ hình bus.
Các thiết bị kết nối theo cấu trúc phân cấp, với một thiết bị trung tâm (root).

Ưu điểm:
- Dễ mở rộng và quản lý.
- Dễ phát hiện và khắc phục sự cố.
- Phân đoạn mạng dễ dàng.

Nhược điểm:
- Phụ thuộc vào thiết bị trung tâm, nếu nó hỏng thì toàn bộ mạng có thể bị gián đoạn.
- Chi phí lắp đặt cao hơn do cần nhiều cáp và thiết bị trung tâm.

Ứng dụng: Mạng doanh nghiệp lớn, mạng trường học, ISP phân cấp.

# Kết luận

Qua bài viết này, chúng ta đã cùng nhau đặt những viên gạch đầu tiên cho
nền tảng mạng máy tính, bước khởi đầu không thể thiếu trên con đường chinh phục
lập trình mạng. Ở bài viết tiếp theo, chúng ta sẽ khám phá Socket Programming,
nơi bạn sẽ tự tay tạo nên những ứng dụng mạng đầu tiên của chính mình.
Hẹn gặp lại các bạn trong bài viết sau!