import type React from "react";
import { useState } from "react";
import { loginAdmin } from "../../api/adminAuth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminLoginSuccess } from "../../redux/Slices/adminSlice";
import "./AdminLogin.css"

export default function AdminLogin(){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");

    const handleLogin = async(e: React.FormEvent) => {
        e.preventDefault()
        if(!email || !password) {
            setError("Please fill in both fields")
            return
        }
        const data = await loginAdmin(email,password);
        const adminData = {...data.admin,token:data.token}
        dispatch(adminLoginSuccess(adminData));
        navigate('/admin/profile');
    }

    return (
        <div className="admin-login">
            <div className="admin-login__card">
                <h1 className="admin-login__title">Admin Login</h1>
                {error && <div className="admin-login__error">{error}</div> }
                <form className="admin-login__form" onSubmit={handleLogin}>
                    <div className="admin-login__input-group">
                        <label htmlFor="email" className="admin-login__label">
                            Email:
                        </label>
                        <input 
                        type="email" 
                        id="email"
                        className="admin-login__input"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        placeholder="Enter your email"
                        />
                    </div>
                    <div className="admin-login__input-group">
                        <label htmlFor="password" className="admin-login__label">
                            Password:
                        </label>
                        <input 
                        type="password"
                        id="password"
                        className="admin-loin__input"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        placeholder="Enter your password"
                        />
                    </div>
                    <button type="submit" className="admin-login__button">
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}