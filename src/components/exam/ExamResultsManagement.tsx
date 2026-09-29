import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Award, 
  UserCheck, 
  Calendar,
  X,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { StudentSubmission, SchoolClass, Exam, GradeLevel } from '../../types';

interface ExamResultsManagementProps {
  submissions: StudentSubmission[];
  setSubmissions: React.Dispatch<React.SetStateAction<StudentSubmission[]>>;
  classes: SchoolClass[];
  exams: Exam[];
}

export const ExamResultsManagement: React.FC<ExamResultsManagementProps> = ({
  submissions,
  setSubmissions,
  classes,
  exams
}) => {
  const [selectedGrade, setSelectedGrade] = useState<'ALL' | GradeLevel>('ALL');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [selectedExamId, setSelectedExamId] = useState<string>('ALL');
  const [searchName, setSearchName] = useState<string>('');
  const [viewingSubmission, setViewingSubmission] = useState<StudentSubmission | null>(null);

  // Available classes according to selectedGrade
  const filteredClasses = classes.filter(c => selectedGrade === 'ALL' || c.gradeId === selectedGrade);

  // Filter submissions by Grade, Class, Exam, and Student Name
  const filteredSubmissions = submissions.filter(sub => {
    // Determine grade: sub.gradeId or find from class or exam
    let grade = sub.gradeId;
    if (!grade) {
      const cls = classes.find(c => c.name === sub.className);
      if (cls) grade = cls.gradeId;
      else {
        const ex = exams.find(e => e.id === sub.examId);
        if (ex) grade = ex.gradeId;
      }
    }

    if (selectedGrade !== 'ALL' && grade !== selectedGrade) return false;
    if (selectedClass !== 'ALL' && sub.className !== selectedClass) return false;
    if (selectedExamId !== 'ALL' && sub.examId !== selectedExamId) return false;
    if (searchName.trim() && !sub.studentName.toLowerCase().includes(searchName.toLowerCase())) return false;

    return true;
  });

  // Calculate statistics for filtered results
  const totalSubmissions = filteredSubmissions.length;
  const avgScore = totalSubmissions > 0
    ? (filteredSubmissions.reduce((sum, s) => sum + s.totalScore, 0) / totalSubmissions).toFixed(1)
    : '0.0';
  const passedCount = filteredSubmissions.filter(s => s.totalScore >= 5.0).length;
  const passRate = totalSubmissions > 0 ? Math.round((passedCount / totalSubmissions) * 100) : 0;
  const excellentCount = filteredSubmissions.filter(s => s.totalScore >= 8.0).length;

  const handleDeleteSubmission = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài làm của học sinh này?')) {
      setSubmissions(prev => prev.filter(s => s.id !== id));
      if (viewingSubmission?.id === id) setViewingSubmission(null);
    }
  };

  const handleExportCSV = () => {
    if (filteredSubmissions.length === 0) {
      alert('Không có dữ liệu bài làm để xuất!');
      return;
    }

    const headers = ['Mã HS,Họ tên,Lớp,Đợt thi,Thời gian nộp,Thời gian làm (phút),Điểm số,Xếp loại'];
    const rows = filteredSubmissions.map(s => {
      const exam = exams.find(e => e.id === s.examId);
      const examTitle = (exam?.title || s.examId).replace(/,/g, ' ');
      const durationMin = Math.round(s.durationSecondsUsed / 60);
      const gradeText = s.totalScore >= 8 ? 'Giỏi' : s.totalScore >= 6.5 ? 'Khá' : s.totalScore >= 5 ? 'Đạt' : 'Chưa đạt';
      return `"${s.studentId}","${s.studentName}","${s.className}","${examTitle}","${new Date(s.submittedAt).toLocaleString('vi-VN')}","${durationMin}","${s.totalScore}","${gradeText}"`;
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Ket_qua_kiem_tra_TinTHPT_${selectedGrade === 'ALL' ? 'ToanTruong' : 'Khoi' + selectedGrade}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Số bài đã nộp</p>
            <p className="text-xl font-extrabold text-slate-900">{totalSubmissions} <span className="text-xs font-normal text-slate-400">bài</span></p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Điểm trung bình</p>
            <p className="text-xl font-extrabold text-emerald-700">{avgScore} <span className="text-xs font-normal text-slate-400">/ 10</span></p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Tỷ lệ Đạt (≥ 5.0)</p>
            <p className="text-xl font-extrabold text-sky-700">{passRate}% <span className="text-xs font-normal text-slate-400">({passedCount} HS)</span></p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Điểm Giỏi (≥ 8.0)</p>
            <p className="text-xl font-extrabold text-purple-700">{excellentCount} <span className="text-xs font-normal text-slate-400">HS</span></p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Grade Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['ALL', '10', '11', '12'] as const).map(g => (
              <button
                key={g}
                type="button"
                onClick={() => {
                  setSelectedGrade(g);
                  setSelectedClass('ALL');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedGrade === g
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {g === 'ALL' ? 'Toàn trường' : `Khối ${g}`}
              </button>
            ))}
          </div>

          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">Tất cả lớp học</option>
            {filteredClasses.map(c => (
              <option key={c.id} value={c.name}>Lớp {c.name}</option>
            ))}
          </select>

          {/* Exam Filter */}
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-[220px] truncate"
          >
            <option value="ALL">Tất cả đợt kiểm tra</option>
            {exams.map(e => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>
        </div>

        {/* Right side: Search & Export */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Tìm tên học sinh..."
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-48"
            />
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="btn-3d-light px-3.5 py-2 text-xs font-bold text-emerald-800 rounded-xl flex items-center gap-1.5 cursor-pointer"
            title="Xuất file danh sách điểm ra định dạng Excel / CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Xuất Excel/CSV</span>
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Sổ điểm điện tử & Danh sách bài làm
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Có <strong>{filteredSubmissions.length}</strong> bài làm hợp lệ
          </span>
        </div>

        {filteredSubmissions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <FileSpreadsheet className="w-10 h-10 mx-auto opacity-30" />
            <p className="text-sm font-semibold text-slate-600">Chưa có kết quả bài làm nào trong danh mục lọc</p>
            <p className="text-xs">Khi học sinh hoàn thành kiểm tra và nộp bài, kết quả sẽ tự động lưu về đây theo từng Khối và Lớp.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5">Học sinh</th>
                  <th className="px-4 py-3.5">Lớp</th>
                  <th className="px-4 py-3.5">Đợt kiểm tra</th>
                  <th className="px-4 py-3.5">Thời gian nộp</th>
                  <th className="px-4 py-3.5">Thời lượng làm</th>
                  <th className="px-4 py-3.5 text-center">Điểm số</th>
                  <th className="px-4 py-3.5 text-center">Xếp loại</th>
                  <th className="px-4 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredSubmissions.map((sub) => {
                  const exam = exams.find(e => e.id === sub.examId);
                  const durationMin = Math.floor(sub.durationSecondsUsed / 60);
                  const durationSec = sub.durationSecondsUsed % 60;
                  const isPassed = sub.totalScore >= 5.0;

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
                            {sub.studentName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{sub.studentName}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{sub.studentId}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-slate-100 text-slate-800 border border-slate-200">
                          {sub.className}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 max-w-[200px] truncate" title={exam?.title || sub.examId}>
                        <p className="font-semibold text-slate-900 truncate">{exam?.title || 'Đợt kiểm tra'}</p>
                        <p className="text-[10px] text-indigo-600 font-bold uppercase">Tin học {exam?.gradeId || 'THPT'}</p>
                      </td>

                      <td className="px-4 py-3.5 text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{new Date(sub.submittedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} • {new Date(sub.submittedAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{durationMin}p {durationSec}s</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-lg font-black text-sm ${
                          sub.totalScore >= 8.0 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : sub.totalScore >= 5.0 
                            ? 'bg-sky-100 text-sky-800' 
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {sub.totalScore.toFixed(1)}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          isPassed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {isPassed ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3 text-rose-600" />}
                          {sub.totalScore >= 8 ? 'Giỏi' : sub.totalScore >= 6.5 ? 'Khá' : isPassed ? 'Đạt' : 'Chưa đạt'}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setViewingSubmission(sub)}
                            className="btn-3d-light px-2.5 py-1 text-[11px] font-bold text-indigo-700 rounded-lg inline-flex items-center gap-1 cursor-pointer"
                            title="Xem chi tiết các câu trả lời"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Chi tiết</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSubmission(sub.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Xóa bài nộp"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Submission Modal */}
      {viewingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  {viewingSubmission.studentName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-900">{viewingSubmission.studentName}</h4>
                  <p className="text-xs text-slate-500 font-medium">
                    Lớp {viewingSubmission.className} • Điểm số: <strong className="text-emerald-700">{viewingSubmission.totalScore} / {viewingSubmission.maxScore}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingSubmission(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Answer List */}
            <div className="p-6 overflow-y-auto space-y-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">Chi tiết từng câu trả lời:</h5>
              <div className="space-y-3">
                {viewingSubmission.answers.map((ans, idx) => (
                  <div
                    key={ans.questionId || idx}
                    className={`p-3.5 rounded-xl border ${
                      ans.isCorrect ? 'bg-emerald-50/30 border-emerald-200' : 'bg-rose-50/30 border-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-800">Câu hỏi #{idx + 1}</span>
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                        ans.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        +{ans.earnedPoints}đ
                      </span>
                    </div>
                    <p className="text-xs text-slate-700">
                      Học sinh chọn/điền: <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">{ans.studentAnswer || '(Không trả lời)'}</strong>
                    </p>
                    {ans.feedback && (
                      <p className="text-[11px] text-slate-500 mt-1 italic">
                        Đánh giá tự động: {ans.feedback}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingSubmission(null)}
                className="btn-3d-light px-4 py-2 text-xs font-bold text-slate-700 rounded-xl"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
