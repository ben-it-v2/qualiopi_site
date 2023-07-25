import * as React from 'react';
import Header from '../Header/Header';
import AxiosHandler from "../../axios/AxiosHandler";
import useAuth from '../../hooks/useAuth';
import { useNavigate } from "react-router-dom";
import CfaForm from './CfaForm';
import ReactDOM from 'react-dom';

import './Cfa.css';

import logo_add from '../../assets/add.png';
import logo_idmn from '../../assets/idmn_logo.png';
import logo_options from '../../assets/options.png';
import logo_edit from '../../assets/edit.png';
import logo_delete from '../../assets/delete.png';

function CfaButton(params) {
    const cfa = params.cfa;
    const navigate = params.navigate;
    const isAdmin = params.isAdmin;
    const nbCFA = params.nbCFA;
    const cfasData = params.cfasData;
    const setCfasData = params.setCfasData;
    const auth = params.auth;
    const post = params.post;

    const cfaOptionsContainerID = `cfa-options-container-${cfa.id}`;
    const cfaDeleteTitleID = `cfa-delete-title-${cfa.id}`;

    const onCfaButtonClicked = () => {
        navigate(`/cfa/${cfa.name}`);
    }

    const handleOptionsContainerDisplayState = (event, state) => {
        event.preventDefault();
        event.stopPropagation();

        let cfaOptionsContainer = document.getElementById(cfaOptionsContainerID);
        cfaOptionsContainer.style.display = state;
    }

    const onOptionsContainerClicked = (event) => {
        handleOptionsContainerDisplayState(event, "none");
    }

    const onOptionsButtonClicked = (event) => {
        handleOptionsContainerDisplayState(event, "block");
    }

    const onEditClicked = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const container = document.createElement('div');
        ReactDOM.render(<CfaForm accessToken={auth.accessToken} cfa={cfa} />, container);
        document.body.appendChild(container);
    }

    let cfaDeleteButtonState = false;

    const onDeleteClicked = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        let cfaDeleteTitle = document.getElementById(cfaDeleteTitleID);
        if (cfaDeleteButtonState) {
            const response = await post("cfa/delete", {
                token: auth.accessToken,
                cfa: cfa
            })

            if (response.status === 200) {
                let tmp = cfasData.cfas;
                tmp.splice(tmp.indexOf(cfa), 1);
                setCfasData({
                    ...cfasData,
                    cfas: tmp
                });
            } else {
                cfaDeleteTitle.innerText = "Supprimer";
                cfaDeleteButtonState = false;
            }
        } else {
            cfaDeleteTitle.innerText = "Êtes-vous sûr?";
            cfaDeleteButtonState = true;
        }
    }

    const ratio = 639 / 565;
    let bgClr;
    if (nbCFA % 2 !== 0)
        bgClr = "#D9D9D9";
    else
        bgClr = "#C3C3C3";

    return(
        <div className="cfa-button" onClick={onCfaButtonClicked}>
            <div className="cfa-button-title-container">
                <div className="cfa-button-title">
                    <h1 className="cfa-button-title-text">{cfa.name}</h1>
                </div>
                <div className="cfa-button-title-background">
                </div>
            </div>
            {isAdmin() ? (
                <div>
                    <img className="cfa-button-options" onClick={onOptionsButtonClicked} src={logo_options} alt="logo"/>
                    <div className="cfa-options-container" id={cfaOptionsContainerID} onClick={onOptionsContainerClicked}>
                        <div className="cfa-options-list">
                            <div className="cfa-option" onClick={onEditClicked}>
                                <img src={logo_edit} alt="logo"/>
                                <h1>Modifier</h1>
                            </div>
                            <div className="cfa-option" onClick={onDeleteClicked}>
                                <img src={logo_delete} alt="logo"/>
                                <h1 id={cfaDeleteTitleID}>Supprimer</h1>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (<div/>)}
            <div className="cfa-button-container" style={{backgroundColor:bgClr}}>
                <img src={logo_idmn} alt="logo" style={{height: "200px", width: `${200 * ratio}px`, left: `${(200 - 200 * ratio) / 2}px`}}></img>
            </div>
        </div>
    )
}

export default function Cfa() {
    const { post } = AxiosHandler();
    const { auth, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [cfasData, setCfasData] = React.useState({
        whenToUpdate: false,
        cfas: []
    });

    let nbCFA = 0;

    const cfaListSync = async () => {
        const response = await post("cfa", {
            token: auth.accessToken
        });
        const cfas = (response.data?.cfas) ? response.data.cfas : [];
        let tmp = [];
        cfas.forEach(cfa => {
            if (cfa)
                tmp.push(cfa)
        });
        setCfasData({
            ...cfasData,
            cfas: tmp
        })
    }

    let onButtonAddCFA
    if (isAdmin()) {
        onButtonAddCFA = () => {
            const container = document.createElement('div');
            ReactDOM.render(<CfaForm accessToken={auth.accessToken} cfasData={cfasData} setCfasData={setCfasData}/>, container);
            document.body.appendChild(container);
        }
    }

    React.useEffect(() => {
        cfaListSync();
    }, [cfasData.whenToUpdate]);

    return (
        <div className="cfa-page">
            <Header/>
            <div className="cfa-body">
                <div className="cfa-container">
                    <div className="cfa-container-title">
                        <h1 className="cfa-container-title-text">LISTE DES CFAS</h1>
                    </div>
                    <div className="cfa-list-container" id="cfa-list-container">
                        <div className="cfa-list" id="cfa-list">
                            {cfasData.cfas.map((item) => {
                                nbCFA += 1;
                                return (
                                <CfaButton cfa={item} navigate={navigate} isAdmin={isAdmin} nbCFA={nbCFA} cfasData={cfasData} setCfasData={setCfasData} auth={auth} post={post}/>
                                );
                            })}
                        </div>
                        {isAdmin() ? (
                            <button className="cfa-list-add" onClick={onButtonAddCFA}>
                                <img alt="logo" src={logo_add}/>
                            </button>
                        ) : (<div/>)}
                    </div>
                </div>
            </div>
        </div>
    );
}
