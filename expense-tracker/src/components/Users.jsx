import React, { useEffect, useState } from 'react'
import api from '../lib/api'

export default function Users() {
    const [user,setUser] = useState([])
    useEffect(()=>{
       const fetchUser = async ()=>{
        try{
            const response = await api.get("/users");
            console.log("Response Is ",response);
            setUser(response)
            console.log('Data',user)
            localStorage.setItem("User_id",response.id);
            console.log("Id is",user.id);
            
            
        }catch(err){
            console.error("Error fetching users:", err);
        }
       };
       fetchUser();
    },[])
   
  return (
    <div>
        <h1>User Details</h1>
        <h2>Welcome {user.name}</h2>
        <div>
           <p>{user.email}</p>
           <p>{user.password}</p>
           <p>{user.roles}</p>
           <p>{user.expense}</p>
        </div>
        <a href='/expense/add-expense'>Add Expense</a>
    </div>
  )
}
