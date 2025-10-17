export const fetchResult = (contestId, type) => {
  const demoData = {
    '1': { type: 'quiz', meta: { title: 'JavaScript Fundamentals Quiz', stats: { participants: 45, submissions: 2, status: 'Live', problems: 3 } }, leaders: [{ id: '1', initials: 'AJ', name: 'Alice Johnson', email: 'alice@example.com', score: 100, totalMarks: 3, time: '7m 0s', submittedAt: '10/15/2025 4:35:14 PM' }, { id: '2', initials: 'BS', name: 'Bob Smith', email: 'bob@example.com', score: 67, totalMarks: 3, time: '6m 20s', submittedAt: '10/15/2025 4:45:14 PM' }, { id: '3', initials: 'AJ', name: 'Alice Johnson', email: 'alice@example.com', score: 100, totalMarks: 3, time: '7m 0s', submittedAt: '10/15/2025 4:35:14 PM' }, { id: '4', initials: 'BS', name: 'Bob Smith', email: 'bob@example.com', score: 67, totalMarks: 3, time: '6m 20s', submittedAt: '10/15/2025 4:45:14 PM' }, { id: '5', initials: 'AJ', name: 'Alice Johnson', email: 'alice@example.com', score: 100, totalMarks: 3, time: '7m 0s', submittedAt: '10/15/2025 4:35:14 PM' }, { id: '6', initials: 'BS', name: 'Bob Smith', email: 'bob@example.com', score: 67, totalMarks: 3, time: '6m 20s', submittedAt: '10/15/2025 4:45:14 PM' }, { id: '7', initials: 'AJ', name: 'Alice Johnson', email: 'alice@example.com', score: 100, totalMarks: 3, time: '7m 0s', submittedAt: '10/15/2025 4:35:14 PM' }, { id: '8', initials: 'BS', name: 'Bob Smith', email: 'bob@example.com', score: 67, totalMarks: 3, time: '6m 20s', submittedAt: '10/15/2025 4:45:14 PM' }, { id: '9', initials: 'AJ', name: 'Alice Johnson', email: 'alice@example.com', score: 100, totalMarks: 3, time: '7m 0s', submittedAt: '10/15/2025 4:35:14 PM' }, { id: '10', initials: 'BS', name: 'Bob Smith', email: 'bob@example.com', score: 67, totalMarks: 3, time: '6m 20s', submittedAt: '10/15/2025 4:45:14 PM' }, { id: '11', initials: 'AJ', name: 'Alice Johnson', email: 'alice@example.com', score: 100, totalMarks: 3, time: '7m 0s', submittedAt: '10/15/2025 4:35:14 PM' }, { id: '12', initials: 'BS', name: 'Bob Smith', email: 'bob@example.com', score: 67, totalMarks: 3, time: '6m 20s', submittedAt: '10/15/2025 4:45:14 PM' }] },

    '2': { type: 'coding', meta: { title: 'Data Structures Coding Contest', stats: { participants: 156, submissions: 1, status: 'Ended', problems: 2 } }, leaders: [{ id: '3', initials: 'BS', name: 'Sk Smith', email: 'bob@example.com', score: 100, totalMarks: 3, time: '7m 0s', submittedAt: '10/15/2025 4:35:14 PM' }] },
    
    '3': { type: 'both', meta: { title: 'Combined Quiz + Coding Contest', stats: { participants: 200, submissions: 10, status: 'Ended', problems: 5 } }, leaders: [{ id: '4', initials: 'AJ', name: 'Obey Johnson', email: 'alice@example.com', score: 120, totalMarks: 6, time: '10m 30s', submittedAt: '10/16/2025 1:05:00 PM' }] },
  };

  const contest = demoData[contestId];

  // Only return if contest exists and type matches
  if (contest && contest.type === type) {
    return Promise.resolve(contest);
  } else {
    return Promise.resolve(null);
  }
};


// export const fetchResult = async (contestId, type) => {
//   try {
//     const res = await fetch(`http://localhost:8080/api/contests/results/${contestId}?type=${type}`);
//     if (!res.ok) throw new Error("Failed to fetch result");
//     return await res.json();
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// };
