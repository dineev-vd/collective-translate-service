import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css"

const LandingPage: React.FC<{}> = (_) => {
    const navigate = useNavigate();
    const [query, setQuery] = useState<string>("");

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate(`/search?query=${query}`);
    }

    return <div className="landing-page">
        <div className="landing-page_wrapper">
            <button onClick={() => navigate('/project/create')} className="landing-page_create-button">Создать проект</button>
            <div className="landing-page_or">ИЛИ</div>
            <form onSubmit={e => handleSubmit(e)}>
                <input onChange={(e) => setQuery(e.currentTarget.value)} value={query} placeholder="Найти..." className="landing-page_search"></input>
            </form>
        </div>
    </div>
}

export default LandingPage;