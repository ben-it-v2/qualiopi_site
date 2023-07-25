import * as React from 'react';
import AxiosHandler from "../../axios/AxiosHandler";
import ReactDOM from 'react-dom';
import EditUser from "./EditUser";

import './UsersPanel.css';

import logo_user from '../../assets/user.png';
import logo_admin from '../../assets/admin.png';
import logo_delete from '../../assets/delete.png';
import logo_edit from '../../assets/edit.png';
import logo_close from '../../assets/close.png';

export default function UsersPanel(params) {
    const { post } = AxiosHandler();
    let offsetValue = 0;
    let limitValue = 10;
    let emailValue = "";

    const createUserContainer = (userData) => {
        let userContainer = document.createElement("div");
        userContainer.classList.add("usercontainer");

        let userImg = document.createElement("img");
        userImg.classList.add("role-img");
        userImg.alt = "logo";
        userImg.src = (userData.role === 2) ? logo_admin : logo_user;
        userContainer.appendChild(userImg);

        let userEmail = document.createElement("h1");
        userEmail.classList.add("usercontainer-email");
        userEmail.innerText = userData.email;
        userContainer.appendChild(userEmail);

        let userCreationDate = document.createElement("h1");
        userCreationDate.classList.add("usercontainer-creationdate");
        userCreationDate.innerText = userData.created_at.substring(0, 10);
        userContainer.appendChild(userCreationDate);

        let deleteButton = document.createElement("img");
        deleteButton.classList.add("delete-button");
        deleteButton.alt = "logo";
        deleteButton.src = logo_delete;
        deleteButton.onclick = async () => {
            const response = await post("user/delete", {
                token: params.accessToken,
                user_id: userData.id
            });

            if (response.status === 200) {
                userContainer.remove();
            }
        }
        userContainer.appendChild(deleteButton);

        let editButton = document.createElement("img");
        editButton.classList.add("delete-button");
        editButton.alt = "logo";
        editButton.src = logo_edit;
        editButton.onclick = async () => {
            const container = document.createElement('div');
            ReactDOM.render(<EditUser accessToken={params.accessToken} user={userData} uicontainer={{role: userImg, email: userEmail}}/>, container);
            document.body.appendChild(container);
        }
        userContainer.appendChild(editButton);

        return (userContainer);
    }

    const syncUsers = async (email, limit, offset) => {
        let usersList = document.getElementById("userspanel-list");
        if (usersList) {
            while (usersList.firstChild) {
                usersList.removeChild(usersList.firstChild);
            }
        }

        const response = await post("users", {
            token: params.accessToken,
            email: email,
            limit: limit,
            offset: offset
        });

        if (response.status === 200) {
            let users = (response.data) ? response.data : [];
            for (const id in users) {
                let usersList = document.getElementById("userspanel-list");
                usersList.appendChild(createUserContainer(users[id]));
            }
        }
    }

    syncUsers(null, limitValue, offsetValue);

    const onAddUser = async (event) => {
        event.preventDefault();

        let email = document.getElementById("user-email");
        let password = document.getElementById("user-password");

        const response = await post("user/create", {
            token: params.accessToken,
            email: email.value,
            password: password.value
        });

        if (response.status === 200) {
            let usersList = document.getElementById("userspanel-list");
            usersList.appendChild(createUserContainer(response.data));
        }
    }

    const onInputChanger = () => {
        let name = document.getElementById("user-email");
        let password = document.getElementById("user-password");
        let validateButton = document.getElementById("user-addbutton");

        if (name.value && password.value)
            validateButton.disabled = false;
        else
            validateButton.disabled = true;
    }

    const onCloseButton = () => {
        let panel = document.getElementById("userspanel");
        panel.remove();
    }

    const onEmailChange = (event) => {
        emailValue = event.target.value;
    }
    
    const onOffsetChange = (event) => {
        offsetValue = Number(event.target.value);
    }

    const onLimitChange = (event) => {
        limitValue = Number(event.target.value);
    }

    const onSearch = () => {
        syncUsers(emailValue, limitValue, offsetValue);
    }

    return (
        <div className="userspanel-background" id="userspanel">
            <div className="userspanel-container">
                <div className="userspanel-header">
                    <h1 className="userspanel-title">Gestion des Utilisateurs</h1>
                    <img className="userspanel-close" src={logo_close} alt="logo" onClick={onCloseButton}></img>
                </div>
                <div className="userspanel-body">
                    <div className="userspanel-containerlist">
                        <div className="userspanel-listheader">
                            <input type="email" className="listheader-input-email" id="listheader-email" placeholder="Email" onChange={onEmailChange}></input>
                            <input type="number" className="listheader-input-number" id="listheader-offset" placeholder="Début" min="0" defaultValue={offsetValue} onChange={onOffsetChange}></input>
                            <input type="number" className="listheader-input-number" id="listheader-limit" placeholder="Limite" min="1" max="10" defaultValue={limitValue} onChange={onLimitChange}></input>
                            <button className="user-listheader-searchbutton" id="listheader-searchbutton" onClick={onSearch}>Rechercher</button>
                        </div>
                        <div className="userspanel-list" id="userspanel-list"></div>
                    </div>

                    <form className="userspanel-form" onSubmit={onAddUser} autoComplete="new-password">
                        <h1 className="userspanel-subtitle">Nouvel Utilisateur</h1>
                        <input type="email" className="userspanel-input" id="user-email" placeholder="Email" onChange={onInputChanger} autoComplete="new-password" required></input>
                        <input type="password" className="userspanel-input" id="user-password" placeholder="Mot de passe" onChange={onInputChanger} autoComplete="new-password" required></input>
                        <button type="submit" className="userspanel-button" id="user-addbutton" disabled>Ajouter</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
