import { api } from "api/Api";
import { auth } from "api/Auth";
import News from "components/news/News";
import Orders from "components/orders/Orders";
import CreateProject from "components/project/CreateProject";
import Header from "components/text/ui-components/Header";
import Login from "components/text/ui-components/Login";
import Register from "components/text/ui-components/Register";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import { selectShouldLogin, setUser } from "store/userReducer";
import LandingPage from "./LangingPage";
import LanguageSegmentsPage from "./LanguageSegmentsPage";
import ProfilePage from "./ProfilePage";
import ProjectPage from "./ProjectPage";
import "./Root.css";
import SearchResults from "./SearchResults";
import TranslationPage from "./TranslatePiecePage";

const Root = () => {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);
  const shuoldLogin = useSelector(selectShouldLogin);
  const navigate = useNavigate();

  useEffect(() => {
    api.setDispatch(dispatch, () => navigate("/login"));

    if (!auth.getAccessToken()) {
      setReady(true);
      return;
    }

    api
      .getProfile()
      .then(([user, _]) => {
        dispatch(setUser(user));
      })
      .finally(() => {
        setReady(true);
      });
  }, []);

  return (
    <>
      {ready ? (
        <div className="root">
          <Header />
          <div className="content-wrapper">
            <Routes>
              <Route path="profile/:profileId/*" element={<ProfilePage />} />
              <Route path="segments/:segmentId" element={<TranslationPage />} />
              <Route
                path="languages/:languageId"
                element={<LanguageSegmentsPage />}
              />
              <Route path="search" element={<SearchResults />} />
              <Route path="project/create" element={<CreateProject />} />
              <Route path="project/:projectId/*" element={<ProjectPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/news/*" element={<News />} />
              <Route path="/orders/*" element={<Orders />} />

              <Route path="*" element={<div>404</div>} />
              <Route index element={<LandingPage />} />
            </Routes>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Root;
