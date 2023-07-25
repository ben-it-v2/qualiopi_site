import ReactDOM from 'react-dom';
import UsersPanel from '../Admin/UsersPanel';
import LogsPanel from '../Admin/LogsPanel';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import "./Header.css"

import logo from '../../assets/idmn_logo.png';
import logo_users from '../../assets/admin_users.png';
import logo_logs from '../../assets/admin_logs.png';
import logo_admin from '../../assets/admin_button.png';
import logo_logout from '../../assets/logout.png';

function OptionButton(params) {
    const onOptionClicked = params.onClick;
    const logo = params.logo;
    const text = params.text;

    return (
        <button className="admin-option" onClick={onOptionClicked}>
            <img className="admin-option-logo" alt="logo" src={logo}></img>
            <h1 className="admin-option-title">{text}</h1>
        </button>
    );
}

export default function Header() {
    const { auth, saveAuth, isAdmin } = useAuth();
    const navigate = useNavigate();

    const createPanel = (componentElement) => {
        const container = document.createElement('div');
        ReactDOM.render(componentElement, container);
        document.body.appendChild(container);
    }

    const onUsersButton = () => {
        createPanel(<UsersPanel accessToken={auth.accessToken} />)
    }

    const onActivitiesButton = () => {
        createPanel(<LogsPanel accessToken={auth.accessToken} />)
    }

    const onLogoutButton = () => {
        saveAuth({});
        navigate('/login');
    }

    const onHomeButton = () => {
        navigate("/");
    }

    return (
        <div className="main-header">
            <div className="main-header-logo">
                <div className="main-header-logo2">
                    <img src={logo} alt="Logo" className="idmn-logo" onClick={onHomeButton}></img>
                    <div className="main-header-title">
                        <h1 className="idmn-title">Institut des Métiers Network</h1>
                        <div className="main-header-bar"></div>
                    </div>
                </div>
            </div>
            <div className="main-header-buttons">
                <button className="admin-button">
                    <img src={logo_admin} alt="Logo" className="admin-button-logo"></img>
                </button>
                <div className="admin-dropdownmenu" id="options-popup">
                    {isAdmin() ? (
                        <div>
                            <OptionButton logo={logo_users} text={"Utilisateurs"} onClick={onUsersButton} />
                            <OptionButton logo={logo_logs} text={"Activités"} onClick={onActivitiesButton} />
                        </div>
                    ) : (<div></div>)}
                    <OptionButton logo={logo_logout} text={"Déconnexion"} onClick={onLogoutButton} />
                </div>
            </div>
        </div>
    );
}
