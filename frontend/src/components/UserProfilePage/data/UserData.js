const userData = {
  profile: {
    avatar: "https://i.pravatar.cc/48?img=5",
    name: "Sophia Bennett",
    designation: "Software Engineer",
    bio: "Passionate about building innovative solutions and contributing to the tech community. Experienced in full-stack development with a focus on creating scalable and user-friendly applications.",
    department: "Engineering", // ✅ Match one of the keys in departmentOptions
    email: "sophia.bennett@example.com",
    showProfile: false,
    score: "560"
  },

  account: {
    email: "sophia@gmail.com",
    currentPassword: "",
    newPassword: "",
  },

  stats: {
    Reputation: "1,234",
    Badges: "56",
    Questions: "78",
    Answers: "90",
    Contributions: "123"
  },

  activity: {
    questions: [
      { title: "How to optimize React app performance?", time: "2 weeks ago", votes: 12, answers: 5 },
      { title: "What is the difference between let, var, and const?", time: "1 weeks ago", votes: 8, answers: 3 },
      { title: "How does MongoDB handle indexing?", time: "1 month ago", votes: 5, answers: 2 },
      { title: "Explain closures in JavaScript?", time: "5 months ago", votes: 7, answers: 4 },
      { title: "What is middleware in Node.js?", time: "2 days ago", votes: 10, answers: 6 },
      { title: "Explain prototypal inheritance.", time: "2 weeks ago", votes: 6, answers: 2 },
      { title: "What is hoisting in JavaScript?", time: "2 years ago", votes: 9, answers: 3 },
    ],
    answers: [
      { question: "Difference between HTTP and HTTPS?", votes: 15 },
      { question: "What is event bubbling in JavaScript?", votes: 9 },
      { question: "Explain normalization in databases.", votes: 7 },
      { question: "What is a REST API?", votes: 12 },
      { question: "Explain lifecycle methods in React.", votes: 11 },
      { question: "What is CORS?", votes: 8 },
      { question: "Difference between SQL and NoSQL?", votes: 14 },
    ],
    tags: [
      { tag: "React", score: 150 },
      { tag: "JavaScript", score: 120 },
      { tag: "MongoDB", score: 90 },
      { tag: "Node.js", score: 80 },
      { tag: "Express", score: 70 },
      { tag: "CSS", score: 60 },
      { tag: "HTML", score: 50 },
      { tag: "Spring Boot", score: 40 },
    ],
    reputation: [
      { date: "Aug 2025", change: "+25 for accepted answer" },
      { date: "Jul 2025", change: "+10 for upvoted question" },
      { date: "Jun 2025", change: "+5 for upvoted answer" },
      { date: "May 2025", change: "+15 for bounty" },
      { date: "Apr 2025", change: "+20 for best answer" },
      { date: "Mar 2025", change: "+5 for upvote" },
      { date: "Feb 2025", change: "+30 for badge" },
    ],
  },

  achievements: {
    badges: [
      { id: 1, name: "Gold Contributor", desc: "Earned 1000 reputation points", icon: "🥇" },
      { id: 2, name: "Silver Helper", desc: "Earned 500 reputation points", icon: "🥈" },
      { id: 3, name: "Bronze Starter", desc: "Earned 100 reputation points", icon: "🥉" },
      { id: 4, name: "Top Answer", desc: "Answer selected as best 25 times", icon: "🏆" },
      { id: 5, name: "Tag Expert", desc: "Earned 10 tag badges", icon: "🏷️" },
      { id: 6, name: "Rising Star", desc: "First accepted answer", icon: "⭐" },
      { id: 7, name: "Community Builder", desc: "Asked 50 questions", icon: "👥" },
      { id: 8, name: "Consistency", desc: "Active 100 days in a row", icon: "📅" },
      { id: 9, name: "Bug Finder", desc: "Reported 20 issues", icon: "🔍" },
      { id: 10, name: "Yearly Active", desc: "1 Year active on platform", icon: "📆" },
    ],
    milestones: [
      { id: 1, title: "Reached 100 Reputation", date: "Jan 2024", progress: 100 },
      { id: 2, title: "First Silver Badge", date: "Feb 2024", progress: 60 },
      { id: 3, title: "Answered 100 Questions", date: "Apr 2024", progress: 75 },
      { id: 4, title: "500 Reputation Milestone", date: "Jun 2024", progress: 50 },
      { id: 5, title: "Earned Tag Expert Badge", date: "Aug 2024", progress: 30 },
      { id: 6, title: "Reached 1000 Reputation", date: "Sep 2024", progress: 20 },
    ],
  },

  departmentOptions: {
    Engineering: ["Software Engineer","Software Developer","Backend Developer","Frontend Developer","Java Developer","Full Stack Developer","Trainee Java Full Stack", "Python Developer", "Senior Developer", "Tech Lead", "CyberSecurity Engineer"],
    Testing: ["Software Test Engineer", "Software Test Trainee"],
    Data: ["Data Analyst", "Data Analyst Trainee", "Data Science Engineer", "Data Science Trainee"],
    Cloud: ["AWS Cloud Engineer", "Junior AWS Engineer"],
    "Human Resources": ["HR Executive", "HR Manager"],
    Marketing: ["Marketing Executive", "Marketing Manager"],
    Sales: ["Sales Executive", "Sales Manager"],
    Finance: ["Accountant", "Finance Manager"],
  },
};

export default userData;
