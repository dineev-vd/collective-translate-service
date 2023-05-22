import { GetProjectDto } from "common/dto/project.dto";
import { Link } from "react-router-dom";
import "./ProjectSmall.css";

const ProjectSmall: React.FC<{ project: GetProjectDto }> = ({ project }) => {
  return (
    <div className="project-small">
      <span>
        <Link to={`/project/${project.id}`}>{project.name}</Link>
      </span>
      {project.private && (
        <span
          style={{
            marginLeft: "5px",
            backgroundColor: "coral",
            border: "1px solid transparent",
            borderRadius: "5px",
            padding: "0 2px"
          }}
        >
          Приватный
        </span>
      )}
      <div>{project.description}</div>
    </div>
  );
};

export default ProjectSmall;
