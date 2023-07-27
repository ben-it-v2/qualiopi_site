import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import ReactDOM from 'react-dom';
import AxiosHandler from "../../axios/AxiosHandler";
import IndicatorForm from '../Indicator/IndicatorForm';

import logo_options from '../../assets/options.png';
import logo_edit from '../../assets/edit.png';
import logo_delete from '../../assets/delete.png';
import logo_pdf from '../../assets/file-pdf.png';
import logo_img from '../../assets/file-img.png';
import logo_download from '../../assets/file_download.png';
import logo_open from '../../assets/file_open.png';
import logo_fdelete from '../../assets/file_delete.png';

function ProofElement(params) {
    const { post, get } = AxiosHandler();
    const { auth } = useAuth();

    const fileName = params.filename;
    const extension = /(?:\.([^.]+))?$/.exec(fileName)[1];
    const proofID = params.proofID;
    const proofElementID = `proof-element-${params.indicator_id}-${proofID}`;

    const PDFFILE = 0;
    const PNGFILE = 1;
    const filesSignature = [
        [0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E],
        [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]
    ];

    const checkFileType = (type, data) => {
        const fileSignature = filesSignature[type];
        if (fileSignature) {
            console.log("fileSignature.length", fileSignature.length);
            const fileHeader = new Uint8Array(data.slice(0, fileSignature.length));
            return fileSignature.every((byte, index) => byte === fileHeader[index]);
        }
        return (false);
    }

    const getFileDataURL = (responseData) => {
        const base64String = btoa(
            new Uint8Array(responseData).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ''
            )
        );

        if (checkFileType(PDFFILE, responseData)) {
            return (`data:application/pdf;base64,${base64String}`);
        } else if (checkFileType(PNGFILE, responseData)) {
            return (`data:image/png;base64,${base64String}`);
        }
        return ("");
    }

    const getFileHTMLElement = (responseData, dataURL) => {
        if (checkFileType(PDFFILE, responseData)) {
            var body = document.body,
                html = document.documentElement;
            var height = Math.max(body.scrollHeight, body.offsetHeight, 
                html.clientHeight, html.scrollHeight, html.offsetHeight);
            return (`<iframe src=${dataURL} width="100%" height="${height}px"</iframe>`);
        } else if (checkFileType(PNGFILE, responseData)) {
            return (`<img src="${dataURL}" alt="Displayed Image">`);
        }
        return ("<p>Le type de fichier n'est pas pris en compte!</p>");
    }

    const onOpenFileClicked = async () => {
        const response = await post("indicator/openfile", {
            token: auth.accessToken,
            id: params.indicator_id,
            filename: fileName
        }, {
            responseType: 'arraybuffer'
        })

        if (response.status === 200) {
            const dataURL = getFileDataURL(response.data);
            console.log("dataURL", dataURL)
            
            const htmlContent = `
                <!DOCTYPE html>
                <html>
                    <head>
                        <style>
                            body {
                                padding: 0;
                                margin: 0;
                                overflow-x: hidden;
                                overflow-y: hidden;
                            }

                            iframe, img {
                                margin: 0;
                                width: 100%;
                            }
                        </style>
                        <title>Image Viewer</title>
                    </head>
                    <body>
                        ${getFileHTMLElement(response.data, dataURL)}
                    </body>
                </html>
            `;
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);

            window.open(url, "_blank");
        }
    }

    const onDownloadFileClicked = async () => {
        const response = await post("indicator/downloadfile", {
            token: auth.accessToken,
            id: params.indicator_id,
            filename: fileName
        }, {
            responseType: 'blob',
        });

        if (response.status === 200) {
            try {
                // Create a temporary URL to the downloaded file
                const url = window.URL.createObjectURL(new Blob([response.data]));

                // Create a link element to init the download
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                
                // Append the link to the document and click it to start the download
                document.body.appendChild(link);
                link.click();

                // Clean up the temporary URL
                window.URL.revokeObjectURL(url);
            } catch(error) {
                console.error('Error downloading the file:', error);
            }
        }
    }

    const onDeleteFileClicked = async () => {
        const response = await post("indicator/deletefile", {
            token: auth.accessToken,
            id: params.indicator_id,
            filename: fileName
        });

        if (response.status === 200) {
            let proofElement = document.getElementById(proofElementID);
            if (proofElement) {
                proofElement.remove();
            }
        }
    }

    return (
        <div className="proof-element" id={proofElementID}>
            <img src={extension === "pdf" ? logo_pdf : logo_img} alt="logo"></img>
            <h1>{fileName}</h1>
            <div className="proof-options">
                <img src={logo_open} alt="logo" onClick={onOpenFileClicked}/>
                <img src={logo_download} alt="logo" onClick={onDownloadFileClicked}/>
                <img src={logo_fdelete} alt="logo" onClick={onDeleteFileClicked}/>
            </div>
        </div>
    );
}

