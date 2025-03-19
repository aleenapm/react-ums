import React, { useState } from "react";
import { uploadImageToCloudinary } from "../../api/uploadImage";

interface UserProps {
    user: {
        _id: string;
        name: string;
        email: string;
        phone: string;
        profileImage: string;
    };
    onClose: () => void;
    onSave: (updatedUser: {
        _id: string;
        name: string;
        email: string;
        phone: string;
        profileImage: string;
    }) => void;
}

export default function EditUserModel({ user, onClose, onSave }: UserProps) {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);
    const [image, setImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState(user.profileImage);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; image?: string }>({});

    const validateInputs = () => {
        let newErrors: { name?: string; email?: string; phone?: string; image?: string } = {};

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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

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

        let imageUrl = user.profileImage;
        try {
            if (image) {
                imageUrl = await uploadImageToCloudinary(image);
            }
            onSave({
                _id: user._id,
                name,
                email,
                phone,
                profileImage: imageUrl,
            });
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
                <h2>Edit Profile</h2>

                <label>Profile Image:</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {previewImage && <img src={previewImage} alt="Preview" className="preview-image" />}

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

                <div className="modal-buttons">
                    <button onClick={handleSaveChanges} className="save-btn" disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </button>
                    <button onClick={onClose} className="cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    );
}
