import { GetActionDto } from "common/dto/action.dto";
import { Link } from "react-router-dom";
import "./ActionSmall.css";

const ActionSmall: React.FC<{ action: GetActionDto }> = ({ action }) => {
  return (
    <div className="action-small">
      <Link style={{marginRight: "5px"}} to={`/segments/${action.segment.id}`}>К сегменту</Link>
      Автор:
      {action.author ? (
        <span style={{marginRight: "5px"}}>
          <Link to={`/profile/${action.author.id}`}>{action.author.name}</Link>
        </span>
      ) : (
        "Система"
      )}
      <span style={{margin: "0 5px"}}>Время изменения: {new Date(action.timestamp).toLocaleString()}</span>
      {action.change ? (
          <span>Изменение: {action.change}</span>
      ):
      ("Сегмент создан")}

    </div>
  );
};

export default ActionSmall;
