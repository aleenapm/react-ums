import axios from 'axios';

export const API_URL = "http://localhost:5000/users";

export const login = async (email:string, password:string) => {
    const response = await axios.post(`${API_URL}/login`,{email,password});
    return response.data
}

export const register = async (name:string, email:string, phone:number, password:string, image:string) => {
    try{
        const response = await axios.post(`${API_URL}/register`,{
            name,
            email,
            phone,
            password,
            image
        });
        console.log(response);

        return response.data;
    } catch (error:any) {
        if(error.response){
            throw new Error(error.response.data.message || "Registration Failed");
        }else{
            throw new Error("Something went wrong. Please try again.");
        }
    } 
}