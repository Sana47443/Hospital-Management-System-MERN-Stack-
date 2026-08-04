import {createContext,useContext,useMemo,useState} from 'react';
import {api} from '../api/client';
const C=createContext(null);
export function AuthProvider({children}){const [user,setUser]=useState(()=>JSON.parse(localStorage.getItem('hospital_user')||'null'));async function login(email,password){const {data}=await api.post('/auth/login',{email,password});localStorage.setItem('hospital_token',data.token);localStorage.setItem('hospital_user',JSON.stringify(data.user));setUser(data.user);}function logout(){localStorage.removeItem('hospital_token');localStorage.removeItem('hospital_user');setUser(null);}const value=useMemo(()=>({user,login,logout}),[user]);return <C.Provider value={value}>{children}</C.Provider>}
export const useAuth=()=>useContext(C);
