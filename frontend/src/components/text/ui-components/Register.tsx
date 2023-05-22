import { useState } from "react";
import { PostUserDto } from "common/dto/user.dto";
import { api } from "api/Api";
import { auth } from "api/Auth";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [newUserForm, setUserForm] = useState<PostUserDto>({
    email: "",
    name: "",
    password: "",
  });
  const navigate = useNavigate();

  const [errorText, setErrorText] = useState<string | undefined>();

  const handleSubmit = (e) => {
    e.preventDefault();

    // if(newUserForm.)

    api.register(newUserForm).then(([resonse, _]) => {
      auth.setAccessToken(resonse.accessToken);
      navigate("/");
    });
  };

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <h4>E-mail:</h4>
        <input
          required
          type={"email"}
          value={newUserForm.email}
          onChange={(e) =>
            setUserForm((prev) => ({ ...prev, email: e.target.value }))
          }
        ></input>
        <h4>Пароль:</h4>
        <input
          required
          type={"password"}
          value={newUserForm.password}
          onChange={(e) =>
            setUserForm((prev) => ({ ...prev, password: e.target.value }))
          }
        ></input>
        <h4>Имя:</h4>
        <input
          required
          type={"text"}
          value={newUserForm.name}
          onChange={(e) =>
            setUserForm((prev) => ({ ...prev, name: e.target.value }))
          }
        ></input>
        <br></br>
        <button style={{ marginTop: "10px" }} type="submit">
          Зарегистрироваться
        </button>
        {/* {errorText && <div style={{ color: "red" }}>{errorText}</div>} */}
      </form>
    </div>
  );
};

export default Register;
