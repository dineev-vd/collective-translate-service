import { Tag } from "@blueprintjs/core";
import { api } from "api/Api";
import { ChangeProjectDto, GetProjectDto } from "common/dto/project.dto";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectUser } from "store/userReducer";
import TagSelect from "./TagSelect";

const ProjectSummary: React.FC<{}> = () => {
  const { projectId } = useParams();
  const [summaryResponse, setSummaryResponse] = useState<GetProjectDto>();
  const [change, setChange] = useState<ChangeProjectDto>();
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);
  const user = useSelector(selectUser);

  useEffect(() => {
    api.getProjectById(projectId).then(([response, _]) => {
      setSummaryResponse(response);
      setChange({
        name: response.name,
        description: response.description,
        tags: response.tags.map(({ id }) => id),
      });
    });
  }, [projectId]);

  const handleChange = () => {
    api.updateProject(projectId, change).then(() => {
      location.reload();
    });
  };

  return (
    <>
      {summaryResponse && (
        <div>
          {summaryResponse &&
            (summaryResponse.editorsId.includes(user.id.toString()) ||
              summaryResponse.ownerId == user.id.toString()) && (
              <button onClick={() => setShowEdit((prev) => !prev)}>
                {!showEdit ? "Изменить" : "Отмена"}
              </button>
            )}

          {showEdit && (
            <>
              <br></br>
              <button onClick={() => handleChange()}>
                Закончить изменения
              </button>
            </>
          )}
          {showEdit ? (
            <>
              <br></br>
              Название проекта
              <br></br>
              <input
                onChange={(e) =>
                  setChange((prev) => {
                    return { ...prev, name: e.target.value };
                  })
                }
                value={change.name}
              />
            </>
          ) : (
            <h1>{summaryResponse.name}</h1>
          )}
          {showEdit ? (
            <>
              <br></br>
              Описание проекта
              <br></br>
              <textarea
                onChange={(e) =>
                  setChange((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                value={change.description}
              />
            </>
          ) : (
            <>
              Описание
              <br />
              <h4>{summaryResponse.description}</h4>
            </>
          )}
          {showEdit ? (
            <>
              <br></br>
              Тэги
              <br></br>
              <TagSelect
                tags={change.tags}
                setTags={(tags) => setChange({ ...change, tags })}
              />
            </>
          ) : (
            <h4>
              Теги
              <br />
              {summaryResponse.tags.length ? (
                <div style={{ display: "flex", gap: 4 }}>
                  {summaryResponse.tags.map((t) => (
                    <Tag>{t.id}</Tag>
                  ))}
                </div>
              ) : (
                "Теги отсутствуют"
              )}
            </h4>
          )}
          <div>Всего сегментов: {summaryResponse.all}</div>
          <div>Переведено: {summaryResponse.translated}</div>
        </div>
      )}
    </>
  );
};

export default ProjectSummary;
