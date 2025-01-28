import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";


const axiosSecure = axios.create({
    baseURL: 'https://study-platform-server-beta.vercel.app',
    // baseURL: 'http://localhost:9000',
    withCredentials: true,
})

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const { handelLogOut } = useAuth();

    // request interceptor to add authorization header for every secure call to teh api
    axiosSecure.interceptors.request.use(function (config) {
        const token = localStorage.getItem('access-token')
        config.headers.authorization = `Bearer ${token}`;
        return config;
    }, function (error) {
        // Do something with request error
        return Promise.reject(error);
    });


    // intercepts 401 and 403 status
    axiosSecure.interceptors.response.use(function (response) {
        return response;
    }, async (error) => {
        const status = error.response.status;
        // for 401 or 403 logout the user and move the user to the login
        if (status === 401 || status === 403) {
            await handelLogOut();
            navigate('/login');
        }
        return Promise.reject(error);
    })


    return axiosSecure;
};

export default useAxiosSecure;