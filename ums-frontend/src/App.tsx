import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { ProtectedRoute, RedirectRoute } from "./components/ProtectedRoute"
import Login from "./components/user/Login"
import Register from "./components/user/Register"
import AdminLogin from "./components/admin/AdminLogin"
import Dashboard from "./components/user/Dashboard"
import AdminDashboard from "./components/admin/AdminDashboard"
import AdminProfile from "./components/admin/AdminProfile"
import NotFound from "./components/Notfound"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<RedirectRoute/>}>
        <Route path="/" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/admin/login" element={<AdminLogin/>}/>
        </Route>
        <Route element={<ProtectedRoute/>}>
        <Route path="/dashboard" element={<Dashboard/>}/>
        </Route>
        <Route element={<ProtectedRoute isAdmin={true}/>}>
        <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
        <Route path="/admin/profile" element={<AdminProfile/>}/>
        </Route>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </Router>
  )
}

export default App;