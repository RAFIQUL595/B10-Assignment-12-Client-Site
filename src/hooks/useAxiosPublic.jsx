import axios from "axios";


const axiosPublic = axios.create({
    baseURL: 'https://study-platform-server-beta.vercel.app',
    // baseURL: 'http://localhost:9000',
    withCredentials: true,
})

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;