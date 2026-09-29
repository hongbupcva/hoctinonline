import React, { useState, useEffect } from 'react';
import { 
  X, 
  BookOpen, 
  Code2, 
  Check, 
  Plus, 
  Trash2, 
  Clock, 
  FileText, 
  Sparkles,
  Paperclip
} from 'lucide-react';
import { Lesson, Topic, GradeLevel } from '../../types';

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lesson: Lesson, topicId: string) => void;
  editingLesson?: Lesson | null;
  defaultTopicId?: string;
  topics: Topic[];
  currentGrade: GradeLevel;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingLesson,
  defaultTopicId,
  topics,
  currentGrade
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(defaultTopicId || (topics[0]?.id || ''));
  const [lessonNumber, setLessonNumber] = useState<number>(1);
  const [title, setTitle] = useState<string>('');
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [summary, setSummary] = useState<string>('');
  const [objectives, setObjectives] = useState<string[]>(['']);
  const [contentMarkdown, setContentMarkdown] = useState<string>('');
  
  // Code snippet
  const [hasCode, setHasCode] = useState<boolean>(false);
  const [codeLanguage, setCodeLanguage] = useState<'python' | 'html' | 'css' | 'sql'>('python');
  const [codeContent, setCodeContent] = useState<string>('');
  const [codeExplanation, setCodeExplanation] = useState<string>('');

  // Review questions
  const [reviewQuestions, setReviewQuestions] = useState<string[]>(['']);

  useEffect(() => {
    if (editingLesson) {
      setSelectedTopicId(editingLesson.topicId);
      setLessonNumber(editingLesson.lessonNumber);
      setTitle(editingLesson.title);
      setDurationMinutes(editingLesson.durationMinutes);
      setSummary(editingLesson.summary);
      setObjectives(editingLesson.objectives.length > 0 ? editingLesson.objectives : ['']);
      setContentMarkdown(editingLesson.contentMarkdown);
      if (editingLesson.codeSnippet) {
        setHasCode(true);
        setCodeLanguage(editingLesson.codeSnippet.language as any || 'python');
        setCodeContent(editingLesson.codeSnippet.code);
        setCodeExplanation(editingLesson.codeSnippet.explanation);
      } else {
        setHasCode(false);
        setCodeContent('');
        setCodeExplanation('');
      }
      setReviewQuestions(editingLesson.reviewQuestions && editingLesson.reviewQuestions.length > 0 ? editingLesson.reviewQuestions : ['']);
    } else {
      // Reset form
      setSelectedTopicId(defaultTopicId || (topics.find(t => t.gradeId === currentGrade)?.id || topics[0]?.id || ''));
      setLessonNumber(1);
      setTitle('');
      setDurationMinutes(45);
      setSummary('');
      setObjectives(['Nắm vững kiến thức trọng tâm SGK']);
      setContentMarkdown('### 1. Kiến thức trọng tâm\nNội dung lý thuyết...\n\n### 2. Thực hành & Ứng dụng\nHọc sinh tiến hành thao tác...');
      setHasCode(currentGrade === '10' || currentGrade === '11');
      setCodeLanguage(currentGrade === '10' ? 'python' : 'html');
      setCodeContent(currentGrade === '10' ? '# Lập trình Python\nprint("Hello World")' : '<h1>Trang Web Tin Học 11</h1>');
      setCodeExplanation('Minh họa thực thi câu lệnh theo SGK Kết nối tri thức.');
      setReviewQuestions(['Nêu các bước thực hiện thao tác trên máy tính?']);
    }
  }, [editingLesson, defaultTopicId, isOpen, currentGrade, topics]);

  if (!isOpen) return null;

  const handleAddObjective = () => {
    setObjectives([...objectives, '']);
  };

  const handleUpdateObjective = (index: number, val: string) => {
    const updated = [...objectives];
    updated[index] = val;
    setObjectives(updated);
  };

  const handleRemoveObjective = (index: number) => {
    setObjectives(objectives.filter((_, i) => i !== index));
  };

  const handleAddReviewQ = () => {
    setReviewQuestions([...reviewQuestions, '']);
  };

  const handleUpdateReviewQ = (index: number, val: string) => {
    const updated = [...reviewQuestions];
    updated[index] = val;
    setReviewQuestions(updated);
  };

  const handleRemoveReviewQ = (index: number) => {
    setReviewQuestions(reviewQuestions.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const cleanedObjectives = objectives.filter(o => o.trim() !== '');
    const cleanedReview = reviewQuestions.filter(q => q.trim() !== '');

    const newLesson: Lesson = {
      id: editingLesson ? editingLesson.id : `les-${Date.now()}`,
      topicId: selectedTopicId,
      lessonNumber: Number(lessonNumber),
      title: title.trim(),
      durationMinutes: Number(durationMinutes),
      summary: summary.trim(),
      objectives: cleanedObjectives.length > 0 ? cleanedObjectives : ['Nắm vững kiến thức bài học.'],
      contentMarkdown: contentMarkdown.trim(),
      codeSnippet: hasCode && codeContent.trim() ? {
        language: codeLanguage,
        code: codeContent.trim(),
        explanation: codeExplanation.trim()
      } : undefined,
      reviewQuestions: cleanedReview,
      attachments: editingLesson?.attachments || [
        {
          id: 'att-1',
          name: `Bai_Giang_Bai_${lessonNumber}_KNTT.pptx`,
          type: 'ppt',
          url: '#',
          size: '3.4 MB'
        }
      ],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    onSave(newLesson, selectedTopicId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {editingLesson ? 'Chỉnh sửa Nội dung Bài học' : 'Thêm Bài học Mới vào Chương trình'}
              </h2>
              <p className="text-xs text-slate-500">
                SGK Tin học THPT Kết nối tri thức với cuộc sống
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {/* Top row: Topic & Number & Duration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Thuộc Chủ đề <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {topics.map(t => (
                  <option key={t.id} value={t.id}>
                    [Lớp {t.gradeId}] {t.code}: {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số thứ tự bài (SGK) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Bài</span>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={lessonNumber}
                  onChange={(e) => setLessonNumber(parseInt(e.target.value) || 1)}
                  className="w-full pl-12 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Thời lượng tiết học
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value={45}>45 phút (1 tiết)</option>
                  <option value={90}>90 phút (2 tiết thực hành)</option>
                  <option value={135}>135 phút (3 tiết chuyên đề)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tên bài học <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Khởi tạo trang web bằng HTML"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-900"
            />
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tóm tắt nội dung bài học
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Mô tả ngắn gọn trọng tâm kiến thức và kỹ năng cần trang bị..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700"
            />
          </div>

          {/* Objectives */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Mục tiêu cần đạt (Yêu cầu cần đạt theo chương trình GDPT 2018)
              </label>
              <button
                type="button"
                onClick={handleAddObjective}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Thêm mục tiêu
              </button>
            </div>
            <div className="space-y-2">
              {objectives.map((obj, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 font-bold text-[10px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={obj}
                    onChange={(e) => handleUpdateObjective(idx, e.target.value)}
                    placeholder="VD: Sử dụng được thẻ tiêu đề và thẻ đoạn văn bản trong HTML."
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  {objectives.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveObjective(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Theory Markdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              Chi tiết bài giảng (Định dạng Markdown)
            </label>
            <textarea
              rows={5}
              value={contentMarkdown}
              onChange={(e) => setContentMarkdown(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
            />
          </div>

          {/* Code Snippet Box */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasCode}
                  onChange={(e) => setHasCode(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <Code2 className="w-4 h-4 text-indigo-600" />
                <span>Đính kèm Đoạn code mẫu / Thực hành lập trình</span>
              </label>

              {hasCode && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">Ngôn ngữ:</span>
                  <select
                    value={codeLanguage}
                    onChange={(e) => setCodeLanguage(e.target.value as any)}
                    className="px-2 py-1 text-xs font-semibold bg-white border border-slate-200 rounded-md"
                  >
                    <option value="python">Python</option>
                    <option value="html">HTML5</option>
                    <option value="css">CSS3</option>
                    <option value="sql">SQL</option>
                  </select>
                </div>
              )}
            </div>

            {hasCode && (
              <div className="space-y-3">
                <div>
                  <textarea
                    rows={4}
                    value={codeContent}
                    onChange={(e) => setCodeContent(e.target.value)}
                    placeholder="Nhập mã nguồn mẫu..."
                    className="w-full p-3 text-xs font-mono bg-slate-900 text-slate-100 rounded-lg border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={codeExplanation}
                    onChange={(e) => setCodeExplanation(e.target.value)}
                    placeholder="Giải thích tác dụng của đoạn code trên đối với bài học..."
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Review Questions */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Câu hỏi củng cố & Luyện tập cuối bài
              </label>
              <button
                type="button"
                onClick={handleAddReviewQ}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Thêm câu hỏi
              </button>
            </div>
            <div className="space-y-2">
              {reviewQuestions.map((q, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">Q{idx + 1}:</span>
                  <input
                    type="text"
                    value={q}
                    onChange={(e) => handleUpdateReviewQ(idx, e.target.value)}
                    placeholder="VD: Cấu trúc cơ bản của tệp HTML gồm những thẻ nào?"
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  {reviewQuestions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveReviewQ(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Paperclip className="w-3.5 h-3.5" />
            <span>Tự động đính kèm Slide bài giảng KNTT</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-3d-light px-4 py-2 text-xs font-semibold text-slate-700 rounded-xl cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="btn-3d-primary px-5 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              {editingLesson ? 'Lưu cập nhật' : 'Tạo bài học mới'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
