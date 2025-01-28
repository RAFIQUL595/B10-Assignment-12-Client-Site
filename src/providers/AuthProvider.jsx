import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';
import auth from './../firebase/firebase.config';
import toast from 'react-hot-toast';
import useAxiosPublic from './../hooks/useAxiosPublic';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosPublic = useAxiosPublic();


    // SignUp With Email and Password
    const handelSignUp = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // Login With Email and Password
    const handelLogin = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    // Sign Out User
    const handelLogOut = () => {
        setLoading(true);
        toast.success("Log Out Successfully");
        return signOut(auth);
    };

    // Update user profile
    const updateUser = (name, photo) => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            return updateProfile(currentUser, {
                displayName: name,
                photoURL: photo,
            }).then(() => {
                setUser({
                    ...currentUser,
                    displayName: name,
                    photoURL: photo,
                });
            });
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            if (currentUser) {
                // get token and store client
                const userInfo = { email: currentUser.email };
                axiosPublic.post('/jwt', userInfo)
                    .then(res => {
                        if (res.data.token) {
                            localStorage.setItem('access-token', res.data.token);
                            setLoading(false);
                        }
                    })
            }
            else {
                localStorage.removeItem('access-token');
                setLoading(false);
            }
        });
        return () => {
            return unsubscribe();
        }
    }, [axiosPublic])

    const authInfo = {
        user,
        loading,
        handelSignUp,
        handelLogin,
        updateUser,
        handelLogOut
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;