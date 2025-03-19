import type React from "react";
import { useState } from "react";
import { loginAdmin } from "../../api/adminAuth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminLoginSuccess } from "../../redux/Slices/adminSlice";
import "./AdminLogin.css";

export default function AdminLogin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [loading, setLoading] = useState(false);

    const validateInputs = () => {
        let newErrors: { email?: string; password?: string } = {};

        if (!email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Invalid email format.";
        }

        if (!password.trim()) {
            newErrors.password = "Password is required.";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        
        if (!validateInputs()) return;

        setLoading(true);
        try {
            const data = await loginAdmin(email, password);
            const adminData = { ...data.admin, token: data.token };
            dispatch(adminLoginSuccess(adminData));
            navigate('/admin/profile');
        } catch (error: any) {
            setErrors({ password: "Login failed. Please check your credentials." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login">
            <div className="admin-login__card">
                <h1 className="admin-login__title">Admin Login</h1>
                
                <form className="admin-login__form" onSubmit={handleLogin}>
                    <div className="admin-login__input-group">
                        <label htmlFor="email" className="admin-login__label">Email:</label>
                        <input
                            type="email"
                            id="email"
                            className="admin-login__input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                        {errors.email && <div className="admin-login__error">{errors.email}</div>}
                    </div>

                    <div className="admin-login__input-group">
                        <label htmlFor="password" className="admin-login__label">Password:</label>
                        <input
                            type="password"
                            id="password"
                            className="admin-login__input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                        {errors.password && <div className="admin-login__error">{errors.password}</div>}
                    </div>

                    <button type="submit" className="admin-login__button" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}
