import { createAuthClient } from "better-auth/react";
import axios from "axios";
import { BetterAuthUser } from "@/types/auth.types";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:19200").replace(/\/+$/, "");
const SESSION_EXPIRY = 60 * 60; 

// Client better-auth standard
const betterAuthClient = createAuthClient({
    baseURL: API_BASE_URL,
    authEndpoint: "/api/v1/auth",
    signInPath: "signin",
    signOutPath: "signout",
    signUpPath: "signup",
    forgotPasswordPath: "forgot-password",
    resetPasswordPath: "reset-password",
    storage: {
        type: "cookie",
        options: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: SESSION_EXPIRY,
            path: "/"
        }
    },
    session: {
        expiresIn: SESSION_EXPIRY
    },
    redirectToSignIn: true,
    usePrefixedPaths: false,
});

export const authClient = {
    ...betterAuthClient,
    signIn: {
        ...betterAuthClient.signIn,
        email: async ({ email, password }: { email: string; password: string }): Promise<{ data: { user: BetterAuthUser; token: string } | null; error: { message: string } | null }> => {
            try {
                const response = await axios.post(`${API_BASE_URL}/api/v1/auth/signin`, {
                    email,
                    password
                });
                
                return {
                    data: response.data,
                    error: null
                };
            } catch (error: any) {
                console.error("Login error:", error);
                return {
                    data: null,
                    error: {
                        message: error.response?.data?.message || "Échec de la connexion"
                    }
                };
            }
        }
    }
};
