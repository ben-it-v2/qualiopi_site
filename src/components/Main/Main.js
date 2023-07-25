import * as React from 'react';
import { useNavigate } from "react-router-dom";

import Header from '../Header/Header';

import './Main.css';

import logo_arrow from '../../assets/main-arrow.png';

export default function Main() {
    const navigate = useNavigate();
    
    const modificationButton = async () => {
        navigate('/cfa');
    }

    return(
        <div>
            <Header/>
            <div className="main-body">
                <div className="main-body-options">
                    <div className="main-body-option">
                        <div className="main-body-option-title">
                            <h1 className="main-body-option-text">INSPECTION</h1>
                        </div>
                        <div className="main-body-option-content">
                            <h1 className="main-body-option-desc">Présentation de l’ensemble des documents pour Qualiopi</h1>
                            <button className="main-body-option-button">
                                <img src={logo_arrow} alt="Logo" className="main-body-option-button-logo"></img>
                            </button>
                        </div>
                    </div>
                    <div className="main-body-spacer"></div>
                    <div className="main-body-option">
                        <div className="main-body-option-title">
                            <h1 className="main-body-option-text">MODIFICATION</h1>
                        </div>
                        <div className="main-body-option-content">
                            <h1 className="main-body-option-desc">Consulter, ajouter et modifier les documents des différents CFAs</h1>
                            <button className="main-body-option-button" onClick={modificationButton}>
                                <img src={logo_arrow} alt="Logo" className="main-body-option-button-logo"></img>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
