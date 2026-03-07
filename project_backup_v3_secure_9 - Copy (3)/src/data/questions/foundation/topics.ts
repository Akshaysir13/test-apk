import { foundationlatestQuestions } from './latest';

// Basic topic structure used by foundation-topic-tests.ts
// You can later populate this array with real topics if needed.
type Topic = {
  id: string;
  name: string;
  questions: typeof foundationlatestQuestions;
};

// Currently empty so that the build succeeds without adding extra tests.
// Example of how to add a topic later:
// {
//   id: 'aptitude-permutations',
//   name: 'Permutations & Combinations',
//   questions: foundationlatestQuestions.filter(q => q.topic === 'permutations'),
// }
export const topicRegistry: Topic[] = [];

