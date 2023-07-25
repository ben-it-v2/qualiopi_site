import AxiosHandler from "../../axios/AxiosHandler";

import './CfaForm.css'

export default function CfaForm(params) {
    const { post } = AxiosHandler();

    const cfasData = params.cfasData;
    const setCfasData = params.setCfasData;

    const onCancelButton = (event) => {
        event.preventDefault();
        removeForm();
    }

    const cfa = params.cfa;

    let onValidateButton;
    let formTitle;
    if (cfa) {
        formTitle = "Modification CFA";

        onValidateButton = async (event) => {
            event.preventDefault();

            let name = document.getElementById("cfa-name");
            let response = await post("cfa/update", {
                token: params.accessToken,
                cfa: {id: cfa.id, name: name.value}
            });

            if (response.status === 200) {
                window.location.reload(false);
            }
        }
    } else {
        formTitle = "Nouveau CFA";

        onValidateButton = async (event) => {
            event.preventDefault();

            let name = document.getElementById("cfa-name");
            let response = await post("cfa/create", {
                token: params.accessToken,
                name: name.value
            });

            if (response.status === 200) {
                let tmp = cfasData.cfas;
                tmp.push(response.data);
                setCfasData({
                    ...cfasData.cfas,
                    cfas: tmp
                });
            }

            removeForm();
        }
    }

    const removeForm = () => {
        let indicatorContainer = document.getElementById("cfaform-popup");
        if (indicatorContainer)
            indicatorContainer.remove();
    }

    const onInputChange = () => {
        let name = document.getElementById("cfa-name");
        let validateButton = document.getElementById("cfaform-validate");

        if (name.value)
            validateButton.disabled = false;
        else
            validateButton.disabled = true;
    }

    return (
        <div className="cfaform-background" id="cfaform-popup">
            <div className="cfaform-container">
                <h1 className="cfaform-title">{formTitle}</h1>
                <form className="cfaform-form" onSubmit={onValidateButton}>
                    <input type="text" className="cfaform-input" id="cfa-name" placeholder="Nom" defaultValue={cfa ? cfa.name : ""} onChange={onInputChange} required></input>

                    <div className="cfaform-buttons">
                        <button className="cfaform-cancel" onClick={onCancelButton}>Annuler</button>
                        <button type="submit" className="cfaform-validate" id="cfaform-validate" disabled>Valider</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
