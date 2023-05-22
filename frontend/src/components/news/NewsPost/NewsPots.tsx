import dayjs from "dayjs";
import { FC } from "react";
import { createReactEditorJS } from "react-editor-js";
import { Link } from "react-router-dom";
import { NewsPost as NewsPostType } from "store/api/news/getNewsPost";

const ReactEditorJS = createReactEditorJS();

export type NewsPostProps = {
  withLink?: boolean;
};

const NewsPost: FC<NewsPostType & NewsPostProps> = (newsPost) => {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid black",
        borderRadius: 8,
        width: 650,
        display: "flex",
        padding: 16,
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px solid lightgray",
        }}
      >
        {newsPost?.withLink ? (
          <Link to={`/news/${newsPost.id}`}>
            <h2>{newsPost.title}</h2>
          </Link>
        ) : (
          <h2>{newsPost?.title}</h2>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <h4 style={{ color: "lightgray", margin: 0 }}>
            {dayjs(newsPost?.updatedDate).format("DD.MM.YYYY HH:mm")}
          </h4>
          <h5 style={{ margin: 0 }}>{newsPost?.author.name}</h5>
        </div>
      </div>
      {newsPost && (
        <ReactEditorJS defaultValue={JSON.parse(newsPost.content)} readOnly />
      )}
    </div>
  );
};

export default NewsPost;
