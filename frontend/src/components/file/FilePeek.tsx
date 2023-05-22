import { GetRegexpDto } from "common/dto/regexp.dto";
import { api } from "api/Api";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { JsxElement } from "typescript";
import "./FilePeek.css";

const FilePeek: React.FC = () => {
  const [markedText, setMarkedText] = useState<
    { marked: Boolean; text: string }[]
  >([]);
  const { fileId } = useParams();
  const [regexpString, setReString] = useState<string>("");
  const [regexpList, setRegexpList] = useState<GetRegexpDto[]>([]);
  const [regexpSelected, setRegexpSelected] = useState<number>(-1);
  const regexpToSend = useMemo(() => {
    if (regexpSelected == -2) {
      return regexpString;
    }

    if (regexpSelected == -1) {
      return null;
    }

    return regexpList[regexpSelected].regexp;
  }, [regexpSelected, regexpString, regexpList]);
  const [errorText, setErrorText] = useState<string | undefined>()

  function handleChange(e) {
    setReString(e.currentTarget.value);
  }

  function handleSelect(e) {
    setRegexpSelected(e.currentTarget.value);
  }

  useEffect(() => {
    api.getFilePeek(Number(fileId), regexpToSend).then(([response, _]) => {
      setMarkedText(response.text);
      setErrorText(undefined)
    }).catch(() => {
        setErrorText("Неверное регулярное выражение!")
    });
  }, [fileId, regexpToSend]);

  useEffect(() => {
    api.getAllRegexps().then(([response, _]) => {
      setRegexpList(response);
    });
  }, []);

  return (
    <div className="file-peek">
      <div className="file-peek_process">
        <button onClick={() => api.splitFile(+fileId, regexpToSend).then(()=> location.reload())}>
          Обработать
        </button>
        <input
          disabled={regexpSelected != -2}
          onChange={handleChange}
          value={regexpString}
        ></input>
        <select value={regexpSelected} onChange={handleSelect}>
          <option value={-2}>Свое выражение</option>
          <option value={-1}>По предложениям</option>
          {regexpList.map((regexp, index) => (
            <option value={index} key={index}>
              {regexp.name}
            </option>
          ))}
        </select>
      </div>
      {errorText && <div style={{ color: "red" }}>{errorText}</div>}
      <div className="file-peek_text">
        {markedText.map((e, index) => (
          <span
            key={index}
            className={`file-peek_text-segment ${
              e.marked ? `file-peek_marked_${index % 3}` : ""
            }`}
          >
            {e.text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default FilePeek;
