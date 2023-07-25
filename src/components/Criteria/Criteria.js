import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import ReactDOM from 'react-dom';
import IndicatorForm from '../Indicator/IndicatorForm';
import AxiosHandler from "../../axios/AxiosHandler";
import CriteriaForm from "./CriteriaForm";
import Indicator from "../Indicator/Indicator";

import logo_add from '../../assets/add.png';
import logo_options from '../../assets/options.png';
import logo_edit from '../../assets/edit.png';
import logo_delete from '../../assets/delete.png';

import "../CfaDetail/CfaDetail.css";

export default function Criteria(params) {
    const { post } = AxiosHandler();
    const { auth, isAdmin } = useAuth();

    let criteria = params.criteria;
    let nbIndicators = 0;
    let nbIndicatorsValidated = 0;

    let indicatorsListID = `indicators-list-${criteria.id}`;
    let indicatorsContainerID = `indicators-container-${criteria.id}`;
    let criteriaPanelID = `criteria-panel-${criteria.id}`;
    let criteriaContainerID = `criteria-container-${criteria.id}`;
    let criteriaDeleteTitleID = `criteria-delete-title-${criteria.id}`;
    const optionsContainerID = `criteria-options-container-${criteria.id}`;

    const [data, setData] = useState({
        whenToUpdate: false,
        indicators: []
    });

    let tmp = [];
    for (const id in criteria.indicators) {
        let indicator = criteria.indicators[id];
        if (indicator) {
            tmp.push(indicator);
            const is_validated = indicator.is_validated;
            if (Number.isInteger(is_validated) && is_validated === 1)
                nbIndicatorsValidated += 1;
            nbIndicators += 1;
        }
    }
    let progressBarDetail = `${nbIndicatorsValidated}/${nbIndicators}`;
    let progressBarWidth = `${(nbIndicators === 0) ? 0 : (nbIndicatorsValidated / nbIndicators * 100)}%`;

    const updateCriteriaData = (indicator_id, is_validated) => {
        tmp = [];
        for (const id in criteria.indicators) {
            let indicator = criteria.indicators[id];
            if (indicator && indicator.id === indicator_id) {
                tmp.push(indicator);
                indicator.is_validated = is_validated;
                if (Number.isInteger(is_validated) && is_validated === 1)
                    nbIndicatorsValidated += 1;
                else
                    nbIndicatorsValidated -= 1;
            }
        }
        progressBarDetail = `${nbIndicatorsValidated}/${nbIndicators}`;
        progressBarWidth = `${(nbIndicators === 0) ? 0 : (nbIndicatorsValidated / nbIndicators * 100)}%`;
    }

    useEffect(() => {
        setData({
            ...data,
            indicators: tmp
        });
    }, [data.whenToUpdate])

    const onButtonAddIndicator = (criteria_id, criteria_infoid) => {
        const container = document.createElement('div');
        ReactDOM.render(<IndicatorForm accessToken={auth.accessToken} name={params.name} criteria_id={criteria_id} criteria_infoid={criteria_infoid} data={data} setData={setData} />, container);
        document.body.appendChild(container);
    }

    const onCriteriaClicked = () => {
        let indicatorsContainer = document.getElementById(indicatorsContainerID);
        indicatorsContainer.style.display = (indicatorsContainer.style.display === "none") ? "block" : "none";
    }

    const onIndicatorAddClicked = () => {
        onButtonAddIndicator(criteria.id, criteria.info_id);
    }

    const handleOptionsContainerDisplayState = (event, state) => {
        event.preventDefault();
        event.stopPropagation();

        let optionsContainer = document.getElementById(optionsContainerID);
        optionsContainer.style.display = state;
    }

    const onCriteriaOptionClicked = (event) => {
        handleOptionsContainerDisplayState(event, "block");
    }

    const onOptionsContainerClicked = (event) => {
        handleOptionsContainerDisplayState(event, "none");
    }

    const onEditClicked = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const container = document.createElement('div');
        ReactDOM.render(<CriteriaForm accessToken={auth.accessToken} criteria={criteria} />, container);
        document.body.appendChild(container);
    }

    let criteriaDeleteButtonState = false;

    const onDeleteClicked = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        let criteriaDeleteTitle = document.getElementById(criteriaDeleteTitleID);
        if (criteriaDeleteButtonState) {
            const response = await post("criteria/delete", {
                token: auth.accessToken,
                info_id: criteria.info_id
            })

            if (response.status === 200) {
                let criteriaList = document.getElementById("criterias-list");
                let criteriaPanel = document.getElementById(criteriaPanelID);
                criteriaList.removeChild(criteriaPanel);
            } else {
                criteriaDeleteTitle.innerText = "Supprimer";
                criteriaDeleteButtonState = false;
            }
        } else {
            criteriaDeleteTitle.innerText = "Êtes-vous sûr?";
            criteriaDeleteButtonState = true;
        }
    }

    return (
        <div className="criteria-panel" id={criteriaPanelID}>
            <div className="criteria-container" id={criteriaContainerID} onClick={onCriteriaClicked}>
                <div className="id-container">
                    <h1 className="id-text">{criteria.display_id}</h1>
                </div>
                <div className="data-container">
                    <h1 className="criteria-name">{criteria.name}</h1>
                    <h1 className="criteria-description">{criteria.description}</h1>
                </div>
                <div className="progressbar-container">
                    <h1 className="progressbar-detail">{progressBarDetail} Indicateurs</h1>
                    <div className="progressbar-background">
                        <div className="progressbar" style={{width: progressBarWidth}}></div>
                    </div>
                </div>
                {isAdmin() ? (
                    <div>
                        <img className="button-options" onClick={onCriteriaOptionClicked} src={logo_options} alt="logo"></img>
                        <div className="options-container" id={optionsContainerID} onClick={onOptionsContainerClicked}>
                            <div className="options-list">
                                <div className="option" onClick={onEditClicked}>
                                    <img src={logo_edit} alt="logo"/>
                                    <h1>Modifier</h1>
                                </div>
                                <div className="option" onClick={onDeleteClicked}>
                                    <img src={logo_delete} alt="logo"/>
                                    <h1 id={criteriaDeleteTitleID}>Supprimer</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (<div/>)}
            </div>

            <div className="indicators-container" id={indicatorsContainerID} style={{display:"none"}}>
                <div className="line"></div>
                <div className="indicators-list" id={indicatorsListID}>
                    {data.indicators.map((item, id) => {
                        return (<Indicator criteria_id={criteria.id} criteria_infoid={criteria.info_id} indicator={item} id={id} data={data} setData={setData} updateCriteriaData={updateCriteriaData}/>);
                    })}
                </div>
                {isAdmin() ? (
                    <button className="indicators-list-add" onClick={onIndicatorAddClicked}>
                        <img alt="logo" src={logo_add}></img>
                    </button>
                ) : (<div/>)}
            </div>
        </div>
    );
}
