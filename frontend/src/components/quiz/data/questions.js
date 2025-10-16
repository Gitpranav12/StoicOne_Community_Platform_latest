// src/components/quiz/data/questions.js

export const questions = [
  {
    // Corresponds to "Logical Reasoning Question"
    title: "Logical Reasoning Question",
    questions: [
      {
        id: 1,
        question: "If 'CAT' is coded as 'DDU', how is 'DOG' coded?",
        options: ["EPH", "DPK", "EPI", "EPJ"],
        correctAnswerIndex: 2 // Assuming correct answer is 'EPI'
      },
      {
        id: 2,
        question: "Find the odd one out: Apple, Banana, Potato, Orange.",
        options: ["Apple", "Banana", "Potato", "Orange"],
        correctAnswerIndex: 2 // Potato is a vegetable, others are fruits
      }
    ]
  },
  {
    // Corresponds to "Quantitative Aptitude Question"
    title: "Quantitative Aptitude Question",
    questions: [
      {
        id: 3,
        question: "What is 20% of 200?",
        options: ["20", "40", "10", "100"],
        correctAnswerIndex: 1 
      },
      {
        id: 4,
        question: "If a train travels 60km/h, how far does it travel in 30 minutes?",
        options: ["30 km", "60 km", "20 km", "45 km"],
        correctAnswerIndex: 0 
      }
    ]
  },
  {
    // Corresponds to "Verbal Reasoning Question"
    title: "Verbal Reasoning Question",
    questions: [
      {
        id: 5,
        question: "Choose the word that means the opposite of 'Flexible'.",
        options: ["Bendable", "Rigid", "Pliable", "Supple"],
        correctAnswerIndex: 1 
      },
      {
        id: 6,
        question: "Complete the analogy: Bird is to Nest as Human is to...?",
        options: ["Car", "City", "House", "Tree"],
        correctAnswerIndex: 2 
      }
    ]
  },
  {
    // Corresponds to "Data Interpretation Question"
    title: "Data Interpretation Question",
    questions: [
      {
        id: 7,
        question: "If a bar graph shows 50 sales in January and 70 in February, what is the percent increase?",
        options: ["20%", "40%", "25%", "50%"],
        correctAnswerIndex: 1 
      },
      {
        id: 7,
        question: "If a bar graph shows the sales of 120 units in March and 90 units in April, what is the percent decrease?",
        options: ["25%", "33.33%", "20%", "22.5%"],
        correctAnswerIndex: 1 
      },
      
    ]
  }
];

// Export the sections array
export default questions;