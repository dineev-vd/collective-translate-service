import FileList from "components/file/FileList";
import FilePeek from "components/file/FilePeek";
import TextSegments from "components/language/LanguageTranslations";
import Languages from "components/language/Languages";
import Actions from "components/project/Actions";
import Applications from "components/project/Applications";
import Glossary from "components/project/Glossary";
import ProjectSummary from "components/project/ProjectSummary";
import TabLink from "components/text/ui-components/TabLink";
import { Navigate, Route, Routes } from "react-router-dom";
import "./ProjectPage.css";

const ProjectPage: React.FC = () => {
  return (
    <div className="project-page">
      <div className="project-page_nav">
        <TabLink to={"details"}>Детали</TabLink>
        <TabLink to={"languages"}>Перевод</TabLink>
        <TabLink to={"files"}>Файлы</TabLink>
        <TabLink to={"text-segments"}>Все сегменты</TabLink>
        <TabLink to={"actions"}>История изменений</TabLink>
        <TabLink to={"glossary"}>Глоссарий</TabLink>
        <TabLink to={"applications"}>Заявки</TabLink>
      </div>
      <div className="project-page_content">
        <Routes>
          <Route path="languages/*" element={<Languages />} />
          <Route path="files" element={<FileList />}>
            <Route path=":fileId" element={<FilePeek />} />
          </Route>
          <Route path="text-segments" element={<TextSegments />} />
          <Route path="details" element={<ProjectSummary />} />
          <Route index element={<Navigate to={"details"} replace />} />
          <Route path="actions" element={<Actions />} />
          <Route path="glossary/*" element={<Glossary />} />
          <Route path="applications/*" element={<Applications />} />
        </Routes>
      </div>
    </div>
  );
};

export default ProjectPage;
