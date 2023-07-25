import * as React from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import AxiosHandler from '../../axios/AxiosHandler';

import './Login.css';

import logo from '../../assets/idmn_logo.png';

export default function Login() {
    const { saveAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [emailReg, setEmailReg] = React.useState("");
    const [passwordReg, setPasswordReg] = React.useState("");
    const [loginStatus, setLoginStatus] = React.useState("");

    let errRef = React.useRef();

    const login = async (event) => {
        event.preventDefault();

        try {
            const { post } = AxiosHandler();
            const response = await post("auth", {
                email: emailReg,
                password: passwordReg,
            }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            const accessToken = response?.data?.token;
            const role = response?.data?.role;
            saveAuth({ emailReg, passwordReg, role, accessToken });
            setEmailReg('');
            setPasswordReg('');
            navigate(from, { replace: true });
        } catch(err) {
            if (!err?.response) {
                setLoginStatus("Aucune réponse du serveur!");
            } else if (err.response?.status === 400) {
                setLoginStatus("Email ou mot de passe incorrect!");
            } else {
                setLoginStatus("Connexion échouée!");
            }
            errRef.current.focus();
        }
    };

    return (
        <div className="rotating-stripes-background">
            <div className="login-container">
                <img src={logo} alt="Logo" className="idmn-logo"></img>
                <div className="separator-lign"></div>
                <form className="login-form">
                    <div className="input-form">
                        <label className="input-title">EMAIL</label>
                        <input type="text" className="input-container" id="input-mail" onChange={(e) => {
                            setEmailReg(e.target.value);
                        }}></input>
                    </div>

                    <div className="input-form">
                        <label className="input-title">MOT DE PASSE</label>
                        <input type="password" className="input-container" id="input-password" onChange={(e) => {
                            setPasswordReg(e.target.value);
                        }}></input>
                    </div>

                    <button type="submit" className="form-submit" id="login-button" onClick={login}>CONNEXION</button>
                    <h1 ref={errRef} className="message">{loginStatus}</h1>
                </form>
            </div>
        </div>
    )
}
