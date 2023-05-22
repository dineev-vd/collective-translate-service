import { api } from "api/Api";
import { ChangeUserDto, GetUserDto } from "common/dto/user.dto";
import { useState } from "react";

const UserInfo: React.FC<{ user: GetUserDto }> = ({ user }) => {
  const [edit, setEdit] = useState<Boolean>(false);
  const [change, setChange] = useState<ChangeUserDto>({
    email: user.email,
    name: user.name,
    info: user.info,
    password: "",
  });

  const handleSubmit = () => {
    api.changeUser(user.id.toString(), change).then(() => {
      location.reload();
    });
  };

  return (
    <div style={{ width: 1280 }}>
      <button onClick={() => setEdit((prev) => !prev)}>
        {!edit ? "Редактировать" : "Отмена"}
      </button>
      {!edit ? (
        <div>
          <h2>{user.name}</h2>
          <h4>Email: {user.email}</h4>
          <div>
            <b>Информация о пользователе:</b>
          </div>
          <div style={{ opacity: user.info ? 1 : 0.5 }}>
            {user.info ? user.info : "Не заполнено"}
          </div>
          <br />
          <div>
            <b>Вледение языками</b>
          </div>
          <div>Русский, Английский</div>
        </div>
      ) : (
        <form onSubmit={() => handleSubmit()}>
          <div>Имя:</div>
          <input
            required
            value={change.name}
            onChange={(e) =>
              setChange((prev) => ({ ...prev, name: e.target.value }))
            }
          ></input>

          <div>Email:</div>
          <input
            required
            type={"email"}
            value={change.email}
            onChange={(e) =>
              setChange((prev) => ({ ...prev, email: e.target.value }))
            }
          ></input>

          <div>Пароль:</div>
          <input
            type={"password"}
            value={change.password}
            onChange={(e) =>
              setChange((prev) => ({ ...prev, password: e.target.value }))
            }
          ></input>

          <div>Информация:</div>
          <textarea
            value={change.info}
            onChange={(e) =>
              setChange((prev) => ({ ...prev, info: e.target.value }))
            }
          ></textarea>
          <br></br>
          <button type="submit">Сохранить</button>
        </form>
      )}
    </div>
  );
};

export default UserInfo;
