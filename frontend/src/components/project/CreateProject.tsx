import { api } from "api/Api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateProject.css";
import TagSelect from "./TagSelect";

enum Language {
  RUSSIAN = "ru",
  ENGLISH = "en",
  GERMAN = "de",
}

const CreateProject: React.FC = () => {
  const [projectName, setProjectName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [language, setLanguage] = useState<Language>(Language.RUSSIAN);
  const [tags, setTags] = useState<string[]>([]);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    console.log(language);
    api
      .postProject({
        name: projectName,
        description: description,
        language: language,
        tags: tags,
      })
      .then(([response, _]) => {
        navigate(`/project/${response.id}`);
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="create-project-wrapper" style={{ width: 650 }}>
        Название проекта
        <input
          required
          onChange={(e) => setProjectName(e.currentTarget.value)}
          value={projectName}
          placeholder="Название"
        ></input>
        Описание
        <textarea
          className="create-project-description"
          onChange={(e) => setDescription(e.currentTarget.value)}
          value={description}
          placeholder="Описание"
        ></textarea>
        Язык оригинала
        <select
          value={language}
          onChange={(e) => setLanguage(e.currentTarget.value as Language)}
        >
          {Object.values(Language).map((l) => (
            <option value={l}>{l}</option>
          ))}
        </select>
        Тэги
        <TagSelect tags={tags} setTags={setTags} />
        <span>
          Приватный
          <input type={"checkbox"} style={{ marginLeft: 4 }} />
        </span>
        <button type="submit">Создать</button>
      </div>
    </form>
  );
};

export default CreateProject;
