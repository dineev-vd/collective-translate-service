import { FC, useState } from "react";

type CommentInputProps = {
  onSubmit?: (comment: string) => void;
};

const CommentInput: FC<CommentInputProps> = ({ onSubmit }) => {
  const [comment, setComment] = useState<string>("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(comment);
        setComment("");
      }}
    >
      <textarea
        style={{ width: "100%", resize: "none", minHeight: 50 }}
        onChange={(e) => setComment(e.target.value)}
        value={comment}
      ></textarea>
      <button type="submit">Отправить</button>
    </form>
  );
};

export default CommentInput;
