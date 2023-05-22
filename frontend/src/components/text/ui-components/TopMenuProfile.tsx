import { api } from "api/Api";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectUser, setUser } from "store/userReducer";
import "./TopMenuProfile.css";

const TopMenuProfile: React.FC<{ show: Boolean }> = ({ show }) => {

    return <div className={`top_menu_wrapper ${show ? 'top_menu_wrapper__show' : ''}`}>
        <div className="top_menu">
            <Link to={"/profile/me"}>Мой профиль</Link>
            <Link to={"/profile/me/projects"}>Мои проекты</Link>
        </div>
    </div>
}

export default TopMenuProfile;