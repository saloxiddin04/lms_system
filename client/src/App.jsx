import {Route, Routes} from "react-router-dom";
import Register from "@/pages/Auth/Register.jsx";
import Login from "@/pages/Auth/Login.jsx";
import VerifyEmail from "@/pages/Auth/VerifyEmail.jsx";
import ProtectedRoute from "@/components/ProtectedRoute.jsx";
import AdminLayout from "@/layouts/AdminLayout.jsx";
import DashboardLayout from "@/layouts/DashboardLayout.jsx";
import TeacherLayout from "@/layouts/TeacherLayout.jsx";
import Hero from "@/pages/Hero.jsx";
import Error403 from "@/pages/Error403.jsx";
import Error404 from "@/pages/Error404.jsx";
import {Toaster} from "react-hot-toast";

function App() {

  return (
    <>
      <Routes>
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/verify-email" element={<VerifyEmail/>} />
        
        <Route path="/" element={<Hero/>} />
        
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute roles={["admin"]}>
              <DashboardLayout>
                <AdminLayout />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/teacher/*"
          element={
            <ProtectedRoute roles={["teacher"]}>
              <DashboardLayout>
                <TeacherLayout />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        
        <Route path="/403" element={<Error403 />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
      
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </>
  )
}

export default App

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import DashboardLayout from "@/layouts/DashboardLayout";
// import ProtectedRoute from "@/components/ProtectedRoute";
// import LoginPage from "@/pages/LoginPage";
// import StudentDashboard from "@/pages/student/Dashboard";
// import TeacherDashboard from "@/pages/teacher/Dashboard";
// import AdminDashboard from "@/pages/admin/Dashboard";
// import NotFound from "@/pages/NotFound";
// import Forbidden from "@/pages/Forbidden";
//
// function App() {
//   const user = JSON.parse(localStorage.getItem("user")); // authdan keladi
//   const logout = () => {
//     localStorage.removeItem("user");
//     window.location.href = "/login";
//   };
//
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<LoginPage />} />
//
//         {/* Student */}
//         <Route
//           path="/student/*"
//           element={
//             <ProtectedRoute user={user} roles={["student"]}>
//               <DashboardLayout user={user} onLogout={logout}>
//                 <StudentDashboard />
//               </DashboardLayout>
//             </ProtectedRoute>
//           }
//         />
//
//         {/* Teacher */}
//         <Route
//           path="/teacher/*"
//           element={
//             <ProtectedRoute user={user} roles={["teacher"]}>
//               <DashboardLayout user={user} onLogout={logout}>
//                 <TeacherDashboard />
//               </DashboardLayout>
//             </ProtectedRoute>
//           }
//         />
//
//         {/* Admin */}
//         <Route
//           path="/admin/*"
//           element={
//             <ProtectedRoute user={user} roles={["admin"]}>
//               <DashboardLayout user={user} onLogout={logout}>
//                 <AdminDashboard />
//               </DashboardLayout>
//             </ProtectedRoute>
//           }
//         />
//
//         <Route path="/403" element={<Forbidden />} />
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </Router>
//   );
// }
//
// export default App;

