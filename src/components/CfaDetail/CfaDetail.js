import Header from '../Header/Header';
import ReactDOM from 'react-dom';
import AxiosHandler from "../../axios/AxiosHandler";
import useAuth from '../../hooks/useAuth';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Criteria from '../Criteria/Criteria';
import CriteriaForm from '../Criteria/CriteriaForm';

import './CfaDetail.css';

import logo_add from '../../assets/add.png';

export default function CfaDetail() {
    const params = useParams();
    const { post } = AxiosHandler();
    const { auth, isAdmin } = useAuth();
    const [data, setData] = useState({
        whenToUpdate: false,
        criterias: []
    });

    const criteriasSync = async () => {
        const response = await post("cfa/details", {
            token: auth.accessToken,
            name: params.name
        });
        const criterias = (response.data) ? response.data : {};
        let tmp = [];
        for (const id in criterias) {
            let criteria = criterias[id];
            if (criteria)
                tmp.push(criterias[id]);
        }
        setData({
            ...data,
            criterias: tmp
        });
    }

    let onButtonAddCriteria;
    if (isAdmin()) {
        onButtonAddCriteria = () => {
            const container = document.createElement('div');
            ReactDOM.render(<CriteriaForm accessToken={auth.accessToken} name={params.name} data={data} setData={setData} />, container);
            document.body.appendChild(container);
        }
    } else {
        onButtonAddCriteria = () => {};
    }

    useEffect(() => {
        criteriasSync();
    }, [data.whenToUpdate]);

    return (
        <div className="criterias-page">
            <Header/>
            <div className="criterias-body">
                <div className="criterias-container">
                    <div className="criterias-container-title">
                        <h1 className="criterias-container-title-text">LISTE DES CRITERES</h1>
                    </div>
                    <div className="criterias-list-container" id="criterias-list-container">
                        <div className="criterias-list" id="criterias-list">
                            {data.criterias.map((item, id) => {
                                return (<Criteria criteria={item} id={id}/>);
                            })}
                        </div>
                        {isAdmin() ? (
                            <button className="criterias-list-add" onClick={onButtonAddCriteria}>
                                <img alt="logo" src={logo_add}/>
                            </button>
                        ) : (<div/>)}
                    </div>
                </div>
            </div>
        </div>
    );
}
