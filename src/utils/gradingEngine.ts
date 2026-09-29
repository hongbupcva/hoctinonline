import { Question, KeywordMatchingConfig, AutoGradingConfig } from '../types';

export interface GradingResultItem {
  questionId: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  earnedPoints: number;
  maxPoints: number;
  feedback: string;
  matchType?: 'EXACT' | 'VARIANT' | 'REGEX' | 'PARTIAL' | 'WRONG';
}

export interface SubmissionEvaluation {
  totalEarnedScore: number;
  maxScore: number;
  percentage: number;
  isPassed: boolean;
  items: GradingResultItem[];
}

/**
 * Thuật toán so khớp từ khóa thông minh (Keyword matching)
 * Hỗ trợ: Case-insensitivity, whitespace normalization, synonyms, regex, và tính điểm từng phần
 */
export function evaluateKeywordAnswer(
  studentInput: string,
  correctAnswer: string,
  config?: KeywordMatchingConfig,
  points: number = 1
): { isCorrect: boolean; earnedPoints: number; feedback: string; matchType: 'EXACT' | 'VARIANT' | 'REGEX' | 'PARTIAL' | 'WRONG' } {
  if (!studentInput || studentInput.trim() === '') {
    return {
      isCorrect: false,
      earnedPoints: 0,
      feedback: 'Chưa có câu trả lời.',
      matchType: 'WRONG'
    };
  }

  const rawInput = studentInput;
  const cfg = config || {
    primaryKeywords: [correctAnswer],
    acceptableVariants: [],
    caseSensitive: false,
    ignoreWhitespace: true,
  };

  let cleanInput = rawInput;
  if (cfg.ignoreWhitespace) {
    cleanInput = cleanInput.trim().replace(/\s+/g, ' ');
  }

  const compareTarget = (target: string) => {
    let cleanTarget = target;
    if (cfg.ignoreWhitespace) {
      cleanTarget = cleanTarget.trim().replace(/\s+/g, ' ');
    }
    if (!cfg.caseSensitive) {
      return cleanInput.toLowerCase() === cleanTarget.toLowerCase();
    }
    return cleanInput === cleanTarget;
  };

  // 1. Kiểm tra Regex nếu có
  if (cfg.regexPattern && cfg.regexPattern.trim() !== '') {
    try {
      const flags = cfg.caseSensitive ? '' : 'i';
      const regex = new RegExp(cfg.regexPattern, flags);
      if (regex.test(rawInput)) {
        return {
          isCorrect: true,
          earnedPoints: points,
          feedback: `Khớp mẫu biểu thức chính quy (Regex: /${cfg.regexPattern}/)`,
          matchType: 'REGEX'
        };
      }
    } catch {
      // In case regex is invalid, proceed to keyword check
    }
  }

  // 2. Kiểm tra từ khóa chính xác (Primary Keywords)
  const primaries = cfg.primaryKeywords && cfg.primaryKeywords.length > 0 ? cfg.primaryKeywords : [correctAnswer];
  for (const kw of primaries) {
    if (compareTarget(kw)) {
      return {
        isCorrect: true,
        earnedPoints: points,
        feedback: `Tuyệt vời! Khớp chính xác đáp án chuẩn: "${kw}"`,
        matchType: 'EXACT'
      };
    }
  }

  // 3. Kiểm tra biến thể chấp nhận (Acceptable Variants / Synonyms)
  if (cfg.acceptableVariants) {
    for (const v of cfg.acceptableVariants) {
      if (compareTarget(v)) {
        return {
          isCorrect: true,
          earnedPoints: points,
          feedback: `Chính xác! Khớp phương án tương đương: "${v}"`,
          matchType: 'VARIANT'
        };
      }
    }
  }

  // 4. Kiểm tra so khớp gần đúng / một phần (Partial Match)
  // Nếu câu trả lời chứa từ khóa chính hoặc ngược lại
  const lowerInput = cleanInput.toLowerCase();
  for (const kw of primaries) {
    const lowerKw = kw.toLowerCase();
    if (lowerInput.includes(lowerKw) || lowerKw.includes(lowerInput)) {
      const partialPercent = (cfg.partialMatchPercentage || 50) / 100;
      const partialEarned = Math.round(points * partialPercent * 100) / 100;
      return {
        isCorrect: false,
        earnedPoints: partialEarned,
        feedback: `Đúng một phần (${cfg.partialMatchPercentage || 50}% số điểm) với từ khóa "${kw}"`,
        matchType: 'PARTIAL'
      };
    }
  }

  return {
    isCorrect: false,
    earnedPoints: 0,
    feedback: `Chưa chính xác. Đáp án mong đợi là: "${correctAnswer}"`,
    matchType: 'WRONG'
  };
}

/**
 * Chấm điểm toàn diện bài nộp của học sinh
 */
export function evaluateExamSubmission(
  questions: Question[],
  studentAnswers: Record<string, string>,
  config: AutoGradingConfig
): SubmissionEvaluation {
  let totalEarnedScore = 0;
  const items: GradingResultItem[] = [];

  const pointsPerQuestion =
    config.gradingMode === 'EQUAL' && questions.length > 0
      ? config.totalPoints / questions.length
      : 0;

  for (const q of questions) {
    const studentAns = studentAnswers[q.id] || '';
    const qPoints = config.gradingMode === 'EQUAL' ? pointsPerQuestion : (q.points || 1);

    if (q.type === 'MULTIPLE_CHOICE' || q.type === 'TRUE_FALSE') {
      const isCorrect = studentAns.trim().toUpperCase() === q.correctAnswer.trim().toUpperCase();
      const earned = isCorrect ? qPoints : 0;
      totalEarnedScore += earned;

      items.push({
        questionId: q.id,
        studentAnswer: studentAns || '(Bỏ trống)',
        correctAnswer: q.correctAnswer,
        isCorrect,
        earnedPoints: Math.round(earned * 100) / 100,
        maxPoints: Math.round(qPoints * 100) / 100,
        feedback: isCorrect ? 'Đáp án hoàn toàn chính xác.' : `Phương án đúng là ${q.correctAnswer}. ${q.explanation}`,
        matchType: isCorrect ? 'EXACT' : 'WRONG'
      });
    } else {
      // CODE_FILL hoặc THEORY_SHORT
      const evalResult = evaluateKeywordAnswer(studentAns, q.correctAnswer, q.keywordConfig, qPoints);
      totalEarnedScore += evalResult.earnedPoints;

      items.push({
        questionId: q.id,
        studentAnswer: studentAns || '(Bỏ trống)',
        correctAnswer: q.correctAnswer,
        isCorrect: evalResult.isCorrect,
        earnedPoints: evalResult.earnedPoints,
        maxPoints: Math.round(qPoints * 100) / 100,
        feedback: evalResult.feedback + (q.explanation ? ` — ${q.explanation}` : ''),
        matchType: evalResult.matchType
      });
    }
  }

  const roundedScore = Math.round(totalEarnedScore * 100) / 100;
  const maxScore = config.totalPoints;
  const percentage = Math.round((roundedScore / maxScore) * 100);

  return {
    totalEarnedScore: roundedScore,
    maxScore,
    percentage,
    isPassed: roundedScore >= config.passScore,
    items
  };
}
