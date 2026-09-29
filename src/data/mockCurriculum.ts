import { Topic, SchoolClass, Exam, StudentSubmission } from '../types';

export const INITIAL_CLASSES: SchoolClass[] = [
  { 
    id: '10A1', 
    gradeId: '10', 
    name: '10A1 (Ban Tự nhiên)', 
    homeroomTeacher: 'Cô Cao Thị Hồng Búp', 
    studentCount: 5,
    students: [
      { id: 'HS1001', name: 'Phạm Hồng Nhung', gender: 'Nữ', dob: '2010-03-15' },
      { id: 'HS1002', name: 'Đỗ Tuấn Khải', gender: 'Nam', dob: '2010-07-22' },
      { id: 'HS1003', name: 'Nguyễn Minh Anh', gender: 'Nữ', dob: '2010-11-05' },
      { id: 'HS1004', name: 'Trần Gia Bảo', gender: 'Nam', dob: '2010-01-30' },
      { id: 'HS1005', name: 'Vũ Thùy Linh', gender: 'Nữ', dob: '2010-09-18' },
    ]
  },
  { 
    id: '10A2', 
    gradeId: '10', 
    name: '10A2 (Chuyên Toán-Tin)', 
    homeroomTeacher: 'Cô Trần Thị Hương', 
    studentCount: 4,
    students: [
      { id: 'HS1006', name: 'Lê Hoàng Dương', gender: 'Nam', dob: '2010-05-12' },
      { id: 'HS1007', name: 'Bùi Phương Thảo', gender: 'Nữ', dob: '2010-08-20' },
      { id: 'HS1008', name: 'Đặng Tuấn Tú', gender: 'Nam', dob: '2010-02-14' },
      { id: 'HS1009', name: 'Hoàng Ngọc Hà', gender: 'Nữ', dob: '2010-10-09' },
    ]
  },
  { 
    id: '10A3', 
    gradeId: '10', 
    name: '10A3 (Ban Xã hội)', 
    homeroomTeacher: 'Thầy Lê Hoàng Long', 
    studentCount: 3,
    students: [
      { id: 'HS1010', name: 'Ngô Trọng Nghĩa', gender: 'Nam', dob: '2010-04-17' },
      { id: 'HS1011', name: 'Trương Mỹ Duyên', gender: 'Nữ', dob: '2010-06-25' },
      { id: 'HS1012', name: 'Phan Quốc Việt', gender: 'Nam', dob: '2010-12-01' },
    ]
  },
  { 
    id: '11A1', 
    gradeId: '11', 
    name: '11A1 (Định hướng ICT - Web)', 
    homeroomTeacher: 'Cô Phạm Minh Châu', 
    studentCount: 5,
    students: [
      { id: 'HS1101', name: 'Trần Minh Quân', gender: 'Nam', dob: '2009-02-18' },
      { id: 'HS1102', name: 'Lê Hoàng Yến Nhi', gender: 'Nữ', dob: '2009-08-14' },
      { id: 'HS1103', name: 'Nguyễn Thành Nam', gender: 'Nam', dob: '2009-04-20' },
      { id: 'HS1104', name: 'Đặng Mai Phương', gender: 'Nữ', dob: '2009-10-11' },
      { id: 'HS1105', name: 'Hoàng Quốc Bảo', gender: 'Nam', dob: '2009-12-03' },
    ]
  },
  { 
    id: '11A2', 
    gradeId: '11', 
    name: '11A2 (Định hướng CS - Lập trình)', 
    homeroomTeacher: 'Thầy Đỗ Trọng Nghĩa', 
    studentCount: 4,
    students: [
      { id: 'HS1106', name: 'Vũ Đức Thịnh', gender: 'Nam', dob: '2009-03-27' },
      { id: 'HS1107', name: 'Phạm Thùy Chi', gender: 'Nữ', dob: '2009-09-19' },
      { id: 'HS1108', name: 'Lương Minh Khang', gender: 'Nam', dob: '2009-06-08' },
      { id: 'HS1109', name: 'Bùi Cẩm Tú', gender: 'Nữ', dob: '2009-11-23' },
    ]
  },
  { 
    id: '11A5', 
    gradeId: '11', 
    name: '11A5 (Định hướng Tin ứng dụng)', 
    homeroomTeacher: 'Cô Vũ Thị Thu', 
    studentCount: 3,
    students: [
      { id: 'HS1110', name: 'Nguyễn Trọng Hưng', gender: 'Nam', dob: '2009-01-15' },
      { id: 'HS1111', name: 'Dương Khánh Linh', gender: 'Nữ', dob: '2009-05-30' },
      { id: 'HS1112', name: 'Tạ Văn Quyết', gender: 'Nam', dob: '2009-07-04' },
    ]
  },
  { 
    id: '12A1', 
    gradeId: '12', 
    name: '12A1 (Khoa học dữ liệu & AI)', 
    homeroomTeacher: 'Thầy Ngô Quốc Bảo', 
    studentCount: 4,
    students: [
      { id: 'HS1201', name: 'Phan Đình Trí', gender: 'Nam', dob: '2008-01-10' },
      { id: 'HS1202', name: 'Nguyễn Thu Trang', gender: 'Nữ', dob: '2008-07-16' },
      { id: 'HS1203', name: 'Trần Văn Hùng', gender: 'Nam', dob: '2008-03-22' },
      { id: 'HS1204', name: 'Lê Thảo My', gender: 'Nữ', dob: '2008-09-09' },
    ]
  },
  { 
    id: '12A2', 
    gradeId: '12', 
    name: '12A2 (Công nghệ Web & An toàn mạng)', 
    homeroomTeacher: 'Cô Đặng Kim Oanh', 
    studentCount: 3,
    students: [
      { id: 'HS1205', name: 'Bùi Quang Hải', gender: 'Nam', dob: '2008-04-18' },
      { id: 'HS1206', name: 'Vũ Hồng Hạnh', gender: 'Nữ', dob: '2008-08-28' },
      { id: 'HS1207', name: 'Đoàn Nhật Minh', gender: 'Nam', dob: '2008-11-12' },
    ]
  },
  { 
    id: '12D1', 
    gradeId: '12', 
    name: '12D1 (Ứng dụng Tin học số)', 
    homeroomTeacher: 'Thầy Bùi Đức Anh', 
    studentCount: 3,
    students: [
      { id: 'HS1208', name: 'Trịnh Gia Huy', gender: 'Nam', dob: '2008-05-02' },
      { id: 'HS1209', name: 'Phạm Bích Ngọc', gender: 'Nữ', dob: '2008-10-14' },
      { id: 'HS1210', name: 'Đinh Tuấn Phong', gender: 'Nam', dob: '2008-12-25' },
    ]
  },
];

