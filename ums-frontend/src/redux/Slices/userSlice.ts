import {createSlice, PayloadAction, createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';
import { API_URL } from "../../api/userAuth";

interface User{
    id:string,
    name:string,
    email:string,
    role:string,
    token:string,
    profileImage:string,
    phone:Number
}

interface AuthState{
    user: User | null;
    loading: boolean;
    error:string| null;
}

const initialState : AuthState = {
    user: null,
    loading:false,
    error:null
}

export const updateUserProfile = createAsyncThunk(
    "auth/updateUserProfile",
    async(updatedData:Partial<User>, {rejectWithValue}) => {
        try{
            const response = await axios.put(`${API_URL}/updateProfile`,updatedData, {
                headers:{Authorization:`Bearer ${updatedData.token}`}
            });
            console.log("API Response", response.data);
            return response.data.user
        } catch (error) {
            return rejectWithValue("Failed to update profile");
        }
    }
)

const authSlice  = createSlice({
    name:"auth",
    initialState,
    reducers:{
        loginSuccess:(state,action:PayloadAction<User>) => {
            state.user = action.payload;
        },
        logout:(state)=>{
            state.user = null;
        }
    },
    extraReducers:(builder) => {
        builder
        .addCase(updateUserProfile.pending,(state)=>{
            state.loading = true,
            state.error = null
        })
        .addCase(updateUserProfile.fulfilled,(state,action:PayloadAction<User>)=>{
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(updateUserProfile.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload as string;
        });
    }
})

export const {loginSuccess,logout} = authSlice.actions;
export default authSlice.reducer