import { useState } from "react";
import { uploadImageToCloudinary } from "../../api/uploadImage";

interface AddUserModelProps {
    onClose: () => void;
    onUserCreated: (userdata: any) => Promise<void>;
}

export default function AddUserModel({ onClose, onUserCreated }: AddUserModelProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [password, setPassword] = useState("");
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; password?: string; image?: string }>({});

    const validateInputs = () => {
        let newErrors: { name?: string; email?: string; phone?: string; password?: string; image?: string } = {};

        if (!name.trim()) {
            newErrors.name = "Name is required.";
        } else if (name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters.";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Invalid email format.";
        }

        if (!phone.trim()) {
            newErrors.phone = "Phone number is required.";
        } else if (!/^\d{10}$/.test(phone)) {
            newErrors.phone = "Phone number must be exactly 10 digits.";
        }

        if (!password.trim()) {
            newErrors.password = "Password is required.";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        }

        if (!image) {
            newErrors.image = "Profile image is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                setErrors((prev) => ({ ...prev, image: "Only image files are allowed." }));
                return;
            }

            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
            setErrors((prev) => ({ ...prev, image: undefined }));
        }
    };

    const handleSaveChanges = async () => {
        if (!validateInputs()) return;

        setLoading(true);

        let imageUrl = "";
        try {
            if (image) {
                imageUrl = await uploadImageToCloudinary(image);
            }
            const newUser = {
                name,
                email,
                phone,
                password,
                profileImage: imageUrl,
            };
            await onUserCreated(newUser);
            onClose();
        } catch (error) {
            setErrors((prev) => ({ ...prev, image: "Image upload failed. Please try again." }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Add User</h2>

                <label>Profile Image:</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {previewImage && <img src={previewImage} alt="Preview" className="preview-image" />}
                {errors.image && <p className="error-message">{errors.image}</p>}

                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                {errors.name && <p className="error-message">{errors.name}</p>}

                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                {errors.email && <p className="error-message">{errors.email}</p>}

                <label>Phone:</label>
                <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    maxLength={10}
                />
                {errors.phone && <p className="error-message">{errors.phone}</p>}

                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {errors.password && <p className="error-message">{errors.password}</p>}

                <div className="modal-buttons">
                    <button onClick={handleSaveChanges} className="save-btn" disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </button>
                    <button onClick={onClose} className="cancel-btn">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
