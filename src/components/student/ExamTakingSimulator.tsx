import React, { useState, useEffect } from 'react';
import { 
  PlayCircle, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  Award, 
  Sparkles, 
  ChevronRight,
  Code2,
  Send,
  UserCheck,
  GraduationCap,
  ArrowRight,
  School,
  FileCheck2,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Exam, StudentSubmission, SchoolClass } from '../../types';
import { evaluateExamSubmission, SubmissionEvaluation } from '../../utils/gradingEngine';

interface ExamTakingSimulatorProps {
  exams: Exam[];
  classes?: SchoolClass[];
  selectedExamId?: string;
  onGradingConfigRequested?: (examId: string) => void;
  onSubmissionRecorded?: (submission: StudentSubmission) => void;
  onNavigateToResults?: () => void;
}

export const ExamTakingSimulator: React.FC<ExamTakingSimulatorProps> = ({
  exams,
  classes = [],
  selectedExamId,
  onGradingConfigRequested,
  onSubmissionRecorded,
  onNavigateToResults
}) => {
  const [currentId, setCurrentId] = useState<string>(selectedExamId || exams[0]?.id || '');
  const activeExam = exams.find(e => e.id === currentId) || exams[0];

  // Student profile entry state
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [studentId, setStudentId] = useState('');
  const [hasStarted, setHasStarted] = useState(false);

  // Answers state: { questionId: string answer }
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Timer state
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(
    (activeExam?.autoGradingConfig.durationMinutes || 45) * 60
  );
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<SubmissionEvaluation | null>(null);

  // Available classes for active exam grade
  const availableClasses = classes.length > 0 
    ? classes.filter(c => !activeExam?.gradeId || c.gradeId === activeExam.gradeId)
    : [
        { id: 'c1', name: '10A1', gradeId: '10', homeroomTeacher: '', studentCount: 40 },
        { id: 'c2', name: '10A2', gradeId: '10', homeroomTeacher: '', studentCount: 40 },
        { id: 'c3', name: '11A1', gradeId: '11', homeroomTeacher: '', studentCount: 40 },
        { id: 'c4', name: '11A2', gradeId: '11', homeroomTeacher: '', studentCount: 40 },
        { id: 'c5', name: '12A1', gradeId: '12', homeroomTeacher: '', studentCount: 40 },
        { id: 'c6', name: '12A2', gradeId: '12', homeroomTeacher: '', studentCount: 40 }
      ].filter(c => !activeExam?.gradeId || c.gradeId === activeExam.gradeId);

  // Default class selection
  useEffect(() => {
    if (availableClasses.length > 0 && (!studentClass || !availableClasses.some(c => c.name === studentClass))) {
      setStudentClass(availableClasses[0].name);
    }
  }, [availableClasses, studentClass]);

  // Sync when exam changes
  useEffect(() => {
    if (activeExam) {
      setTimeLeftSeconds(activeExam.autoGradingConfig.durationMinutes * 60);
      setAnswers({});
      setIsSubmitted(false);
      setEvaluation(null);
      setHasStarted(false);
    }
  }, [activeExam]);

  // Countdown timer effect
  useEffect(() => {
    if (!hasStarted || isSubmitted || timeLeftSeconds <= 0) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (activeExam?.autoGradingConfig.autoSubmitOnTime) {
            handleAutoSubmitOnTimeout();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, isSubmitted, timeLeftSeconds, activeExam]);

  const handleStartExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      alert('Vui lòng nhập họ và tên học sinh!');
      return;
    }
    if (!studentClass) {
      alert('Vui lòng chọn lớp học của em!');
      return;
    }
    setHasStarted(true);
  };

  const handleAutoSubmitOnTimeout = () => {
    if (!activeExam) return;
    const result = evaluateExamSubmission(activeExam.questions, answers, activeExam.autoGradingConfig);
    setEvaluation(result);
    setIsSubmitted(true);
    saveSubmission(result);
  };

  const handleSubmitExam = () => {
    if (!activeExam) return;
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < activeExam.questions.length) {
      if (!confirm(`Em mới trả lời ${answeredCount}/${activeExam.questions.length} câu hỏi. Em có chắc chắn muốn nộp bài thi ngay bây giờ?`)) {
        return;
      }
    }

    const result = evaluateExamSubmission(activeExam.questions, answers, activeExam.autoGradingConfig);
    setEvaluation(result);
    setIsSubmitted(true);
    saveSubmission(result);

    if (result.isPassed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  };

  const saveSubmission = (evalResult: SubmissionEvaluation) => {
    if (!activeExam) return;
    const durationUsed = (activeExam.autoGradingConfig.durationMinutes * 60) - timeLeftSeconds;
    
    const submissionRecord: StudentSubmission = {
      id: `sub-${Date.now()}`,
      examId: activeExam.id,
      gradeId: activeExam.gradeId,
      studentId: studentId.trim() || `HS${activeExam.gradeId}${Math.floor(100 + Math.random() * 900)}`,
      studentName: studentName.trim() || 'Học sinh',
      className: studentClass || `${activeExam.gradeId}A1`,
      submittedAt: new Date().toISOString(),
      durationSecondsUsed: Math.max(durationUsed, 60),
      totalScore: evalResult.totalEarnedScore,
      maxScore: evalResult.maxScore,
      answers: evalResult.items.map(item => ({
        questionId: item.questionId,
        studentAnswer: item.studentAnswer,
        isCorrect: item.isCorrect,
        earnedPoints: item.earnedPoints,
        feedback: item.feedback
      }))
    };

    if (onSubmissionRecorded) {
      onSubmissionRecorded(submissionRecord);
    }
  };

  const handleResetExam = () => {
    if (!activeExam) return;
    setTimeLeftSeconds(activeExam.autoGradingConfig.durationMinutes * 60);
    setAnswers({});
    setIsSubmitted(false);
    setEvaluation(null);
    setHasStarted(false);
  };

  if (!activeExam) {
    return (
      <div className="p-8 text-center text-slate-500">
        Chưa có bài kiểm tra nào được tạo.
      </div>
    );
  }

  // Format time MM:SS
  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const isTimeCritical = timeLeftSeconds < 300; // < 5 mins

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      {/* Simulator Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
            <PlayCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-emerald-700">Phòng thi Trực tuyến Tin học</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Chấm điểm Tự động</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Đợt thi: {activeExam.title} (Khối {activeExam.gradeId})
            </h3>
          </div>
        </div>

        {/* Exam switch & Reset */}
        <div className="flex items-center gap-3">
          <select
            value={currentId}
            onChange={(e) => {
              setCurrentId(e.target.value);
              setHasStarted(false);
            }}
            disabled={hasStarted && !isSubmitted}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-indigo-700 focus:outline-none"
          >
            {exams.map(e => (
              <option key={e.id} value={e.id}>
                {e.title} ({e.questions.length} câu)
              </option>
            ))}
          </select>

          <button
            onClick={handleResetExam}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Làm lại từ đầu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* STEP 1: Student Information Entrance Gate (If not started yet) */}
      {!hasStarted ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-8 max-w-xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Thông tin học sinh làm bài
            </h3>
            <p className="text-xs text-slate-500">
              Vui lòng điền đúng Họ tên và chọn đúng Lớp để kết quả bài làm được lưu tự động vào sổ điểm.
            </p>
          </div>

          <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-xs space-y-1.5 text-indigo-950">
            <div className="flex justify-between">
              <span className="text-slate-500">Bài kiểm tra:</span>
              <span className="font-bold text-slate-900">{activeExam.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Khối lớp:</span>
              <span className="font-bold text-slate-900">Tin học {activeExam.gradeId} THPT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Thời gian làm bài:</span>
              <span className="font-bold text-slate-900">{activeExam.autoGradingConfig.durationMinutes} phút ({activeExam.questions.length} câu)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Thang điểm tối đa:</span>
              <span className="font-bold text-emerald-700">{activeExam.autoGradingConfig.totalPoints} điểm</span>
            </div>
          </div>

          <form onSubmit={handleStartExam} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Tên học sinh <span className="text-rose-500">*</span>
                </label>
                {/* Check if current selected class has students */}
                {(() => {
                  const currentClsObj = classes.find(c => c.name === studentClass);
                  if (currentClsObj?.students && currentClsObj.students.length > 0) {
                    return (
                      <span className="text-[11px] text-indigo-600 font-bold">
                        (Có {currentClsObj.students.length} học sinh trong lớp)
                      </span>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* Datalist for autocomplete if student list exists */}
              <input
                type="text"
                list="class-students-list"
                value={studentName}
                onChange={(e) => {
                  const val = e.target.value;
                  setStudentName(val);
                  // Auto-fill studentId if matches
                  const currentClsObj = classes.find(c => c.name === studentClass);
                  const matched = currentClsObj?.students?.find(s => s.name.toLowerCase() === val.toLowerCase());
                  if (matched) {
                    setStudentId(matched.id);
                  }
                }}
                placeholder="Nhập hoặc chọn tên học sinh từ danh sách..."
                className="w-full px-4 py-2.5 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                autoFocus
              />

              <datalist id="class-students-list">
                {(() => {
                  const currentClsObj = classes.find(c => c.name === studentClass);
                  return (currentClsObj?.students || []).map(st => (
                    <option key={st.id} value={st.name}>
                      Mã: {st.id} - {st.gender || 'Nam'}
                    </option>
                  ));
                })()}
              </datalist>

              {/* Quick-click student chips if present */}
              {(() => {
                const currentClsObj = classes.find(c => c.name === studentClass);
                if (currentClsObj?.students && currentClsObj.students.length > 0) {
                  return (
                    <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                      <span className="text-[10px] text-slate-400 font-semibold">Chọn nhanh:</span>
                      {currentClsObj.students.slice(0, 6).map(st => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => {
                            setStudentName(st.name);
                            setStudentId(st.id);
                          }}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                            studentName === st.name
                              ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                          }`}
                        >
                          {st.name}
                        </button>
                      ))}
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Chọn Lớp <span className="text-rose-500">*</span>
                </label>
                <select
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-indigo-900"
                  required
                >
                  {availableClasses.map(c => (
                    <option key={c.id || c.name} value={c.name}>
                      Lớp {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mã học sinh (tùy chọn)
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder={`HS${activeExam.gradeId}01`}
                  className="w-full px-3.5 py-2.5 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-3d-primary py-3 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2"
            >
              <span>Bắt đầu làm bài kiểm tra</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <>
          {/* Floating Info Banner: Student Info & Timer */}
          <div className="sticky top-20 z-10 bg-slate-900 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Thí sinh: <strong>{studentName}</strong> (Lớp <span className="text-amber-300 font-bold">{studentClass}</span>)</span>
              <span className="hidden sm:inline text-slate-500">•</span>
              <span className="hidden sm:inline text-slate-400">Tin học {activeExam.gradeId}</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Timer Display */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-sm font-bold ${
                isTimeCritical ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 animate-pulse' : 'bg-slate-800 text-emerald-400 border border-slate-700'
              }`}>
                <Clock className="w-4 h-4" />
                <span>{isSubmitted ? 'ĐÃ NỘP' : formattedTime}</span>
              </div>

              {!isSubmitted && (
                <button
                  onClick={handleSubmitExam}
                  className="btn-3d-emerald px-4 py-1.5 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Nộp bài thi</span>
                </button>
              )}
            </div>
          </div>

          {/* Evaluation Results Card (If Submitted) */}
          {isSubmitted && evaluation && (
            <div className="bg-white rounded-2xl p-6 border-2 border-indigo-200 shadow-lg space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-md ${
                    evaluation.isPassed ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-rose-500 text-white shadow-rose-100'
                  }`}>
                    {evaluation.totalEarnedScore}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-extrabold text-slate-900">
                        Đã nộp bài & Lưu kết quả thành công!
                      </h3>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        evaluation.isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {evaluation.isPassed ? '✓ ĐẠT YÊU CẦU' : '✗ CHƯA ĐẠT'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Học sinh: <strong>{studentName}</strong> (Lớp {studentClass}) • Điểm số: <strong className="text-emerald-700">{evaluation.totalEarnedScore} / {evaluation.maxScore}đ</strong>
                    </p>
                    <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>Kết quả bài làm đã được lưu vào Sổ điểm Khối {activeExam.gradeId} - Lớp {studentClass}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onNavigateToResults && (
                    <button
                      type="button"
                      onClick={onNavigateToResults}
                      className="btn-3d-primary px-3.5 py-2 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Xem Sổ điểm Khối/Lớp
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleResetExam}
                    className="btn-3d-light px-4 py-2 text-xs font-bold text-slate-700 rounded-xl cursor-pointer"
                  >
                    Làm bài thi mới
                  </button>
                </div>
              </div>

              {/* Breakdown for each question */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Chi tiết câu trả lời & Lời giải tự động
                </h4>

                <div className="space-y-3">
                  {evaluation.items.map((item, idx) => {
                    const q = activeExam.questions.find(quest => quest.id === item.questionId);
                    return (
                      <div
                        key={item.questionId}
                        className={`p-4 rounded-xl border transition-all ${
                          item.isCorrect 
                            ? 'bg-emerald-50/40 border-emerald-200' 
                            : item.earnedPoints > 0 
                            ? 'bg-amber-50/40 border-amber-200' 
                            : 'bg-rose-50/40 border-rose-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-bold text-slate-900">
                            Câu {idx + 1}: {q?.questionText.substring(0, 70)}...
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              item.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              +{item.earnedPoints}đ / {item.maxPoints}đ
                            </span>
                            {item.isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-600" />
                            )}
                          </div>
                        </div>

                        <div className="text-xs space-y-1">
                          <div className="flex items-start gap-2">
                            <span className="text-slate-500">Học sinh trả lời:</span>
                            <span className="font-bold text-slate-900 font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">
                              {item.studentAnswer || '(Chưa làm)'}
                            </span>
                          </div>

                          {!item.isCorrect && (
                            <div className="flex items-start gap-2">
                              <span className="text-slate-500">Đáp án chuẩn:</span>
                              <span className="font-bold text-emerald-700 font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-200">
                                {item.correctAnswer}
                              </span>
                            </div>
                          )}

                          <div className="flex items-start gap-2">
                            <span className="text-slate-500">Nhận xét:</span>
                            <span className="text-slate-700 font-medium">
                              {item.feedback}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Question List */}
          <div className="space-y-6">
            {activeExam.questions.map((q, index) => {
              const currentAns = answers[q.id] || '';

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            {q.type === 'MULTIPLE_CHOICE' ? 'Trắc nghiệm' : q.type === 'CODE_FILL' ? 'Điền khuyết Code' : 'Lý thuyết ngắn'}
                          </span>
                          <span className="text-xs font-semibold text-slate-400">
                            ({q.points} điểm)
                          </span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 leading-relaxed">
                          {q.questionText}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Code Context if present */}
                  {q.codeContext && (
                    <div className="bg-slate-900 text-slate-100 rounded-xl p-3.5 font-mono text-xs overflow-x-auto border border-slate-800">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold mb-2 pb-1.5 border-b border-slate-800">
                        <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Mã nguồn thực hành ({q.codeLanguage || 'code'})</span>
                      </div>
                      <pre className="whitespace-pre">{q.codeContext}</pre>
                    </div>
                  )}

                  {/* Question Inputs */}
                  {q.type === 'MULTIPLE_CHOICE' && q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                      {q.options.map((opt) => {
                        const isSelected = currentAns === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt.id }))}
                            className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-50 border-indigo-600 text-indigo-950 shadow-2xs font-semibold'
                                : 'bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            } ${isSubmitted ? 'cursor-not-allowed opacity-90' : ''}`}
                          >
                            <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white border border-slate-300 text-slate-700'
                            }`}>
                              {opt.id}
                            </span>
                            <span className="text-xs self-center leading-snug">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {q.type !== 'MULTIPLE_CHOICE' && (
                    <div className="pt-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Câu trả lời của em:
                      </label>
                      <input
                        type="text"
                        disabled={isSubmitted}
                        value={currentAns}
                        onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                        placeholder={q.type === 'CODE_FILL' ? 'Nhập từ khóa, toán tử hoặc cú pháp code...' : 'Nhập câu trả lời ngắn...'}
                        className="w-full px-4 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Submit action */}
          {!isSubmitted && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="text-xs text-slate-500">
                Đã hoàn thành: <strong>{Object.keys(answers).length}</strong> / {activeExam.questions.length} câu hỏi.
              </div>

              <button
                type="button"
                onClick={handleSubmitExam}
                className="btn-3d-emerald px-6 py-2.5 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>Hoàn thành & Nộp bài kiểm tra</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
