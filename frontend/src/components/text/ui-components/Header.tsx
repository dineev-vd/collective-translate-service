import { Menu, MenuItem } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useMatch, useNavigate } from "react-router-dom";
import { selectUser } from "store/userReducer";
import "./Header.css";

const Header: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const navigate = useNavigate();
  const curUser = useSelector(selectUser);
  const match = useMatch("/");
  const [showTopMenu, setShowTopMenu] = useState(false);

  function handleChange(event) {
    setSearchValue(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    navigate(`/search?query=${searchValue}`);
  }

  return (
    <header className="header">
      <Link to={"/"}>Главная</Link>
      <Link to={"/news"}>Новости</Link>
      <Link to={"/orders"}>Заказы</Link>
      <div className="header_input_wrapper">
        {!match && (
          <form onSubmit={handleSubmit}>
            <input
              style={{ boxSizing: "initial" }}
              placeholder="Поиск..."
              className="header_input"
              onChange={handleChange}
              value={searchValue}
            ></input>
          </form>
        )}
      </div>
      {curUser ? (
        <Popover2
          placement="bottom"
          content={
            <Menu>
              <MenuItem
                text={"Мой профиль"}
                onClick={() => navigate("/profile/me")}
              />
              <MenuItem
                text={"Мои проекты"}
                onClick={() => navigate("/profile/me/projects")}
              />
              <MenuItem
                text={"Создать новость"}
                onClick={() => navigate("/news/create")}
              />
            </Menu>
          }
          matchTargetWidth
          minimal
        >
          <div
            className="header_profile"
            onClick={() => setShowTopMenu((prev) => !prev)}
          >
            <div className="header_profile_name">{curUser.name}</div>
            <div className="header_avatar"></div>
          </div>
        </Popover2>
      ) : (
        <>
          <Link to={"/register"}>Регистрация</Link>
          <Link to={"/login"}>Вход</Link>
        </>
      )}
    </header>
  );
};

export default Header;
