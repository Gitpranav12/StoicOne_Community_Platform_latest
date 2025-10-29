import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import DashboardLayout from "./components/Dashboard";
// import Home from "./pages/Home";
// import Questions from "./pages/Questions";
// import Tags from "./pages/Tags";
// import Chat from "./pages/Chat";
import UsersPage from "./components/user/UsersPage";
import DashboardHome from "./components/home/Dashboardhome";
import DashboardHomeAdmin from "./components/home/Dashboardadmin";
// import ModeratorPage from "./components/moderator/ModeratorPage";
import AskQuestionWrapper from "./components/ask_question/AskQuestionWrapper";
import QuestionsPage from "./components/questionlist/QuestionsPage";
import QuestionDetailsWrapper from "./components/questionlist/QuestionDetailsWrapper";
import AiAssistant from "./components/AiAssistant";
import Signup from "./pages/Signup/index";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Login from "./pages/Login/index";
import TagsPage from "./components/tags/TagsPage";
import Articles from "./components/Articles";
import UserProfile from "./components/UserProfilePage/pages/UserProfile";
import UserPublicProfile from "./components/UserProfilePage/pages/UserPublicProfile";
import { UserProvider } from "./components/UserProfilePage/context/UserContext";
import HowToAsk from './components/help/HowToAsk';
import HowToAnswer from './components/help/HowToAnswer';
import WhyEditPosts from './components/help/WhyEditPosts';
import ExploreCollectives from './components/collectives/ExploreCollectives';
import { CollectivesProvider } from './components/collectives/CollectivesContext';
import CollectivesPage from "./components/collectives/CollectivePage";
import Productpage from "./components/productpage/Productpage";
import ContactForm from "./components/productpage/components/pages/ContactForm";
// Admin Dashboard pages

import UsersAdmin from "./components/adminDashboard/pages/UsersAdmin";
import QuestionsAdmin from "./components/adminDashboard/pages/QuestionsAdmin";
import AnswersAdmin from "./components/adminDashboard/pages/AnswersAdmin";
import TagsAdmin from "./components/adminDashboard/pages/TagsAdmin";
import CollectivesAdmin from "./components/adminDashboard/pages/CollectivesAdmin";
import AnalyticsAdmin from "./components/adminDashboard/pages/AnalyticsAdmin";

import EventsUserPage from "./components/eventsUser/EventsUserPage";
import ContestPage from "./components/eventsUser/ContestPage";
import ProgressPage from "./components/eventsUser/ProgressPage";
import CodeCompilerPage from "./components/eventsUser/CodeCompiler";
import QuizPage from "./components/quiz/QuizPage";
import { LayoutProvider } from "./context/LayoutContext";

import ProtectedRoute from "./ProtectedRoute";

// admin events pages
import EventsAdminPage from "./components/adminEvents/EventsAdminPage";
import CreateContestForm from "./components/adminEvents/CreateContestForm";
import ContestDetails from "./components/adminEvents/ContestDetails";
import { Toaster } from 'react-hot-toast';
import SubmissionDetail from "./components/adminEvents/SubmissionDetail";
// Result page
import ResultWrapper from "./components/eventsUser/Result/ResultWrapper";
// data page
import DataPage from "./components/adminDashboard/datapages/DataPage"; // adjust path as needed


