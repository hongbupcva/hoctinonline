import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  BookOpen, 
  Folder, 
  FolderOpen, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  Clock, 
  Code2, 
  Layers, 
  Check, 
  FileText,
  Filter,
  Sparkles,
  Search,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Topic, Lesson, GradeLevel, UserRole } from '../../types';
import { LessonModal } from './LessonModal';
import { LessonDetailModal } from './LessonDetailModal';
import { TopicModal } from './TopicModal';

interface LearningManagementProps {
  topics: Topic[];
  setTopics: React.Dispatch<React.SetStateAction<Topic[]>>;
  searchQuery: string;
  userRole?: UserRole;
}

export const LearningManagement: React.FC<LearningManagementProps> = ({
  topics,
  setTopics,
  searchQuery,
  userRole = 'teacher'
}) => {
  const isStudent = userRole === 'student';
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'ALL'>('ALL');
  const [selectedDirection, setSelectedDirection] = useState<'ALL' | 'Chung' | 'ICT' | 'CS'>('ALL');
  
  // Accordion state: Topic IDs that are expanded
  const [expandedTopicIds, setExpandedTopicIds] = useState<Record<string, boolean>>(() => {
    // Expand first 2 topics by default
    const initial: Record<string, boolean> = {};
    topics.slice(0, 3).forEach(t => { initial[t.id] = true; });
    return initial;
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [targetTopicId, setTargetTopicId] = useState<string>('');

  // Detail Drawer state
  const [viewingLesson, setViewingLesson] = useState<Lesson | null>(null);
  const [viewingTopic, setViewingTopic] = useState<Topic | null>(null);

  // Delete confirmation
  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null);

  const handleSaveTopic = (newTopic: Topic) => {
    setTopics(prev => [newTopic, ...prev]);
    setExpandedTopicIds(prev => ({ ...prev, [newTopic.id]: true }));
  };

  const toggleTopic = (topicId: string) => {
    setExpandedTopicIds(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    topics.forEach(t => { allExpanded[t.id] = true; });
    setExpandedTopicIds(allExpanded);
  };

  const collapseAll = () => {
    setExpandedTopicIds({});
  };

  // Filter topics and lessons
  const filteredTopics = topics.filter(topic => {
    // Grade filter
    if (selectedGrade !== 'ALL' && topic.gradeId !== selectedGrade) {
      return false;
    }
    // Direction filter
    if (selectedDirection !== 'ALL' && topic.direction !== selectedDirection) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTopic = topic.name.toLowerCase().includes(q) || topic.code.toLowerCase().includes(q);
      const matchLesson = topic.lessons.some(l => 
        l.title.toLowerCase().includes(q) || 
        l.summary.toLowerCase().includes(q) ||
        (l.codeSnippet?.code.toLowerCase().includes(q))
      );
      return matchTopic || matchLesson;
    }
    return true;
  });

  const totalLessons = topics.reduce((acc, t) => acc + t.lessons.length, 0);

  // Handlers for Lesson CRUD
  const handleOpenAddLesson = (topicId?: string) => {
    setEditingLesson(null);
    setTargetTopicId(topicId || (topics[0]?.id || ''));
    setIsModalOpen(true);
  };

  const handleOpenEditLesson = (lesson: Lesson, topicId: string) => {
    setEditingLesson(lesson);
    setTargetTopicId(topicId);
    setIsModalOpen(true);
    setViewingLesson(null); // Close viewer if opened
  };

  const handleOpenViewLesson = (lesson: Lesson, topic: Topic) => {
    setViewingLesson(lesson);
    setViewingTopic(topic);
  };

  const handleDeleteLesson = (topicId: string, lessonId: string) => {
    setTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        return {
          ...t,
          lessons: t.lessons.filter(l => l.id !== lessonId)
        };
      }
      return t;
    }));
    setDeletingLessonId(null);
  };

  const handleSaveLesson = (lesson: Lesson, targetTopic: string) => {
    setTopics(prev => {
      // If editing an existing lesson
      if (editingLesson) {
        return prev.map(t => {
          // If moved to different topic
          if (t.id === targetTopic) {
            const exists = t.lessons.some(l => l.id === lesson.id);
            if (exists) {
              return {
                ...t,
                lessons: t.lessons.map(l => l.id === lesson.id ? lesson : l)
              };
            } else {
              return {
                ...t,
                lessons: [...t.lessons, lesson]
              };
            }
          } else {
            // Remove from old topic if changed
            return {
              ...t,
              lessons: t.lessons.filter(l => l.id !== lesson.id)
            };
          }
        });
      } else {
        // Adding new lesson
        return prev.map(t => {
          if (t.id === targetTopic) {
            return {
              ...t,
              lessons: [...t.lessons, lesson]
            };
          }
          return t;
        });
      }
    });

    // Automatically expand the topic containing this lesson
    setExpandedTopicIds(prev => ({ ...prev, [targetTopic]: true }));
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner: Single Line Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-sky-700 rounded-2xl p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
          Chương trình Tin học THPT kết nối tri thức với cuộc sống
        </h2>

        {!isStudent && (
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsTopicModalOpen(true)}
              className="btn-3d-light px-5 py-2.5 text-indigo-900 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>Thêm chủ đề</span>
            </button>
          </div>
        )}
      </div>

      {/* Control Bar: Grade Tabs & Direction Filter & Expand/Collapse */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        {/* Grade tabs (Cấp độ 1) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          {[
            { id: 'ALL', label: 'Tất cả Khối', badge: totalLessons },
            { id: '10', label: 'Tin học 10', sub: 'Python cơ bản' },
            { id: '11', label: 'Tin học 11', sub: 'Web & CSDL' },
            { id: '12', label: 'Tin học 12', sub: 'AI & Mạng' },
          ].map(g => (
            <button
              key={g.id}
              onClick={() => setSelectedGrade(g.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                selectedGrade === g.id
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <span>{g.label}</span>
              {g.badge !== undefined && (
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-full font-bold">
                  {g.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Direction Filter (ICT vs CS) */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">Định hướng:</span>
          <select
            value={selectedDirection}
            onChange={(e) => setSelectedDirection(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="ALL">Tất cả định hướng</option>
            <option value="ICT">Tin học ứng dụng (ICT - Web/Media)</option>
            <option value="CS">Khoa học máy tính (CS - Lập trình/AI)</option>
          </select>
        </div>

        {/* Expand / Collapse all */}
        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 border border-slate-200"
          >
            <Maximize2 className="w-3 h-3" /> Mở rộng tất cả
          </button>
          <button
            onClick={collapseAll}
            className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 border border-slate-200"
          >
            <Minimize2 className="w-3 h-3" /> Thu gọn tất cả
          </button>
        </div>
      </div>

      {/* Main Hierarchy: Tree-view / Accordion */}
      <div className="space-y-4">
        {filteredTopics.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">Không tìm thấy bài học phù hợp</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Thử thay đổi bộ lọc khối lớp hoặc từ khóa tìm kiếm trên thanh điều hướng.
            </p>
          </div>
        ) : (
          filteredTopics.map((topic) => {
            const isExpanded = !!expandedTopicIds[topic.id];
            const gradeBadgeColor = 
              topic.gradeId === '10' ? 'bg-blue-50 text-blue-700 border-blue-200' :
              topic.gradeId === '11' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              'bg-purple-50 text-purple-700 border-purple-200';

            return (
              <div 
                key={topic.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all duration-200"
              >
                {/* Level 2: Topic Accordion Header */}
                <div 
                  className={`px-5 py-4 flex items-center justify-between transition-colors select-none ${
                    isExpanded ? 'bg-slate-50/80 border-b border-slate-200/80' : 'hover:bg-slate-50/50'
                  }`}
                >
                  <div 
                    onClick={() => toggleTopic(topic.id)}
                    className="flex items-center gap-3.5 flex-1 cursor-pointer"
                  >
                    <button className="p-1 rounded-md text-slate-400 hover:text-slate-700">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                      {isExpanded ? <FolderOpen className="w-5 h-5" /> : <Folder className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${gradeBadgeColor}`}>
                          Tin học {topic.gradeId}
                        </span>
                        <span className="text-xs font-bold text-indigo-600">
                          {topic.code}
                        </span>
                        {topic.direction && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            topic.direction === 'ICT'
                              ? 'bg-sky-50 text-sky-800 border-sky-200'
                              : 'bg-purple-50 text-purple-800 border-purple-200'
                          }`}>
                            Định hướng {topic.direction === 'ICT' ? 'ICT (Tin ứng dụng)' : 'CS (Khoa học máy tính)'}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 font-medium">
                          ({topic.lessons.length} bài học)
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-0.5">{topic.name}</h3>
                    </div>
                  </div>

                  {/* Topic Action: Add Lesson to this Topic (Teacher only) */}
                  {!isStudent && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenAddLesson(topic.id);
                        }}
                        className="btn-3d-primary px-3.5 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ Thêm bài vào chủ đề</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Level 3: Lessons List (Tree Child Nodes) */}
                {isExpanded && (
                  <div className="p-4 bg-slate-50/40 divide-y divide-slate-100">
                    {topic.lessons.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500 bg-white rounded-xl border border-dashed border-slate-200 space-y-3">
                        <p className="italic">Chủ đề này chưa có bài học nào.</p>
                        <button
                          type="button"
                          onClick={() => handleOpenAddLesson(topic.id)}
                          className="btn-3d-primary px-4 py-2 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Thêm bài đầu tiên vào {topic.code}</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        {topic.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="py-3 px-3 hover:bg-white rounded-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group border border-transparent hover:border-slate-200 hover:shadow-2xs"
                          >
                            {/* Lesson Info */}
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              {/* Lesson Number Circle */}
                              <div className="w-8 h-8 rounded-lg bg-indigo-100/70 text-indigo-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                {lesson.lessonNumber}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="text-sm font-bold text-slate-900 truncate">
                                    Bài {lesson.lessonNumber}: {lesson.title}
                                  </h4>
                                  <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                                    <Clock className="w-3 h-3 text-slate-400" />
                                    {lesson.durationMinutes} phút
                                  </span>

                                  {lesson.codeSnippet && (
                                    <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                                      <Code2 className="w-3 h-3" />
                                      {lesson.codeSnippet.language}
                                    </span>
                                  )}

                                  {lesson.objectives && lesson.objectives.length > 0 && (
                                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                      {lesson.objectives.length} yêu cầu cần đạt
                                    </span>
                                  )}
                                </div>

                                <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                                  {lesson.summary || 'Không có mô tả ngắn.'}
                                </p>
                              </div>
                            </div>

                            {/* Level 3 CRUD Interactive Buttons with 3D Depth */}
                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                              {/* 1. Xem chi tiết (Cả GV và Học sinh đều xem được bài học) */}
                              <button
                                onClick={() => handleOpenViewLesson(lesson, topic)}
                                title="Xem nội dung bài học"
                                className="btn-3d-primary px-3.5 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 text-white" />
                                <span>{isStudent ? 'Học bài' : 'Xem'}</span>
                              </button>

                              {/* 2. Sửa & 3. Xóa nội dung (Chỉ dành cho Giáo viên) */}
                              {!isStudent && (
                                <>
                                  <button
                                    onClick={() => handleOpenEditLesson(lesson, topic.id)}
                                    title="Chỉnh sửa bài học"
                                    className="btn-3d-light px-3 py-1.5 text-xs font-semibold text-amber-800 rounded-lg flex items-center gap-1 cursor-pointer"
                                  >
                                    <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                                    <span>Sửa</span>
                                  </button>

                                  {deletingLessonId === lesson.id ? (
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() => handleDeleteLesson(topic.id, lesson.id)}
                                        className="btn-3d-rose px-2.5 py-1 text-[11px] font-bold rounded-lg cursor-pointer"
                                      >
                                        Xóa thật
                                      </button>
                                      <button
                                        onClick={() => setDeletingLessonId(null)}
                                        className="btn-3d-light px-2.5 py-1 text-[11px] font-medium text-slate-600 rounded-lg cursor-pointer"
                                      >
                                        Hủy
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => setDeletingLessonId(lesson.id)}
                                      title="Xóa bài học khỏi chủ đề"
                                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        ))}

                        {/* Additional Quick Add Row at bottom of list */}
                        {!isStudent && (
                          <div className="pt-3 pb-1 flex justify-center">
                            <button
                              type="button"
                              onClick={() => handleOpenAddLesson(topic.id)}
                              className="btn-3d-light px-4 py-2 text-xs font-bold text-indigo-700 rounded-xl inline-flex items-center gap-1.5 cursor-pointer border border-dashed border-indigo-300 hover:bg-indigo-50/60"
                            >
                              <Plus className="w-3.5 h-3.5 text-indigo-600" />
                              <span>+ Thêm bài tiếp theo vào {topic.code}</span>
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Topic Creation Modal */}
      <TopicModal
        isOpen={isTopicModalOpen}
        onClose={() => setIsTopicModalOpen(false)}
        onSave={handleSaveTopic}
        currentGrade={selectedGrade === 'ALL' ? '10' : selectedGrade}
        existingCount={topics.filter(t => selectedGrade === 'ALL' || t.gradeId === selectedGrade).length}
      />

      {/* Add / Edit Lesson Modal */}
      <LessonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLesson}
        editingLesson={editingLesson}
        defaultTopicId={targetTopicId}
        topics={topics}
        currentGrade={selectedGrade === 'ALL' ? '10' : selectedGrade}
      />

      {/* Lesson Detail Viewer */}
      <LessonDetailModal
        lesson={viewingLesson}
        topic={viewingTopic}
        onClose={() => setViewingLesson(null)}
        onEdit={(lesson) => handleOpenEditLesson(lesson, lesson.topicId)}
      />
    </div>
  );
};
