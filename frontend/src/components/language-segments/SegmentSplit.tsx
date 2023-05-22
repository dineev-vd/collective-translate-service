import { Icon } from "@blueprintjs/core";
import { api } from "api/Api";
import { GetProjectDto } from "common/dto/project.dto";
import { GetTranslationDto } from "common/dto/translate-piece.dto";
import CommentsView from "components/comments/CommentsView";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetJobResultsQuery } from "store/api/jobResults/getJobResults";
import { useSuggestMutation } from "store/api/suggestions/getSuggestions";
import {
  putTranslationChanges,
  selectTranslationChanges,
} from "store/translate-piece-reducer";
import { selectUser } from "store/userReducer";
import { SegmentStatus, segmentStatusToText } from "utils/enums";
import "./SegmentSplit.css";

export function segmentStatusToColor(status: SegmentStatus) {
  switch (status) {
    // case SegmentStatus.LOCKED:
    //   return "coral";

    case SegmentStatus.NEW:
      return "cornflowerblue";

    case SegmentStatus.TRANSLATED:
      return "green";

    default:
      return "";
  }
}

const SegmentSplit: React.FC<{
  segment: GetTranslationDto;
  project: GetProjectDto;
}> = ({ segment, project }) => {
  const translationChanges = useSelector(selectTranslationChanges);
  const dispatch = useDispatch();

  const user = useSelector(selectUser);

  const [triggerPostSuggestion] = useSuggestMutation();

  const translation = useMemo(
    () =>
      segment.id in translationChanges
        ? translationChanges[segment.id].translationText
        : segment.translationText,
    [segment, translationChanges]
  );
  const original = useMemo(
    () =>
      segment.original
        ? segment.original.id in translationChanges
          ? translationChanges[segment.original.id].translationText
          : segment.original.translationText
        : undefined,
    [segment, translationChanges]
  );

  const handleSegmentChange = (value: string) => {
    dispatch(
      putTranslationChanges([
        { id: segment.id, comment: "", translationText: value },
      ])
    );
  };

  const handleOriginalChange = (value: string) => {
    dispatch(
      putTranslationChanges([
        { id: segment.original?.id, comment: "", translationText: value },
      ])
    );
  };

  const handleCommitChange = () => {
    api.postTranslations([translationChanges[segment.id]]).then(() => {
      location.reload();
    });
  };

  const handleSuggestTranslation = () => {
    triggerPostSuggestion({
      segmentId: segment.id,
      suggestion: translationChanges[segment.id].translationText,
    });
  };

  const { data } = useGetJobResultsQuery(segment.id);

  const [showComments, setShowComments] = useState(false);

  return (
    <div>
      <div className="segment-split">
        {segment.original && (
          <div className="segment-split_part">
            <div>
              Оригинал{" "}
              <span
                style={{ color: "lightgray" }}
              >{`#${segment.original.id}`}</span>
            </div>
            <textarea
              readOnly
              className={`segment-split_textarea ${
                segment.original.id in translationChanges
                  ? "segment-split__uncommited-change"
                  : ""
              }`}
              onChange={(e) => handleOriginalChange(e.currentTarget.value)}
              value={original}
            />
          </div>
        )}
        <div className="segment-split_part">
          <div>
            Сегмент{" "}
            <span style={{ color: "lightgray" }}>{`#${segment.id}`}</span>
            <span
              style={{
                color: "white",
                backgroundColor: segmentStatusToColor(segment.status),
                borderRadius: "5px",
                padding: "0 3px",
                marginLeft: "5px",
                float: "right",
              }}
            >
              {segmentStatusToText(segment.status)}
            </span>
            {segment.suggestionsIds.length > 0 && (
              <span
                style={{
                  color: "white",
                  backgroundColor: "orange",
                  borderRadius: "5px",
                  padding: "0 3px",
                  marginLeft: "5px",
                  float: "right",
                }}
              >
                {"Предложен перевод"}
              </span>
            )}
          </div>
          {/* <Link to={`/segments/${segment.id}`}>Открыть в контексте</Link> */}
          <textarea
            className={`segment-split_textarea ${
              segment.id in translationChanges
                ? "segment-split__uncommited-change"
                : ""
            }`}
            onChange={(e) => handleSegmentChange(e.currentTarget.value)}
            value={(data && data[0]?.text) ?? translation}
          />
          {user && (
            <>
              {(project.editorsId.includes(user.id.toString()) ||
                project.ownerId == user.id.toString()) && (
                <button
                  onClick={() => handleCommitChange()}
                  disabled={!(segment.id in translationChanges)}
                  style={{ marginRight: "5px" }}
                >
                  Сохранить перевод
                </button>
              )}
              <button
                onClick={() => handleSuggestTranslation()}
                disabled={!(segment.id in translationChanges)}
              >
                Предложить перевод
              </button>
            </>
          )}
        </div>
      </div>
      <div
        style={{
          padding: 10,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div onClick={() => setShowComments((p) => !p)}>
          <span>Комментарии</span>
          <Icon icon={showComments ? "arrow-up" : "arrow-down"} />
        </div>
        {showComments && <CommentsView type={"translation"} id={segment.id} />}
      </div>
      {/* {data && data.map((d) => d.text)} */}
    </div>
  );
};

export default SegmentSplit;
