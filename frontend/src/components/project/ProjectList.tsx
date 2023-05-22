import { GetProjectDto } from "common/dto/project.dto";
import { api } from "api/Api";
import { useEffect, useState } from "react";
import ProjectSmall from "./ProjectSmall";

const UserProjectList: React.FC<{ userId: string }> = ({ userId }) => {
    const [projects, setProjects] = useState<GetProjectDto[]>([]);

    useEffect(() => {
        api.getProjectsByUser(userId).then(([response, _]) => {
            setProjects(response);
        })
    }, [userId])

    return <div>
        {projects.map(project => (
            <ProjectSmall key={project.id} project={project} />
        ))}
    </div>
}

export default UserProjectList;