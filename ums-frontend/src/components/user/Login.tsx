import { useState } from "react"
import { useDispatch } from "react-redux";
import { login } from "../../api/userAuth";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../redux/Slices/userSlice";
import "./Login.css"

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{email?:string; password?: string }>({});
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const validateInputs = () => {

        let newErrors: {email?:string; password?:string} = {};

        if(!email.trim()) {
            newErrors.email = "Email is required.";
        } else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Invalid email format.";
        }

        if(!password.trim()){
            newErrors.password = "Password is required.";
        } else if(password.length < 6){
            newErrors.password = "Password must be at least 6 characters.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if(!validateInputs()) return;

        setLoading(true);
        try{
            const data = await login(email, password);
            const userData = {...data.user, token:data.token};
            dispatch(loginSuccess(userData));
            navigate("/dashboard");
        } catch (error:any) {
            setErrors({password:"Login failed. Please check your credentials."})
        } finally {
            setLoading(false);
        }
    };

    const handleAdminLogin = (e: React.MouseEvent) => {
        e.preventDefault(); 
        navigate("/admin/login");
    };

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <div className="login-box">
                    <div className="login-header">
                        <h2>Welcome Back</h2>
                        <p className="login-subtitle">Please enter your details to sign in</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input 
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                            placeholder="Enter your email" 
                            />
                        {errors.email && <div className="error-message">{errors.email}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input 
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            placeholder="Enter your password" 
                            />
                            {errors.password && <div className="error-message">{errors.password}</div>}
                        </div>

                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? "Signing in..." : "Sign in"}
                        </button>

                        <button className="adminlogin-button" onClick={handleAdminLogin}>
                            Admin Login
                        </button>

                        <div className="signup-prompt">
                            Don't have an account? <a href="/register">Sign up</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login