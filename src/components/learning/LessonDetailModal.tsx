import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Code2, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  HelpCircle,
  Edit,
  FolderOpen
} from 'lucide-react';
import { Lesson, Topic } from '../../types';

interface LessonDetailModalProps {
  lesson: Lesson | null;
  topic?: Topic | null;
  onClose: () => void;
  onEdit: (lesson: Lesson) => void;
}

export const LessonDetailModal: React.FC<LessonDetailModalProps> = ({
  lesson,
  topic,
  onClose,
  onEdit
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'content' | 'code' | 'review'>('content');

  if (!lesson) return null;

  const handleCopyCode = () => {
    if (lesson.codeSnippet?.code) {
      navigator.clipboard.writeText(lesson.codeSnippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <span className="font-bold text-sm">B{lesson.lessonNumber}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {topic?.code || 'Chủ đề'}: {topic?.name}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {lesson.durationMinutes} phút
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                Bài {lesson.lessonNumber}: {lesson.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(lesson)}
              className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1.5 border border-indigo-200"
            >
              <Edit className="w-3.5 h-3.5" /> Sửa bài học
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="px-6 border-b border-slate-200 bg-white flex gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('content')}
            className={`py-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'content'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" /> Nội dung bài giảng & Mục tiêu
          </button>

          {lesson.codeSnippet && (
            <button
              onClick={() => setActiveTab('code')}
              className={`py-3 border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === 'code'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Code2 className="w-4 h-4" /> Code mẫu & Thực hành
              <span className="text-[10px] uppercase font-bold bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded">
                {lesson.codeSnippet.language}
              </span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('review')}
            className={`py-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'review'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" /> Câu hỏi củng cố & Luyện tập
            {lesson.reviewQuestions && (
              <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 rounded-full">
                {lesson.reviewQuestions.length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Summary */}
              {lesson.summary && (
                <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-1">
                    Tóm tắt bài học
                  </h4>
                  <p className="text-xs text-indigo-950 leading-relaxed">{lesson.summary}</p>
                </div>
              )}

              {/* Objectives */}
              {lesson.objectives && lesson.objectives.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Yêu cầu cần đạt (Mục tiêu kiến thức & năng lực)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {lesson.objectives.map((obj, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200/70 text-xs text-slate-800">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span className="leading-snug">{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Markdown Content */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Chi tiết nội dung bài giảng
                </h4>
                <div className="prose prose-sm max-w-none bg-slate-50/50 p-5 rounded-xl border border-slate-200 text-xs leading-relaxed text-slate-800 font-sans space-y-3 whitespace-pre-wrap">
                  {lesson.contentMarkdown || 'Đang cập nhật nội dung chi tiết...'}
                </div>
              </div>

              {/* Attachments */}
              {lesson.attachments && lesson.attachments.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                    <FolderOpen className="w-4 h-4 text-amber-600" /> Tài liệu đính kèm
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {lesson.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-indigo-400 transition-colors cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 font-bold text-xs flex items-center justify-center">
                          PPT
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{att.name}</p>
                          <p className="text-[10px] text-slate-400">{att.size}</p>
                        </div>
                        <Download className="w-4 h-4 text-slate-400 hover:text-indigo-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'code' && lesson.codeSnippet && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-indigo-600" />
                    Mã nguồn minh họa ({lesson.codeSnippet.language.toUpperCase()})
                  </h4>
                  <p className="text-xs text-slate-500">{lesson.codeSnippet.explanation}</p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> Đã sao chép
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Sao chép code
                    </>
                  )}
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md">
                <div className="px-4 py-2 bg-slate-800/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>snippet.{lesson.codeSnippet.language === 'python' ? 'py' : lesson.codeSnippet.language === 'html' ? 'html' : 'css'}</span>
                  <span>UTF-8</span>
                </div>
                <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                  <code>{lesson.codeSnippet.code}</code>
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'review' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Hệ thống câu hỏi ôn tập & thảo luận
              </h4>
              {lesson.reviewQuestions && lesson.reviewQuestions.length > 0 ? (
                lesson.reviewQuestions.map((q, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{q}</p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Gợi ý: Dựa vào kiến thức các mục trong bài học để trả lời hoặc thực hành trên máy tính.
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">Chưa có câu hỏi ôn tập nào cho bài này.</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex items-center justify-between text-xs text-slate-500">
          <span>Cập nhật gần nhất: {lesson.updatedAt}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 font-semibold text-slate-700 rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
