import TagSelect from "components/project/TagSelect";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetProjectsQuery } from "store/api/projects/getProjects";
import ProjectSmall from "../components/project/ProjectSmall";
import "./SearchResults.css";

const SearchResults: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const query = params.get("query");
  const [tags, setTags] = useState<string[]>([]);

  const { data } = useGetProjectsQuery({ query, tags });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <h3>Проекты</h3>
      <input
        value={query}
        onChange={(e) => setParams({ query: e.target.value })}
        placeholder="Начните вводить название проекта..."
      />
      <TagSelect tags={tags} setTags={setTags} disableCreate />
      <div className="search-results">
        {data?.map((e) => (
          <ProjectSmall key={e.id} project={e} />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
