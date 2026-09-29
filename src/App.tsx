import React, { useState, useEffect } from 'react';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { LearningManagement } from './components/learning/LearningManagement';
import { ExamList } from './components/exam/ExamList';
import { AutoGradingSettings } from './components/exam/AutoGradingSettings';
import { ExamTakingSimulator } from './components/student/ExamTakingSimulator';
import { ClassManagement } from './components/classes/ClassManagement';
import { DatabaseSchemaView } from './components/schema/DatabaseSchemaView';
import { INITIAL_TOPICS, INITIAL_EXAMS, INITIAL_CLASSES, INITIAL_SUBMISSIONS } from './data/mockCurriculum';
import { Topic, Exam, SchoolClass, StudentSubmission, UserRole } from './types';

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem('edutin_user_role');
      return (saved === 'student' || saved === 'teacher') ? saved : 'teacher';
    } catch {
      return 'teacher';
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('learning');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Main Persistent States with LocalStorage fallbacks
  const [topics, setTopics] = useState<Topic[]>(() => {
    try {
      const saved = localStorage.getItem('edutin_topics');
      if (saved) {
        const parsed: any[] = JSON.parse(saved);
        // Normalize any old 'Chung' values to ICT or CS
        return parsed.map(t => ({
          ...t,
          direction: t.direction === 'Chung' ? (t.code?.includes('5') || t.name?.includes('Python') || t.name?.includes('CSDL') || t.name?.includes('AI') ? 'CS' : 'ICT') : t.direction
        }));
      }
      return INITIAL_TOPICS;
    } catch {
      return INITIAL_TOPICS;
    }
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    try {
      const saved = localStorage.getItem('edutin_exams');
      return saved ? JSON.parse(saved) : INITIAL_EXAMS;
    } catch {
      return INITIAL_EXAMS;
    }
  });

  const [classes, setClasses] = useState<SchoolClass[]>(() => {
    try {
      const saved = localStorage.getItem('edutin_classes');
      return saved ? JSON.parse(saved) : INITIAL_CLASSES;
    } catch {
      return INITIAL_CLASSES;
    }
  });

  const [submissions, setSubmissions] = useState<StudentSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('edutin_submissions');
      return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  });

  // Track currently active exam for auto-grading & simulator
  const [currentExamId, setCurrentExamId] = useState<string>(() => exams[0]?.id || 'exam-11-midterm');

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('edutin_user_role', userRole);
    } catch {}
  }, [userRole]);

  useEffect(() => {
    try {
      localStorage.setItem('edutin_topics', JSON.stringify(topics));
    } catch {}
  }, [topics]);

  useEffect(() => {
    try {
      localStorage.setItem('edutin_exams', JSON.stringify(exams));
    } catch {}
  }, [exams]);

  useEffect(() => {
    try {
      localStorage.setItem('edutin_classes', JSON.stringify(classes));
    } catch {}
  }, [classes]);

  useEffect(() => {
    try {
      localStorage.setItem('edutin_submissions', JSON.stringify(submissions));
    } catch {}
  }, [submissions]);

  // Total counts
  const totalLessons = topics.reduce((acc, t) => acc + t.lessons.length, 0);

  // Navigation callbacks
  const handleOpenAutoGrading = (examId: string) => {
    setCurrentExamId(examId);
    setActiveTab('auto-grading');
  };

  const handleOpenSimulator = (examId: string) => {
    setCurrentExamId(examId);
    setActiveTab('simulator');
  };

  const handleSubmissionRecorded = (newSub: StudentSubmission) => {
    setSubmissions(prev => [newSub, ...prev]);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        examCount={exams.length}
        lessonCount={totalLessons}
        userRole={userRole}
        setUserRole={setUserRole}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          userRole={userRole}
          setUserRole={setUserRole}
        />

        <main className="flex-1 overflow-y-auto">
          {activeTab === 'learning' && (
            <LearningManagement
              topics={topics}
              setTopics={setTopics}
              searchQuery={searchQuery}
              userRole={userRole}
            />
          )}

          {activeTab === 'exams' && (
            <ExamList
              exams={exams}
              setExams={setExams}
              classes={classes}
              submissions={submissions}
              setSubmissions={setSubmissions}
              onOpenAutoGrading={handleOpenAutoGrading}
              onOpenSimulator={handleOpenSimulator}
              searchQuery={searchQuery}
              userRole={userRole}
            />
          )}

          {/* Teacher-only tabs: Auto-grading, Simulator, Classes, Schema */}
          {userRole === 'teacher' && activeTab === 'auto-grading' && (
            <AutoGradingSettings
              exams={exams}
              setExams={setExams}
              currentExamId={currentExamId}
              onNavigateToSimulator={() => setActiveTab('simulator')}
            />
          )}

          {/* Student or Teacher can open exam taking simulator */}
          {activeTab === 'simulator' && (
            <ExamTakingSimulator
              exams={exams}
              classes={classes}
              selectedExamId={currentExamId}
              onGradingConfigRequested={(id) => {
                if (userRole === 'teacher') {
                  setCurrentExamId(id);
                  setActiveTab('auto-grading');
                }
              }}
              onSubmissionRecorded={handleSubmissionRecorded}
              onNavigateToResults={() => setActiveTab('exams')}
            />
          )}

          {userRole === 'teacher' && activeTab === 'classes' && (
            <ClassManagement
              classes={classes}
              setClasses={setClasses}
            />
          )}

          {userRole === 'teacher' && activeTab === 'schema' && (
            <DatabaseSchemaView />
          )}
        </main>
      </div>
    </div>
  );
}
