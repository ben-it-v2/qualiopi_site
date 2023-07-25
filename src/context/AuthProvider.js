import { createContext, useState } from "react";
import AxiosHandler from "../axios/AxiosHandler";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const { post } = AxiosHandler();

    const loadAuth = () => {
        let auth = localStorage.getItem("auth");
        if (auth)
            auth = JSON.parse(auth);
        return (auth);
    }

    const [auth, setAuth] = useState(loadAuth());

    const saveAuth = (auth) => {
        localStorage.setItem("auth", JSON.stringify(auth));
        setAuth(auth);
    }

    const checkToken = async (token) => {
        try {
            const response = await post("token", {
                token: token
            });

            if (response.status === 200) {
                console.log("Token encore valide!");
            }
        } catch(_) {
            saveAuth({});
        }
    }

    const isAdmin = () => {
        return (auth.role === 2);
    }

    return (
        <AuthContext.Provider value={{ auth, saveAuth, checkToken, isAdmin }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
