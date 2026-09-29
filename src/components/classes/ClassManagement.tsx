import React, { useState, useRef } from 'react';
import { 
  Users, 
  Plus, 
  School, 
  Search, 
  Trash2, 
  Edit3, 
  Eye, 
  UserCheck, 
  Check, 
  X, 
  Filter,
  GraduationCap,
  Sparkles,
  Award,
  BookOpen,
  Calendar,
  AlertTriangle,
  Upload,
  FileSpreadsheet,
  Download,
  UserPlus,
  ArrowRight,
  UserMinus
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { SchoolClass, GradeLevel, Student } from '../../types';

interface ClassManagementProps {
  classes: SchoolClass[];
  setClasses: React.Dispatch<React.SetStateAction<SchoolClass[]>>;
}

export const ClassManagement: React.FC<ClassManagementProps> = ({
  classes,
  setClasses
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingClass, setViewingClass] = useState<SchoolClass | null>(null);
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);
  const [deletingClassId, setDeletingClassId] = useState<string | null>(null);

  // Student list modal / import modal for a specific class
  const [managingStudentsClass, setManagingStudentsClass] = useState<SchoolClass | null>(null);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentId, setNewStudentId] = useState('');
  const [newStudentGender, setNewStudentGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Excel import status & error
  const [excelImportSuccess, setExcelImportSuccess] = useState<string | null>(null);
  const [excelImportError, setExcelImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states for Add / Edit Class
  const [formGrade, setFormGrade] = useState<GradeLevel>('10');
  const [formName, setFormName] = useState('');
  const [formTeacher, setFormTeacher] = useState('');
  const [formStudentCount, setFormStudentCount] = useState<number>(40);

  const filtered = classes.filter(c => {
    if (selectedGrade !== 'ALL' && c.gradeId !== selectedGrade) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.homeroomTeacher.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        (c.students && c.students.some(s => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)))
      );
    }
    return true;
  });

  // Open Add Class Modal
  const handleOpenAdd = () => {
    setFormGrade(selectedGrade === 'ALL' ? '10' : selectedGrade);
    setFormName('');
    setFormTeacher('');
    setFormStudentCount(40);
    setIsAddModalOpen(true);
  };

  // Open Edit Class Modal
  const handleOpenEdit = (cls: SchoolClass) => {
    setEditingClass(cls);
    setFormGrade(cls.gradeId);
    setFormName(cls.name);
    setFormTeacher(cls.homeroomTeacher);
    setFormStudentCount(cls.students ? cls.students.length : cls.studentCount);
  };

  // Save Add Class
  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Vui lòng nhập tên lớp học!');
      return;
    }

    const newId = `${formGrade}A${Date.now().toString().slice(-4)}`;
    const newClass: SchoolClass = {
      id: newId,
      gradeId: formGrade,
      name: formName.trim(),
      homeroomTeacher: formTeacher.trim() || 'Chưa phân công',
      studentCount: Number(formStudentCount) || 40,
      students: []
    };

    setClasses(prev => [newClass, ...prev]);
    setIsAddModalOpen(false);
  };

  // Save Edit Class
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass) return;
    if (!formName.trim()) {
      alert('Vui lòng nhập tên lớp học!');
      return;
    }

    setClasses(prev => prev.map(c => {
      if (c.id === editingClass.id) {
        return {
          ...c,
          gradeId: formGrade,
          name: formName.trim(),
          homeroomTeacher: formTeacher.trim() || 'Chưa phân công',
          studentCount: Number(formStudentCount) || (c.students ? c.students.length : 40)
        };
      }
      return c;
    }));

    setEditingClass(null);
  };

  // Confirm Delete Class
  const handleConfirmDelete = () => {
    if (!deletingClassId) return;
    setClasses(prev => prev.filter(c => c.id !== deletingClassId));
    setDeletingClassId(null);
    if (viewingClass?.id === deletingClassId) setViewingClass(null);
    if (managingStudentsClass?.id === deletingClassId) setManagingStudentsClass(null);
  };

  // Student Management handlers inside a Class
  const handleOpenStudentManagement = (cls: SchoolClass) => {
    setManagingStudentsClass(cls);
    setNewStudentName('');
    setNewStudentId(`HS${cls.gradeId}${Math.floor(100 + Math.random() * 900)}`);
    setNewStudentGender('Nam');
    setEditingStudent(null);
    setExcelImportSuccess(null);
    setExcelImportError(null);
  };

  const handleAddStudentToClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingStudentsClass || !newStudentName.trim()) return;

    const studentToAdd: Student = {
      id: newStudentId.trim() || `HS${managingStudentsClass.gradeId}${Date.now().toString().slice(-3)}`,
      name: newStudentName.trim(),
      gender: newStudentGender,
      dob: ''
    };

    const updatedStudents = [...(managingStudentsClass.students || []), studentToAdd];
    const updatedClass = {
      ...managingStudentsClass,
      students: updatedStudents,
      studentCount: updatedStudents.length
    };

    setClasses(prev => prev.map(c => c.id === updatedClass.id ? updatedClass : c));
    setManagingStudentsClass(updatedClass);
    setNewStudentName('');
    setNewStudentId(`HS${managingStudentsClass.gradeId}${Math.floor(100 + Math.random() * 900)}`);
  };

  const handleDeleteStudentFromClass = (studentIdToDelete: string) => {
    if (!managingStudentsClass) return;
    if (!confirm('Bạn có chắc chắn muốn xóa học sinh này khỏi danh sách lớp?')) return;

    const updatedStudents = (managingStudentsClass.students || []).filter(s => s.id !== studentIdToDelete);
    const updatedClass = {
      ...managingStudentsClass,
      students: updatedStudents,
      studentCount: updatedStudents.length
    };

    setClasses(prev => prev.map(c => c.id === updatedClass.id ? updatedClass : c));
    setManagingStudentsClass(updatedClass);
  };

  const handleSaveEditStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingStudentsClass || !editingStudent || !editingStudent.name.trim()) return;

    const updatedStudents = (managingStudentsClass.students || []).map(s => 
      s.id === editingStudent.id ? editingStudent : s
    );
    const updatedClass = {
      ...managingStudentsClass,
      students: updatedStudents,
      studentCount: updatedStudents.length
    };

    setClasses(prev => prev.map(c => c.id === updatedClass.id ? updatedClass : c));
    setManagingStudentsClass(updatedClass);
    setEditingStudent(null);
  };

  // Import Excel (.xlsx, .xls, .csv)
  const handleExcelFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !managingStudentsClass) return;

    setExcelImportSuccess(null);
    setExcelImportError(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const rawData: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });

        if (!rawData || rawData.length === 0) {
          setExcelImportError('Tệp Excel trống hoặc không có dữ liệu hợp lệ.');
          return;
        }

        // Parse rows. Header might be in row 0 or 1
        const importedStudents: Student[] = [];
        let startIndex = 0;

        // Check if row 0 has strings like "họ tên", "tên", "name", "mã"
        const headerRow = (rawData[0] || []).map((col: any) => String(col || '').toLowerCase());
        if (headerRow.some((col: string) => col.includes('tên') || col.includes('họ') || col.includes('name') || col.includes('mã') || col.includes('stt'))) {
          startIndex = 1;
        }

        for (let i = startIndex; i < rawData.length; i++) {
          const row = rawData[i];
          if (!row || row.length === 0) continue;

          // Look for name in columns
          let sName = '';
          let sId = '';
          let sGender: 'Nam' | 'Nữ' = 'Nam';
          let sDob = '';

          // Find values: usually col 0: STT or ID, col 1: Name or ID, col 2: Name or Gender
          const strings = row.map((cell: any) => String(cell || '').trim()).filter((c: string) => c !== '');
          if (strings.length === 0) continue;

          // If standard layout: [STT, Mã HS, Họ và tên, Giới tính, Ngày sinh] or [Mã, Tên] or [Họ tên]
          if (strings.length >= 2) {
            // Check if first column looks like ID (HS... or number)
            if (/^(HS|\d+)/i.test(strings[0])) {
              sId = strings[0].startsWith('HS') ? strings[0] : `HS${managingStudentsClass.gradeId}${strings[0].padStart(2, '0')}`;
              sName = strings[1];
              if (strings[2]) {
                const g = strings[2].toLowerCase();
                sGender = g.includes('nữ') || g.includes('nu') || g.includes('female') ? 'Nữ' : 'Nam';
              }
              if (strings[3]) sDob = strings[3];
            } else {
              sName = strings[0];
              sId = strings[1];
            }
          } else {
            sName = strings[0];
            sId = `HS${managingStudentsClass.gradeId}${Math.floor(100 + Math.random() * 900)}`;
          }

          if (sName && sName.length > 1 && !/^(họ tên|họ và tên|name|stt|mã hs)$/i.test(sName)) {
            importedStudents.push({
              id: sId || `HS${managingStudentsClass.gradeId}${Math.floor(100 + Math.random() * 900)}`,
              name: sName,
              gender: sGender,
              dob: sDob
            });
          }
        }

        if (importedStudents.length === 0) {
          setExcelImportError('Không tìm thấy học sinh nào trong tệp. Vui lòng kiểm tra định dạng cột (Cột 1: Mã HS, Cột 2: Họ và tên, Cột 3: Giới tính).');
          return;
        }

        // Merge with existing students, avoiding exact duplicate IDs
        const existingList = managingStudentsClass.students || [];
        const mergedList = [...existingList];
        
        importedStudents.forEach(imp => {
          if (!mergedList.some(ex => ex.id === imp.id && ex.name === imp.name)) {
            mergedList.push(imp);
          }
        });

        const updatedClass = {
          ...managingStudentsClass,
          students: mergedList,
          studentCount: mergedList.length
        };

        setClasses(prev => prev.map(c => c.id === updatedClass.id ? updatedClass : c));
        setManagingStudentsClass(updatedClass);
        setExcelImportSuccess(`Đã import thành công ${importedStudents.length} học sinh từ file Excel! Sĩ số lớp hiện tại: ${mergedList.length}.`);

        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (err: any) {
        setExcelImportError('Lỗi đọc file Excel: ' + (err?.message || 'Định dạng file không được hỗ trợ.'));
      }
    };
    reader.readAsBinaryString(file);
  };

  // Download template Excel file
  const handleDownloadSampleExcel = () => {
    if (!managingStudentsClass) return;

    const data = [
      ['STT', 'Mã Học Sinh', 'Họ và Tên', 'Giới Tính', 'Ngày Sinh'],
      [1, `HS${managingStudentsClass.gradeId}01`, 'Nguyễn Văn An', 'Nam', '2010-01-15'],
      [2, `HS${managingStudentsClass.gradeId}02`, 'Trần Thị Mai', 'Nữ', '2010-04-20'],
      [3, `HS${managingStudentsClass.gradeId}03`, 'Lê Hoàng Long', 'Nam', '2010-09-08'],
      [4, `HS${managingStudentsClass.gradeId}04`, 'Phạm Thùy Linh', 'Nữ', '2010-11-25']
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DanhSachHocSinh');
    XLSX.writeFile(wb, `Mau_Danh_Sach_Hoc_Sinh_${managingStudentsClass.name.replace(/\s+/g, '_')}.xlsx`);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-800 rounded-2xl p-5 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
            Lớp học & Phân bổ
          </h2>
          <p className="text-xs text-blue-100 max-w-2xl mt-1 leading-relaxed font-normal">
            Quản lý các lớp học THPT và danh sách tên học sinh trong từng lớp; hỗ trợ xem chi tiết, thêm, sửa, xóa học sinh và import hàng loạt từ file Excel.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn-3d-light px-5 py-2.5 text-blue-900 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md shrink-0"
        >
          <Plus className="w-4 h-4 text-blue-700" />
          <span>Thêm lớp học mới</span>
        </button>
      </div>

      {/* Filter and stats */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            {(['ALL', '10', '11', '12'] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGrade(g)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  selectedGrade === g
                    ? 'bg-white text-blue-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {g === 'ALL' ? 'Toàn trường' : `Khối ${g}`}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên lớp, tên học sinh, GVCN..."
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Hiển thị <strong>{filtered.length}</strong> lớp học (Tổng sĩ số: <strong>{filtered.reduce((acc, c) => acc + (c.students?.length || c.studentCount), 0)}</strong> học sinh)
        </div>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filtered.map((cls) => {
          const currentCount = cls.students ? cls.students.length : cls.studentCount;

          return (
            <div
              key={cls.id}
              className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                {/* Badge & Action Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Tin học {cls.gradeId}
                  </span>

                  <span className="text-[11px] text-slate-400 font-mono font-medium">
                    {cls.id}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {cls.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>GVCN: <strong className="text-slate-700">{cls.homeroomTeacher}</strong></span>
                  </p>
                </div>

                {/* Students list preview in card */}
                <div className="mt-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1.5 font-bold text-slate-800">
                      <Users className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Sĩ số: {currentCount} học sinh</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenStudentManagement(cls)}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Quản lý tên HS</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Student names tags preview */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(cls.students && cls.students.length > 0) ? (
                      cls.students.slice(0, 4).map(st => (
                        <span key={st.id} className="text-[10px] bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-700 font-medium">
                          {st.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">Chưa nhập danh sách chi tiết</span>
                    )}
                    {cls.students && cls.students.length > 4 && (
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded-md">
                        +{cls.students.length - 4} HS
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 4 Action Buttons on each class: Xem, Thêm (HS/Lớp), Sửa, Xóa */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                <button
                  type="button"
                  onClick={() => setViewingClass(cls)}
                  className="btn-3d-light px-2.5 py-1.5 text-xs font-bold text-slate-700 rounded-lg flex items-center gap-1 cursor-pointer flex-1 justify-center"
                  title="Xem thông tin chi tiết lớp học"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Xem</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenStudentManagement(cls)}
                  className="btn-3d-light px-2.5 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50/80 rounded-lg flex items-center gap-1 cursor-pointer flex-1 justify-center"
                  title="Thêm & Quản lý tên học sinh trong lớp"
                >
                  <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Học sinh</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenEdit(cls)}
                  className="btn-3d-light px-2.5 py-1.5 text-xs font-bold text-slate-700 rounded-lg flex items-center gap-1 cursor-pointer flex-1 justify-center"
                  title="Chỉnh sửa thông tin lớp"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Sửa</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeletingClassId(cls.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Xóa lớp học"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: QUẢN LÝ TÊN HỌC SINH TRONG LỚP & IMPORT FILE EXCEL */}
      {managingStudentsClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Danh sách học sinh • Lớp {managingStudentsClass.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Khối {managingStudentsClass.gradeId} THPT • GVCN: {managingStudentsClass.homeroomTeacher} • Sĩ số: <strong className="text-indigo-600">{managingStudentsClass.students?.length || 0} học sinh</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setManagingStudentsClass(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Excel Import Bar & Sample Download */}
            <div className="p-4 bg-emerald-50/60 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <p className="text-xs font-extrabold text-emerald-950">
                    Import danh sách học sinh từ file Excel (.xlsx, .xls, .csv)
                  </p>
                  <p className="text-[11px] text-emerald-800">
                    Tự động nhận diện cột: Mã học sinh, Họ và tên, Giới tính, Ngày sinh.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadSampleExcel}
                  className="btn-3d-light px-3 py-1.5 text-xs font-bold text-emerald-900 rounded-xl flex items-center gap-1.5 cursor-pointer bg-white"
                  title="Tải tệp Excel mẫu để điền thông tin"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tải file mẫu Excel</span>
                </button>

                <label className="btn-3d-emerald px-3.5 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs">
                  <Upload className="w-3.5 h-3.5 text-white" />
                  <span>Chọn file Excel</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleExcelFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Notification alert for Excel */}
            {excelImportSuccess && (
              <div className="mx-5 mt-4 p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-semibold flex items-center justify-between">
                <span>{excelImportSuccess}</span>
                <button onClick={() => setExcelImportSuccess(null)} className="text-emerald-700 hover:text-emerald-950">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {excelImportError && (
              <div className="mx-5 mt-4 p-3 bg-rose-100 border border-rose-300 rounded-xl text-xs text-rose-900 font-semibold flex items-center justify-between">
                <span>{excelImportError}</span>
                <button onClick={() => setExcelImportError(null)} className="text-rose-700 hover:text-rose-950">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Main content: Add Student Form + Students Table */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Form Add or Edit Single Student */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4 text-indigo-600" />
                  <span>{editingStudent ? 'Sửa thông tin học sinh' : 'Thêm học sinh mới vào lớp'}</span>
                </h4>

                {editingStudent ? (
                  <form onSubmit={handleSaveEditStudent} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Mã HS</label>
                      <input
                        type="text"
                        value={editingStudent.id}
                        onChange={(e) => setEditingStudent({ ...editingStudent, id: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono font-semibold"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">Tên học sinh <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        value={editingStudent.name}
                        onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Giới tính</label>
                      <select
                        value={editingStudent.gender || 'Nam'}
                        onChange={(e) => setEditingStudent({ ...editingStudent, gender: e.target.value as any })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-semibold"
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                      </select>
                    </div>

                    <div className="sm:col-span-4 flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingStudent(null)}
                        className="btn-3d-light px-3.5 py-1.5 text-xs font-bold text-slate-600 rounded-lg cursor-pointer"
                      >
                        Hủy sửa
                      </button>
                      <button
                        type="submit"
                        className="btn-3d-emerald px-4 py-1.5 text-xs font-bold text-white rounded-lg cursor-pointer"
                      >
                        Lưu thông tin học sinh
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleAddStudentToClass} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Mã HS</label>
                      <input
                        type="text"
                        value={newStudentId}
                        onChange={(e) => setNewStudentId(e.target.value)}
                        placeholder={`HS${managingStudentsClass.gradeId}01`}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono font-semibold text-slate-800"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">Tên học sinh <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        placeholder="Nhập họ và tên học sinh..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-semibold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Giới tính</label>
                      <select
                        value={newStudentGender}
                        onChange={(e) => setNewStudentGender(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-semibold text-slate-800"
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                      </select>
                    </div>

                    <div className="sm:col-span-4 flex justify-end">
                      <button
                        type="submit"
                        className="btn-3d-primary px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm vào danh sách</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Table of Students in Class */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    Danh sách học sinh ({managingStudentsClass.students?.length || 0})
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Dùng để tự động điền & chọn khi học sinh vào kiểm tra
                  </span>
                </div>

                {(!managingStudentsClass.students || managingStudentsClass.students.length === 0) ? (
                  <div className="p-8 text-center text-slate-400 space-y-2">
                    <Users className="w-8 h-8 mx-auto opacity-30" />
                    <p className="text-xs font-semibold">Chưa có học sinh nào trong danh sách lớp này.</p>
                    <p className="text-[11px]">Em có thể nhập tên từng học sinh ở trên hoặc bấm "Chọn file Excel" để tải lên toàn bộ danh sách.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto max-h-72">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[10px] uppercase sticky top-0">
                        <tr>
                          <th className="px-4 py-2.5 w-12 text-center">STT</th>
                          <th className="px-4 py-2.5">Mã học sinh</th>
                          <th className="px-4 py-2.5">Tên học sinh</th>
                          <th className="px-4 py-2.5">Giới tính</th>
                          <th className="px-4 py-2.5 text-right">Thao tác (Sửa/Xóa)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {managingStudentsClass.students.map((st, idx) => (
                          <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-4 py-2.5 text-center text-slate-400 font-mono text-[11px]">
                              {idx + 1}
                            </td>
                            <td className="px-4 py-2.5 font-mono text-slate-600">
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px]">
                                {st.id}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 font-bold text-slate-900">
                              {st.name}
                            </td>
                            <td className="px-4 py-2.5">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                st.gender === 'Nữ' ? 'bg-pink-50 text-pink-700 border border-pink-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}>
                                {st.gender || 'Nam'}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => setEditingStudent(st)}
                                  className="btn-3d-light px-2 py-1 text-[11px] font-bold text-amber-700 rounded-lg flex items-center gap-1 cursor-pointer"
                                  title="Sửa tên học sinh"
                                >
                                  <Edit3 className="w-3 h-3 text-amber-600" />
                                  <span>Sửa</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteStudentFromClass(st.id)}
                                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Xóa học sinh này"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
              <span className="text-xs text-slate-500">
                Sĩ số lớp sẽ tự động cập nhật theo số lượng học sinh thực tế.
              </span>
              <button
                type="button"
                onClick={() => setManagingStudentsClass(null)}
                className="btn-3d-primary px-5 py-2 text-xs font-bold rounded-xl cursor-pointer shadow-md"
              >
                Hoàn tất & Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: VIEW CLASS DETAILS */}
      {viewingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
                  {viewingClass.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{viewingClass.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">Mã lớp: {viewingClass.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingClass(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-medium">Khối lớp</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">Tin học {viewingClass.gradeId} THPT</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-medium">Sĩ số học sinh</span>
                <span className="text-sm font-bold text-indigo-700 mt-0.5 block">{viewingClass.students?.length || viewingClass.studentCount} học sinh</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 col-span-2">
                <span className="text-slate-400 block font-medium">Giáo viên chủ nhiệm</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">{viewingClass.homeroomTeacher}</span>
              </div>
            </div>

            {/* List of students in View Modal */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-700">Danh sách tên học sinh trong lớp:</span>
                <button
                  type="button"
                  onClick={() => {
                    const target = viewingClass;
                    setViewingClass(null);
                    handleOpenStudentManagement(target);
                  }}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Quản lý & Thêm/Sửa/Xóa</span>
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 max-h-48 overflow-y-auto space-y-1">
                {viewingClass.students && viewingClass.students.length > 0 ? (
                  <div className="divide-y divide-slate-100 text-xs">
                    {viewingClass.students.map((st, i) => (
                      <div key={st.id} className="py-1.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 text-slate-400 font-mono text-[10px]">{i + 1}.</span>
                          <span className="font-bold text-slate-800">{st.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({st.id})</span>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${st.gender === 'Nữ' ? 'text-pink-600 bg-pink-50' : 'text-blue-600 bg-blue-50'}`}>
                          {st.gender || 'Nam'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic text-center py-3">
                    Lớp chưa có danh sách tên học sinh. Bấm "Quản lý & Thêm/Sửa/Xóa" để nhập hoặc import file Excel.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  const target = viewingClass;
                  setViewingClass(null);
                  handleOpenEdit(target);
                }}
                className="btn-3d-light px-4 py-2 text-xs font-bold text-amber-700 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Chỉnh sửa lớp</span>
              </button>
              <button
                type="button"
                onClick={() => setViewingClass(null)}
                className="btn-3d-primary px-5 py-2 text-xs font-bold rounded-xl cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD CLASS */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">Thêm Lớp học Mới</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Khối lớp <span className="text-rose-500">*</span></label>
                <select
                  value={formGrade}
                  onChange={(e) => setFormGrade(e.target.value as GradeLevel)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-indigo-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="10">Khối 10 (Tin học 10 THPT)</option>
                  <option value="11">Khối 11 (Tin học 11 THPT)</option>
                  <option value="12">Khối 12 (Tin học 12 THPT)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Tên lớp học <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="VD: 10A4 (Định hướng Tin học), 11A6..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Giáo viên chủ nhiệm</label>
                <input
                  type="text"
                  value={formTeacher}
                  onChange={(e) => setFormTeacher(e.target.value)}
                  placeholder="VD: Thầy Nguyễn Văn A, Cô Trần Thị B..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Sĩ số dự kiến</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={formStudentCount}
                  onChange={(e) => setFormStudentCount(parseInt(e.target.value) || 40)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-3d-light px-4 py-2 font-bold text-slate-600 rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-3d-primary px-5 py-2 font-extrabold rounded-xl cursor-pointer shadow-md"
                >
                  Lưu lớp mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT CLASS */}
      {editingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">Chỉnh sửa Lớp học</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingClass(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Khối lớp <span className="text-rose-500">*</span></label>
                <select
                  value={formGrade}
                  onChange={(e) => setFormGrade(e.target.value as GradeLevel)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-indigo-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="10">Khối 10 (Tin học 10 THPT)</option>
                  <option value="11">Khối 11 (Tin học 11 THPT)</option>
                  <option value="12">Khối 12 (Tin học 12 THPT)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Tên lớp học <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Giáo viên chủ nhiệm</label>
                <input
                  type="text"
                  value={formTeacher}
                  onChange={(e) => setFormTeacher(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Sĩ số học sinh</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={formStudentCount}
                  onChange={(e) => setFormStudentCount(parseInt(e.target.value) || 40)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingClass(null)}
                  className="btn-3d-light px-4 py-2 font-bold text-slate-600 rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-3d-emerald px-5 py-2 font-extrabold rounded-xl cursor-pointer shadow-md text-white"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: CONFIRM DELETE */}
      {deletingClassId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-slate-200 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900">Xác nhận xóa lớp học?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Lớp học sẽ bị xóa khỏi danh sách phân bổ. Các kết quả bài thi đã hoàn thành trước đó vẫn được lưu trữ trong sổ điểm.
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingClassId(null)}
                className="btn-3d-light px-4 py-2 text-xs font-bold text-slate-600 rounded-xl cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md cursor-pointer transition-colors"
              >
                Xác nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
