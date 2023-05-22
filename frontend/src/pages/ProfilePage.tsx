import { api } from "api/Api";
import { GetUserDto } from "common/dto/user.dto";
import UserInfo from "components/UserInfo";
import UserProjectList from "components/project/ProjectList";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const { profileId } = useParams();
  const [user, setUser] = useState<GetUserDto>();

  useEffect(() => {
    console.log(profileId);

    if (profileId !== "me") {
      api.getUserById(profileId).then(([response, _]) => {
        setUser(response);
      });
    } else {
      api.getProfile().then(([response, _]) => {
        setUser(response);
        console.log(response);
      });
    }
  }, []);

  return user ? (
    <>
      <Routes>
        <Route path="details" element={<UserInfo user={user} />} />
        <Route index element={<Navigate to={"details"} replace />} />
        <Route
          path="projects"
          element={<UserProjectList userId={user.id.toString()} />}
        />
      </Routes>
    </>
  ) : null;
};

export default ProfilePage;
