import { Button } from "@blueprintjs/core";
import { ComponentProps, FC, useEffect, useRef, useState } from "react";
import { createReactEditorJS } from "react-editor-js";
import { useNavigate } from "react-router-dom";
import { useCreatePostMutation } from "store/api/news/createPost";

const ReactEditorJS = createReactEditorJS();

const NewsEditor: FC = () => {
  const editorCore =
    useRef<
      Parameters<ComponentProps<typeof ReactEditorJS>["onInitialize"]>[0]
    >();

  const [trigger, { isSuccess }] = useCreatePostMutation();
  const [title, setTitle] = useState("");

  const handleSave = async () => {
    trigger({ content: await editorCore.current.save(), title });
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      navigate("/news");
    }
  }, [isSuccess]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        alignItems: "center",
        width: 650,
      }}
    >
      <div
        style={{
          background: "white",
          border: "1px solid black",
          borderRadius: 8,
          width: "100%",
          display: "flex",
          padding: "8px 25px",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div>Название</div>
        <input value={title} onChange={(e) => setTitle(e.target.value)}></input>
        <hr style={{ width: "100%" }}></hr>
        <div>Контент</div>

        <ReactEditorJS
          onInitialize={(instance) => (editorCore.current = instance)}
          placeholder="Введите текст..."
        />
        <Button intent="primary" onClick={handleSave}>
          Создать
        </Button>
      </div>
    </div>
  );
};

export default NewsEditor;
