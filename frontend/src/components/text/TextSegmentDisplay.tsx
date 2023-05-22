import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  putTranslationChanges,
  selectTranslationChanges,
  selectTranslations,
} from "store/translate-piece-reducer";

const TextSegmentDisplay: React.FC<{
  segmentId: string;
  originalSegmentId: string;
  selectedSegmentId: string;
}> = ({ segmentId, originalSegmentId, selectedSegmentId }) => {

  const [showOriginal, setShowOriginal] = useState<Boolean>(false);
  const translations = useSelector(selectTranslations);
  const translationsChanges = useSelector(selectTranslationChanges);
  const dispatch = useDispatch();

  const spanRef = useRef<HTMLSpanElement>();
  const previousChangeInside = useRef<Boolean>();

  const originalText = useMemo(
    () =>
      originalSegmentId in translationsChanges
        ? translationsChanges[originalSegmentId].translationText
        : translations[originalSegmentId]?.translationText,
    [translations, originalSegmentId, translationsChanges]
  );
  const segmentText = useMemo(
    () =>
      segmentId in translationsChanges
        ? translationsChanges[segmentId].translationText
        : translations[segmentId]?.translationText,
    [translations, segmentId, translationsChanges]
  );
  const finalText = useMemo(
    () =>
      (showOriginal && originalText) || !segmentText
        ? originalText
        : segmentText,
    [showOriginal, originalText, segmentText]
  );

  const navigate = useNavigate();

  const navigateToSegment = useCallback(() => {
    navigate(
      `../segments/${
        !showOriginal
          ? segmentId ?? originalSegmentId
          : originalSegmentId ?? segmentId
      }`
    );
  }, [segmentId, originalSegmentId, showOriginal]);

  useEffect(() => {
    if (previousChangeInside.current) {
      previousChangeInside.current = false;
      return;
    }

    spanRef.current.innerText = finalText;
  }, [finalText]);

  useEffect(() => {
    if (
      selectedSegmentId == segmentId ||
      selectedSegmentId == originalSegmentId
    ) {
      spanRef.current.style.backgroundColor = "lightgreen";
    } else {
      spanRef.current.style.backgroundColor = null;
    }
  }, [selectedSegmentId, segmentId, originalSegmentId]);

  const handleInput = useCallback(() => {
    const id =
      (showOriginal && originalText) || !segmentText
        ? originalSegmentId
        : segmentId;
    dispatch(
      putTranslationChanges([
        { comment: "", translationText: spanRef.current.innerText, id: id },
      ])
    );

    previousChangeInside.current = true;
  }, [showOriginal, originalText, segmentText, segmentId, originalSegmentId]);

  return (
    <span>
      <span onInput={handleInput} ref={spanRef} contentEditable></span>
      {/* {segmentId && (
        <button onClick={() => setShowOriginal((prev) => !prev)}>#</button>
      )}
      {translations[segmentId] && (
        <button onClick={() => navigateToSegment()}>К сегменту</button>
      )} */}
    </span>
  );
};

export default TextSegmentDisplay;
