import { Icon } from "@blueprintjs/core";
import { Classes, Tooltip2 } from "@blueprintjs/popover2";
import dayjs from "dayjs";
import { FC } from "react";
import { Link } from "react-router-dom";
import {
  GetCommentsParams,
  useGetCommentsQuery,
} from "store/api/comments/getNewsComments";
import { usePostCommentMutation } from "store/api/comments/postComment";
import CommentInput from "./CommentInput";

const CommentsView: FC<GetCommentsParams> = (params) => {
  const { data: comments } = useGetCommentsQuery(params);

  const [trigger] = usePostCommentMutation();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {comments &&
        (comments.length ? (
          comments.map((comment) => (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Link to={`/profile/${comment.author.id}`}>
                    {comment.author.name}
                  </Link>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {dayjs(comment.createdDate).format("DD.MM.YYYY HH:mm")}
                  <Tooltip2
                    className={Classes.TOOLTIP2_INDICATOR}
                    content={<span>Пожаловаться на комментарий</span>}
                    hoverOpenDelay={1000}
                    placement="top"
                  >
                    <Icon icon={"warning-sign"} color="gray" />
                  </Tooltip2>
                </div>
              </div>
              <p>{comment.comment}</p>
            </div>
          ))
        ) : (
          <h4>Комментариев пока нет</h4>
        ))}

      <CommentInput
        onSubmit={(comment) => trigger({ ...params, text: comment })}
      />
    </div>
  );
};

export default CommentsView;
