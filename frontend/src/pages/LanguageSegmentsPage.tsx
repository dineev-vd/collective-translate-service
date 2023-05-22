import { api } from "api/Api";
import { GetTranslateLanguageWithProject } from "common/dto/language.dto";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LanguageSegments from "../components/language-segments/LanguageSegments";

const LanguageSegmentsPage: React.FC = () => {
  const { languageId } = useParams();
  const [language, setLanguage] = useState<GetTranslateLanguageWithProject>();

  useEffect(() => {
    api.getLanguage(languageId).then(([response, _]) => {
      setLanguage(response);
    });
  }, [languageId]);

  return (
    <div style={{ width: 1720 }}>
      {language && (
        <div style={{ marginBottom: "30px" }}>
          <h3>
            Проект:
            <Link
              style={{ marginLeft: "10px" }}
              to={`/project/${language.project.id}`}
            >
              {language.project.name}
            </Link>
          </h3>
          {`Язык: ${language.language}`}
        </div>
      )}

      {language && <LanguageSegments project={language.project} />}
    </div>
  );
};

export default LanguageSegmentsPage;
