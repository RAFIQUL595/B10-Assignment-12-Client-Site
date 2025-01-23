import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const useTutor = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { data: isTutor, isPending: isTutorLoading } = useQuery({
        queryKey: [user?.email, 'isTutor'],
        enabled: !loading,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/tutor/${user.email}`);
            return res.data?.tutor;
        }
    });
    return [isTutor, isTutorLoading]
};

export default useTutor;
