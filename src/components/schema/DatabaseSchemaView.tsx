import React, { useState } from 'react';
import { 
  Database, 
  Layers, 
  Workflow, 
  Code2, 
  Copy, 
  Check, 
  FileJson, 
  Table, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  Users,
  BookOpen,
  CheckSquare
} from 'lucide-react';

export const DatabaseSchemaView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'erd' | 'userflow' | 'sql' | 'json'>('erd');
  const [copied, setCopied] = useState<boolean>(false);

  const sqlDDL = `-- ====================================================================
-- EDUTIN THPT - CƠ SỞ DỮ LIỆU QUẢN LÝ HỌC TẬP & KIỂM TRA TIN HỌC THPT
-- Theo chuẩn Chương trình GDPT 2018 & SGK Kết nối tri thức với cuộc sống
-- ====================================================================

-- 1. BẢNG KHỐI LỚP (Grades)
CREATE TABLE grades (
    id VARCHAR(10) PRIMARY KEY, -- '10', '11', '12'
    code VARCHAR(20) NOT NULL UNIQUE, -- 'TIN_10', 'TIN_11', 'TIN_12'
    name VARCHAR(100) NOT NULL, -- 'Tin học 10 (Python)', 'Tin học 11 (Web & CSDL)'
    curriculum_name VARCHAR(150) DEFAULT 'Kết nối tri thức với cuộc sống',
    academic_year VARCHAR(20) NOT NULL DEFAULT '2026-2027',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. BẢNG CHỦ ĐỀ (Topics)
CREATE TABLE topics (
    id VARCHAR(50) PRIMARY KEY,
    grade_id VARCHAR(10) NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL, -- 'Chủ đề 1', 'Chủ đề 5', 'Chủ đề A'
    name VARCHAR(255) NOT NULL, -- 'Giải quyết vấn đề với sự trợ giúp của máy tính'
    direction VARCHAR(20) DEFAULT 'Chung', -- 'Chung', 'ICT' (Tin học ứng dụng), 'CS' (Khoa học máy tính)
    order_index INT NOT NULL DEFAULT 1,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. BẢNG BÀI HỌC (Lessons)
CREATE TABLE lessons (
    id VARCHAR(50) PRIMARY KEY,
    topic_id VARCHAR(50) NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    lesson_number INT NOT NULL, -- Bài 1, Bài 26...
    title VARCHAR(255) NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 45,
    summary TEXT,
    objectives JSONB DEFAULT '[]'::jsonb, -- Danh sách yêu cầu cần đạt
    content_markdown TEXT,
    code_snippet JSONB, -- { language: 'python'|'html'|'css', code: '...', explanation: '...' }
    attachments JSONB DEFAULT '[]'::jsonb,
    review_questions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. BẢNG LỚP HỌC (Classes)
CREATE TABLE classes (
    id VARCHAR(20) PRIMARY KEY, -- '10A1', '11A2'
    grade_id VARCHAR(10) NOT NULL REFERENCES grades(id),
    name VARCHAR(50) NOT NULL,
    homeroom_teacher VARCHAR(100),
    student_count INT DEFAULT 0,
    academic_year VARCHAR(20) DEFAULT '2026-2027'
);

-- 5. BẢNG ĐỢT KIỂM TRA (Exams)
CREATE TABLE exams (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    exam_type VARCHAR(50) NOT NULL, -- '15p', 'Giữa kì 1', 'Cuối kì 1'
    grade_id VARCHAR(10) NOT NULL REFERENCES grades(id),
    target_class_ids JSONB NOT NULL DEFAULT '[]'::jsonb, -- ['11A1', '11A2']
    status VARCHAR(20) NOT NULL DEFAULT 'draft', -- 'draft', 'scheduled', 'active', 'completed'
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    auto_grading_config JSONB NOT NULL, -- { gradingMode: 'EQUAL'|'CUSTOM', totalPoints: 10.0, passScore: 5.0, durationMinutes: 45, autoSubmitOnTime: true... }
    uploaded_file_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. BẢNG CÂU HỎI & NGÂN HÀNG ĐỀ (Questions)
CREATE TABLE questions (
    id VARCHAR(50) PRIMARY KEY,
    exam_id VARCHAR(50) NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    order_index INT NOT NULL,
    type VARCHAR(30) NOT NULL, -- 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'CODE_FILL', 'THEORY_SHORT'
    difficulty VARCHAR(10) NOT NULL DEFAULT 'TH', -- 'NB', 'TH', 'VD', 'VDC'
    question_text TEXT NOT NULL,
    code_context TEXT, -- Đoạn code ngắn ngữ cảnh cần điền
    code_language VARCHAR(20), -- 'python', 'html', 'css', 'sql'
    options JSONB, -- [{ id: 'A', text: '...' }, { id: 'B', text: '...' }]
    correct_answer TEXT NOT NULL, -- 'A', hoặc từ khóa chuẩn
    points NUMERIC(4,2) NOT NULL DEFAULT 1.0,
    explanation TEXT,
    keyword_config JSONB -- { primaryKeywords: ['src'], acceptableVariants: ['src='], caseSensitive: false, ignoreWhitespace: true, regexPattern: '...' }
);

-- 7. BẢNG BÀI NỘP & KẾT QUẢ TỰ ĐỘNG CHẤM (Results / Submissions)
CREATE TABLE results (
    id VARCHAR(50) PRIMARY KEY,
    exam_id VARCHAR(50) NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    student_id VARCHAR(50) NOT NULL,
    student_name VARCHAR(100) NOT NULL,
    class_id VARCHAR(20) NOT NULL REFERENCES classes(id),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    duration_seconds_used INT NOT NULL,
    total_score NUMERIC(4,2) NOT NULL,
    max_score NUMERIC(4,2) NOT NULL DEFAULT 10.0,
    is_passed BOOLEAN NOT NULL,
    answers_breakdown JSONB NOT NULL -- [{ questionId, studentAnswer, isCorrect, earnedPoints, feedback }]
);`;

  const jsonSchemaOutline = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "EduTinTHPTSchema",
    "description": "Cấu trúc dữ liệu EduTin THPT Kết nối tri thức",
    "definitions": {
      "Grade": {
        "type": "object",
        "properties": {
          "id": { "type": "string", "enum": ["10", "11", "12"] },
          "code": { "type": "string" },
          "name": { "type": "string" },
          "curriculum": { "type": "string", "default": "Kết nối tri thức" }
        },
        "required": ["id", "code", "name"]
      },
      "Topic": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "gradeId": { "type": "string" },
          "code": { "type": "string" },
          "name": { "type": "string" },
          "direction": { "type": "string", "enum": ["Chung", "ICT", "CS"] },
          "lessons": { "type": "array", "items": { "$ref": "#/definitions/Lesson" } }
        }
      },
      "Lesson": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "topicId": { "type": "string" },
          "lessonNumber": { "type": "integer" },
          "title": { "type": "string" },
          "durationMinutes": { "type": "integer" },
          "summary": { "type": "string" },
          "objectives": { "type": "array", "items": { "type": "string" } },
          "codeSnippet": {
            "type": "object",
            "properties": {
              "language": { "type": "string", "enum": ["python", "html", "css", "sql"] },
              "code": { "type": "string" },
              "explanation": { "type": "string" }
            }
          }
        },
        "required": ["id", "title", "lessonNumber"]
      },
      "Exam": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "title": { "type": "string" },
          "code": { "type": "string" },
          "examType": { "type": "string" },
          "gradeId": { "type": "string" },
          "targetClassIds": { "type": "array", "items": { "type": "string" } },
          "autoGradingConfig": {
            "type": "object",
            "properties": {
              "gradingMode": { "type": "string", "enum": ["EQUAL", "CUSTOM"] },
              "totalPoints": { "type": "number", "default": 10.0 },
              "durationMinutes": { "type": "integer" },
              "autoSubmitOnTime": { "type": "boolean" }
            }
          }
        }
      }
    }
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(sqlDDL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-xs mb-2">
            <Database className="w-3.5 h-3.5 text-purple-300" />
            <span>Đặc tả Kiến trúc Kỹ thuật & Luồng Nghiệp vụ</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            Kiến trúc CSDL & User Flow Giáo viên
          </h2>
          <p className="text-xs text-purple-100 max-w-2xl mt-1 leading-relaxed">
            Mô hình dữ liệu quan hệ chuẩn hóa 3NF cho 7 thực thể cốt lõi (Grades, Topics, Lessons, Classes, Exams, Questions, Results) và sơ đồ quy trình chi tiết.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySQL}
            className="px-4 py-2 bg-white text-purple-900 hover:bg-purple-50 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>Sao chép SQL DDL</span>
          </button>
        </div>
      </div>

      {/* Subtab Navigation */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap gap-2 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('erd')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            activeSubTab === 'erd' ? 'bg-purple-50 text-purple-700 shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>Sơ đồ Quan hệ Bảng (7 Bảng ERD)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('userflow')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            activeSubTab === 'userflow' ? 'bg-purple-50 text-purple-700 shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Workflow className="w-4 h-4" />
          <span>Luồng Thao tác Giáo viên (User Flow)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sql')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            activeSubTab === 'sql' ? 'bg-purple-50 text-purple-700 shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Mã nguồn SQL DDL Tạo Bảng</span>
        </button>

        <button
          onClick={() => setActiveSubTab('json')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            activeSubTab === 'json' ? 'bg-purple-50 text-purple-700 shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileJson className="w-4 h-4" />
          <span>Lược đồ JSON Schema API</span>
        </button>
      </div>

      {/* Content Area */}
      {activeSubTab === 'erd' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Table 1: Grades */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="p-3 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
                <span className="font-bold text-xs text-blue-900 font-mono">1. grades</span>
                <span className="text-[10px] bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded font-bold">Khối</span>
              </div>
              <div className="p-3 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-800"><span className="text-amber-600 font-bold">🔑 id</span><span>VARCHAR(10)</span></div>
                <div className="flex justify-between text-slate-600"><span>code</span><span>VARCHAR(20)</span></div>
                <div className="flex justify-between text-slate-600"><span>name</span><span>VARCHAR(100)</span></div>
                <div className="flex justify-between text-slate-400 text-[11px]"><span>curriculum_name</span><span>VARCHAR(150)</span></div>
              </div>
            </div>

            {/* Table 2: Topics */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="p-3 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
                <span className="font-bold text-xs text-indigo-900 font-mono">2. topics</span>
                <span className="text-[10px] bg-indigo-200 text-indigo-800 px-1.5 py-0.5 rounded font-bold">Chủ đề</span>
              </div>
              <div className="p-3 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-800"><span className="text-amber-600 font-bold">🔑 id</span><span>VARCHAR(50)</span></div>
                <div className="flex justify-between text-indigo-600"><span>🔗 grade_id</span><span>FK → grades</span></div>
                <div className="flex justify-between text-slate-600"><span>code</span><span>VARCHAR(50)</span></div>
                <div className="flex justify-between text-slate-600"><span>name</span><span>VARCHAR(255)</span></div>
                <div className="flex justify-between text-slate-600"><span>direction</span><span>'Chung'|'ICT'|'CS'</span></div>
              </div>
            </div>

            {/* Table 3: Lessons */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="p-3 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
                <span className="font-bold text-xs text-emerald-900 font-mono">3. lessons</span>
                <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded font-bold">Bài học</span>
              </div>
              <div className="p-3 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-800"><span className="text-amber-600 font-bold">🔑 id</span><span>VARCHAR(50)</span></div>
                <div className="flex justify-between text-indigo-600"><span>🔗 topic_id</span><span>FK → topics</span></div>
                <div className="flex justify-between text-slate-600"><span>lesson_number</span><span>INT</span></div>
                <div className="flex justify-between text-slate-600"><span>title</span><span>VARCHAR(255)</span></div>
                <div className="flex justify-between text-slate-400 text-[11px]"><span>objectives</span><span>JSONB</span></div>
                <div className="flex justify-between text-slate-400 text-[11px]"><span>code_snippet</span><span>JSONB</span></div>
              </div>
            </div>

            {/* Table 4: Classes */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="p-3 bg-sky-50 border-b border-sky-100 flex items-center justify-between">
                <span className="font-bold text-xs text-sky-900 font-mono">4. classes</span>
                <span className="text-[10px] bg-sky-200 text-sky-800 px-1.5 py-0.5 rounded font-bold">Lớp học</span>
              </div>
              <div className="p-3 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-800"><span className="text-amber-600 font-bold">🔑 id</span><span>VARCHAR(20)</span></div>
                <div className="flex justify-between text-indigo-600"><span>🔗 grade_id</span><span>FK → grades</span></div>
                <div className="flex justify-between text-slate-600"><span>name</span><span>VARCHAR(50)</span></div>
                <div className="flex justify-between text-slate-600"><span>homeroom_teacher</span><span>VARCHAR(100)</span></div>
                <div className="flex justify-between text-slate-600"><span>student_count</span><span>INT</span></div>
              </div>
            </div>

            {/* Table 5: Exams */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="p-3 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
                <span className="font-bold text-xs text-amber-900 font-mono">5. exams</span>
                <span className="text-[10px] bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded font-bold">Đợt thi</span>
              </div>
              <div className="p-3 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-800"><span className="text-amber-600 font-bold">🔑 id</span><span>VARCHAR(50)</span></div>
                <div className="flex justify-between text-slate-600"><span>title</span><span>VARCHAR(255)</span></div>
                <div className="flex justify-between text-indigo-600"><span>🔗 grade_id</span><span>FK → grades</span></div>
                <div className="flex justify-between text-slate-600"><span>target_class_ids</span><span>JSONB (M:N)</span></div>
                <div className="flex justify-between text-purple-700 font-bold"><span>auto_grading_config</span><span>JSONB</span></div>
              </div>
            </div>

            {/* Table 6: Questions */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="p-3 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
                <span className="font-bold text-xs text-rose-900 font-mono">6. questions</span>
                <span className="text-[10px] bg-rose-200 text-rose-800 px-1.5 py-0.5 rounded font-bold">Câu hỏi</span>
              </div>
              <div className="p-3 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-800"><span className="text-amber-600 font-bold">🔑 id</span><span>VARCHAR(50)</span></div>
                <div className="flex justify-between text-indigo-600"><span>🔗 exam_id</span><span>FK → exams</span></div>
                <div className="flex justify-between text-slate-600"><span>type</span><span>'MC'|'CODE_FILL'</span></div>
                <div className="flex justify-between text-emerald-600 font-bold"><span>correct_answer</span><span>TEXT</span></div>
                <div className="flex justify-between text-slate-600"><span>points</span><span>NUMERIC(4,2)</span></div>
                <div className="flex justify-between text-purple-700"><span>keyword_config</span><span>JSONB</span></div>
              </div>
            </div>

            {/* Table 7: Results */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs md:col-span-2 lg:col-span-3">
              <div className="p-3 bg-purple-50 border-b border-purple-100 flex items-center justify-between">
                <span className="font-bold text-xs text-purple-900 font-mono">7. results (Bảng Kết quả Chấm tự động)</span>
                <span className="text-[10px] bg-purple-200 text-purple-800 px-1.5 py-0.5 rounded font-bold">Submissions</span>
              </div>
              <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                <div className="space-y-1">
                  <div className="flex justify-between"><span className="text-amber-600 font-bold">🔑 id</span><span>VARCHAR(50)</span></div>
                  <div className="flex justify-between"><span className="text-indigo-600">🔗 exam_id</span><span>FK → exams</span></div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between"><span>student_name</span><span>VARCHAR(100)</span></div>
                  <div className="flex justify-between"><span className="text-indigo-600">🔗 class_id</span><span>FK → classes</span></div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between"><span className="text-emerald-600 font-bold">total_score</span><span>NUMERIC(4,2)</span></div>
                  <div className="flex justify-between"><span>is_passed</span><span>BOOLEAN</span></div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between"><span>duration_seconds</span><span>INT</span></div>
                  <div className="flex justify-between"><span className="text-purple-700">answers_breakdown</span><span>JSONB</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Flow Presentation */}
      {activeSubTab === 'userflow' && (
        <div className="space-y-8">
          {/* Flow 1: Tạo mới 1 bài học */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                F1
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Quy trình Giáo viên Số hóa & Tạo mới 1 Bài học (Learning Management Flow)
                </h3>
                <p className="text-xs text-slate-500">
                  Mô hình cây 3 cấp theo SGK Kết nối tri thức với cuộc sống
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
              {[
                {
                  step: '1',
                  title: 'Chọn Khối & Chủ đề',
                  desc: 'Truy cập cây thư mục, chọn khối 10, 11 hoặc 12 và chủ đề SGK tương ứng (vd Chủ đề 6: Thiết kế Web).',
                  icon: BookOpen
                },
                {
                  step: '2',
                  title: 'Bấm "Thêm bài học"',
                  desc: 'Hệ thống mở Modal biểu mẫu chuẩn hóa theo định hướng GDPT 2018.',
                  icon: Sparkles
                },
                {
                  step: '3',
                  title: 'Nhập Mục tiêu & Lý thuyết',
                  desc: 'Điền số thứ tự bài, tên bài, thời lượng (45p/90p), yêu cầu cần đạt và nội dung chi tiết dạng Markdown.',
                  icon: CheckCircle2
                },
                {
                  step: '4',
                  title: 'Đính kèm Code Snippet',
                  desc: 'Chọn ngôn ngữ (Python/HTML/CSS), dán mã nguồn mẫu và giải thích thuật toán/cú pháp.',
                  icon: Code2
                },
                {
                  step: '5',
                  title: 'Lưu & Đồng bộ Cây',
                  desc: 'Hệ thống tự động lưu vào chủ đề, mở rộng nhánh cây và kích hoạt các nút Xem, Sửa, Xóa.',
                  icon: Check
                }
              ].map((st) => (
                <div key={st.step} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                      {st.step}
                    </span>
                    <st.icon className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{st.title}</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{st.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Flow 2: Thiết lập Đợt thi & Cài đặt Tự động chấm */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                F2
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Quy trình Thiết lập Đợt Kiểm tra & Cài đặt Chấm Tự động (Exam & Auto-grading Flow)
                </h3>
                <p className="text-xs text-slate-500">
                  Từ khâu tạo đợt thi, phân bổ lớp, cài đặt ma trận đến giám sát chấm tự động tức thời
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 pt-2">
              {[
                {
                  step: '1',
                  title: 'Khởi tạo Đợt kiểm tra',
                  desc: 'Đặt tên đợt thi (Giữa kì 1, 15p), thời gian làm bài, thời điểm mở/đóng đề.',
                  color: 'bg-emerald-600'
                },
                {
                  step: '2',
                  title: 'Phân bổ Lớp học',
                  desc: 'Chọn các lớp tham gia (11A1, 11A2, 11A5...), hệ thống tự thống kê tổng số thí sinh.',
                  color: 'bg-emerald-600'
                },
                {
                  step: '3',
                  title: 'Soạn / Upload Đề thi',
                  desc: 'Tải tệp PDF/Word lên để bóc tách tự động hoặc soạn câu hỏi trắc nghiệm & điền khuyết code.',
                  color: 'bg-emerald-600'
                },
                {
                  step: '4',
                  title: 'Cài Ma trận & Thang điểm',
                  desc: 'Nhập đáp án chuẩn nhanh (1A 2B 3D), chọn Chia đều 10 điểm hoặc Tùy chỉnh điểm từng câu khó/dễ.',
                  color: 'bg-emerald-600'
                },
                {
                  step: '5',
                  title: 'Cấu hình So khớp Code',
                  desc: 'Thiết lập từ khóa chuẩn (src, def), biến thể tương đương, regex, bỏ qua khoảng trắng thừa.',
                  color: 'bg-emerald-600'
                },
                {
                  step: '6',
                  title: 'Xuất bản & Tự động Chấm',
                  desc: 'Học sinh làm bài, hết giờ tự thu bài, chấm tức thì và phân tích phổ điểm lớp học.',
                  color: 'bg-indigo-600'
                }
              ].map((st) => (
                <div key={st.step} className="p-3.5 rounded-xl border border-slate-200 bg-emerald-50/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`w-6 h-6 rounded-full text-white font-bold text-xs flex items-center justify-center ${st.color}`}>
                      {st.step}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{st.title}</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{st.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SQL Script View */}
      {activeSubTab === 'sql' && (
        <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-md">
          <div className="px-6 py-3 bg-slate-800/90 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400">schema_edutin_thpt.sql</span>
            <button
              onClick={handleCopySQL}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
            </button>
          </div>
          <pre className="p-6 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
            <code>{sqlDDL}</code>
          </pre>
        </div>
      )}

      {/* JSON Schema View */}
      {activeSubTab === 'json' && (
        <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-md">
          <div className="px-6 py-3 bg-slate-800/90 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono text-sky-400">edutin_schema.json</span>
          </div>
          <pre className="p-6 text-xs font-mono text-sky-300 overflow-x-auto leading-relaxed">
            <code>{JSON.stringify(jsonSchemaOutline, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
