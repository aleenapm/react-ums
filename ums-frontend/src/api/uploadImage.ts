export const uploadImageToCloudinary = async (file:any):Promise<string> => {
    const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dssd8hfyf/image/upload";
    const CLOUDINARY_UPLOAD_PRESET = "ml_default";

    const formData = new FormData();
    formData.append('file',file);
    formData.append('upload_preset',CLOUDINARY_UPLOAD_PRESET);

    try{
        const response = await fetch(CLOUDINARY_UPLOAD_URL, {
            method:"POST",
            body:formData
        })
        const data = await response.json();
        if(!data.secure_url){
            throw new Error("Image upload failed")
        }
        return data.secure_url;
    } catch (error) {
        console.error("Image upload error:", error);
        throw new Error("Image upload failed");
    }
}