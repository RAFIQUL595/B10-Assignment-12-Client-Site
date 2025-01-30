import { useNavigate } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAuth from "../../hooks/useAuth";

const SocialLogin = () => {
    const { handelGoogle, handleGitHub } = useAuth();
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();

    const handleGoogleSignIn = () => {
        handelGoogle()
            .then(result => {
                const userInfo = {
                    image: result.user?.photoURL,
                    email: result.user?.email,
                    name: result.user?.displayName,
                    role: "Student"
                }
                axiosPublic.post('/users', userInfo)
                    .then(res => {
                        navigate('/');
                    })
            })
    }
    const handleGitSignIn = () => {
        handleGitHub()
            .then(result => {
                const userInfo = {
                    image: result.user?.photoURL,
                    email: result.user?.email,
                    name: result.user?.displayName,
                    role: "Student"
                }
                axiosPublic.post('/users', userInfo)
                    .then(res => {
                        navigate('/');
                    })
            })
    }

    return (
        <div className="p-8">
            <div className="divider">OR</div>
            <div className="flex flex-col gap-3">
                {/* Google Sign-In */}
                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="border border-[#e5eaf2] rounded-md py-2 px-4 flex items-center gap-2 text-lg text-[#424242] hover:bg-gray-50 transition duration-200">
                    <img src="https://i.ibb.co/dQMmB8h/download-4-removebg-preview-1.png" alt="Google logo"
                        className="w-6" />
                    Sign in with Google
                </button>

                {/* GitHub Sign-In */}
                <button
                    type="button"
                    onClick={handleGitSignIn}
                    className="border border-[#e5eaf2] rounded-md py-2 px-4 flex items-center gap-2 text-lg text-[#424242] hover:bg-gray-50 transition duration-200">
                    <img src="https://assets.website-files.com/632c941ea9199f8985f3fd52/632c95c46041d682027a3c2a_github.svg"
                        alt="Github logo"
                        className="w-[30px]" />
                    Sign in with GitHub
                </button>
            </div>
        </div>
    );
};

export default SocialLogin;