import axios from 'axios';
//axios instance made global as to prevent the need to do each api call individually
export const axiosInstance =axios.create({
    headers:{
        authorization : `Bearer ${localStorage.getItem('token')}`   
    }
});