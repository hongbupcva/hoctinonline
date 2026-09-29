import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  Settings2, 
  PlayCircle, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  BarChart3,
  ExternalLink,
  ChevronRight,
  Filter,
  FileSpreadsheet,
  ListOrdered,
  GraduationCap
} from 'lucide-react';
import { Exam, SchoolClass, GradeLevel, StudentSubmission, UserRole } from '../../types';
import { ExamCreateModal } from './ExamCreateModal';
import { ExamResultsManagement } from './ExamResultsManagement';

interface ExamListProps {
  exams: Exam[];
  setExams: React.Dispatch<React.SetStateAction<Exam[]>>;
  classes: SchoolClass[];
  submissions: StudentSubmission[];
  setSubmissions: React.Dispatch<React.SetStateAction<StudentSubmission[]>>;
  onOpenAutoGrading: (examId: string) => void;
  onOpenSimulator: (examId: string) => void;
  searchQuery: string;
  userRole?: UserRole;
}

export const ExamList: React.FC<ExamListProps> = ({
  exams,
  setExams,
  classes,
  submissions,
  setSubmissions,
  onOpenAutoGrading,
  onOpenSimulator,
  searchQuery,
  userRole = 'teacher'
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'exams' | 'results'>('exams');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'ALL'>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filtered exams
  const filteredExams = exams.filter(ex => {
    if (selectedGrade !== 'ALL' && ex.gradeId !== selectedGrade) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ex.title.toLowerCase().includes(q) ||
        ex.code.toLowerCase().includes(q) ||
        ex.examType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSaveExam = (newExam: Exam) => {
    setExams([newExam, ...exams]);
    setIsCreateModalOpen(false);
  };

  const isStudent = userRole === 'student';

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className={`rounded-2xl p-5 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isStudent
          ? 'bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-800'
          : 'bg-gradient-to-r from-emerald-700 via-teal-800 to-cyan-800'
      }`}>
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/15 text-[11px] font-bold backdrop-blur-xs mb-1.5">
            {isStudent ? (
              <>
                <GraduationCap className="w-3.5 h-3.5 text-emerald-300" />
                <span>Giao diện Kiểm tra dành cho Học sinh</span>
              </>
            ) : (
              <>
                <CheckSquare className="w-3.5 h-3.5 text-emerald-300" />
                <span>Phân hệ Quản lý Kiểm tra & Đánh giá THPT</span>
              </>
            )}
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
            {isStudent ? 'Kiểm tra môn Tin học' : 'Kiểm tra, đánh giá'}
          </h2>
          <p className="text-xs text-emerald-100 max-w-2xl mt-1 leading-relaxed font-normal">
            {isStudent 
              ? 'Chọn bài kiểm tra của khối/lớp em để vào làm bài trực tuyến, hệ thống sẽ tự động chấm điểm và phản hồi kết quả ngay sau khi nộp.'
              : 'Tạo các bài kiểm tra 15 phút, giữa kỳ, học kỳ; phân bổ cụ thể theo từng khối và từng lớp; theo dõi sổ điểm điện tử của học sinh.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onOpenSimulator(exams[0]?.id || '')}
            className="btn-3d-light px-5 py-2.5 text-emerald-950 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
          >
            <PlayCircle className="w-4 h-4 text-emerald-600" />
            <span>{isStudent ? 'Bắt đầu làm bài thi' : 'Học sinh làm bài'}</span>
          </button>

          {!isStudent && (
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-3d-emerald px-4 py-2.5 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Tạo đợt kiểm tra mới</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-tabs for Teacher (Exam list vs Results) or Student results view */}
      {!isStudent && (
        <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
          <button
            type="button"
            onClick={() => setActiveSubTab('exams')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'exams'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>Danh sách Đợt kiểm tra ({exams.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('results')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'results'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Sổ điểm & Kết quả bài làm theo Khối/Lớp</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeSubTab === 'results' ? 'bg-white text-emerald-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {submissions.length} bài
            </span>
          </button>
        </div>
      )}

      {/* VIEW 1: Exam List */}
      {(isStudent || activeSubTab === 'exams') ? (
        <>
          {/* Filter bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-semibold text-slate-500">Lọc theo Khối:</span>
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                {['ALL', '10', '11', '12'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSelectedGrade(g as any)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      selectedGrade === g
                        ? 'bg-white text-emerald-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {g === 'ALL' ? 'Tất cả' : `Khối ${g}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Hiển thị <strong>{filteredExams.length}</strong> đợt kiểm tra
            </div>
          </div>

          {/* Exam Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredExams.map((exam) => {
              const assignedClasses = classes.filter(c => exam.targetClassIds.includes(c.id));
              const totalStudents = assignedClasses.reduce((acc, c) => acc + (c.students?.length || c.studentCount), 0);

              return (
                <div
                  key={exam.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    {/* Header tags */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Tin học {exam.gradeId}
                        </span>
                        <span className="text-xs font-bold text-slate-400 font-mono">
                          {exam.code}
                        </span>
                      </div>

                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        exam.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : exam.status === 'scheduled'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          exam.status === 'active' ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'
                        }`} />
                        {exam.status === 'active' ? 'Đang mở kiểm tra' : exam.status === 'scheduled' ? 'Đã lên lịch' : 'Bản nháp'}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {exam.title}
                    </h3>

                    {/* Assigned Classes */}
                    <div className="mt-3 flex items-start gap-2 text-xs text-slate-600">
                      <Users className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-800">Lớp được gán: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {assignedClasses.map(c => (
                            <span key={c.id} className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-medium text-[11px] border border-indigo-100">
                              {c.name}
                            </span>
                          ))}
                          {!isStudent && (
                            <span className="text-[11px] text-slate-500 font-normal self-center ml-1">
                              (Tổng: {totalStudents} học sinh)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Specs */}
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600 p-3 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Thời lượng: <strong>{exam.autoGradingConfig.durationMinutes} phút</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span>Số lượng: <strong>{exam.questions.length} câu hỏi</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Thang điểm: <strong>{exam.autoGradingConfig.totalPoints}đ</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Hình thức: <strong>Tự động chấm</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {!isStudent ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onOpenAutoGrading(exam.id)}
                          className="btn-3d-light px-3.5 py-2 text-xs font-semibold text-slate-800 rounded-xl flex items-center gap-1.5 cursor-pointer"
                        >
                          <Settings2 className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Cài đặt chấm tự động</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenSimulator(exam.id)}
                          className="btn-3d-primary px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                        >
                          <PlayCircle className="w-3.5 h-3.5 text-white" />
                          <span>Học sinh làm bài</span>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onOpenSimulator(exam.id)}
                        className="w-full btn-3d-emerald py-2.5 text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <PlayCircle className="w-4 h-4 text-white" />
                        <span>Vào làm bài thi trực tuyến ngay</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* VIEW 2: Results & Submissions Repository by Grade and Class (Teacher only) */
        <ExamResultsManagement
          submissions={submissions}
          setSubmissions={setSubmissions}
          classes={classes}
          exams={exams}
        />
      )}

      {!isStudent && (
        <ExamCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleSaveExam}
          classes={classes}
        />
      )}
    </div>
  );
};
