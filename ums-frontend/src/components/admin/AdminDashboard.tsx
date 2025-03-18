import { useDispatch,useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../redux/store"
import { useEffect, useState } from "react";
import { deleteUser, fetchAllUsers } from "../../redux/Slices/adminSlice";
import { createUserAPI, updateUserAPI } from "../../api/adminAuth";
import { toast } from "react-toastify";
import './AdminDashboard.css'
import Swal from "sweetalert2";
import AddUserModel from "./AddUserModel";
import EditUserModel from "./EditUserModel"

interface Userdate{
    _id:string,
    name:string,
    phone:number,
    email:string,
    password:string,
    profileImage:string
}

export default function AdminDashboard() {
    const dispatch = useDispatch<AppDispatch>();
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<string | null>(null);
    const [isAddUserModalOpen,setIsAddUserModalOpen] = useState(false);
    const [isEditUserModalOpen,setIsEditUserModalOpen] = useState(false);
    const [selectedUser,setSelectedUser] = useState<Userdate | null>(null);
    const [searchQuery,setSearchQuery] = useState<string>("")

    const users = useSelector((state: RootState) => state.admin.users) || [];
    const admin = useSelector((state: RootState) => state.admin.admin);

    useEffect(() => {
        const getUsers = async () => {
            try{
                setLoading(true);
                if(admin?.token){
                    await dispatch(fetchAllUsers(admin.token));
                }else{
                    setError('No authentication token available');
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch users');
                setLoading(false);
            }
        };
        getUsers();
    },[dispatch, admin?.token]);

    const handleCreateUser = async (userDate:Userdate)=>{
        try{
            const response = await createUserAPI(userDate);
            if(response.status === 200){
                toast.success("User created successfully");
                if(admin?.token){
                    await dispatch(fetchAllUsers(admin.token));
                }else{
                    toast.error("Failed to create user");
                }
            }
        } catch (error) {
            console.error("Error creating user:", error);
            toast.error("An error occured while creating the user.");
        }
    }

    const handleEditUser = async (userdata:any) => {
        setSelectedUser(userdata);
        setIsEditUserModalOpen(true);
    }

    const handleUpdateUser = async (updateUser:any) => {
        try{
            if(!admin?.token){
                toast.error("admin token missing");
                return
            }
            const response = await updateUserAPI(updateUser,admin?.token);
            if(response.status == 200){
                toast.success("User updated successfully");
                await dispatch(fetchAllUsers(admin?.token))
            }
        } catch (error) {

        }
    }

    const handleDeleteUser = async (id:string) => {
        try{
            if(!admin?.token){
                toast.error("Admin token missing");
                return;
            }
            const confirmed = await Swal.fire({
                title:"Are you sure?",
                text:"You won't be able to revert this!",
                icon:"warning",
                showCancelButton: true,
                confirmButtonColor:"#d33",
                cancelButtonColor:"#3085d6",
                confirmButtonText:"Yes, delete it!",
                cancelButtonText:"No, cancel!",
            });
            if(!confirmed.isConfirmed) return;
            await dispatch(deleteUser({userId:id, token: admin.token}))
            toast.success("User deleted successfully");
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user");
        }
    }

    const filteredUsers = users.filter(user=>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if(loading) return <div className="loading">Loading...</div>;
    if(error) return <div className="error">{error}</div>

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Admin Dashboard</h1>

            <button className="add-user-btn" onClick={()=>setIsAddUserModalOpen(true)}>Add User</button>

            <input type="text" 
            placeholder="Search  by name" 
            value={searchQuery} 
            onChange={(e)=>setSearchQuery(e.target.value)} 
            className="search-button"/>

            <table className="users-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user,index) => (
                            <tr key={index}>
                                <td><img src={user.profileImage || '/default-avatar.png'} alt="User" className="user-image" /></td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{String(user.phone)}</td>
                                <td>
                                    <button className="edit-btn" onClick={()=>handleEditUser(user)}>Edit</button>
                                    <button className="delete-btn" onClick={()=>handleDeleteUser((user as any)._id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ): (
                        <tr><td colSpan={5} className="no-users">No users found.</td></tr>
                    )}
                </tbody>
            </table>
            {isAddUserModalOpen && <AddUserModel onClose={()=>setIsAddUserModalOpen(false)}
                 onUserCreated={handleCreateUser}/>}

            {isEditUserModalOpen && selectedUser && <EditUserModel user={{...selectedUser,phone:String(selectedUser.phone)}} onClose={()=>setIsEditUserModalOpen(false)} onSave={handleUpdateUser} />}
        </div>
    )
}