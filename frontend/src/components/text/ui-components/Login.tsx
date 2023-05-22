import { api } from "api/Api";
import { auth } from "api/Auth";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "store/userReducer";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    api.login(email, password).then(([response, _]) => {
      auth.setAccessToken(response.accessToken);
      api.getProfile().then(([user, _]) => {
        dispatch(setUser(user));
        navigate(-1);
      });
    });
  };

  return (
    <>
      <form onSubmit={(e) => handleLogin(e)}>
        <h4>E-mail:</h4>
        <input
          type={"email"}
          value={email}
          onChange={({ target }) => setEmail(target.value)}
        ></input>
        <h4>Пароль:</h4>
        <input
          type={"password"}
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        ></input>
        <button type="submit">Войти</button>
      </form>
    </>
  );
};

export default Login;
