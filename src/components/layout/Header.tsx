import React from 'react';
import { Search, Bell, HelpCircle, Layers, CheckCircle2, UserCheck, GraduationCap } from 'lucide-react';
import { ActiveTab } from './Sidebar';
import { UserRole } from '../../types';

interface HeaderProps {
  activeTab: ActiveTab;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  searchQuery,
  setSearchQuery,
  userRole,
  setUserRole
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'learning':
        return {
          title: 'Học tập',
          desc: userRole === 'student' 
            ? 'Khám phá bài học và lý thuyết Tin học THPT theo SGK Kết nối tri thức với cuộc sống'
            : 'Cấu trúc 3 cấp: Khối lớp → Chủ đề → Bài học (SGK Tin học Kết nối tri thức với cuộc sống)'
        };
      case 'exams':
        return {
          title: userRole === 'student' ? 'Kiểm tra' : 'Kiểm tra, đánh giá',
          desc: userRole === 'student'
            ? 'Danh sách các đợt kiểm tra Tin học và kết quả bài làm của em'
            : 'Tạo đợt thi, phân bổ theo từng khối/lớp, upload đề và quản lý sổ điểm học sinh'
        };
      case 'auto-grading':
        return {
          title: 'Cài đặt Chấm điểm tự động (Auto-grading Settings)',
          desc: 'Cấu hình ma trận đáp án, chia đều điểm hoặc điểm tùy chỉnh, so khớp từ khóa đoạn code'
        };
      case 'simulator':
        return {
          title: 'Trải nghiệm Làm bài thi & Chấm điểm tức thời',
          desc: 'Mô phỏng góc nhìn học sinh nộp bài, đồng hồ đếm ngược và kiểm tra thuật toán tự chấm'
        };
      case 'classes':
        return {
          title: 'Lớp học & Phân bổ',
          desc: 'Quản lý khối 10, 11, 12, danh sách tên học sinh trong từng lớp và import file Excel'
        };
      case 'schema':
        return {
          title: 'Kiến trúc Cơ sở dữ liệu & Quy trình (User Flow)',
          desc: 'Mô hình dữ liệu quan hệ cho Grades, Topics, Lessons, Exams, Questions, Results'
        };
      default:
        return { title: 'EduTin THPT', desc: '' };
    }
  };

  const { title, desc } = getTabTitle();

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-3.5 sticky top-0 z-20 flex items-center justify-between shadow-2xs">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200/80 px-2.5 py-1 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            <span className="text-xs font-bold text-indigo-700">Học Tin cùng Cô Búp</span>
          </div>
          <span className="text-slate-300 font-light">|</span>
          <h1 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
            userRole === 'student'
              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
              : 'text-indigo-700 bg-indigo-50 border-indigo-200'
          }`}>
            {userRole === 'student' ? (
              <>
                <GraduationCap className="w-3 h-3 text-emerald-600" />
                <span>Góc nhìn Học sinh</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                <span>Quyền Giáo viên</span>
              </>
            )}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">{desc}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Search bar */}
        <div className="relative w-60 md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={userRole === 'student' ? 'Tìm bài học, bài kiểm tra...' : 'Tìm bài học, đợt thi, lớp học...'}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {/* Quick Role Toggle in Header */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setUserRole('teacher')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              userRole === 'teacher'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Chuyển sang chế độ Giáo viên"
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Giáo viên</span>
          </button>
          <button
            type="button"
            onClick={() => setUserRole('student')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              userRole === 'student'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Chuyển sang chế độ Học sinh"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Học sinh</span>
          </button>
        </div>

        {/* Quick notification */}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
          <button 
            title="Thông báo"
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1.5 right-1.5 ring-2 ring-white"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
