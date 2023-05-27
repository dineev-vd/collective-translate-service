import TagSelect from "components/project/TagSelect";
import { FC, useState } from "react";
import { useApplyOrderMutation } from "store/api/orders/applyOrder";
import { useGetOrdersQuery } from "store/api/orders/getOrders";
import { useRevokeOrderMutation } from "store/api/orders/revokeOrder";

const Orders: FC = () => {
  const [query, setQuery] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const { data: orders } = useGetOrdersQuery({ query, tags });

  const [applyTrigger] = useApplyOrderMutation();
  const [revokeTrigger] = useRevokeOrderMutation();

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 8, width: 650 }}
    >
      <h2>Заказы</h2>
      <input
        placeholder="Поиск по названию..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <TagSelect tags={tags} setTags={setTags} disableCreate />
      <hr style={{ width: "100%" }} />
      {orders &&
        (orders.length ? (
          orders?.map(({ description, id, applied, project }) => (
            <div>
              <h2>{project.name}</h2>
              <p>{description}</p>
              {applied ? (
                <button onClick={() => revokeTrigger(id)}>
                  Отозвать заявку
                </button>
              ) : (
                <button onClick={() => applyTrigger(id)}>Подать заявку</button>
              )}
            </div>
          ))
        ) : (
          <h3 style={{ color: "gray" }}>Заказы отсутствуют</h3>
        ))}
    </div>
  );
};

export default Orders;
