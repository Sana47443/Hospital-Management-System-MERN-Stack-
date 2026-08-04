import axios from 'axios';
export const api=axios.create({baseURL:import.meta.env.VITE_API_URL||'/api',timeout:15000});
api.interceptors.request.use((config)=>{const token=localStorage.getItem('hospital_token');if(token)config.headers.Authorization=`Bearer ${token}`;return config;});
api.interceptors.response.use(r=>r,err=>{if(err.response?.status===401){localStorage.removeItem('hospital_token');localStorage.removeItem('hospital_user');if(!location.pathname.includes('/login'))location.href='/login';}return Promise.reject(err);});
