import {create} from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isLoggingOut: false,

    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser: res.data});

        } catch (error) {
            console.error("Error in checkAuth:",error.message);
            set({authUser: null})
        } finally{
            set({isCheckingAuth: false});
        }
    },

    signup: async (data) => {
        set({isSigningUp: true});

        try{
            const res = await axiosInstance.post("/auth/signup", data);
            set({authUser: res.data});
        
        } catch(error){
            console.error("Error in signup:",error.message);
        } finally{
            set({isSigningUp: false});
        }
    },

    login: async (data) => {
        set({isLoggingIn: true});

        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser: res.data});

        } catch (error) {
            console.error("Error in login:",error.message);
        } finally{
            set({isLoggingIn: false});
        }
    },

    logout: async () => {
        set({isLoggingOut: true});

        try {
            await axiosInstance.post("/auth/logout");
            set({authUser: null});

        } catch (error) {
            console.error("Error in logout:",error.message);
        } finally{
            set({isLoggingOut: false});
        }
    }
}))