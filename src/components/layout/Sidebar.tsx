import React from 'react';
import { 
  BookOpen, 
  CheckSquare, 
  Settings2, 
  Database, 
  Users, 
  PlayCircle,
  Sparkles,
  School,
  GraduationCap,
  UserCheck
} from 'lucide-react';
import { UserRole } from '../../types';

export type ActiveTab = 'learning' | 'exams' | 'auto-grading' | 'simulator' | 'classes' | 'schema';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  examCount: number;
  lessonCount: number;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  examCount,
  lessonCount,
  userRole,
  setUserRole
}) => {
  // All navigation items
  const allMenuItems = [
    {
      id: 'learning' as ActiveTab,
      label: 'Học tập',
      sublabel: 'Khối 10, 11, 12 • SGK KNTT',
      icon: BookOpen,
      badge: lessonCount > 0 ? `${lessonCount} bài` : undefined,
      color: 'text-indigo-600',
      activeBg: 'bg-indigo-50 border-indigo-600 text-indigo-700',
      roles: ['teacher', 'student'] as UserRole[]
    },
    {
      id: 'exams' as ActiveTab,
      label: userRole === 'student' ? 'Kiểm tra' : 'Kiểm tra, đánh giá',
      sublabel: userRole === 'student' ? 'Vào thi & Xem kết quả' : 'Tạo đợt thi & Phân bổ lớp',
      icon: CheckSquare,
      badge: examCount > 0 ? `${examCount} đợt` : undefined,
      color: 'text-emerald-600',
      activeBg: 'bg-emerald-50 border-emerald-600 text-emerald-700',
      roles: ['teacher', 'student'] as UserRole[]
    },
    {
      id: 'auto-grading' as ActiveTab,
      label: 'Cài đặt Chấm điểm tự động',
      sublabel: 'Đáp án chuẩn & So khớp từ khóa',
      icon: Settings2,
      badge: 'Nâng cao',
      badgeColor: 'bg-amber-100 text-amber-800',
      color: 'text-amber-600',
      activeBg: 'bg-amber-50 border-amber-600 text-amber-700',
      roles: ['teacher'] as UserRole[]
    },
    {
      id: 'simulator' as ActiveTab,
      label: 'Thử nghiệm Làm bài & Chấm',
      sublabel: 'Mô phỏng Chấm live',
      icon: PlayCircle,
      badge: 'Live',
      badgeColor: 'bg-rose-100 text-rose-700 animate-pulse',
      color: 'text-rose-600',
      activeBg: 'bg-rose-50 border-rose-600 text-rose-700',
      roles: ['teacher'] as UserRole[]
    },
    {
      id: 'classes' as ActiveTab,
      label: 'Lớp học & Phân bổ',
      sublabel: 'Danh sách lớp & học sinh',
      icon: Users,
      color: 'text-blue-600',
      activeBg: 'bg-blue-50 border-blue-600 text-blue-700',
      roles: ['teacher'] as UserRole[]
    },
    {
      id: 'schema' as ActiveTab,
      label: 'Kiến trúc CSDL & User Flow',
      sublabel: 'ERD Schema, SQL & Quy trình',
      icon: Database,
      color: 'text-purple-600',
      activeBg: 'bg-purple-50 border-purple-600 text-purple-700',
      roles: ['teacher'] as UserRole[]
    }
  ];

  // Filter menu items by current active role:
  // When role is 'student', ONLY show 'learning' and 'exams'
  const visibleMenuItems = allMenuItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl logo-3d flex items-center justify-center text-white shrink-0 cursor-pointer select-none">
          <span className="font-black text-base tracking-tighter drop-shadow-sm font-sans">HB</span>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-slate-900 tracking-tight text-lg">EduTin</span>
            <span className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase bg-indigo-100 text-indigo-800 rounded-md badge-3d">THPT</span>
          </div>
          <p className="text-xs text-slate-500 font-medium truncate max-w-[170px]">SGK Kết nối tri thức</p>
        </div>
      </div>

      {/* Role Switcher Tab: Giáo viên / Học sinh */}
      <div className="p-3 bg-slate-50/80 border-b border-slate-100">
        <p className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider mb-1.5 px-1">
          Chế độ người dùng
        </p>
        <div className="grid grid-cols-2 p-1 bg-slate-200/70 rounded-xl gap-1">
          <button
            type="button"
            onClick={() => {
              setUserRole('teacher');
            }}
            className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              userRole === 'teacher'
                ? 'bg-white text-indigo-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Giáo viên</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setUserRole('student');
              // If current active tab is not visible to student, switch to learning
              if (activeTab !== 'learning' && activeTab !== 'exams') {
                setActiveTab('learning');
              }
            }}
            className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              userRole === 'student'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Học sinh</span>
          </button>
        </div>
      </div>

      {/* Program Academic Year Tag */}
      <div className="mx-4 mt-3 px-3 py-2 rounded-xl academic-tag-3d flex items-center gap-2 text-xs text-slate-700 cursor-default">
        <div className="w-5 h-5 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
          <School className="w-3 h-3 text-indigo-600" />
        </div>
        <span className="truncate font-semibold text-[11px]">Năm học 2026 - 2027 • GDPT 2018</span>
      </div>

      {/* Nav List */}
      <nav className="p-3 space-y-1.5 flex-1">
        <div className="px-3 pt-2 pb-1 text-[11px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center justify-between">
          <span>{userRole === 'student' ? 'Giao diện Học sinh' : 'Phân hệ Quản lý Giáo viên'}</span>
          {userRole === 'student' && (
            <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-bold">2 mục</span>
          )}
        </div>

        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-3.5 py-3 rounded-2xl text-sm font-medium transition-all flex items-center gap-3 cursor-pointer ${
                isActive
                  ? 'sidebar-3d-active font-bold text-indigo-950'
                  : 'sidebar-3d-idle text-slate-700 hover:text-slate-950'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all ${
                isActive 
                  ? userRole === 'student' 
                    ? 'bg-gradient-to-tr from-emerald-600 to-teal-700 text-white shadow-sm border-b-2 border-emerald-900'
                    : 'bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white shadow-sm border-b-2 border-indigo-900' 
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`truncate ${isActive ? 'text-indigo-950 font-bold' : 'text-slate-800 font-semibold'}`}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold badge-3d ${
                        item.badgeColor || (isActive ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-700 border-slate-200')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 font-normal truncate mt-0.5">{item.sublabel}</p>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Role-specific Notice Card */}
      {userRole === 'student' ? (
        <div className="p-3.5 bg-emerald-50/80 m-3 rounded-2xl border border-emerald-200 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 mb-1">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>Chế độ Học sinh</span>
          </div>
          <p className="text-[11px] text-emerald-800 leading-relaxed font-normal">
            Học sinh được học lý thuyết Tin học KNTT khối 10, 11, 12 và trực tiếp vào làm các bài kiểm tra được gán.
          </p>
        </div>
      ) : (
        <div className="p-3.5 bg-slate-50 m-3 rounded-2xl border border-slate-200 border-b-2 border-b-slate-300 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Quyền hạn Giáo viên</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
            Toàn quyền quản lý học tập, đề thi, cài đặt chấm tự động, phân bổ lớp và sổ điểm điện tử.
          </p>
        </div>
      )}

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-200 flex items-center gap-3 bg-white">
        <div className={`w-10 h-10 rounded-xl font-bold text-xs flex items-center justify-center shadow-xs shrink-0 text-white ${
          userRole === 'student'
            ? 'bg-gradient-to-tr from-emerald-600 to-teal-700 border-b-2 border-emerald-900'
            : 'bg-gradient-to-tr from-indigo-600 to-indigo-700 border-b-2 border-indigo-900'
        }`}>
          {userRole === 'student' ? 'HS' : 'GV'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-900 truncate">
            {userRole === 'student' ? 'Học sinh THPT' : 'Cô Cao Thị Hồng Búp'}
          </p>
          <p className="text-[11px] text-slate-500 truncate font-medium">
            {userRole === 'student' ? 'Quyền truy cập: Học tập, Kiểm tra' : 'Giáo viên phụ trách môn Tin'}
          </p>
        </div>
      </div>
    </aside>
  );
};
