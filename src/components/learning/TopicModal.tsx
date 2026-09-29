import React, { useState } from 'react';
import { X, Check, FolderPlus, BookOpen } from 'lucide-react';
import { Topic, GradeLevel, BookDirection } from '../../types';

interface TopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (topic: Topic) => void;
  currentGrade: GradeLevel;
  existingCount: number;
}

export const TopicModal: React.FC<TopicModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentGrade,
  existingCount
}) => {
  const [gradeId, setGradeId] = useState<GradeLevel>(currentGrade || '10');
  const [code, setCode] = useState(`Chủ đề ${existingCount + 1}`);
  const [name, setName] = useState('');
  const [direction, setDirection] = useState<BookDirection>('ICT');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Vui lòng nhập tên chủ đề!');
      return;
    }

    const newTopic: Topic = {
      id: `topic-${gradeId.toLowerCase()}-${Date.now()}`,
      gradeId,
      code: code.trim() || `Chủ đề ${existingCount + 1}`,
      name: name.trim(),
      direction,
      description: description.trim() || `Chủ đề thuộc chương trình Tin học ${gradeId} Kết nối tri thức`,
      lessons: []
    };

    onSave(newTopic);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Thêm Chủ đề Mới
              </h3>
              <p className="text-xs text-slate-500">
                SGK Kết nối tri thức với cuộc sống
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Khối lớp <span className="text-rose-500">*</span>
              </label>
              <select
                value={gradeId}
                onChange={(e) => setGradeId(e.target.value as GradeLevel)}
                className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="10">Tin học 10</option>
                <option value="11">Tin học 11</option>
                <option value="12">Tin học 12</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mã / Ký hiệu chủ đề <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="VD: Chủ đề 1, Chủ đề A..."
                className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Định hướng môn học
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'ICT' as BookDirection, label: 'Tin học ứng dụng (ICT)', desc: 'Thiết kế Web, Đa phương tiện, Văn phòng số' },
                { id: 'CS' as BookDirection, label: 'Khoa học máy tính (CS)', desc: 'Thuật toán, Lập trình, Trí tuệ nhân tạo (AI)' }
              ].map((d) => (
                <button
                  type="button"
                  key={d.id}
                  onClick={() => setDirection(d.id)}
                  className={`px-3.5 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    direction === d.id
                      ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 shadow-xs font-bold border-b-2 border-b-indigo-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <p className="text-xs font-bold">{d.label}</p>
                  <p className="text-[10px] text-slate-500 font-normal mt-0.5">{d.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tên chủ đề <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Lập trình cơ bản với Python, Hệ cơ sở dữ liệu quan hệ..."
              className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mô tả ngắn gọn
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Giới thiệu nội dung trọng tâm của chủ đề theo chuẩn GDPT 2018..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-3d-light px-4 py-2 text-xs font-semibold text-slate-700 rounded-xl cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn-3d-primary px-5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Tạo chủ đề</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
