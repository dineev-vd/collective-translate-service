import TabLink from "components/text/ui-components/TabLink";
import { FC } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { useGetGlossariesByProjectQuery } from "store/api/glossary/getGlossaries";
import GlossaryEntries from "./GlossaryEntries";

type GlossaryItem = {
  phrase: string;
  description: string;
  proposedTranslation: string;
};

const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const comments = Array(10)
  .fill(0)
  .map((_, index) => ({ name: `Пользователь ${index}`, comment: lorem }));

const GlossaryLIST: GlossaryItem[] = [
  {
    phrase: "Верея",
    description: "Столб, на который навешивались ворота",
    proposedTranslation: "pole",
  },
];

const Glossary: FC = () => {
  const { projectId } = useParams();

  const { data: glossaries } = useGetGlossariesByProjectQuery(projectId);

  return (
    <div>
      <div
        style={{
          marginBottom: 12,
        }}
      >
        <div
          style={{
            marginLeft: 20,
            marginBottom: -1,
            display: "flex",
            gap: 8,
          }}
        >
          {glossaries &&
            glossaries.map((g) => (
              <TabLink to={g.id}>{g.language.language}</TabLink>
            ))}
        </div>
        <div
          style={{
            height: 1,
            width: "100%",
            backgroundColor: "black",
            position: "relative",
            zIndex: 100,
          }}
        ></div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <Routes>
          <Route path=":glossaryId" element={<GlossaryEntries />} />
          <Route
            index
            element={
              glossaries &&
              glossaries.length && <Navigate to={glossaries[0].id} />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Glossary;