export const INITIAL_TOPICS: Topic[] = [
  // --- KHỐI 10 ---
  {
    id: 'top-10-1',
    gradeId: '10',
    code: 'Chủ đề 1',
    name: 'Máy tính và xã hội tri thức (Thế giới thiết bị số)',
    direction: 'ICT',
    description: 'Tìm hiểu thông tin và xử lý thông tin, thiết bị số và mạng xã hội tri thức theo SGK Kết nối tri thức.',
    lessons: [
      {
        id: 'les-10-1',
        topicId: 'top-10-1',
        lessonNumber: 1,
        title: 'Thông tin và xử lý thông tin',
        durationMinutes: 45,
        summary: 'Khái niệm thông tin, dữ liệu, vật mang tin; quá trình thu nhận, lưu trữ và xử lý thông tin trong máy tính.',
        objectives: [
          'Phân biệt được dữ liệu và thông tin, lấy ví dụ thực tế.',
          'Nêu được các bước trong quá trình xử lý thông tin của máy tính.',
          'Hiểu được cách máy tính số hóa và mã hóa thông tin dạng nhị phân (bit).'
        ],
        contentMarkdown: `### 1. Dữ liệu và thông tin
- **Thông tin (Information):** Là sự hiểu biết của con người về thế giới xung quanh qua những tín hiệu thu nhận được.
- **Dữ liệu (Data):** Là các số, văn bản, hình ảnh, âm thanh được lưu trữ và xử lý trên thiết bị số.
- **Vật mang tin (Medium):** Là phương tiện lưu trữ dữ liệu (USB, đĩa cứng, thẻ nhớ, đám mây).

### 2. Quá trình xử lý thông tin
Mọi máy tính số đều hoạt động theo mô hình:
1. **Thu nhận dữ liệu (Input):** Bàn phím, chuột, camera, microphone.
2. **Xử lý dữ liệu (Processing):** CPU (Bộ vi xử lý trung tâm).
3. **Lưu trữ dữ liệu (Storage):** RAM (Bộ nhớ tạm), ROM, Ổ cứng SSD/HDD.
4. **Xuất kết quả (Output):** Màn hình, máy in, loa.`,
        reviewQuestions: [
          'Phân biệt sự khác nhau giữa dữ liệu nhiệt độ ghi nhận và thông tin thời tiết hôm nay?',
          'Kể tên 3 thiết bị vào và 3 thiết bị ra phổ biến của máy tính để bàn?'
        ],
        updatedAt: '2026-09-15'
      },
      {
        id: 'les-10-2',
        topicId: 'top-10-1',
        lessonNumber: 2,
        title: 'Vai trò của thiết bị thông minh và Tin học đối với xã hội',
        durationMinutes: 45,
        summary: 'Các thiết bị thông minh như smartphone, robot, IoT và tác động chuyển đổi số sâu rộng đến đời sống.',
        objectives: [
          'Kể tên các thiết bị thông minh phổ biến xung quanh.',
          'Phân tích vai trò của cuộc Cách mạng công nghiệp 4.0 và chuyển đổi số.',
          'Nhận thức về đạo đức và văn hóa giao tiếp trên không gian số.'
        ],
        contentMarkdown: `### Thiết bị thông minh (Smart Devices)
Thiết bị thông minh là thiết bị điện tử có khả năng hoạt động tự chủ, kết nối mạng và có khả năng tương tác với môi trường cũng như các thiết bị khác.`,
        reviewQuestions: ['Đặc điểm nào phân biệt một chiếc điện thoại thường và điện thoại thông minh?'],
        updatedAt: '2026-09-18'
      }
    ]
  },
  {
    id: 'top-10-5',
    gradeId: '10',
    code: 'Chủ đề 5',
    name: 'Giải quyết vấn đề với sự trợ giúp của máy tính (Lập trình Python cơ bản)',
    direction: 'CS',
    description: 'Cốt lõi chương trình Tin 10 KNTT: Biến, lệnh gán, cấu trúc rẽ nhánh if-else, vòng lặp for, while và hàm trong Python.',
    lessons: [
      {
        id: 'les-10-16',
        topicId: 'top-10-5',
        lessonNumber: 16,
        title: 'Ngôn ngữ lập trình bậc cao và Python',
        durationMinutes: 90,
        summary: 'Làm quen với môi trường lập trình Python, chế độ tương tác (Interactive Mode) và chế độ soạn thảo (Script Mode).',
        objectives: [
          'Biết cách mở môi trường IDLE hoặc VS Code chạy Python.',
          'Sử dụng lệnh print() để in dữ liệu ra màn hình.',
          'Nắm được các phép toán cơ bản (+, -, *, /, //, %, **).'
        ],
        contentMarkdown: `### Môi trường thực thi Python
Python là ngôn ngữ thông dịch (interpreted language) có cú pháp trong sáng, dễ học.
- Dòng lệnh in chuỗi: \`print("Xin chào Việt Nam!")\`
- Phép chia lấy phần nguyên: \`17 // 3 = 5\`
- Phép chia lấy phần dư: \`17 % 3 = 2\`
- Phép lũy thừa: \`2 ** 4 = 16\``,
        codeSnippet: {
          language: 'python',
          code: `# Bài tập mở đầu Python
ho_ten = "Nguyen Van An"
diem_toan = 8.5
diem_tin = 9.5
diem_tb = (diem_toan + diem_tin) / 2

print(f"Học sinh: {ho_ten}")
print(f"Điểm trung bình: {diem_tb:.2f}")`,
          explanation: 'Sử dụng biến lưu trữ họ tên và tính điểm trung bình môn học qua f-string.'
        },
        reviewQuestions: ['Kết quả của biểu thức 19 % 4 là bao nhiêu?', 'Lệnh nào dùng để in dữ liệu ra màn hình console?'],
        updatedAt: '2026-09-20'
      },
      {
        id: 'les-10-19',
        topicId: 'top-10-5',
        lessonNumber: 19,
        title: 'Câu lệnh rẽ nhánh if - else',
        durationMinutes: 90,
        summary: 'Cấu trúc rẽ nhánh dạng thiếu và đủ, toán tử so sánh (==, !=, >, <, >=, <=) và toán tử logic (and, or, not).',
        objectives: [
          'Hiểu nguyên lý thụt đầu dòng (Indentation) trong khối lệnh Python.',
          'Viết được chương trình kiểm tra số chẵn/lẻ, xếp loại học sinh theo điểm.',
          'Tránh các lỗi cú pháp thiếu dấu hai chấm (:) sau điều kiện.'
        ],
        contentMarkdown: `### Cú pháp câu lệnh if - elif - else
\`\`\`python
if dieu_kien_1:
    khoi_lenh_1
elif dieu_kien_2:
    khoi_lenh_2
else:
    khoi_lenh_mac_dinh
\`\`\``,
        codeSnippet: {
          language: 'python',
          code: `# Kiểm tra năm nhuận dương lịch
nam = int(input("Nhập năm cần kiểm tra: "))
if (nam % 400 == 0) or (nam % 4 == 0 and nam % 100 != 0):
    print(f"Năm {nam} là NĂM NHUẬN")
else:
    print(f"Năm {nam} KHÔNG PHẢI năm nhuận")`,
          explanation: 'Thuật toán năm nhuận: chia hết cho 400 hoặc chia hết cho 4 nhưng không chia hết cho 100.'
        },
        reviewQuestions: ['Ý nghĩa của thụt dòng (Indentation) trong Python là gì?'],
        updatedAt: '2026-09-22'
      }
    ]
  },

  // --- KHỐI 11 ---
  {
    id: 'top-11-web',
    gradeId: '11',
    code: 'Chủ đề 6 (ICT)',
    name: 'Thực hành Thiết kế Trang Web với HTML & CSS',
    direction: 'ICT',
    description: 'Chủ đề trọng tâm hướng nghiệp ICT Tin học 11 KNTT: Tạo trang web, định dạng siêu văn bản và CSS styling.',
    lessons: [
      {
        id: 'les-11-26',
        topicId: 'top-11-web',
        lessonNumber: 26,
        title: 'Khởi tạo trang web bằng HTML',
        durationMinutes: 90,
        summary: 'Cấu trúc chuẩn của một tệp tài liệu HTML5, cặp thẻ gốc <!DOCTYPE html>, <html>, <head>, <body>.',
        objectives: [
          'Giải thích ý nghĩa cấu trúc cơ bản của tệp HTML5.',
          'Phân biệt cặp thẻ có đóng mở (<p></p>) và thẻ đơn tự đóng (<br>, <img>).',
          'Sử dụng các thẻ tiêu đề <h1> đến <h6> và đoạn văn <p>.'
        ],
        contentMarkdown: `### 1. Khung cấu trúc HTML chuẩn
Tất cả các trang web hiện đại đều tuân theo chuẩn HTML5 của W3C.
- \`<!DOCTYPE html>\`: Khai báo phiên bản tài liệu.
- \`<head>\`: Chứa siêu dữ liệu (metadata), tiêu đề tab, liên kết file CSS.
- \`<body>\`: Chứa nội dung hiển thị cho người xem.`,
        codeSnippet: {
          language: 'html',
          code: `<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8">
    <title>Cổng Thông Tin Học Sinh THPT</title>
  </head>
  <body>
    <h1>Trường THPT Kết Nối Tri Thức</h1>
    <p>Chào mừng các bạn học sinh đến với lớp <strong>Tin học 11</strong>!</p>
  </body>
</html>`,
          explanation: 'Tài liệu HTML5 hoàn chỉnh với thẻ khai báo ngôn ngữ tiếng Việt và mã hóa ký tự UTF-8.'
        },
        reviewQuestions: ['Thẻ nào dùng để khai báo tiêu đề trang web hiển thị trên thanh tab trình duyệt?'],
        updatedAt: '2026-09-24'
      },
      {
        id: 'les-11-29',
        topicId: 'top-11-web',
        lessonNumber: 29,
        title: 'Định dạng trang web bằng CSS (Cascading Style Sheets)',
        durationMinutes: 90,
        summary: 'Cơ chế hoạt động của CSS: Bộ chọn (Selector), Thuộc tính (Property) và Giá trị (Value). Nhúng CSS nội bộ và ngoại vi.',
        objectives: [
          'Phân biệt 3 cách nhúng CSS: Inline, Internal, External.',
          'Thành thạo các bộ chọn cơ bản: thẻ tag, class (chấm .), id (thăng #).',
          'Tùy chỉnh màu chữ (color), màu nền (background-color), font-size và margin/padding.'
        ],
        contentMarkdown: `### Cú pháp quy tắc CSS
\`\`\`css
selector {
  property: value;
}
\`\`\`
- Selector theo class: \`.highlight { color: red; }\`
- Selector theo id: \`#header-main { font-weight: bold; }\``,
        codeSnippet: {
          language: 'css',
          code: `/* File styles.css */
body {
  font-family: Arial, sans-serif;
  background-color: #f8fafc;
  color: #1e293b;
  margin: 0;
  padding: 20px;
}

.lesson-card {
  border-radius: 8px;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 16px;
}`,
          explanation: 'Khai báo các thuộc tính phông chữ, màu nền và thẻ bo góc bằng CSS.'
        },
        reviewQuestions: ['Ký tự nào đứng trước tên class trong bộ chọn CSS?'],
        updatedAt: '2026-09-25'
      }
    ]
  },
  {
    id: 'top-11-db',
    gradeId: '11',
    code: 'Chủ đề 7',
    name: 'Cơ sở dữ liệu và Hệ quản trị CSDL',
    direction: 'CS',
    description: 'Khái niệm hệ CSDL quan hệ, bảng (table), trường (field), bản ghi (record), khóa chính (primary key) và ngôn ngữ SQL.',
    lessons: [
      {
        id: 'les-11-11',
        topicId: 'top-11-db',
        lessonNumber: 11,
        title: 'Cơ sở dữ liệu và hệ quản trị CSDL',
        durationMinutes: 45,
        summary: 'Sự cần thiết của CSDL trong kỷ nguyên số so với quản lý dữ liệu thủ công bằng tệp tin rời rạc.',
        objectives: [
          'Nêu được khái niệm CSDL và Hệ quản trị CSDL (DBMS).',
          'Chỉ ra các ưu điểm: hạn chế dư thừa, đảm bảo tính nhất quán, chia sẻ dữ liệu an toàn.',
          'Nhận biết khóa chính và vai trò phân biệt từng bản ghi duy nhất.'
        ],
        contentMarkdown: `### Bảng dữ liệu quan hệ (Relation Table)
Một bảng gồm:
- **Trường (Field / Attribute):** Cột biểu diễn thuộc tính của đối tượng.
- **Bản ghi (Record / Tuple):** Hàng biểu diễn một đối tượng cụ thể.
- **Khóa chính (Primary Key):** Tập một hoặc nhiều trường có giá trị xác định duy nhất mỗi bản ghi trong bảng.`,
        reviewQuestions: ['Khóa chính có thể nhận giá trị rỗng (NULL) được không? Giải thích vì sao?'],
        updatedAt: '2026-09-26'
      }
    ]
  },

  // --- KHỐI 12 ---
  {
    id: 'top-12-ai',
    gradeId: '12',
    code: 'Chủ đề: Trí tuệ nhân tạo',
    name: 'Làm quen với Trí tuệ nhân tạo (AI) & Học máy',
    direction: 'CS',
    description: 'Chương trình Tin học 12 KNTT mới: Lịch sử, ứng dụng thực tế của AI, học máy (Machine Learning), xử lý ngôn ngữ tự nhiên và đạo đức AI.',
    lessons: [
      {
        id: 'les-12-1',
        topicId: 'top-12-ai',
        lessonNumber: 1,
        title: 'Giới thiệu về Trí tuệ nhân tạo (Artificial Intelligence)',
        durationMinutes: 90,
        summary: 'Khái niệm AI hẹp (Narrow AI), AI tổng quát (AGI); các trụ cột dữ liệu, thuật toán và năng lực tính toán.',
        objectives: [
          'Hiểu đúng định nghĩa về Trí tuệ nhân tạo.',
          'Phân biệt được trí tuệ nhân tạo yếu (Narrow AI) và trí tuệ nhân tạo mạnh (General AI).',
          'Nắm được các bài toán ứng dụng: nhận dạng khuôn mặt, dịch máy, xe tự hành, trợ lý ảo.'
        ],
        contentMarkdown: `### 1. Trí tuệ nhân tạo là gì?
Trí tuệ nhân tạo (AI) là lĩnh vực khoa học kỹ thuật máy tính nghiên cứu tạo ra các hệ thống máy tính có khả năng thực hiện những nhiệm vụ đòi hỏi trí thông minh con người như học tập, suy luận, thích nghi và giải quyết vấn đề.`,
        codeSnippet: {
          language: 'python',
          code: `# Minh họa hàm dự đoán đơn giản trong học máy
def du_doan_dau_rot(diem_chuyen_can, diem_kiem_tra):
    # Trọng số tính toán (Weights)
    diem_tong_ket = (diem_chuyen_can * 0.3) + (diem_kiem_tra * 0.7)
    return "ĐỖ" if diem_tong_ket >= 5.0 else "TRƯỢT"

print("Kết quả học sinh A:", du_doan_dau_rot(8.0, 6.5))`,
          explanation: 'Mô phỏng mô hình ra quyết định tuyến tính trong khoa học máy tính.'
        },
        reviewQuestions: ['Hiện nay các hệ thống AI thương mại (như ChatGPT, Siri) thuộc loại Narrow AI hay AGI?'],
        updatedAt: '2026-09-27'
      }
    ]
  }
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'exam-11-midterm',
    title: 'Kiểm tra Giữa kì 1 - Tin học 11 (Thiết kế Web & CSDL)',
    code: 'TIN11-GK1-2026',
    examType: 'Giữa kì 1',
    gradeId: '11',
    targetClassIds: ['11A1', '11A2'],
    subject: 'Tin học THPT (Kết nối tri thức)',
    status: 'active',
    createdAt: '2026-09-20',
    startTime: '2026-10-05T07:30',
    endTime: '2026-10-05T08:15',
    autoGradingConfig: {
      gradingMode: 'EQUAL',
      totalPoints: 10.0,
      passScore: 5.0,
      durationMinutes: 45,
      autoSubmitOnTime: true,
      shuffleQuestions: true,
      shuffleOptions: true,
      allowReviewAfterSubmit: true,
      maxAttempts: 1,
      enableNegativeMarking: false
    },
    questions: [
      {
        id: 'q1',
        examId: 'exam-11-midterm',
        order: 1,
        type: 'MULTIPLE_CHOICE',
        difficulty: 'NB',
        questionText: 'Thẻ HTML nào sau đây được sử dụng để tạo một liên kết siêu văn bản (hyperlink)?',
        options: [
          { id: 'A', text: '<a>' },
          { id: 'B', text: '<link>' },
          { id: 'C', text: '<href>' },
          { id: 'D', text: '<url>' }
        ],
        correctAnswer: 'A',
        points: 2.0,
        explanation: 'Thẻ <a> (viết tắt của Anchor) kết hợp với thuộc tính href dùng để tạo siêu liên kết chuyển hướng trong tài liệu HTML.'
      },
      {
        id: 'q2',
        examId: 'exam-11-midterm',
        order: 2,
        type: 'MULTIPLE_CHOICE',
        difficulty: 'TH',
        questionText: 'Trong CSS, bộ chọn (selector) nào dùng để định dạng cho phần tử có id là "navbar"?',
        options: [
          { id: 'A', text: '.navbar' },
          { id: 'B', text: '#navbar' },
          { id: 'C', text: '*navbar' },
          { id: 'D', text: '@navbar' }
        ],
        correctAnswer: 'B',
        points: 2.0,
        explanation: 'Ký tự thăng (#) là ký tự bắt đầu của bộ chọn ID (ID selector) trong CSS, trong khi dấu chấm (.) dùng cho Class.'
      },
      {
        id: 'q3',
        examId: 'exam-11-midterm',
        order: 3,
        type: 'CODE_FILL',
        difficulty: 'VD',
        questionText: 'Điền từ khóa HTML còn thiếu vào chỗ trống [___] để hiển thị hình ảnh "logo.png" với văn bản thay thế "Logo Trường":',
        codeContext: `<img [___]="logo.png" alt="Logo Trường">`,
        codeLanguage: 'html',
        correctAnswer: 'src',
        points: 3.0,
        explanation: 'Thuộc tính src (viết tắt của source) chỉ định đường dẫn tệp tin hình ảnh cần hiển thị.',
        keywordConfig: {
          primaryKeywords: ['src'],
          acceptableVariants: ['src=', 'src '],
          caseSensitive: false,
          ignoreWhitespace: true,
          regexPattern: '^\\s*src\\s*$',
          partialMatchPercentage: 50
        }
      },
      {
        id: 'q4',
        examId: 'exam-11-midterm',
        order: 4,
        type: 'THEORY_SHORT',
        difficulty: 'TH',
        questionText: 'Trong Hệ quản trị CSDL quan hệ, thuật ngữ dùng để chỉ "một hàng" trong bảng dữ liệu được gọi là gì? (Điền 1 cụm từ tiếng Việt hoặc tiếng Anh):',
        correctAnswer: 'bản ghi',
        points: 3.0,
        explanation: 'Mỗi hàng trong bảng quan hệ được gọi là Bản ghi (Record hoặc Tuple).',
        keywordConfig: {
          primaryKeywords: ['bản ghi', 'record'],
          acceptableVariants: ['bản ghi', 'record', 'tuple', 'hàng bản ghi'],
          caseSensitive: false,
          ignoreWhitespace: true,
          partialMatchPercentage: 50
        }
      }
    ]
  },
  {
    id: 'exam-10-python',
    title: 'Kiểm tra Thường xuyên 15p - Python Cơ bản (Lệnh if & Vòng lặp)',
    code: 'TIN10-15P-PY',
    examType: '15p',
    gradeId: '10',
    targetClassIds: ['10A1', '10A2', '10A3'],
    subject: 'Tin học THPT (Kết nối tri thức)',
    status: 'scheduled',
    createdAt: '2026-09-22',
    startTime: '2026-10-02T08:00',
    endTime: '2026-10-02T08:15',
    autoGradingConfig: {
      gradingMode: 'EQUAL',
      totalPoints: 10.0,
      passScore: 5.0,
      durationMinutes: 15,
      autoSubmitOnTime: true,
      shuffleQuestions: true,
      shuffleOptions: false,
      allowReviewAfterSubmit: true,
      maxAttempts: 1,
      enableNegativeMarking: false
    },
    questions: [
      {
        id: 'q10-1',
        examId: 'exam-10-python',
        order: 1,
        type: 'MULTIPLE_CHOICE',
        difficulty: 'NB',
        questionText: 'Hàm nào trong Python được dùng để nhập dữ liệu từ bàn phím dưới dạng chuỗi ký tự?',
        options: [
          { id: 'A', text: 'scan()' },
          { id: 'B', text: 'input()' },
          { id: 'C', text: 'cin >>' },
          { id: 'D', text: 'read()' }
        ],
        correctAnswer: 'B',
        points: 2.5,
        explanation: 'Hàm input() đọc một dòng từ thiết bị vào chuẩn và trả về kiểu chuỗi ký tự (str).'
      },
      {
        id: 'q10-2',
        examId: 'exam-10-python',
        order: 2,
        type: 'MULTIPLE_CHOICE',
        difficulty: 'TH',
        questionText: 'Cho đoạn code: `x = 15 % 4`. Giá trị của biến x là bao nhiêu?',
        options: [
          { id: 'A', text: '3' },
          { id: 'B', text: '3.75' },
          { id: 'C', text: '4' },
          { id: 'D', text: '0' }
        ],
        correctAnswer: 'A',
        points: 2.5,
        explanation: 'Toán tử % là phép chia lấy phần dư. 15 chia 4 được 3 dư 3.'
      },
      {
        id: 'q10-3',
        examId: 'exam-10-python',
        order: 3,
        type: 'CODE_FILL',
        difficulty: 'VD',
        questionText: 'Điền từ khóa còn thiếu vào [___] để định nghĩa một hàm tính diện tích hình chữ nhật:',
        codeContext: `[___] tinh_dien_tich(a, b):
    return a * b`,
        codeLanguage: 'python',
        correctAnswer: 'def',
        points: 2.5,
        explanation: 'Từ khóa `def` bắt đầu phần định nghĩa hàm trong Python.',
        keywordConfig: {
          primaryKeywords: ['def'],
          acceptableVariants: ['def '],
          caseSensitive: true,
          ignoreWhitespace: true
        }
      },
      {
        id: 'q10-4',
        examId: 'exam-10-python',
        order: 4,
        type: 'MULTIPLE_CHOICE',
        difficulty: 'NB',
        questionText: 'Vòng lặp `for i in range(5):` sẽ lặp lại bao nhiêu lần?',
        options: [
          { id: 'A', text: '4 lần (từ 0 đến 3)' },
          { id: 'B', text: '5 lần (từ 0 đến 4)' },
          { id: 'C', text: '5 lần (từ 1 đến 5)' },
          { id: 'D', text: '6 lần (từ 0 đến 5)' }
        ],
        correctAnswer: 'B',
        points: 2.5,
        explanation: 'range(5) sinh ra dãy chỉ số 0, 1, 2, 3, 4, tổng cộng gồm 5 lần lặp.'
      }
    ]
  }
];

