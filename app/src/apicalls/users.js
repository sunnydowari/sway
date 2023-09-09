import { axiosInstance } from "."

export const LoginUser = async(user) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await axiosInstance.post("/api/users/login", user);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const RegisterUser = async (user) => {
    try {
        const response = await axiosInstance.post("/api/users/register", user);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}