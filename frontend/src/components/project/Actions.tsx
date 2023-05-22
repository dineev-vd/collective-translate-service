import { api } from "api/Api";
import { GetActionDto } from "common/dto/action.dto";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ActionSmall from "./ActionSmall";

const Actions: React.FC<{}> = () => {
  const { projectId } = useParams();
  const [actions, setActions] = useState<GetActionDto[]>([]);

  useEffect(() => {
    api.getActionsByProject(projectId).then(([response, _]) => {
      setActions(response);
    });
  }, [projectId]);

  return (
    <div>
      {actions.map((action) => (
        <ActionSmall action={action} />
      ))}
    </div>
  );
};

export default Actions;
