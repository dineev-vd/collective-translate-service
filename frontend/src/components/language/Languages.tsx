import { GetTranslateLanguage } from "common/dto/language.dto";
import { api } from "api/Api";
import { useEffect, useState } from "react";
import { Link, Route, Routes, useParams } from "react-router-dom";
import LanguageDetails from "./LanguageDetails";
import LanguageSmall from "./LanguageSmall";
import { Language } from "../../utils/enums";
import { useSelector } from "react-redux";
import { selectUser } from "store/userReducer";
import { GetProjectDto } from "common/dto/project.dto";

const Languages: React.FC = () => {
  const [state, changeState] = useState<GetTranslateLanguage[]>([]);
  const { projectId } = useParams();
  const [language, setLanguage] = useState<Language>();
  const user = useSelector(selectUser);
  const [project, setProject] = useState<GetProjectDto>();

  useEffect(() => {
    api.getProjectById(projectId).then(([response, _]) => {
        setProject(response);
    });
  }, [projectId]);

  useEffect(() => {
    setLanguage(Language.RUSSIAN);

    api.getLanguagesBtProjectId(Number(projectId)).then(([response, _]) => {
      changeState(response);
    });
  }, []);

  function handleCreateLanguage() {
    api
      .postLanguage(projectId, { language: language })
      .then(([response, _]) => {
        location.reload();
      });
  }

  return (
    <div>
      {project && (project.editorsId.includes(user.id.toString()) || project.ownerId == user.id.toString()) && 
        <>
          <select
            value={language}
            onChange={(e) => setLanguage(e.currentTarget.value as Language)}
          >
            {Object.values(Language).map((l) => (
              <option>{l}</option>
            ))}
          </select>
          <button style={{ marginLeft: "5px" }} onClick={handleCreateLanguage}>
            Создать перевод
          </button>
        </>
      }
      <div style={{ display: "flex", width: "100%", marginTop: "10px" }}>
        <div style={{ width: "100%" }}>
          {state &&
            state.map((language) => <LanguageSmall language={language} />)}
        </div>
        <div style={{ width: "100%", marginLeft: "20px" }}>
          <Routes>
            <Route index element={<h3>Выберите язык</h3>} />
            <Route path=":languageId" element={<LanguageDetails />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Languages;
