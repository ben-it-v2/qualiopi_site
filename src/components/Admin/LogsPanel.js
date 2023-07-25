import * as React from 'react';
import AxiosHandler from "../../axios/AxiosHandler";

import './LogsPanel.css';

import log_view from '../../assets/log_view.png';
import log_edit from '../../assets/log_edit.png';
import log_download from '../../assets/log_download.png';
import log_delete from '../../assets/log_delete.png';
import log_add from '../../assets/log_add.png';
import log_auth from '../../assets/log_auth.png';
import log_error from '../../assets/log_error.png';
import logo_close from '../../assets/close.png';

export default function LogsPanel(params) {
    const { post } = AxiosHandler();
    let offsetValue = 0;
    let limitValue = 10;
    let logtypeValue;
    let emailValue;
    let orderValue = "ASC";

    const logTypes = new Map();
    logTypes.set("VIEW", {src: log_view, alt: "Consultation"});
    logTypes.set("EDIT", {src: log_edit, alt: "Modification"});
    logTypes.set("DOWNLOAD", {src: log_download, alt: "Téléchargement"});
    logTypes.set("DELETE", {src: log_delete, alt: "Suppression"});
    logTypes.set("ADD", {src: log_add, alt: "Ajout"});
    logTypes.set("AUTH", {src: log_auth, alt: "Authentification"});
    const defaultLogType = {src: log_error, alt: "Type non-reconnu!"};

    const createLogContainer = (logData) => {
        let logContainer = document.createElement("div");
        logContainer.classList.add("logcontainer");

        let logImg = document.createElement("img");
        logImg.classList.add("role-img");
        let t = logTypes.get(logData.log_type);
        if (!t) {
            t = defaultLogType;
        }
        logImg.alt = t.alt;
        logImg.src = t.src;
        logContainer.appendChild(logImg);

        let logDesc = document.createElement("h1");
        logDesc.classList.add("logcontainer-desc");
        logDesc.innerText = logData.log_desc;
        logContainer.appendChild(logDesc);

        let logCreationDate = document.createElement("h1");
        logCreationDate.classList.add("logcontainer-creationdate");
        logCreationDate.innerText = logData.created_at.substring(0, 10);
        logContainer.appendChild(logCreationDate);

        return (logContainer);
    }

    const syncLogs = async (limit, offset) => {
        let logsList = document.getElementById("logspanel-list");
        if (logsList) {
            while (logsList.firstChild) {
                logsList.removeChild(logsList.firstChild);
            }
        }

        const response = await post("logs", {
            token: params.accessToken,
            limit: limit,
            offset: offset,
            log_type: logtypeValue,
            email: emailValue,
            order: orderValue
        });

        if (response.status === 200) {
            let logs = (response.data) ? response.data : [];
            for (const id in logs) {
                let logsList = document.getElementById("logspanel-list");
                logsList.appendChild(createLogContainer(logs[id]));
            }
        }

        let logtypes = document.getElementById("listheader-select");
        if (logtypes && logtypes.children.length === 1) {
            logTypes.forEach((value, key) => {
                let opt = document.createElement("option");
                opt.value = key;
                opt.innerText = value.alt;
                logtypes.appendChild(opt);
            });
        }
    }

    syncLogs(limitValue, offsetValue);

    const onCloseButton = () => {
        let panel = document.getElementById("logspanel");
        if (panel)
            panel.remove();
    }
    
    const onOffsetChange = (event) => {
        offsetValue = Number(event.target.value);
    }

    const onLimitChange = (event) => {
        limitValue = Number(event.target.value);
    }

    const onLogtypeChange = (event) => {
        logtypeValue = event.target.value;
    }

    const onEmailChange = (event) => {
        emailValue = event.target.value;
    }

    const onOrderChange = (event) => {
        orderValue = event.target.value;
    }

    const onSearch = () => {
        syncLogs(limitValue, offsetValue);
    }

    return (
        <div className="logspanel-background" id="logspanel">
            <div className="logspanel-container">
                <div className="logspanel-header">
                    <h1 className="logspanel-title">Activités des Utilisateurs</h1>
                    <img className="logspanel-close" src={logo_close} alt="logo" onClick={onCloseButton}></img>
                </div>
                <div className="logspanel-body">
                    <div className="logspanel-containerlist">
                        <div className="logspanel-listheader">
                            <select className="listheader-select" id="listheader-select" onChange={onLogtypeChange}>
                                <option value=""></option>
                            </select>
                            <input type="email" className="listheader-input" id="listheader-email" placeholder="Email" onChange={onEmailChange}></input>
                            <input type="number" className="listheader-input-number" id="listheader-offset" placeholder="Début" min="0" defaultValue={offsetValue} onChange={onOffsetChange}></input>
                            <input type="number" className="listheader-input-number" id="listheader-limit" placeholder="Limite" min="1" max="10" defaultValue={limitValue} onChange={onLimitChange}></input>
                            <select className="listheader-select" id="listheader-order" onChange={onOrderChange}>
                                <option value="ASC">Moins récent</option>
                                <option value="DESC">Plus récent</option>
                            </select>
                            <button className="listheader-searchbutton" id="listheader-searchbutton" onClick={onSearch}>Rechercher</button>
                        </div>
                        <div className="logspanel-list" id="logspanel-list"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
