import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL:"https://sway-backend.onrender.com",
    headers : {
        authorization : `Bearer ${localStorage.getItem('token')}`
    },
    // withCredentials:true
});