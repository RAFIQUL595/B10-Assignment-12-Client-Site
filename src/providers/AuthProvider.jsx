import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';
import auth from './../firebase/firebase.config';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


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
            setLoading(false);
        });
        return () => {
            return unsubscribe();
        }
    }, [])

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