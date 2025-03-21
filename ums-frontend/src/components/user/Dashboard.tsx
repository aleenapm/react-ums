import { AppDispatch, RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import "./Dashboard.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { logout, updateUserProfile } from "../../redux/Slices/userSlice";
import { uploadImageToCloudinary } from "../../api/uploadImage";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const error = useSelector((state: RootState) => state.auth.error);
    const loading = useSelector((state: RootState) => state.auth.loading);
    const user = useSelector((state: RootState) => state.auth.user);
    const token = useSelector((state: RootState) => state.auth.user?.token);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState<string>(user?.phone ? String(user.phone) : "");
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleEditProfile = () => {
        setIsModalOpen(true);
        setValidationError(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    let mob = Number(phone);

    const validateForm = () => {
        if (!name.trim()) {
            setValidationError("Name is required.");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setValidationError("Invalid email format.");
            return false;
        }

        if (!phone.match(/^\d{10,}$/)) {
            setValidationError("Phone number must be at least 10 digits.");
            return false;
        }

        return true;
    };

    const handleSaveChanges = async () => {
        if (!validateForm()) return;

        let imageUrl = user?.profileImage;

        if (profileImage) {
            try {
                imageUrl = await uploadImageToCloudinary(profileImage);
                console.log("New image URL:", imageUrl);
            } catch (error) {
                setValidationError("Image upload failed. Please try again.");
                return;
            }
        }

        await dispatch(updateUserProfile({ name, email, phone: mob, token, profileImage: imageUrl }));
        setIsModalOpen(false);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfileImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    if (!user) {
        return (
            <div className="loading-message">
                <p>No user data available. Please log in.</p>
            </div>
        );
    }

    return (
        <div className="dashboard-containerr">
            <div className="dashboard-card fade-in">
                <div className="dashboard-header">
                    <h2 className="dashboard-title">Welcome, {user.name}</h2>
                </div>

                <div className="profile-image-container">
                    <img
                        src={user.profileImage || "https://via.placeholder.com/150"}
                        alt="Profile"
                        className="profile-image"
                    />
                </div>

                <div className="user-info">
                    <div className="info-item">
                        <span className="info-label">Email:</span>
                        <span className="info-value">{user.email}</span>
                    </div>

                    <div className="info-item">
                        <span className="info-label">Phone:</span>
                        <span className="info-value">{Number(user.phone)}</span>
                    </div>
                </div>

                <div className="dashboard-actions">
                    <button className="edit-profile-btn" onClick={handleEditProfile}>
                        Edit Profile
                    </button>
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>

                {isModalOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>Edit Profile</h2>
                            {validationError && <p className="error-message">{validationError}</p>}
                            {error && <p className="error-message">{error}</p>}

                            <label>Profile Image:</label>
                            <input type="file" accept="image/*" onChange={(e) => handleImageChange(e)} />
                            {previewImage && <img src={previewImage} alt="Preview" className="preview-image" />}

                            <label>Name:</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setValidationError(null);
                                }}
                            />

                            <label>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setValidationError(null);
                                }}
                            />

                            <label>Phone:</label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value.replace(/\D/, ""));
                                    setValidationError(null);
                                }}
                            />

                            <div className="modal-buttons">
                                <button onClick={handleSaveChanges} className="save-btn" disabled={loading}>
                                    {loading ? "Saving..." : "Save"}
                                </button>
                                <button onClick={() => setIsModalOpen(false)} className="cancel-btn">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
