import { RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminLogout } from "../../redux/Slices/adminSlice";
import './AdminProfile.css'

const AdminProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const admin = useSelector((state: RootState)=>state.admin.admin);

    if(!admin){
        return(
            <div className="loading-message">
                <p>No admin data available. Please log in.</p>
            </div>
        );
    }

    const handleLogout = () => {
        dispatch(adminLogout());
        navigate("/admin/login")
    };

    const handleDashboard = () => {
        navigate("/admin/dashboard");
    }

    return (
        <div className="admin-profile-container">
            <div className="admin-profile-card">
                <h2 className="admin-profile-title">Admin Profile</h2>

                <div className="profile-image-container">
                    <img 
                    src={admin.profileImage || "https://via.placeholder.com/150"} 
                    alt="Admin Profile"
                    className="profile-image" 
                    />
                </div>

                <div className="admin-info">
                    <div className="info-item">
                        <span className="info-label">Name:</span>
                        <span className="info-value">{admin.name}</span>
                    </div>

                    <div className="info-item">
                        <span className="info-label">Email:</span>
                        <span className="info-value">{admin.email}</span>
                    </div>

                    <div className="info-item">
                        <span className="info-label">Phone:</span>
                        <span className="info-value">{admin.phone}</span>{" "}
                    </div>
                </div>

                <div className="admin-actions">
                    <button className="dashboard-btn" onClick={handleDashboard}>
                        Dashboard
                    </button>
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AdminProfile