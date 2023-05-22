import { GetActionDto, PostActionDto } from "common/dto/action.dto";
import { GetTranslateLanguage } from "common/dto/language.dto";
import {
  GetTranslationDto,
  PostTranslationDto,
} from "common/dto/translate-piece.dto";
import { api } from "api/Api";
import TextDisplay from "components/text/TextDisplay";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  putTranslationChanges,
  putTranslations,
  selectTranslationChanges,
  selectTranslations,
} from "store/translate-piece-reducer";
import { getEffectiveConstraintOfTypeParameter } from "typescript";
import "./TranslatePiecePage.css";

const TranslationPage: React.FC<{}> = () => {
  const { segmentId } = useParams<string>();
  const dispatch = useDispatch();

  const translations = useSelector(selectTranslations);
  const translationChanges = useSelector(selectTranslationChanges);

  const segment = useMemo(
    () => translations[segmentId],
    [segmentId, translations]
  );
  const originalSegment = useMemo(
    () => translations[segment?.originalSegmentId],
    [segment, translations]
  );

  const [actions, setActions] = useState<GetActionDto[]>();

  useEffect(() => {
    // check if segmentId in store, if not - fetch
    if (!(segmentId in translations)) {
      api
        .getTextSegment(segmentId, { withOriginal: true })
        .then(([response, _]) => {
          dispatch(putTranslations(response));
        });
    }

    api.getActions(+segmentId).then(([response, _]) => {
      setActions(response);
    });
  }, [segmentId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const textChange = translationChanges[originalSegment.id];
    const translationChange = translationChanges[segment.id];

    let arr: PostTranslationDto[] = [];
    if (textChange) {
      arr.push(textChange);
    }

    if (translationChange) {
      arr.push(translationChange);
    }

    api.postTranslations(arr).then(() => {
      window.location.reload();
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", flex: "1 1 auto" }}>
      <div style={{ width: "100%" }}>
        <form onSubmit={(e) => handleSubmit(e)}>
          {originalSegment && (
            <div>
              <h3>Оригинал:</h3>
              <textarea
                onChange={(e) =>
                  dispatch(
                    putTranslationChanges([
                      {
                        id: originalSegment.id,
                        translationText: e.target.value,
                        comment: "",
                      },
                    ])
                  )
                }
                value={
                  originalSegment.id in translationChanges
                    ? translationChanges[originalSegment.id].translationText
                    : originalSegment.translationText
                }
              />
            </div>
          )}

          {segment && (
            <div>
              <h3>Перевод:</h3>
              <textarea
                onChange={(e) =>
                  dispatch(
                    putTranslationChanges([
                      {
                        id: segment.id,
                        translationText: e.target.value,
                        comment: "",
                      },
                    ])
                  )
                }
                value={
                  segment.id in translationChanges
                    ? translationChanges[segment.id].translationText
                    : segment.translationText
                }
              />
            </div>
          )}
          <button type="submit">Отправить измеения</button>
        </form>
        {actions && actions.length > 0 && (
          <>
            <h3>История изменений: </h3>
            {actions.map((edit) => (
              <div key={edit.id}>
                {edit.author && (
                  <div>
                    <h5>Автор:</h5>
                    <Link to={`/profile/${edit.author.id}`}>
                      {" "}
                      {edit.author.name}{" "}
                    </Link>
                  </div>
                )}
                <h5>Изменение:</h5>
                {edit.change}
                {edit.comment && (
                  <div>
                    <h5>Заметка:</h5>
                    {edit.comment}
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
      {segment && <TextDisplay segmentId={segment.id} />}
    </div>
  );
};

export default TranslationPage;
