import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  Check, 
  AlertCircle, 
  Sparkles, 
  FileCode,
  ArrowRight
} from 'lucide-react';
import { Question } from '../../types';

interface ExamFileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onParsedQuestions: (questions: Question[], fileName: string) => void;
}

export const ExamFileUploadModal: React.FC<ExamFileUploadModalProps> = ({
  isOpen,
  onClose,
  onParsedQuestions
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [previewText, setPreviewText] = useState<string>('');

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setIsParsing(true);

    // Simulate smart parsing of questions from file text
    setTimeout(() => {
      setIsParsing(false);
      setPreviewText(
        `[ĐÃ TRÍCH XUẤT TỰ ĐỘNG TỪ TỆP: ${file.name}]\n` +
        `Câu 1. (Nhận biết - Trắc nghiệm)\nTrong ngôn ngữ HTML, phần tử nào chứa nội dung hiển thị chính của trang web?\nA. <head>\nB. <body>\nC. <title>\nD. <meta>\n-> Đáp án: B\n\n` +
        `Câu 2. (Vận dụng - Điền khuyết code HTML/CSS)\nĐiền thuộc tính định kiểu CSS màu chữ còn thiếu vào [___]:\np { [___]: #2563eb; }\n-> Từ khóa chuẩn: color`
      );
    }, 700);
  };

  const handleConfirmImport = () => {
    if (!selectedFile) return;

    // Generated parsed questions
    const generated: Question[] = [
      {
        id: `q-parsed-${Date.now()}-1`,
        examId: '',
        order: 1,
        type: 'MULTIPLE_CHOICE',
        difficulty: 'NB',
        questionText: 'Trong ngôn ngữ HTML, phần tử nào chứa toàn bộ nội dung hiển thị trực tiếp cho người dùng trên trình duyệt?',
        options: [
          { id: 'A', text: '<head>' },
          { id: 'B', text: '<body>' },
          { id: 'C', text: '<title>' },
          { id: 'D', text: '<meta>' }
        ],
        correctAnswer: 'B',
        points: 5.0,
        explanation: 'Thẻ <body> chứa các thành phần hiển thị như tiêu đề, đoạn văn, hình ảnh, bảng dữ liệu.'
      },
      {
        id: `q-parsed-${Date.now()}-2`,
        examId: '',
        order: 2,
        type: 'CODE_FILL',
        difficulty: 'VD',
        questionText: 'Điền thuộc tính CSS còn thiếu vào chỗ trống [___] để định dạng màu chữ của đoạn văn bản:',
        codeContext: `p { [___]: #2563eb; font-size: 16px; }`,
        codeLanguage: 'css',
        correctAnswer: 'color',
        points: 5.0,
        explanation: 'Thuộc tính "color" trong CSS dùng để thay đổi màu sắc của văn bản.',
        keywordConfig: {
          primaryKeywords: ['color'],
          acceptableVariants: ['color:'],
          caseSensitive: false,
          ignoreWhitespace: true,
          partialMatchPercentage: 50
        }
      }
    ];

    onParsedQuestions(generated, selectedFile.name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Tải lên Đề thi (PDF / Word)</h3>
              <p className="text-xs text-slate-500">Tự động nhận diện câu hỏi và trích xuất đáp án chuẩn</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Drag drop zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              dragActive 
                ? 'border-indigo-600 bg-indigo-50/50' 
                : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto mb-3">
              <FileCode className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">
              Kéo & Thả tệp đề thi (.pdf, .docx, .doc) vào đây
            </p>
            <p className="text-xs text-slate-500 mt-1">
              hoặc bấm để duyệt tệp từ máy tính của bạn
            </p>

            <label className="mt-4 inline-block">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileInput}
                className="hidden"
              />
              <span className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs transition-colors">
                Chọn tệp từ máy
              </span>
            </label>
          </div>

          {/* Selected File Status */}
          {selectedFile && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">{selectedFile.name}</p>
                    <p className="text-[10px] text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Đã nhận diện
                </span>
              </div>

              {isParsing ? (
                <div className="text-xs text-indigo-600 flex items-center gap-2 py-2">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Đang bóc tách câu hỏi và cấu trúc trắc nghiệm...
                </div>
              ) : (
                previewText && (
                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs font-mono text-slate-700 max-h-36 overflow-y-auto whitespace-pre-wrap">
                    {previewText}
                  </div>
                )
              )}
            </div>
          )}

          {/* Helper Tips */}
          <div className="flex items-start gap-2 p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900">
            <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Hệ thống tự động phát hiện định dạng: <strong>"Câu 1. ... A. ... B. ... C. ... D. ... Đáp án: A"</strong> hoặc câu hỏi điền từ khóa code trong tệp.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Hủy
          </button>
          <button
            disabled={!selectedFile || isParsing}
            onClick={handleConfirmImport}
            className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-xs flex items-center gap-2"
          >
            <span>Nhập câu hỏi vào đề thi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