export default function Indicator(params) {
    const { post } = AxiosHandler();
    const { auth, isAdmin } = useAuth();

    const criteria_id = params.criteria_id;
    const criteria_infoid = params.criteria_infoid;
    const indicator = params.indicator;
    const data = params.data;
    const setData = params.setData;
    const updateCriteriaData = params.updateCriteriaData;

    const indicatorDeleteTitleID = `indicator-delete-title-${indicator.id}`;
    const indicatorContainerID = `indicator-container-${indicator.id}`;
    const indicatorSubcontainerID = `indicator-subcontainer-${indicator.id}`;
    const optionsContainerID = `indicator-options-${indicator.id}`;

    const [filesAmount, setFilesAmount] = useState(indicator.files.length);

    const handleOptionsContainerDisplayState = (event, state) => {
        event.preventDefault();
        event.stopPropagation();

        let optionsContainer = document.getElementById(optionsContainerID);
        optionsContainer.style.display = state;
    }

    const onIndicatorOptionClicked = (event) => {
        handleOptionsContainerDisplayState(event, "block");
    }

    const onOptionsContainerClicked = (event) => {
        handleOptionsContainerDisplayState(event, "none");
    }

    const onEditClicked = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const container = document.createElement('div');
        ReactDOM.render(<IndicatorForm accessToken={auth.accessToken} indicator={indicator} criteria_id={criteria_id} criteria_infoid={criteria_infoid} />, container);
        document.body.appendChild(container);
    }

    let indicatorDeleteButtonState = false;

    const onDeleteClicked = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        let indicatorDeleteTitle = document.getElementById(indicatorDeleteTitleID);
        if (indicatorDeleteButtonState) {
            const response = await post("indicator/delete", {
                token: auth.accessToken,
                indicator_infoid: indicator.info_id,
                criteria_infoid: criteria_infoid
            })

            if (response.status === 200) {
                let indicatorList = document.getElementById(`indicators-list-${criteria_id}`);
                let indicatorContainer = document.getElementById(indicatorContainerID);
                if (indicatorList)
                    indicatorList.removeChild(indicatorContainer);
            } else {
                indicatorDeleteTitle.innerText = "Supprimer";
                indicatorDeleteButtonState = false;
            }
        } else {
            indicatorDeleteTitle.innerText = "Êtes-vous sûr?";
            indicatorDeleteButtonState = true;
        }
    }

    const onBackgroundClicked = () => {
        let indicatorSubcontainer = document.getElementById(indicatorSubcontainerID);
        indicatorSubcontainer.style.display = (indicatorSubcontainer.style.display === "none") ? "block" : "none";
    }

    const onStatusSelectorClicked = (event) => {
        event.preventDefault();
        event.stopPropagation();
    }

    const onStatusChanged = async (event) => {
        let is_validated = Number(event.target.value);

        const response = await post("indicator/status", {
            token: auth.accessToken,
            id: indicator.id,
            is_validated: is_validated,
            criteria_infoid: criteria_infoid
        });

        if (response.status === 200) {
            let tmp = data.indicators;
            let ind = tmp.indexOf(indicator);
            if (ind !== -1) {
                tmp[ind].is_validated = is_validated;
                setData({
                    ...data,
                    tmp
                });
            }
            updateCriteriaData(indicator.id, is_validated);
        }
    }

    const uploadFiles = async (event) => {
        const data = new FormData();
        data.append("token", auth.accessToken);
        data.append("id", indicator.id);
        const files = event.target.files;
        for (const file of files) {
            data.append("files", file);
        }

        const response = await post("indicator/upload", data, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        });

        if (response.status === 200) {
            for (const file of files) {
                console.log(file);
                indicator.files.push(file.name);
            }
            setFilesAmount(indicator.files.length);
            console.log("filesAmount", filesAmount);
        }
    }

    return (
        <div>
            <div className="indicator-container" id={indicatorContainerID}>
                <div className="indicator-background" onClick={onBackgroundClicked}>
                    <div className="indicator-data">
                        <h1 className="indicator-name">{indicator.name}</h1>
                        <h1 className="indicator-description">{indicator.description}</h1>
                        {isAdmin() ? (
                            <div>
                                <img className="button-options" onClick={onIndicatorOptionClicked} src={logo_options} alt="logo"/>
                                <div className="options-container" id={optionsContainerID} onClick={onOptionsContainerClicked}>
                                    <div className="options-list">
                                        <div className="option" onClick={onEditClicked}>
                                            <img src={logo_edit} alt="logo"/>
                                            <h1>Modifier</h1>
                                        </div>
                                        <div className="option" onClick={onDeleteClicked}>
                                            <img src={logo_delete} alt="logo"/>
                                            <h1 id={indicatorDeleteTitleID}>Supprimer</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (<div/>)}
                    </div>
                    <div className="indicator-data-bis">
                        <div className="status-container">
                            <h1 className="status-title">Statut :</h1>
                            {isAdmin() ? (
                                <select className="status-value" defaultValue={indicator.is_validated} onClick={onStatusSelectorClicked} onChange={onStatusChanged}>
                                    <option value={0}>En cours</option>
                                    <option value={1}>Terminé</option>
                                </select>
                            ) : (
                                <h1 className="status-value" style={{color: (indicator.is_validated ? "#0095A1" : "#cc8714")}}>{indicator.is_validated ? "Terminé" : "En cours..."}</h1>
                            )}
                        </div>
                        <h1 className="files-amount">{filesAmount} Documents</h1>
                    </div>
                </div>

                <div className="id-container">
                    <h1 className="id-text">{indicator.display_id}</h1>
                </div>
                <div className="id-container-shadow"/>

                <div className="indicator-subcontainer" id={indicatorSubcontainerID} style={{display:"none"}}>
                    <div className="line"/>
                    <h1 className="expected-level">Niveau Attendu : {indicator.expectedLevel}</h1>
                    <h1 className="elements-proof">Eléments de Preuves : {indicator.elementsProof}</h1>
                    {(indicator.links.length > 0) ? (
                        <div>
                            <h1 className="elements-proof">Liens :</h1>
                            <ul className="links-list">
                                {indicator.links.map((item, id) => {
                                    return(
                                        <li className="link">
                                            <a href={item} target="_blank">{item}</a>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    ) : (<div/>)}
                    <div className="proofs-list-container">
                        <div className="proofs-list">
                            {indicator.files.map((fileName, proofID) => {
                                return (
                                    <ProofElement filename={fileName} proofID={proofID} indicator_id={indicator.id}/>
                                );
                            })}
                        </div>
                    </div>
                    <div className="drop-area">
                        <h1 className="proofs-container-title">Dépôt des éléments de preuve</h1>
                        <div className="proofs-container-help">
                            <h1 className="proofs-container-text">Cliquez ici pour sélectionner des fichiers</h1>
                            <h1 className="proofs-container-text">Ou</h1>
                            <h1 className="proofs-container-text">Glissez et déposer des fichiers ici</h1>
                        </div>
                        <input type="file" id="files-input" name="files" onChange={uploadFiles} multiple></input>
                    </div>
                </div>
            </div>
        </div>
    );
}
