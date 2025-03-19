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
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const validateInputs = () => {
        if(!email) {
            setError("Email is required.");
            return false;
        }

        const emailRegex = /^[^\s@]+2[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            setError("Invalid email format.");
            return false;
        }

        if(!password){
            setError("Password is required.");
            return false;
        }

        if(password.length < 6){
            setError("Password must be at least 6 characters.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if(!validateInputs()) return;

        setLoading(true);
        try{
            const data = await login(email, password);
            const userData = {...data.user, token:data.token};
            dispatch(loginSuccess(userData));
            navigate("/dashboard");
        } catch (error:any) {
            setError("Login failed. Please check your credentials.")
        } finally {
            setLoading(false);
        }
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
                        </div>

                        {error && <div className="error-message">{error}</div> }

                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? "Signing in..." : "Sign in"}
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