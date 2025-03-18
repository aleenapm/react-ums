import { useState } from "react";
import { uploadImageToCloudinary } from "../../api/uploadImage";

interface AddUserModelProps{
    onClose: () => void;
    onUserCreated:(userdata:any) => Promise<void>;
}

export default function AddUserModel({onClose,onUserCreated}:AddUserModelProps){
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [phone,setPhone] = useState("");
    const [image,setImage] = useState<File | null>(null);
    const [password,setPassword] = useState("");
    const [previewImage,setPreviewImage] = useState<string | null>(null);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState<string | null>(null);

    const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(file){
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    }

    const handleSaveChanges = async() => {
        if(!name || !email || !phone || !image || !password){
            setError("All fields are required")
            return;
        }
        setLoading(true);
        try{
            let imageurl = "";
            if(image){
                imageurl = await uploadImageToCloudinary(image);
            }
            const newUser = {
                name,
                email,
                phone,
                password,
                profileImage:imageurl
            }
            await onUserCreated(newUser);
            onClose();
        } catch (error) {
            setError("Error creating user.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Add User</h2>
                {error && <p className="error-message">{error}</p>}

                <label>Profile Image:</label>
                <input type="file" accept="image/*" onChange={handleImageChange}/>
                {previewImage && <img src={previewImage} alt="Preview" className="preview-image"/>}

                <label>Name:</label>
                <input type="text" value={name} onChange={(e)=>setName(e.target.value)} />

                <label>Email:</label>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />

                <label>Phone:</label>
                <input type="text" value={phone} onChange={(e)=>setPhone(e.target.value.replace(/\D/g,""))} />

                <label>Password:</label>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />

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