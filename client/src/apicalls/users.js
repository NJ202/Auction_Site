import { axiosInstance } from "./axiosInstance";

//front-end structure for api calls -register user, pascal case use
export const RegisterUser = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/users/register", payload);
        return response.data;
        //after respose got it is sent to page
    } catch (error) {
        return error.message;
    }
}

//login user
export const LoginUser = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/users/login", payload);
        return response.data;
        //after respose got it is sent to page
    } catch (error) {
        return error.message;
    }
}

//get current user,no payload here
export const GetCurrentUser = async () => {
    try {
        const response = await axiosInstance.post("/api/users/get-current-user");
        return response.data;
        //after respose got it is sent to page
    } catch (error) {
        return error.message;
    }
}
