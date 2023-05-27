import { api } from "api/Api";
import { GetAssemblyDto } from "common/dto/assembly.dto";
import { GetTranslateLanguage } from "common/dto/language.dto";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQueueTranslationMutation } from "store/api/translation/queueTranslation";

const LanguageDetails: React.FC = () => {
  const { languageId } = useParams();
  const [language, setLanguage] = useState<GetTranslateLanguage>();
  const [assemblies, setAssemblies] = useState<GetAssemblyDto[]>();
  const [type, setType] = useState<string>("argos");

  useEffect(() => {
    api.getLanguage(languageId).then(([response, _]) => {
      setLanguage(response);
    });

    api.getAssembliesByLanguage(languageId).then(([response, _]) => {
      setAssemblies(response);
    });
  }, [languageId]);

  function handleAssemble() {
    api.assembleLanguage(languageId).then(() => {
      location.reload();
    });
  }

  const [trigger] = useQueueTranslationMutation();

  return (
    <div style={{ width: "100%", padding: "0px 10px" }}>
      {language && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h3>{language.language}</h3>
          {/* <h6>{language.id}</h6> */}
          {assemblies &&
            assemblies.map((a) => (
              <a href={`/api/crud/assembly/${a.id}`}>{a.name}</a>
            ))}
          <button
            style={{ width: "100px", marginTop: "20px" }}
            onClick={handleAssemble}
          >
            Собрать
          </button>
          <select
            style={{ width: "200px", marginTop: "20px" }}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value={"yandex"}>Yandex Translate</option>
            <option value={"argos"}>Argos</option>
          </select>
          <button
            style={{ width: "100px", marginTop: "20px" }}
            onClick={() => trigger({ translationId: language.id, type })}
          >
            Перевести
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageDetails;
