import AxiosHandler from "../../axios/AxiosHandler";

import './IndicatorForm.css'

import logo_delete from '../../assets/delete.png';
import { useEffect, useState } from "react";

function Link(params) {
    const link = params.link;
    const setLinksData = params.setLinksData;
    const linksData = params.linksData;

    const onDeleteClicked = () => {
        let tmp = linksData.links;
        tmp.splice(tmp.indexOf(link), 1);
        setLinksData({
            ...linksData,
            links: tmp
        })
    }

    return(
        <div className="indicatorform-link">
            <h1>{link}</h1>
            <img onClick={onDeleteClicked} alt="logo" src={logo_delete}></img>
        </div>
    )
}

export default function IndicatorForm(params) {
    const { post } = AxiosHandler();
    const [linksData, setLinksData] = useState({
        whenToUpdate: false,
        links: []
    });

    const onCancelButton = (event) => {
        event.preventDefault();
        removeForm();
    }

    const indicator = params.indicator;

    let onValidateButton;
    let indicatorFormTitle;
    if (indicator) {
        indicatorFormTitle = "Modification Indicateur";
        onValidateButton = async (event) => {
            event.preventDefault();

            const display_id = document.getElementById("indicator-ind");
            const name = document.getElementById("indicator-name");
            const description = document.getElementById("indicator-description");
            const expectedLevel = document.getElementById("indicator-expectedLevel");
            const elementsProof = document.getElementById("indicator-elementsProof");

            const response = await post("indicator/update", {
                token: params.accessToken,
                criteria_id: params.criteria_id,
                criteria_infoid: params.criteria_infoid,
                indicator: {id: indicator.id, info_id: indicator.info_id, display_id: display_id.value, name: name.value, description: description.value, expectedLevel: expectedLevel.value, elementsProof: elementsProof.value, links: linksData.links}
            });

            if (response.status === 200) {
                window.location.reload(false);
            }
        }
    } else {
        indicatorFormTitle = "Nouvel Indicateur";
        onValidateButton = async (event) => {
            event.preventDefault();

            const display_id = document.getElementById("indicator-ind");
            const name = document.getElementById("indicator-name");
            const description = document.getElementById("indicator-description");
            const expectedLevel = document.getElementById("indicator-expectedLevel");
            const elementsProof = document.getElementById("indicator-elementsProof");

            const response = await post("indicator/create", {
                token: params.accessToken,
                criteria_id: params.criteria_id,
                criteria_infoid: params.criteria_infoid,
                display_id: display_id.value,
                name: name.value,
                description: description.value,
                expectedLevel: expectedLevel.value,
                elementsProof: elementsProof.value,
                links: linksData.links
            });

            if (response.status === 200) {
                const setData = params.setData;
                const data = params.data;

                let tmp = data.indicators;
                tmp.push(response.data);

                setData({
                    ...data,
                    indicators: tmp
                });
            }

            removeForm();
        }
    }

    const removeForm = () => {
        let indicatorContainer = document.getElementById("indicatorform-popup");
        if (indicatorContainer)
            indicatorContainer.remove();
    }

    const onInputChange = () => {
        let display_id = document.getElementById("indicator-ind");
        let name = document.getElementById("indicator-name");
        let description = document.getElementById("indicator-description");
        let expectedLevel = document.getElementById("indicator-expectedLevel");
        let elementsProof = document.getElementById("indicator-elementsProof");
        let validateButton = document.getElementById("indicatorform-validate");

        if (display_id.value && name.value && description.value && expectedLevel.value && elementsProof.value)
            validateButton.disabled = false;
        else
            validateButton.disabled = true;
    }

    const onAddLink = (event) => {
        event.preventDefault();

        const newLinkInput = document.getElementById("new-link-input");

        let links = linksData.links;
        links.push(newLinkInput.value);
        setLinksData({
            ...linksData,
            links: links
        })
    }

    useEffect(() => {
        setLinksData({
            ...linksData,
            links: indicator ? indicator.links : [] 
        })
        if (indicator) {
            let validateButton = document.getElementById("indicatorform-validate");
            validateButton.disabled = false;
        }
    }, [linksData.whenToUpdate]);

    return (
        <div className="indicatorform-background" id="indicatorform-popup">
            <div className="indicatorform-container">
                <h1 className="indicatorform-title">{indicatorFormTitle}</h1>
                <form className="indicatorform-form" onSubmit={onValidateButton}>
                    <input type="number" className="indicatorform-input" id="indicator-ind" placeholder="Numéro de l'indicateur" defaultValue={indicator ? indicator.display_id : ""} onChange={onInputChange} required></input>
                    <input type="text" className="indicatorform-input" id="indicator-name" placeholder="Nom" defaultValue={indicator ? indicator.name : ""} onChange={onInputChange} required></input>
                    <input type="text" className="indicatorform-input" id="indicator-description" placeholder="Description" defaultValue={indicator ? indicator.description : ""} onChange={onInputChange} required></input>
                    <input type="text" className="indicatorform-input" id="indicator-expectedLevel" placeholder="Niveau attendu" defaultValue={indicator ? indicator.expectedLevel : ""} onChange={onInputChange} required></input>
                    <input type="text" className="indicatorform-input" id="indicator-elementsProof" placeholder="Eléments de preuve" defaultValue={indicator ? indicator.elementsProof : ""} onChange={onInputChange} required></input>

                    <div className="indicatorform-links-list" id="indicatorform-links-list">
                        {linksData.links.map((item) => {
                            return(
                                <Link link={item} setLinksData={setLinksData} linksData={linksData}/>
                            );
                        })}
                    </div>
                    <div className="indicatorform-add-row">
                        <input type="text" className="indicatorform-input" id="new-link-input" placeholder="Nouveau lien"></input>
                        <button className="indicatorform-button" onClick={onAddLink}>Ajouter</button>
                    </div>

                    <div className="indicatorform-buttons">
                        <button className="indicatorform-cancel" onClick={onCancelButton}>Annuler</button>
                        <button type="submit" className="indicatorform-validate" id="indicatorform-validate" disabled>Valider</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