export default function App() {


  return (
    <>
      <Toaster
        position="top-center" // top-center of screen
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#f9f9f9', // light gray
            color: '#333',
            minWidth: '250px',
          },
        }}
      />

      <UserProvider>
        <CollectivesProvider>
        <LayoutProvider>
          <Router>

            {/* <Routes>
      
          <Route path="/questions" element={<Questions />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/chat" element={<Chat />} />
        </Routes> */}
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />

              <Route path="/Signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              {/* home */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardHome /></ProtectedRoute>} />
              <Route path="/admin-dashboard" element={<ProtectedRoute><DashboardHome /></ProtectedRoute>} />
              {/* Admin Dashboard with nested tabs
=======
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/Signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              {/* home */}
              {/* <Route path="/dashboard" element={<ProtectedRoute><DashboardHome /></ProtectedRoute>} /> */}
              {/* <Route path="/admin-dashboard" element={<ProtectedRoute><DashboardHomeAdmin /></ProtectedRoute>} /> */}
              {/* Admin Dashboard with nested tabs
>>>>>>> 54ce30f07109cb86fd79ca48e0f605540d4ea4da
              <Route path="/admin/*" element={<AdminDashboardPage />} /> */}
              {/* User */}
              <Route path="/user" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
              {/* <Route path="/moderator" element={<ModeratorPage />} /> */}
              <Route path="/askquestion" element={<ProtectedRoute><AskQuestionWrapper /></ProtectedRoute>} />
              <Route path="/questions" element={<ProtectedRoute><QuestionsPage /></ProtectedRoute>} />
              {/* NEW: Question Details */}
              <Route path="/questions/:id" element={<ProtectedRoute><QuestionDetailsWrapper /></ProtectedRoute>} />
              <Route path="/AiAssistant" element={<AiAssistant />} />
              <Route path="/tags" element={<ProtectedRoute><TagsPage /></ProtectedRoute>} />

              <Route path="/Articles" element={<ProtectedRoute><Articles /></ProtectedRoute>} />
              {/* User profile main page */}
              <Route path="/profile/*" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

              {/* Help Section */}
              <Route path="/help/how-to-ask" element={<ProtectedRoute><HowToAsk /></ProtectedRoute>} />
              <Route path="/help/how-to-answer" element={<ProtectedRoute><HowToAnswer /></ProtectedRoute>} />
              <Route path="/help/editing" element={<ProtectedRoute><WhyEditPosts /></ProtectedRoute>} />
              {/* Explore all collectives */}
              <Route path="/collectives" element={<ProtectedRoute><ExploreCollectives /></ProtectedRoute>} />
              <Route path="/collectives/:id" element={<ProtectedRoute><CollectivesPage /></ProtectedRoute>} />

              {/*.......Admin Dashboard routes......  */}
              <Route path="/admin" element={<ProtectedRoute><AnalyticsAdmin /></ProtectedRoute>} />
              <Route path="/admin/tags" element={<ProtectedRoute><TagsAdmin /></ProtectedRoute>} />
              <Route path="/admin/collectives" element={<ProtectedRoute><CollectivesAdmin /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute><UsersAdmin /></ProtectedRoute>} />
              <Route path="/admin/questions" element={<ProtectedRoute><QuestionsAdmin /></ProtectedRoute>} />
              <Route path="/admin/answers" element={<ProtectedRoute><AnswersAdmin /></ProtectedRoute>} />

              <Route path="/users/:id/*" element={<ProtectedRoute><UserPublicProfile /></ProtectedRoute>} />

              <Route path="/admin/events" element={<ProtectedRoute><EventsAdminPage /></ProtectedRoute>} />
              <Route path="/events" element={<ProtectedRoute><EventsUserPage /></ProtectedRoute>} />
              <Route path="/events/contest/:id" element={<ProtectedRoute><ContestPage /></ProtectedRoute>} />
              <Route path="/events/progress/:id" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
              <Route path="/events/code/:contestId/:roundId" element={<ProtectedRoute><CodeCompilerPage /></ProtectedRoute>} />
              <Route path="/events/quiz/:contestId/:roundId" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />


              {/* Product Page */}
              <Route path="/product" element={<Productpage />} />
              <Route path="/contact" element={<ContactForm />} />
              {/* admin events pages routes */}
              <Route path="/admin/events" element={<ProtectedRoute><EventsAdminPage /></ProtectedRoute>} />
              <Route path="/admin/events/createContest" element={<ProtectedRoute><CreateContestForm /></ProtectedRoute>} />
              <Route path="/admin/events/contestDetails" element={<ProtectedRoute><ContestDetails /></ProtectedRoute>} />
              <Route path="/admin/events/submissionDetails" element={<ProtectedRoute><SubmissionDetail /></ProtectedRoute>} />
              {/* Result Page */}
              <Route path="/events/result" element={<ProtectedRoute><ResultWrapper /></ProtectedRoute>} />

              {/* Schedule demo and contacts */}
              <Route path="/admin/data" element={<ProtectedRoute><DataPage /></ProtectedRoute>} />


            </Routes>

          </Router>
          </LayoutProvider>
        </CollectivesProvider>

      </UserProvider>
    </>
  );
}




// import { Routes, Route } from "react-router-dom";
// import { GoogleOAuthProvider } from "@react-oauth/google";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import ModeratorPage from "./pages/ModeratorPage";
// import MemberPage from "./pages/MemberPage";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Register from "./pages/Register";
// import ForgotPassword from "./pages/ForgotPassword";

// function App() {
//   return (
//     <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
//       <Routes>
//
//         <Route
//           path="/moderator"
//           element={
//             <ProtectedRoute roles={["Moderator"]}>
//               <ModeratorPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="/dashboard" element={<Dashboard />} />
//       </Routes>
//     </GoogleOAuthProvider>
//   );
// }

// export default App;
