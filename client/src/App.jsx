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
import StudentLayout from "@/layouts/StudentLayout.jsx";
import CourseDetail from "@/pages/Student/Course/CourseDetail.jsx";
import PaymentSuccess from "@/pages/Student/Course/PaymentSuccess.jsx";
import Verify from "@/pages/Auth/Verify.jsx";
import Courses from "@/pages/Courses.jsx";
import Navbar from "@/components/Navbar.jsx";

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/verify-email" element={<VerifyEmail/>} />
        <Route path="/verify" element={<Verify/>} />
        
        <Route path="/" element={<Hero/>} />
        <Route path="/courses" element={<Courses/>} />
        <Route path="/course/:id" element={<CourseDetail/>} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        
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
        
        <Route
          path="/student/*"
          element={
            <ProtectedRoute roles={["student"]}>
              <DashboardLayout>
                <StudentLayout />
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