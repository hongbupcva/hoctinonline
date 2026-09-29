import React, { useState } from 'react';
import { 
  Settings2, 
  CheckCircle2, 
  Sliders, 
  Clock, 
  Code2, 
  Shuffle, 
  Save, 
  Sparkles, 
  AlertCircle, 
  Plus, 
  Trash2, 
  TestTube2,
  FileCheck2,
  Eye,
  Check,
  RotateCcw
} from 'lucide-react';
import { Exam, Question, AutoGradingConfig, KeywordMatchingConfig } from '../../types';
import { evaluateKeywordAnswer } from '../../utils/gradingEngine';

interface AutoGradingSettingsProps {
  exams: Exam[];
  setExams: React.Dispatch<React.SetStateAction<Exam[]>>;
  currentExamId?: string;
  onNavigateToSimulator?: () => void;
}

export const AutoGradingSettings: React.FC<AutoGradingSettingsProps> = ({
  exams,
  setExams,
  currentExamId,
  onNavigateToSimulator
}) => {
  const [selectedExamId, setSelectedExamId] = useState<string>(currentExamId || exams[0]?.id || '');
  
  // Find current exam
  const currentExam = exams.find(e => e.id === selectedExamId) || exams[0];

  // Local state for configuration
  const [config, setConfig] = useState<AutoGradingConfig>(
    currentExam ? { ...currentExam.autoGradingConfig } : {
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
    }
  );

  // Local state for questions
  const [questions, setQuestions] = useState<Question[]>(currentExam ? [...currentExam.questions] : []);

  // Bulk answer key string
  const [bulkInput, setBulkInput] = useState<string>('');

  // Selected question for advanced keyword matching
  const [selectedKeywordQuestionId, setSelectedKeywordQuestionId] = useState<string>(() => {
    const codeOrTheory = currentExam?.questions.find(q => q.type === 'CODE_FILL' || q.type === 'THEORY_SHORT');
    return codeOrTheory ? codeOrTheory.id : (currentExam?.questions[0]?.id || '');
  });

  // Live tester state
  const [testStudentInput, setTestStudentInput] = useState<string>('src');
  const [testFeedback, setTestFeedback] = useState<any>(null);

  // Save notification toast
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // When changing exam
  const handleSelectExam = (examId: string) => {
    setSelectedExamId(examId);
    const target = exams.find(e => e.id === examId);
    if (target) {
      setConfig({ ...target.autoGradingConfig });
      setQuestions([...target.questions]);
      const codeOrTheory = target.questions.find(q => q.type === 'CODE_FILL' || q.type === 'THEORY_SHORT');
      setSelectedKeywordQuestionId(codeOrTheory ? codeOrTheory.id : (target.questions[0]?.id || ''));
      setTestFeedback(null);
    }
  };

  // Update quick answer key for a multiple-choice question
  const handleQuickKeyChange = (questionId: string, answer: string) => {
    setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, correctAnswer: answer } : q));
  };

  // Bulk Answer Key Parse: e.g. "1A 2B 3C 4D" or "A B C D" or "A, B, C, D"
  const handleApplyBulkKeys = () => {
    if (!bulkInput.trim()) return;

    // Tokens like "1A", "2B" or just "A", "B", "C"
    const cleaned = bulkInput.trim().toUpperCase().replace(/,/g, ' ');
    const tokens = cleaned.split(/\s+/).filter(Boolean);

    setQuestions(prev => {
      const updated = [...prev];
      tokens.forEach((tok, idx) => {
        // Match format 1A or just A
        const match = tok.match(/(?:(\d+)[-.:]?)?([A-D]|TRUE|FALSE)/i);
        if (match) {
          const qIndex = match[1] ? parseInt(match[1]) - 1 : idx;
          const ans = match[2].toUpperCase();
          if (updated[qIndex] && (updated[qIndex].type === 'MULTIPLE_CHOICE' || updated[qIndex].type === 'TRUE_FALSE')) {
            updated[qIndex] = { ...updated[qIndex], correctAnswer: ans };
          }
        }
      });
      return updated;
    });

    setBulkInput('');
  };

  // Change individual question points
  const handleQuestionPointsChange = (questionId: string, points: number) => {
    setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, points } : q));
  };

  // Active question for keyword matching
  const activeKeywordQuestion = questions.find(q => q.id === selectedKeywordQuestionId);

  // Update keyword matching config for selected question
  const handleUpdateKeywordConfig = (updates: Partial<KeywordMatchingConfig>) => {
    if (!activeKeywordQuestion) return;
    setQuestions(prev => prev.map(q => {
      if (q.id === selectedKeywordQuestionId) {
        const currentCfg = q.keywordConfig || {
          primaryKeywords: [q.correctAnswer],
          acceptableVariants: [],
          caseSensitive: false,
          ignoreWhitespace: true,
          partialMatchPercentage: 50
        };
        return {
          ...q,
          keywordConfig: { ...currentCfg, ...updates }
        };
      }
      return q;
    }));
  };

  // Add primary keyword
  const handleAddPrimaryKeyword = (kw: string) => {
    if (!kw.trim() || !activeKeywordQuestion) return;
    const current = activeKeywordQuestion.keywordConfig?.primaryKeywords || [activeKeywordQuestion.correctAnswer];
    if (!current.includes(kw.trim())) {
      handleUpdateKeywordConfig({ primaryKeywords: [...current, kw.trim()] });
    }
  };

  // Remove primary keyword
  const handleRemovePrimaryKeyword = (kw: string) => {
    if (!activeKeywordQuestion) return;
    const current = activeKeywordQuestion.keywordConfig?.primaryKeywords || [];
    handleUpdateKeywordConfig({ primaryKeywords: current.filter(k => k !== kw) });
  };

  // Add acceptable variant
  const handleAddVariant = (v: string) => {
    if (!v.trim() || !activeKeywordQuestion) return;
    const current = activeKeywordQuestion.keywordConfig?.acceptableVariants || [];
    if (!current.includes(v.trim())) {
      handleUpdateKeywordConfig({ acceptableVariants: [...current, v.trim()] });
    }
  };

  // Remove variant
  const handleRemoveVariant = (v: string) => {
    if (!activeKeywordQuestion) return;
    const current = activeKeywordQuestion.keywordConfig?.acceptableVariants || [];
    handleUpdateKeywordConfig({ acceptableVariants: current.filter(x => x !== v) });
  };

  // Run live test
  const handleRunTest = () => {
    if (!activeKeywordQuestion) return;
    const qPoints = config.gradingMode === 'EQUAL' && questions.length > 0
      ? config.totalPoints / questions.length
      : (activeKeywordQuestion.points || 1);

    const result = evaluateKeywordAnswer(
      testStudentInput,
      activeKeywordQuestion.correctAnswer,
      activeKeywordQuestion.keywordConfig,
      qPoints
    );
    setTestFeedback({ ...result, maxPoints: Math.round(qPoints * 100) / 100 });
  };

  // Save all settings to exam
  const handleSaveAll = () => {
    setExams(prev => prev.map(e => {
      if (e.id === selectedExamId) {
        return {
          ...e,
          autoGradingConfig: config,
          questions
        };
      }
      return e;
    }));

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Calculate sum of custom points
  const totalCustomPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);
  const isPointBalanced = Math.abs(totalCustomPoints - config.totalPoints) < 0.05;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-100">
            <Settings2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Cài đặt Chấm điểm Tự động (Auto-grading Engine)
              </h2>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Chuẩn GDPT 2018
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Thiết lập ma trận đáp án chuẩn, chế độ chia điểm và thuật toán so khớp từ khóa cho câu hỏi code Tin học.
            </p>
          </div>
        </div>

        {/* Exam Picker & Save Button */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <label className="text-[11px] font-bold uppercase text-slate-400 block">Đợt thi đang cấu hình:</label>
            <select
              value={selectedExamId}
              onChange={(e) => handleSelectExam(e.target.value)}
              className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {exams.map(ex => (
                <option key={ex.id} value={ex.id}>
                  [{ex.code}] {ex.title}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSaveAll}
            className="btn-3d-primary px-5 py-2.5 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Đã lưu thành công!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Lưu toàn bộ cài đặt</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 Cols): Thang điểm, Ngưỡng thời gian, Ma trận đáp án */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Cài đặt Thang điểm & Chế độ chia điểm */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                Cài đặt Thang điểm & Phân bổ điểm
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                Tổng số: <strong>{questions.length} câu hỏi</strong>
              </span>
            </div>

            {/* Mode selection radio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setConfig({ ...config, gradingMode: 'EQUAL' })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  config.gradingMode === 'EQUAL'
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-2xs'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">Chia đều điểm</span>
                  <input
                    type="radio"
                    name="gradingModeSelect"
                    checked={config.gradingMode === 'EQUAL'}
                    onChange={() => {}}
                    className="text-indigo-600"
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Mỗi câu nhận: <strong>{(config.totalPoints / (questions.length || 1)).toFixed(2)} điểm</strong> (Tổng thang: {config.totalPoints}đ)
                </p>
              </div>

              <div
                onClick={() => setConfig({ ...config, gradingMode: 'CUSTOM' })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  config.gradingMode === 'CUSTOM'
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-2xs'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">Tùy chỉnh điểm từng câu</span>
                  <input
                    type="radio"
                    name="gradingModeSelect"
                    checked={config.gradingMode === 'CUSTOM'}
                    onChange={() => {}}
                    className="text-indigo-600"
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Set điểm theo mức độ: Nhận biết, Thông hiểu, Vận dụng đoạn code ngắn.
                </p>
              </div>
            </div>

            {/* Custom Mode Point Sliders / Table */}
            {config.gradingMode === 'CUSTOM' && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Điểm số từng câu:</span>
                  <span className={`font-bold px-2 py-0.5 rounded ${isPointBalanced ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    Tổng hiện tại: {totalCustomPoints.toFixed(2)} / {config.totalPoints}đ {isPointBalanced ? '✓ Chuẩn' : '⚠️ Chưa khớp'}
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {questions.map((q, idx) => (
                    <div key={q.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 text-xs">
                      <div className="flex items-center gap-2 truncate max-w-[280px]">
                        <span className="font-bold text-indigo-700">Câu {idx + 1}:</span>
                        <span className="text-slate-600 truncate">{q.questionText}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          max="10"
                          value={q.points || 0}
                          onChange={(e) => handleQuestionPointsChange(q.id, parseFloat(e.target.value) || 0)}
                          className="w-16 px-2 py-1 text-center font-bold text-xs bg-slate-50 border border-slate-200 rounded-md"
                        />
                        <span className="text-[11px] text-slate-500">điểm</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total Points & Pass Score */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Thang điểm tối đa</label>
                <input
                  type="number"
                  value={config.totalPoints}
                  onChange={(e) => setConfig({ ...config, totalPoints: parseFloat(e.target.value) || 10 })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Điểm đạt yêu cầu (Pass)</label>
                <input
                  type="number"
                  value={config.passScore}
                  onChange={(e) => setConfig({ ...config, passScore: parseFloat(e.target.value) || 5 })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-emerald-700"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Cài đặt Ngưỡng thời gian & Quy tắc Thu bài */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Clock className="w-4 h-4 text-emerald-600" />
              Thiết lập Ngưỡng thời gian & Tự động thu bài
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Thời lượng làm bài thi (phút)
                </label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={config.durationMinutes}
                  onChange={(e) => setConfig({ ...config, durationMinutes: parseInt(e.target.value) || 45 })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số lần làm bài tối đa
                </label>
                <select
                  value={config.maxAttempts}
                  onChange={(e) => setConfig({ ...config, maxAttempts: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value={1}>1 lần duy nhất (Nghiêm ngặt)</option>
                  <option value={2}>2 lần (Lấy điểm cao nhất)</option>
                  <option value={99}>Không giới hạn (Luyện tập)</option>
                </select>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Tự động thu bài khi hết giờ</span>
                  <span className="text-[11px] text-slate-500">Đồng hồ đếm ngược về 00:00 hệ thống lập tức khóa và nộp bài làm của thí sinh</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.autoSubmitOnTime}
                  onChange={(e) => setConfig({ ...config, autoSubmitOnTime: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Shuffle className="w-3.5 h-3.5 text-indigo-600" />
                    Đảo trật tự câu hỏi & Đảo phương án A/B/C/D
                  </span>
                  <span className="text-[11px] text-slate-500">Tránh học sinh chép bài nhau khi ngồi cùng phòng máy tính</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.shuffleQuestions}
                  onChange={(e) => setConfig({ ...config, shuffleQuestions: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Hiển thị đáp án chuẩn & Lời giải sau khi nộp</span>
                  <span className="text-[11px] text-slate-500">Giúp học sinh đối chiếu kiến thức SGK ngay sau khi hoàn thành</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.allowReviewAfterSubmit}
                  onChange={(e) => setConfig({ ...config, allowReviewAfterSubmit: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>
            </div>
          </div>

          {/* Card 3: Ma trận Đáp án Chuẩn Trắc nghiệm (Answer Key Matrix) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-sky-600" />
                Ma trận Đáp án Chuẩn (Answer Key Grid)
              </h3>
              <span className="text-[11px] text-slate-400">Click chọn đáp án hoặc nhập nhanh</span>
            </div>

            {/* Quick Bulk Input */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="text-[11px] font-semibold text-slate-700 block">
                Nhập chuỗi đáp án hàng loạt (VD: 1A 2B 3D 4C hoặc A, B, D, C):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder="VD: 1A 2B 3D 4C hoặc A B D C"
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg uppercase font-mono"
                />
                <button
                  type="button"
                  onClick={handleApplyBulkKeys}
                  className="btn-3d-primary px-3.5 py-1.5 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Áp dụng nhanh
                </button>
              </div>
            </div>

            {/* Matrix of Questions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {questions.map((q, idx) => {
                const isMC = q.type === 'MULTIPLE_CHOICE';
                return (
                  <div key={q.id} className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">
                        Câu {idx + 1}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {isMC ? 'Trắc nghiệm' : 'Điền code/từ'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 line-clamp-1">{q.questionText}</p>

                    {/* Option Buttons */}
                    {isMC ? (
                      <div className="flex gap-1.5 pt-1">
                        {['A', 'B', 'C', 'D'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleQuickKeyChange(q.id, opt)}
                            className={`flex-1 py-1 text-xs font-bold rounded-md transition-all ${
                              q.correctAnswer.toUpperCase() === opt
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="pt-1 flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-semibold">Khóa chuẩn:</span>
                        <input
                          type="text"
                          value={q.correctAnswer}
                          onChange={(e) => handleQuickKeyChange(q.id, e.target.value)}
                          className="flex-1 px-2 py-1 text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): NÂNG CAO - Keyword Matching Form for Code & Theory */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border-2 border-indigo-100 shadow-sm space-y-5 sticky top-24">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-extrabold uppercase mb-1.5">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                Cài đặt Nâng cao
              </div>
              <h3 className="text-base font-bold text-slate-900">
                So khớp Từ khóa Đoạn Code (Keyword Matching)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Áp dụng cho câu hỏi điền khuyết code HTML/CSS/Python hoặc câu lý thuyết Tin học ngắn.
              </p>
            </div>

            {/* Question Selector for Keyword Matching */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Chọn câu hỏi cần cấu hình từ khóa:
              </label>
              <select
                value={selectedKeywordQuestionId}
                onChange={(e) => {
                  setSelectedKeywordQuestionId(e.target.value);
                  setTestFeedback(null);
                }}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {questions.map((q, idx) => (
                  <option key={q.id} value={q.id}>
                    Câu {idx + 1} ({q.type}): {q.questionText.slice(0, 38)}...
                  </option>
                ))}
              </select>
            </div>

            {activeKeywordQuestion && (
              <div className="space-y-4">
                {/* Code Context Preview if any */}
                {activeKeywordQuestion.codeContext && (
                  <div className="p-3 bg-slate-900 rounded-xl text-xs font-mono text-emerald-400">
                    <span className="text-[10px] text-slate-400 uppercase block mb-1">Đoạn code ngữ cảnh:</span>
                    <code>{activeKeywordQuestion.codeContext}</code>
                  </div>
                )}

                {/* Primary Keywords */}
                <div>
                  <label className="text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                    <span>1. Từ khóa chính xác (Primary Keywords):</span>
                    <span className="text-[10px] text-indigo-600">Đạt 100% điểm</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {(activeKeywordQuestion.keywordConfig?.primaryKeywords || [activeKeywordQuestion.correctAnswer]).map((kw, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold">
                        {kw}
                        <button
                          type="button"
                          onClick={() => handleRemovePrimaryKeyword(kw)}
                          className="hover:text-rose-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add Primary Keyword input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="newPrimaryKwInput"
                      placeholder="Thêm từ khóa chuẩn..."
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = (e.target as HTMLInputElement).value;
                          handleAddPrimaryKeyword(val);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('newPrimaryKwInput') as HTMLInputElement;
                        if (input) {
                          handleAddPrimaryKeyword(input.value);
                          input.value = '';
                        }
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                    >
                      Thêm
                    </button>
                  </div>
                </div>

                {/* Acceptable Variants / Synonyms */}
                <div>
                  <label className="text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                    <span>2. Biến thể chấp nhận (Synonyms / Tương đương):</span>
                    <span className="text-[10px] text-slate-500">vd: có dấu bằng, viết tắt</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {(activeKeywordQuestion.keywordConfig?.acceptableVariants || []).map((v, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-200 text-xs font-mono font-medium">
                        {v}
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(v)}
                          className="hover:text-rose-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="newVariantInput"
                      placeholder="Thêm biến thể..."
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = (e.target as HTMLInputElement).value;
                          handleAddVariant(val);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('newVariantInput') as HTMLInputElement;
                        if (input) {
                          handleAddVariant(input.value);
                          input.value = '';
                        }
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                    >
                      Thêm
                    </button>
                  </div>
                </div>

                {/* Regex & Matching Options */}
                <div className="space-y-2.5 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Biểu thức chính quy tùy chọn (Regex Pattern):
                    </label>
                    <input
                      type="text"
                      value={activeKeywordQuestion.keywordConfig?.regexPattern || ''}
                      onChange={(e) => handleUpdateKeywordConfig({ regexPattern: e.target.value })}
                      placeholder="VD: ^\s*src\s*$"
                      className="w-full px-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input
                        type="checkbox"
                        checked={activeKeywordQuestion.keywordConfig?.caseSensitive || false}
                        onChange={(e) => handleUpdateKeywordConfig({ caseSensitive: e.target.checked })}
                        className="rounded text-indigo-600"
                      />
                      <span>Phân biệt chữ hoa / thường (Case-sensitive)</span>
                    </label>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input
                        type="checkbox"
                        checked={activeKeywordQuestion.keywordConfig?.ignoreWhitespace !== false}
                        onChange={(e) => handleUpdateKeywordConfig({ ignoreWhitespace: e.target.checked })}
                        className="rounded text-indigo-600"
                      />
                      <span>Bỏ qua khoảng trắng thừa (Ignore extra spaces)</span>
                    </label>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700">Tỷ lệ điểm khi đúng một phần:</span>
                    <select
                      value={activeKeywordQuestion.keywordConfig?.partialMatchPercentage || 50}
                      onChange={(e) => handleUpdateKeywordConfig({ partialMatchPercentage: Number(e.target.value) })}
                      className="px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded font-semibold"
                    >
                      <option value={25}>25% số điểm</option>
                      <option value={50}>50% số điểm</option>
                      <option value={75}>75% số điểm</option>
                    </select>
                  </div>
                </div>

                {/* Interactive Live Tester Sandbox */}
                <div className="p-4 bg-slate-900 rounded-xl text-white space-y-3 shadow-inner">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                      <TestTube2 className="w-4 h-4" />
                      <span>Hộp Thử Nghiệm Thuật Toán (Live Sandbox)</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Kiểm tra tức thì</span>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1">
                      Giả lập câu trả lời của học sinh:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={testStudentInput}
                        onChange={(e) => setTestStudentInput(e.target.value)}
                        placeholder="Gõ thử câu trả lời..."
                        className="flex-1 px-3 py-1.5 text-xs font-mono bg-slate-800 border border-slate-700 rounded-lg text-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      />
                      <button
                        type="button"
                        onClick={handleRunTest}
                        className="btn-3d-emerald px-3.5 py-1.5 font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        Chấm thử
                      </button>
                    </div>
                  </div>

                  {/* Feedback result */}
                  {testFeedback && (
                    <div className={`p-3 rounded-lg border text-xs space-y-1 ${
                      testFeedback.isCorrect 
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200' 
                        : testFeedback.matchType === 'PARTIAL'
                        ? 'bg-amber-950/80 border-amber-500 text-amber-200'
                        : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    }`}>
                      <div className="flex items-center justify-between font-bold">
                        <span>
                          {testFeedback.isCorrect ? '✅ ĐẠT ĐIỂM TỐI ĐA' : testFeedback.matchType === 'PARTIAL' ? '⚠️ ĐẠT MỘT PHẦN' : '❌ SAI'}
                        </span>
                        <span>
                          {testFeedback.earnedPoints} / {testFeedback.maxPoints} điểm
                        </span>
                      </div>
                      <p className="text-[11px] opacity-90">{testFeedback.feedback}</p>
                      <div className="text-[10px] opacity-75 font-mono">
                        Kiểu khớp: {testFeedback.matchType}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick button to student simulation */}
            {onNavigateToSimulator && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onNavigateToSimulator}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-200"
                >
                  <Eye className="w-4 h-4 text-indigo-600" />
                  <span>Chuyển sang Chế độ Học sinh làm bài thử</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
