import React, { useState } from 'react';
import { 
  X, 
  CheckSquare, 
  Users, 
  Upload, 
  Plus, 
  Trash2, 
  Clock, 
  Calendar, 
  HelpCircle,
  FileText,
  Code2,
  Check,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Exam, ExamType, GradeLevel, Question, SchoolClass } from '../../types';
import { ExamFileUploadModal } from './ExamFileUploadModal';

interface ExamCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exam: Exam) => void;
  classes: SchoolClass[];
}

export const ExamCreateModal: React.FC<ExamCreateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  classes
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [title, setTitle] = useState('');
  const [examType, setExamType] = useState<ExamType>('Giữa kì 1');
  const [gradeId, setGradeId] = useState<GradeLevel>('11');
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>(['11A1']);
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [startTime, setStartTime] = useState('2026-10-15T08:00');
  const [endTime, setEndTime] = useState('2026-10-15T09:00');
  const [gradingMode, setGradingMode] = useState<'EQUAL' | 'CUSTOM'>('EQUAL');
  const [totalPoints, setTotalPoints] = useState<number>(10.0);
  const [passScore, setPassScore] = useState<number>(5.0);

  // Questions
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'q-new-1',
      examId: '',
      order: 1,
      type: 'MULTIPLE_CHOICE',
      difficulty: 'NB',
      questionText: 'Trong HTML, thẻ nào được dùng để định nghĩa tiêu đề quan trọng nhất trên trang web?',
      options: [
        { id: 'A', text: '<h6>' },
        { id: 'B', text: '<head>' },
        { id: 'C', text: '<h1>' },
        { id: 'D', text: '<header>' }
      ],
      correctAnswer: 'C',
      points: 5.0,
      explanation: 'Thẻ <h1> biểu thị tiêu đề cấp cao nhất (Heading level 1).'
    },
    {
      id: 'q-new-2',
      examId: '',
      order: 2,
      type: 'CODE_FILL',
      difficulty: 'VD',
      questionText: 'Điền từ khóa CSS còn thiếu vào [___] để căn giữa văn bản trong khối:',
      codeContext: `h1 { text-align: [___]; }`,
      codeLanguage: 'css',
      correctAnswer: 'center',
      points: 5.0,
      explanation: 'Giá trị center căn chỉnh văn bản ra chính giữa theo chiều ngang.',
      keywordConfig: {
        primaryKeywords: ['center'],
        acceptableVariants: ['center;'],
        caseSensitive: false,
        ignoreWhitespace: true,
        partialMatchPercentage: 50
      }
    }
  ]);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  if (!isOpen) return null;

  // Classes filtered by selected grade
  const gradeClasses = classes.filter(c => c.gradeId === gradeId);
  const totalAssignedStudents = classes
    .filter(c => selectedClassIds.includes(c.id))
    .reduce((sum, c) => sum + c.studentCount, 0);

  const toggleClass = (classId: string) => {
    if (selectedClassIds.includes(classId)) {
      setSelectedClassIds(selectedClassIds.filter(id => id !== classId));
    } else {
      setSelectedClassIds([...selectedClassIds, classId]);
    }
  };

  const selectAllClassesOfGrade = () => {
    setSelectedClassIds(gradeClasses.map(c => c.id));
  };

  // Add question
  const handleAddQuestion = (type: 'MULTIPLE_CHOICE' | 'CODE_FILL') => {
    const newQ: Question = type === 'MULTIPLE_CHOICE' ? {
      id: `q-${Date.now()}`,
      examId: '',
      order: questions.length + 1,
      type: 'MULTIPLE_CHOICE',
      difficulty: 'TH',
      questionText: 'Nhập nội dung câu hỏi trắc nghiệm...',
      options: [
        { id: 'A', text: 'Lựa chọn A' },
        { id: 'B', text: 'Lựa chọn B' },
        { id: 'C', text: 'Lựa chọn C' },
        { id: 'D', text: 'Lựa chọn D' }
      ],
      correctAnswer: 'A',
      points: 2.5,
      explanation: 'Giải thích vì sao phương án A là đúng.'
    } : {
      id: `q-${Date.now()}`,
      examId: '',
      order: questions.length + 1,
      type: 'CODE_FILL',
      difficulty: 'VD',
      questionText: 'Điền từ khóa lập trình còn thiếu vào chỗ trống [___]:',
      codeContext: `for i in [___](10):\n    print(i)`,
      codeLanguage: 'python',
      correctAnswer: 'range',
      points: 2.5,
      explanation: 'Hàm range(10) sinh dãy số từ 0 đến 9.',
      keywordConfig: {
        primaryKeywords: ['range'],
        acceptableVariants: ['range '],
        caseSensitive: true,
        ignoreWhitespace: true
      }
    };

    setQuestions([...questions, newQ]);
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleImportParsed = (newQuestions: Question[], fileName: string) => {
    setQuestions(newQuestions);
    setUploadedFileName(fileName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const examCode = `TIN${gradeId}-${examType.replace(/\s+/g, '').toUpperCase()}-${Date.now().toString().slice(-4)}`;

    const newExam: Exam = {
      id: `exam-${Date.now()}`,
      title: title.trim(),
      code: examCode,
      examType,
      gradeId,
      targetClassIds: selectedClassIds.length > 0 ? selectedClassIds : [gradeClasses[0]?.id || '10A1'],
      subject: 'Tin học THPT (Kết nối tri thức)',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      startTime,
      endTime,
      uploadedFileName: uploadedFileName || undefined,
      autoGradingConfig: {
        gradingMode,
        totalPoints,
        passScore,
        durationMinutes,
        autoSubmitOnTime: true,
        shuffleQuestions: true,
        shuffleOptions: true,
        allowReviewAfterSubmit: true,
        maxAttempts: 1,
        enableNegativeMarking: false
      },
      questions: questions.map((q, idx) => ({ ...q, order: idx + 1 }))
    };

    onSave(newExam);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Thiết lập Đợt kiểm tra & Đánh giá mới</h2>
              <p className="text-xs text-slate-500">Phân bổ đối tượng theo khối/lớp & cài đặt tự động chấm</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Progress Steps */}
        <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStep(1)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
                step === 1 ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] flex items-center justify-center">1</span>
              <span>Thông tin chung & Khối thi</span>
            </button>
            <ChevronRight className="w-4 h-4 text-slate-300" />

            <button
              onClick={() => setStep(2)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
                step === 2 ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] flex items-center justify-center">2</span>
              <span>Phân bổ Lớp học ({selectedClassIds.length} lớp)</span>
            </button>
            <ChevronRight className="w-4 h-4 text-slate-300" />

            <button
              onClick={() => setStep(3)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
                step === 3 ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] flex items-center justify-center">3</span>
              <span>Đề thi & Tự động chấm ({questions.length} câu)</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-normal">
            Bước {step}/3
          </div>
        </div>

        {/* Step Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên đợt kiểm tra <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: Kiểm tra Giữa kì 1 - Tin học 11 (Thiết kế Web HTML/CSS)"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Loại bài kiểm tra
                  </label>
                  <select
                    value={examType}
                    onChange={(e) => setExamType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="15p">Kiểm tra thường xuyên 15 phút</option>
                    <option value="Giữa kì 1">Kiểm tra Giữa kì 1</option>
                    <option value="Cuối kì 1">Kiểm tra Cuối kì 1</option>
                    <option value="Giữa kì 2">Kiểm tra Giữa kì 2</option>
                    <option value="Cuối kì 2">Kiểm tra Cuối kì 2</option>
                    <option value="Khảo sát">Khảo sát chất lượng đầu năm</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Khối lớp áp dụng
                  </label>
                  <select
                    value={gradeId}
                    onChange={(e) => {
                      const newGrade = e.target.value as GradeLevel;
                      setGradeId(newGrade);
                      const defaultC = classes.filter(c => c.gradeId === newGrade).map(c => c.id);
                      setSelectedClassIds(defaultC.slice(0, 1));
                    }}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-indigo-700"
                  >
                    <option value="10">Khối 10 (Tin học 10 - Python)</option>
                    <option value="11">Khối 11 (Tin học 11 - Web & CSDL)</option>
                    <option value="12">Khối 12 (Tin học 12 - AI & Mạng)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Thời lượng làm bài
                  </label>
                  <div className="relative">
                    <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <option value={15}>15 phút</option>
                      <option value={45}>45 phút (1 tiết)</option>
                      <option value={60}>60 phút</option>
                      <option value={90}>90 phút (2 tiết)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Thời điểm mở đề thi
                  </label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Thời điểm kết thúc đợt thi
                  </label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    Gán đợt kiểm tra cho các lớp Khối {gradeId}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Chỉ học sinh thuộc các lớp được chọn mới có quyền truy cập đề thi.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={selectAllClassesOfGrade}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Chọn tất cả lớp khối {gradeId}
                </button>
              </div>

              {/* Class Checkbox Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {gradeClasses.map((cls) => {
                  const isChecked = selectedClassIds.includes(cls.id);
                  return (
                    <div
                      key={cls.id}
                      onClick={() => toggleClass(cls.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isChecked 
                          ? 'border-indigo-600 bg-indigo-50/70 shadow-xs' 
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-extrabold text-sm text-slate-900">{cls.name}</span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                      </div>
                      <p className="text-xs text-slate-500">GV: {cls.homeroomTeacher}</p>
                      <p className="text-[11px] font-semibold text-indigo-700 mt-1">
                        Sĩ số: {cls.studentCount} học sinh
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Summary of assigned students */}
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>
                    Tổng cộng: <strong>{selectedClassIds.length} lớp</strong> được phân bổ.
                  </span>
                </div>
                <span className="font-bold">
                  Dự kiến {totalAssignedStudents} thí sinh tham gia
                </span>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              {/* Question source & Upload */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Nội dung Đề thi & Ngân hàng câu hỏi
                  </h4>
                  <p className="text-xs text-slate-500">
                    {uploadedFileName ? `Đã nhập từ tệp: ${uploadedFileName}` : 'Soạn thảo câu hỏi trực tiếp hoặc tải lên tệp Word/PDF'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(true)}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-white hover:bg-indigo-50 border border-slate-200 rounded-lg flex items-center gap-1.5 shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5" /> Tải lên Word/PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddQuestion('MULTIPLE_CHOICE')}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm trắc nghiệm
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddQuestion('CODE_FILL')}
                    className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center gap-1.5"
                  >
                    <Code2 className="w-3.5 h-3.5" /> Điền khuyết Code
                  </button>
                </div>
              </div>

              {/* Basic Grading Mode Config */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs">
                <div>
                  <label className="font-bold text-slate-800 mb-1 block">Chế độ phân bổ điểm:</label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="gradingMode"
                        checked={gradingMode === 'EQUAL'}
                        onChange={() => setGradingMode('EQUAL')}
                        className="text-indigo-600"
                      />
                      <span>Chia đều điểm (10đ / {questions.length} câu = {(10 / (questions.length || 1)).toFixed(2)}đ/câu)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 mb-1 block">Ngưỡng điểm:</label>
                  <div className="flex items-center gap-4">
                    <span>Thang điểm: <strong>{totalPoints}đ</strong></span>
                    <span>Điểm đạt: <strong>{passScore}đ</strong></span>
                  </div>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-3">
                {questions.map((q, idx) => (
                  <div key={q.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-semibold uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          {q.type === 'MULTIPLE_CHOICE' ? 'Trắc nghiệm A/B/C/D' : 'Điền khuyết Code / Từ khóa'}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          Đáp án chuẩn: <strong className="text-emerald-600 font-mono">{q.correctAnswer}</strong>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(q.id)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs font-medium text-slate-800">{q.questionText}</p>
                    {q.codeContext && (
                      <pre className="p-2 text-xs font-mono bg-slate-900 text-emerald-400 rounded-md overflow-x-auto">
                        {q.codeContext}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex items-center justify-between">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl"
              >
                Quay lại
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-3d-light px-4 py-2 text-xs font-semibold text-slate-700 rounded-xl cursor-pointer"
            >
              Hủy
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && !title.trim()) {
                    alert('Vui lòng nhập tên đợt kiểm tra!');
                    return;
                  }
                  setStep((step + 1) as any);
                }}
                className="btn-3d-primary px-5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <span>Tiếp tục</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="btn-3d-emerald px-6 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Hoàn tất & Xuất bản đợt thi</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <ExamFileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onParsedQuestions={handleImportParsed}
      />
    </div>
  );
};
