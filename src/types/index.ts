export type GradeLevel = '10' | '11' | '12';

export type UserRole = 'teacher' | 'student'; // Phân quyền: Giáo viên, Học sinh

export type BookDirection = 'ICT' | 'CS'; // Kết nối tri thức: Định hướng Tin học ứng dụng (ICT), Định hướng Khoa học máy tính (CS)

export interface Lesson {
  id: string;
  topicId: string;
  lessonNumber: number;
  title: string;
  durationMinutes: number;
  summary: string;
  objectives: string[];
  contentMarkdown: string;
  codeSnippet?: {
    language: 'python' | 'html' | 'css' | 'sql' | 'pseudocode';
    code: string;
    explanation: string;
  };
  attachments?: {
    id: string;
    name: string;
    type: 'pdf' | 'ppt' | 'docx' | 'link';
    url: string;
    size: string;
  }[];
  reviewQuestions?: string[];
  updatedAt: string;
}

export interface Topic {
  id: string;
  gradeId: GradeLevel;
  code: string; // VD: "Chủ đề 1", "Chủ đề A"
  name: string;
  direction?: BookDirection;
  description: string;
  lessons: Lesson[];
}

export interface Student {
  id: string; // VD: HS1001
  name: string; // VD: Nguyễn Văn An
  gender?: 'Nam' | 'Nữ';
  dob?: string; // Ngày sinh
  email?: string;
  phone?: string;
}

export interface SchoolClass {
  id: string;
  gradeId: GradeLevel;
  name: string; // 10A1, 11A3, 12A1
  homeroomTeacher: string;
  studentCount: number;
  students?: Student[];
}

export type ExamType = '15p' | 'Giữa kì 1' | 'Cuối kì 1' | 'Giữa kì 2' | 'Cuối kì 2' | 'Khảo sát';

export type ExamStatus = 'draft' | 'scheduled' | 'active' | 'completed';

export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'CODE_FILL' | 'THEORY_SHORT';

export type QuestionDifficulty = 'NB' | 'TH' | 'VD' | 'VDC'; // Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao

export interface QuestionOption {
  id: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
}

export interface KeywordMatchingConfig {
  primaryKeywords: string[]; // Các từ khóa chính xác
  acceptableVariants: string[]; // Các biến thể chấp nhận (từ đồng nghĩa, cú pháp tương đương)
  caseSensitive: boolean; // Phân biệt chữ hoa/thường
  ignoreWhitespace: boolean; // Bỏ qua khoảng trắng thừa
  regexPattern?: string; // Biểu thức chính quy tùy chọn
  partialMatchPercentage?: number; // Tỷ lệ điểm nếu khớp một phần (VD: 50%)
}

export interface Question {
  id: string;
  examId: string;
  topicId?: string;
  order: number;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  questionText: string;
  codeContext?: string; // Đoạn code mẫu cần bổ sung hoặc xem xét
  codeLanguage?: 'python' | 'html' | 'css' | 'sql';
  options?: QuestionOption[]; // Cho trắc nghiệm
  correctAnswer: string; // 'A', 'True', hoặc từ khóa chuẩn
  points: number; // Điểm của câu hỏi
  explanation: string;
  keywordConfig?: KeywordMatchingConfig; // Cho câu điền khuyết code / tự luận ngắn
}

export interface AutoGradingConfig {
  gradingMode: 'EQUAL' | 'CUSTOM'; // Chia đều điểm cho tổng số câu hay Tùy chỉnh từng câu
  totalPoints: number; // Thông thường là 10.0
  passScore: number; // Điểm đạt, vd: 5.0
  durationMinutes: number; // Thời gian làm bài
  autoSubmitOnTime: boolean; // Tự động thu bài khi hết giờ
  shuffleQuestions: boolean; // Đảo câu hỏi
  shuffleOptions: boolean; // Đảo đáp án
  allowReviewAfterSubmit: boolean; // Cho xem đáp án và giải thích ngay sau khi nộp
  maxAttempts: number; // Số lần làm bài tối đa
  enableNegativeMarking: boolean; // Trừ điểm nếu chọn sai (mặc định false)
}

export interface Exam {
  id: string;
  title: string;
  code: string;
  examType: ExamType;
  gradeId: GradeLevel;
  targetClassIds: string[]; // ['10A1', '10A2']
  subject: string;
  status: ExamStatus;
  createdAt: string;
  startTime: string;
  endTime: string;
  autoGradingConfig: AutoGradingConfig;
  questions: Question[];
  uploadedFileName?: string;
}

export interface StudentSubmission {
  id: string;
  examId: string;
  gradeId?: GradeLevel;
  studentId: string;
  studentName: string;
  className: string;
  submittedAt: string;
  durationSecondsUsed: number;
  totalScore: number;
  maxScore: number;
  answers: {
    questionId: string;
    studentAnswer: string;
    isCorrect: boolean;
    earnedPoints: number;
    feedback: string;
  }[];
}
