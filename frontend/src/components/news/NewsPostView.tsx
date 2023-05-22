import CommentsView from "components/comments/CommentsView";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { FC } from "react";
import { createReactEditorJS } from "react-editor-js";
import { Link, useParams } from "react-router-dom";
import { useGetNewsPostQuery } from "store/api/news/getNewsPost";
import NewsPost from "./NewsPost/NewsPots";

dayjs.locale("ru");

const ReactEditorJS = createReactEditorJS();

const NewsPostView: FC = () => {
  const { id } = useParams();

  const { data: newsPost } = useGetNewsPostQuery(id);

  return (
    <div
      style={{
        width: 650,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <Link to={"/news"}>Назад</Link>
      {newsPost && <NewsPost {...newsPost} />}

      <div
        style={{
          background: "white",
          border: "1px solid black",
          borderRadius: 8,
          width: "100%",
          display: "flex",
          padding: 16,
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ borderBottom: "1px solid lightgray" }}>
          <h3>Комментарии</h3>
        </div>
        <CommentsView type={"news"} id={id} />
      </div>
    </div>
  );
};

export default NewsPostView;
