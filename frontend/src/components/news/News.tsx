import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { useGetNewsQuery } from "store/api/news/getNews";
import NewsEditor from "./NewsEditor";
import NewsPost from "./NewsPost/NewsPots";
import NewsPostView from "./NewsPostView";

const News: FC = () => {
  const { data } = useGetNewsQuery();

  return (
    <div>
      <Routes>
        <Route path="create" element={<NewsEditor />} />
        <Route path=":id" element={<NewsPostView />} />
        <Route
          index
          element={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 24,
                alignItems: "center",
                width: 650,
              }}
            >
              {data && data.map((post) => <NewsPost withLink {...post} />)}
              <hr style={{ width: "100%" }}></hr>
              <h3 style={{ marginTop: 0, color: "gray" }}>
                Вы просмотрели все новости
              </h3>
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default News;