export const INITIAL_SUBMISSIONS: StudentSubmission[] = [
  {
    id: 'sub-001',
    examId: 'exam-11-midterm',
    gradeId: '11',
    studentId: 'HS1101',
    studentName: 'Trần Minh Quân',
    className: '11A1',
    submittedAt: '2026-10-05T08:10:00',
    durationSecondsUsed: 1420,
    totalScore: 10.0,
    maxScore: 10.0,
    answers: [
      { questionId: 'q1', studentAnswer: 'A', isCorrect: true, earnedPoints: 2.5, feedback: 'Chính xác thẻ <a>' },
      { questionId: 'q2', studentAnswer: 'B', isCorrect: true, earnedPoints: 2.5, feedback: 'Chính xác bộ chọn ID #' },
      { questionId: 'q3', studentAnswer: 'src', isCorrect: true, earnedPoints: 2.5, feedback: 'Khớp từ khóa chuẩn "src"' },
      { questionId: 'q4', studentAnswer: 'bản ghi', isCorrect: true, earnedPoints: 2.5, feedback: 'Khớp từ khóa lý thuyết' }
    ]
  },
  {
    id: 'sub-002',
    examId: 'exam-11-midterm',
    gradeId: '11',
    studentId: 'HS1102',
    studentName: 'Lê Hoàng Yến Nhi',
    className: '11A1',
    submittedAt: '2026-10-05T08:12:00',
    durationSecondsUsed: 1560,
    totalScore: 7.5,
    maxScore: 10.0,
    answers: [
      { questionId: 'q1', studentAnswer: 'A', isCorrect: true, earnedPoints: 2.5, feedback: 'Chính xác' },
      { questionId: 'q2', studentAnswer: 'A', isCorrect: false, earnedPoints: 0.0, feedback: 'Sai (Chọn .navbar là bộ chọn class, không phải ID)' },
      { questionId: 'q3', studentAnswer: 'src', isCorrect: true, earnedPoints: 2.5, feedback: 'Chính xác' },
      { questionId: 'q4', studentAnswer: 'record', isCorrect: true, earnedPoints: 2.5, feedback: 'Khớp từ khóa tiếng Anh tương đương' }
    ]
  },
  {
    id: 'sub-003',
    examId: 'exam-11-midterm',
    gradeId: '11',
    studentId: 'HS1103',
    studentName: 'Nguyễn Thành Nam',
    className: '11A2',
    submittedAt: '2026-10-05T08:15:30',
    durationSecondsUsed: 1680,
    totalScore: 10.0,
    maxScore: 10.0,
    answers: [
      { questionId: 'q1', studentAnswer: 'A', isCorrect: true, earnedPoints: 2.5, feedback: 'Chính xác' },
      { questionId: 'q2', studentAnswer: 'B', isCorrect: true, earnedPoints: 2.5, feedback: 'Chính xác' },
      { questionId: 'q3', studentAnswer: 'src', isCorrect: true, earnedPoints: 2.5, feedback: 'Chính xác' },
      { questionId: 'q4', studentAnswer: 'bản ghi', isCorrect: true, earnedPoints: 2.5, feedback: 'Chính xác' }
    ]
  },
  {
    id: 'sub-004',
    examId: 'exam-10-python',
    gradeId: '10',
    studentId: 'HS1001',
    studentName: 'Phạm Hồng Nhung',
    className: '10A1',
    submittedAt: '2026-10-06T09:20:00',
    durationSecondsUsed: 840,
    totalScore: 10.0,
    maxScore: 10.0,
    answers: [
      { questionId: 'q10-1', studentAnswer: 'B', isCorrect: true, earnedPoints: 2.5, feedback: 'Đúng hàm input()' },
      { questionId: 'q10-2', studentAnswer: 'A', isCorrect: true, earnedPoints: 2.5, feedback: 'Đúng phép dư 3' },
      { questionId: 'q10-3', studentAnswer: 'def', isCorrect: true, earnedPoints: 2.5, feedback: 'Đúng từ khóa def' },
      { questionId: 'q10-4', studentAnswer: 'B', isCorrect: true, earnedPoints: 2.5, feedback: 'Đúng 5 lần' }
    ]
  },
  {
    id: 'sub-005',
    examId: 'exam-10-python',
    gradeId: '10',
    studentId: 'HS1002',
    studentName: 'Đỗ Tuấn Khải',
    className: '10A2',
    submittedAt: '2026-10-06T09:22:45',
    durationSecondsUsed: 890,
    totalScore: 7.5,
    maxScore: 10.0,
    answers: [
      { questionId: 'q10-1', studentAnswer: 'B', isCorrect: true, earnedPoints: 2.5, feedback: 'Đúng' },
      { questionId: 'q10-2', studentAnswer: 'A', isCorrect: true, earnedPoints: 2.5, feedback: 'Đúng' },
      { questionId: 'q10-3', studentAnswer: 'function', isCorrect: false, earnedPoints: 0.0, feedback: 'Sai (Python dùng "def", không dùng "function")' },
      { questionId: 'q10-4', studentAnswer: 'B', isCorrect: true, earnedPoints: 2.5, feedback: 'Đúng' }
    ]
  }
];
