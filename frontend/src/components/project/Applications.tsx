import { FC, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAcceptOrderMutation } from "store/api/orders/acceptOrder";
import { useCreateOrderMutation } from "store/api/orders/createOrder";
import { useDenyOrderMutation } from "store/api/orders/denyOrder";
import { useGetOrderByProjectQuery } from "store/api/orders/getOrderByProject";

const Applications: FC = () => {
  const { projectId } = useParams();
  const { data: order, isSuccess } = useGetOrderByProjectQuery(projectId);

  const [triggerAccept] = useAcceptOrderMutation();
  const [triggerDeny] = useDenyOrderMutation();

  const [triggerCreateOrder] = useCreateOrderMutation();

  const [description, setDescription] = useState("");

  return (
    <div>
      {isSuccess &&
        (!order ? (
          <>
            <h3>Создайте заказ, чтобы принимать заявки</h3>
            <hr style={{ width: "100%" }} />
            <div>Описание</div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <br></br>
            <button
              onClick={() => triggerCreateOrder({ projectId, description })}
            >
              Создать заказ
            </button>
          </>
        ) : (
          <div style={{ borderRadius: 8, padding: 8 }}>
            <h2>Описание</h2>
            <p>{order.description}</p>
            <hr style={{ width: "100%" }} />
            {order.applicants.length ? (
              order.applicants.map(({ email, name, id }) => (
                <div>
                  <h2>
                    <Link to={`/profile/${id}`}>{name}</Link>
                  </h2>
                  <h4>{email}</h4>
                  <b>Языки:</b>
                  <br></br>
                  Русский, Английский
                  <br></br>
                  <br></br>
                  <b>Дополнительная информация:</b>
                  <br></br>
                  Опыт перевода 4 года
                  <br></br>
                  <br></br>
                  <span>
                    <button
                      style={{ marginRight: 4 }}
                      onClick={() =>
                        triggerAccept({ orderId: order.id, userId: id })
                      }
                    >
                      Принять
                    </button>
                    <button
                      onClick={() =>
                        triggerDeny({ orderId: order.id, userId: id })
                      }
                    >
                      Отклонить
                    </button>
                  </span>
                </div>
              ))
            ) : (
              <h3 style={{ color: "gray" }}>Заявки отсутствуют</h3>
            )}
          </div>
        ))}
    </div>
  );
};

export default Applications;
