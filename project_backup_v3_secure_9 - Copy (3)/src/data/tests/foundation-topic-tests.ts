import { Test } from '../../types';
import { foundationlatestQuestions } from '../questions/foundation/latest';
import { topicRegistry } from '../questions/foundation/topics';

// Topic tests: Practice by specific topic (foundation students only)
// Based on full mock structure: Aptitude 0-49, Math MCQ 50-69, Math Numeric 70-74, Drawing 75+

const filterByType = (questions: typeof foundationlatestQuestions, type: string) =>
  questions.filter((q: any) => q.type === type);

export const foundationTopicTests: Test[] = [
  // Aptitude - Match the Pair
  {
    id: 'foundation-topic-match-pair-1',
    name: 'Topic: Aptitude - Match the Pair 01',
    description: 'Practice match the pair questions only',
    duration: 1200, // 20 min
    questions: filterByType(foundationlatestQuestions, 'match-pair').slice(0, 15),
    category: 'topic',
    course: 'foundation',
    sections: [{
      id: 'aptitude',
      name: 'Match the Pair',
      type: 'aptitude',
      questionIndices: Array.from({ length: 15 }, (_, i) => i),
    }],
  },
  {
    id: 'foundation-topic-match-pair-2',
    name: 'Topic: Aptitude - Match the Pair 02',
    description: 'More match the pair practice',
    duration: 1200,
    questions: filterByType(foundationlatestQuestions, 'match-pair').slice(15, 30),
    category: 'topic',
    course: 'foundation',
    sections: [{
      id: 'aptitude',
      name: 'Match the Pair',
      type: 'aptitude',
      questionIndices: Array.from({ length: 15 }, (_, i) => i),
    }],
  },
  // Aptitude MCQ Only
  {
    id: 'foundation-topic-aptitude-mcq-1',
    name: 'Topic: Aptitude MCQ 01',
    description: 'Aptitude section MCQs only (no match-pair, no numeric)',
    duration: 1800, // 30 min
    questions: foundationlatestQuestions.slice(0, 25),
    category: 'topic',
    course: 'foundation',
    sections: [{
      id: 'aptitude',
      name: 'Aptitude MCQ',
      type: 'aptitude',
      questionIndices: Array.from({ length: 25 }, (_, i) => i),
    }],
  },
  {
    id: 'foundation-topic-aptitude-mcq-2',
    name: 'Topic: Aptitude MCQ 02',
    description: 'More aptitude MCQ practice',
    duration: 1800,
    questions: foundationlatestQuestions.slice(25, 50),
    category: 'topic',
    course: 'foundation',
    sections: [{
      id: 'aptitude',
      name: 'Aptitude MCQ',
      type: 'aptitude',
      questionIndices: Array.from({ length: 25 }, (_, i) => i),
    }],
  },
  // Mathematics MCQ Only
  {
    id: 'foundation-topic-math-mcq-1',
    name: 'Topic: Mathematics MCQ 01',
    description: 'Mathematics MCQ section only',
    duration: 1200, // 20 min
    questions: foundationlatestQuestions.slice(50, 70),
    category: 'topic',
    course: 'foundation',
    sections: [{
      id: 'math-mcq',
      name: 'Mathematics MCQ',
      type: 'math',
      questionIndices: Array.from({ length: 20 }, (_, i) => i),
    }],
  },
  // Mathematics Numeric Only
  {
    id: 'foundation-topic-math-numeric-1',
    name: 'Topic: Mathematics Numeric 01',
    description: 'Numeric type questions only (no negative marking)',
    duration: 900, // 15 min
    questions: filterByType(foundationlatestQuestions, 'numeric').slice(0, 5),
    category: 'topic',
    course: 'foundation',
    sections: [{
      id: 'math-numeric',
      name: 'Mathematics Numeric',
      type: 'math',
      questionIndices: Array.from({ length: 5 }, (_, i) => i),
    }],
  },
  {
    id: 'foundation-topic-math-numeric-2',
    name: 'Topic: Mathematics Numeric 02',
    description: 'More numeric practice',
    duration: 900,
    questions: filterByType(foundationlatestQuestions, 'numeric').slice(0, 8),
    category: 'topic',
    course: 'foundation',
    sections: [{
      id: 'math-numeric',
      name: 'Mathematics Numeric',
      type: 'math',
      questionIndices: Array.from({ length: 8 }, (_, i) => i),
    }],
  },
  // Auto-generated from topic registry (add topics in foundation/topics/)
  ...topicRegistry.map((topic) => ({
    id: `foundation-topic-${topic.id}`,
    name: `Topic: ${topic.name}`,
    description: `Practice ${topic.name} questions`,
    duration: Math.max(900, topic.questions.length * 60), // 1 min per Q, min 15 min
    questions: topic.questions,
    category: 'topic' as const,
    course: 'foundation' as const,
    sections: [{
      id: topic.id,
      name: topic.name,
      type: 'aptitude' as const,
      questionIndices: Array.from({ length: topic.questions.length }, (_, i) => i),
    }],
  })),
];
