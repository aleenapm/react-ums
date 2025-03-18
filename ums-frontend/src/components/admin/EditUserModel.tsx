import React, {useState} from "react";
import { uploadImageToCloudinary } from "../../api/uploadImage";

interface UserProps {
    user: {
        _id: string;
        name: string;
        email:string;
        phone: string;
        profileImage: string;
    };
    onClose: () => void;
    onSave: (updateUser: {
        _id: string;
        name: string;
        email: string;
        phone: string;
        profileImage: string;
    }) => void;
}

export default function EditUserModel({ user, onClose, onSave }: UserProps) {
    const [name,setName] = useState(user.name);
    const [email,setEmail] = useState(user.email);
    const [phone,setPhone] = useState(user.phone);
    const [image,setImage] = useState<File | null>(null)
    const [previewImage,setPreviewImage] = useState(user.profileImage);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState<string | null>(null);

    const validateInputs = () => {
        if(!name || name.trim().length < 2) {
            return "Name must be at least 2 characters long.";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return "Invalid email format.";
        }
        if(!/^\d{10}$/.test(phone)) {
            return "Phone number must be a 10-digit number."
        }
        return null;
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if(!file.type.startsWith("image/")) {
                setError("Only image files are allowed.");
                return;
            }

            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
            setError(null);
        }
    };

    const handleSaveChanges = async () => {
        const validationError = validateInputs();
        if(validationError){
            setError(validationError);
            return;
        }

        setLoading(true);
        setError(null);

        let imageUrl = user?.profileImage;
        if(image){
            imageUrl = await uploadImageToCloudinary(image);
        }

        onSave({
            _id:user._id,
            name,
            email,
            phone,
            profileImage: imageUrl,
        });

        setLoading(false);
        onClose();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Edit Profile</h2>
                {error && <p className="error-message">{error}</p> }

                <label>Profile Image:</label>
                <input type="file" accept="image/*" onChange={handleImageChange}/>
                {previewImage && (
                    <img src={previewImage} alt="Preview" className="preview-image" />
                )}
                
                <label>Name:</label>
                <input type="text" value={name} onChange={(e)=>setName(e.target.value)} />

                <label>Email:</label>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>

                <label>Phone:</label>
                <input type="text" value={phone} onChange={(e)=>setPhone(e.target.value.replace(/\D/g,""))} maxLength={10}/>

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
    )
}