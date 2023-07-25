import * as React from 'react';
import AxiosHandler from "../../axios/AxiosHandler";

import './EditUser.css';

import logo_user from '../../assets/user.png';
import logo_admin from '../../assets/admin.png';
import logo_close from '../../assets/close.png';

export default function UsersPanel(params) {
    const { post } = AxiosHandler();

    const onCloseButton = () => {
        let panel = document.getElementById("edituserpanel");
        panel.remove();
    }

    const onUpdateUser = async (event) => {
        event.preventDefault();

        const emailInput = document.getElementById("edituserpanel-email");
        const passwordInput = document.getElementById("edituserpanel-password");
        const roleSelector = document.getElementById("edituserpanel-role");
        let role = Number(roleSelector.value);

        const response = await post("user/update", {
            token: params.accessToken,
            id: params.user.id,
            email: emailInput.value,
            password: passwordInput.value,
            role: role
        });

        if (response.status === 200) {
            let userData = params.user;
            userData.email = emailInput.value;
            userData.role = role;

            let uis = params.uicontainer;
            uis.role.src = (role === 2) ? logo_admin : logo_user;
            uis.email.innerText = userData.email;

            onCloseButton();
        }
    }

    return(
        <div className="edituserpanel-background" id="edituserpanel">
            <div className="edituserpanel-container">
                <div className="edituserpanel-header">
                    <h1 className="edituserpanel-title">Modification de l'Utilisateur</h1>
                    <img className="edituserpanel-close" src={logo_close} alt="logo" onClick={onCloseButton}></img>
                </div>
                <div className="edituserpanel-body">
                    <form className="edituserpanel-form" onSubmit={onUpdateUser} autoComplete="new-password">
                        <input type="email" className="edituserpanel-input" id="edituserpanel-email" placeholder="Email" defaultValue={params.user.email} autoComplete="new-password" required></input>
                        <input type="password" className="edituserpanel-input" id="edituserpanel-password" placeholder="Nouveau mot de passe (Optionnel)" autoComplete="new-password"></input>
                        <select className="edituserpanel-select" id="edituserpanel-role" defaultValue={params.user.role}>
                            <option value={1}>Utilisateur</option>
                            <option value={2}>Administrateur</option>
                        </select>
                        <button type="submit" className="edituserpanel-button">Valider</button>
                    </form>
                </div>
            </div>
        </div>
    );
}


