import AxiosHandler from "../../axios/AxiosHandler";

import './CriteriaForm.css'

export default function CriteriaForm(params) {
    const { post } = AxiosHandler();
    const data = params.data;
    const setData = params.setData;

    const onCancelButton = (event) => {
        event.preventDefault();
        removeForm();
    }

    const criteria = params.criteria;
    let onValidateButton;
    let criteriaFormTitle;
    if (criteria) {
        criteriaFormTitle = "Modification Critère";

        onValidateButton = async (event) => {
            event.preventDefault();

            let criteriaInd = document.getElementById("criteria-ind");
            let criteriaName = document.getElementById("criteria-name");
            let criteriaDescription = document.getElementById("criteria-description");

            let response = await post("criteria/update", {
                token: params.accessToken,
                criteria: {id: criteria.id, info_id: criteria.info_id , display_id: criteriaInd.value, name: criteriaName.value, description: criteriaDescription.value}
            });

            if (response.status === 200) {
                window.location.reload(false);
            }
        }
    } else {
        criteriaFormTitle = "Nouveau Critère";

        onValidateButton = async (event) => {
            event.preventDefault();

            const criteriaInd = document.getElementById("criteria-ind");
            const criteriaName = document.getElementById("criteria-name");
            const criteriaDescription = document.getElementById("criteria-description");

            const response = await post("criteria/create", {
                token: params.accessToken,
                cfa: params.name,
                display_id: criteriaInd.value,
                name: criteriaName.value,
                description: criteriaDescription.value
            });

            if (response.status === 200) {
                let tmp = data.criterias;
                tmp.push(response.data);
                setData({
                    ...data,
                    criterias: tmp
                });
            }

            removeForm();
        }
    }

    const removeForm = () => {
        let criteriaContainer = document.getElementById("criteriaform-popup");
        criteriaContainer.remove();
    }

    const onInputChange = () => {
        let criteriaInd = document.getElementById("criteria-ind");
        let criteriaName = document.getElementById("criteria-name");
        let criteriaDescription = document.getElementById("criteria-description");
        let validateButton = document.getElementById("criteriaform-validate");

        if (criteriaInd.value && criteriaName.value && criteriaDescription.value)
            validateButton.disabled = false;
        else
            validateButton.disabled = true;
    }

    return (
        <div className="criteriaform-background" id="criteriaform-popup">
            <div className="criteriaform-container">
                <h1 className="criteriaform-title">{criteriaFormTitle}</h1>
                <form className="criteriaform-form" onSubmit={onValidateButton}>
                    <input type="number" className="criteriaform-input" id="criteria-ind" placeholder="Numéro du critère" defaultValue={criteria ? criteria.display_id : ""} onChange={onInputChange} required></input>
                    <input type="text" className="criteriaform-input" id="criteria-name" placeholder="Nom du critère" defaultValue={criteria ? criteria.name : ""} onChange={onInputChange} required></input>
                    <input type="text" className="criteriaform-input" id="criteria-description" placeholder="Description du critère" defaultValue={criteria ? criteria.description : ""} onChange={onInputChange} required></input>

                    <div className="criteriaform-buttons">
                        <button className="criteriaform-cancel" onClick={onCancelButton}>Annuler</button>
                        <button type="submit" className="criteriaform-validate" id="criteriaform-validate" disabled>Valider</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
