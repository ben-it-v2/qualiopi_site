import { Link } from "react-router-dom"

const Missing = () => {
    return (
        <article style={{ padding: "100px" }}>
            <h1>Oops!</h1>
            <p>Page Introuvable</p>
            <div className="flexGrow">
                <Link to="/">Retourner à l'Accueil</Link>
            </div>
        </article>
    )
}

export default Missing
