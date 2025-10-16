export const mockContests = [
  {
    id: '1',
    title: 'JavaScript Fundamentals Quiz',
    description: 'Test your knowledge of JavaScript basics including variables, functions, and ES6 features.',
    type: 'quiz',
    status: 'active',
    startDate: new Date('2024-12-01T10:00:00Z'),
    endDate: new Date('2024-12-15T23:59:59Z'),
    duration: 30,
    participants: 127,
    questions: [
      {
        id: 'q1',
        question: 'What is the correct way to declare a variable in JavaScript?',
        options: ['var x = 5;', 'variable x = 5;', 'v x = 5;', 'declare x = 5;'],
        correctAnswer: 0
      },
      {
        id: 'q2',
        question: 'Which method is used to add an element to the end of an array?',
        options: ['append()', 'push()', 'add()', 'insert()'],
        correctAnswer: 1
      },
      {
        id: 'q3',
        question: 'What does "this" keyword refer to in JavaScript?',
        options: ['The current function', 'The global object', 'The current object', 'The parent object'],
        correctAnswer: 2
      }
    ]
  },
  {
    id: '2',
    title: 'Algorithm Challenge: Two Sum',
    description: 'Given an array of integers and a target sum, find two numbers that add up to the target.',
    type: 'coding',
    status: 'upcoming',
    startDate: new Date('2024-12-20T14:00:00Z'),
    endDate: new Date('2024-12-20T16:00:00Z'),
    duration: 120,
    participants: 89,
    problemStatement: `
Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Constraints:
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
    `,
    starterCode: {
      javascript: `function twoSum(nums, target) {
    // Your solution here
    
}`,
      python: `def two_sum(nums, target):
    # Your solution here
    pass`,
      java: `public int[] twoSum(int[] nums, int target) {
    // Your solution here
    
}`
    }
  },
  {
    id: '3',
    title: 'React Hooks Mastery',
    description: 'Advanced quiz on React Hooks including useState, useEffect, useContext, and custom hooks.',
    type: 'quiz',
    status: 'completed',
    startDate: new Date('2024-11-15T09:00:00Z'),
    endDate: new Date('2024-11-16T18:00:00Z'),
    duration: 45,
    participants: 203,
    questions: [
      {
        id: 'q1',
        question: 'Which hook is used for side effects in React?',
        options: ['useState', 'useEffect', 'useContext', 'useReducer'],
        correctAnswer: 1
      },
      {
        id: 'q2',
        question: 'What is the correct dependency array for useEffect to run only once?',
        options: ['[]', '[1]', 'null', 'undefined'],
        correctAnswer: 0
      }
    ]
  },
  {
    id: '4',
    title: 'Data Structures: Binary Tree',
    description: 'Implement various binary tree operations including insertion, deletion, and traversal.',
    type: 'coding',
    status: 'active',
    startDate: new Date('2024-12-10T12:00:00Z'),
    endDate: new Date('2024-12-12T12:00:00Z'),
    duration: 180,
    participants: 156,
    problemStatement: `
Implement a Binary Search Tree with the following operations:

1. Insert a node
2. Delete a node
3. Search for a value
4. In-order traversal

Your BST should maintain the binary search tree property where left children are less than the parent and right children are greater than the parent.
    `,
    starterCode: {
      javascript: `class TreeNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

class BST {
    constructor() {
        this.root = null;
    }
    
    insert(val) {
        // Your implementation here
    }
    
    delete(val) {
        // Your implementation here
    }
    
    search(val) {
        // Your implementation here
    }
    
    inorderTraversal() {
        // Your implementation here
    }
}`
    }
  }
];

export const mockLeaderboard = [
  { rank: 1, username: 'CodeMaster_2024', score: 950, contestsWon: 12, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
  { rank: 2, username: 'AlgorithmAce', score: 920, contestsWon: 8, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
  { rank: 3, username: 'DevQueen', score: 890, contestsWon: 10, avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' },
  { rank: 4, username: 'ByteNinja', score: 875, contestsWon: 7, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face' },
  { rank: 5, username: 'ScriptSorcerer', score: 850, contestsWon: 9, avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face' }
];