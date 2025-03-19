import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { register } from "../../api/userAuth";
import { uploadImageToCloudinary } from "../../api/uploadImage";
import "./Register.css"
import { toast } from "react-toastify";

const Register = () => {
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [phone,setPhone] = useState<number | undefined>(undefined);
    const [password,setPassword] = useState("");
    const [image,setImage] = useState<File | null>(null);
    const [error,setError] = useState<string | null>(null);
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();

    const validateInputs = () => {
        if(!name.trim()) return "Name is required.";
        if(!email.trim()) return "Email is required.";
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format.";
        if(!phone || phone.toString().length < 10) return "Valid phone number is required.";
        if(password.length < 6) return "Password must be at least 6 characters long.";
        return null;
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files.length > 0) {
            setImage(e.target.files[0])
        }
    }

    const handlePhoneChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPhone(value ? Number(value) : undefined);
    }

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const validationError = validateInputs();
        if(validationError){
            setError(validationError);
            setLoading(false);
            return;
        }

        try{
            let imageUrl = "";
            if(image){
                imageUrl = await uploadImageToCloudinary(image);
            }
            let mob = Number(phone);
            await register(name, email, mob, password, imageUrl);
            toast.success("Registration Successful");
            navigate("/");
        } catch (error: any) {
            setError(error.message)
        } finally { 
            setLoading(false);
        }
    }

    return (
        <div className="register-wrapper">
            <div className="register-conatiner">
                <div className="register-box">
                    <div className="register-header">
                        <h2>Create Account</h2>
                        <p className="register-subtitle">Please fill in your details to get started</p>
                    </div>

                    <form onSubmit={handleSubmit} className="register-form">
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input 
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                            placeholder="Enter your full name" 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input 
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                            placeholder="Enter your email" 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input 
                            type="tel"
                            id="phone"
                            value={phone}
                            onChange={handlePhoneChange}
                            placeholder="Enter your phone number" 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input 
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            placeholder="Create a password" 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="profile-image">Profile Picture</label>
                            <div className="file-input-wrapper">
                                <input 
                                type="file"
                                id="profile-image"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="file-input"
                                />
                                <div className="file-input-text">
                                    {image ? "uploadedImage" : "Choose a file or drag it here"}
                                </div>
                            </div>
                            <span className="file-input-help">Maximum file size: 5MB</span>
                        </div>

                        {error && <div className="error-message">{error}</div> }

                        <button type="submit" className="register-button" disabled={loading}>
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>

                        <div className="login-prompt">
                            Already have an account? <a href="/login">Sign in</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register