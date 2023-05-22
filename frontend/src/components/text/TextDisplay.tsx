import { api } from "api/Api";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  putTranslations,
  selectTranslations,
} from "store/translate-piece-reducer";
import TextSegmentDisplay from "./TextSegmentDisplay";
import "./TextDisplay.css";

enum Direction {
  UP = 0,
  DOWN = 1,
}

const TextDisplay: React.FC<{ segmentId: string }> = ({ segmentId }) => {
  const dispatch = useDispatch();
  const translations = useSelector(selectTranslations);

  const segment = useMemo(
    () => translations[segmentId],
    [translations, segmentId]
  );

  const upperTriggerRef = useRef<HTMLDivElement>();
  const lowerTriggerRef = useRef<HTMLDivElement>();
  const divRef = useRef<HTMLDivElement>();
  const [offBoundsCount, setOffBoundsCount] = useState(0);

  const [segmentDisplayArray, setDisplayArray] = useState<
    Partial<Record<"segmentId" | "originalSegmentId", string>>[]
  >([]);

  useEffect(() => {
    if (!(segmentId in translations)) {
      api
        .getTextSegment(segmentId, { withOriginal: true })
        .then(([respone, _]) => {
          dispatch(putTranslations(respone));
        });
    }
  }, [segmentId]);

  useEffect(() => {
    if (!segment) return;

    if (
      segmentDisplayArray.find(
        (info) =>
          segment.id === info.segmentId || segment.id === info.originalSegmentId
      )
    )
      return;

    setDisplayArray([
      { segmentId: segment.id, originalSegmentId: segment.originalSegmentId },
    ]);
  }, [segment]);

  const expand = useCallback(
    (direction: Direction) => {
      const upperBorderSegment = segmentDisplayArray[0];
      const lowerBorderSegment =
        segmentDisplayArray[segmentDisplayArray.length - 1];

      const segmentsPromise =
        direction === Direction.UP
          ? api.getTextSegment(
              upperBorderSegment.segmentId
                ? upperBorderSegment.segmentId
                : upperBorderSegment.originalSegmentId,
              {
                prevMinLength: 50,
                withOriginal: true,
                toLanguageId: upperBorderSegment.segmentId
                  ? undefined
                  : segment.translationLanguageId,
              }
            )
          : api.getTextSegment(
              lowerBorderSegment.segmentId
                ? lowerBorderSegment.segmentId
                : lowerBorderSegment.originalSegmentId,
              {
                nextMinLength: 50,
                withOriginal: true,
                toLanguageId: lowerBorderSegment.segmentId
                  ? undefined
                  : segment.translationLanguageId,
              }
            );

      segmentsPromise.then(([response, _]) => {
        if (response.length === 0) {
          setOffBoundsCount((prev) => prev + 1);
          return;
        }

        const ids = response.map((segment) => ({
          segmentId: segment.id,
          originalSegmentId: segment.original ? segment.original.id : undefined,
        }));
        if (direction === Direction.DOWN) {
          setDisplayArray((prevArrayState) => [...prevArrayState, ...ids]);
        } else {
          setDisplayArray((prevArrayState) => [...ids, ...prevArrayState]);
        }

        dispatch(putTranslations(response));
      });
    },
    [segmentDisplayArray]
  );

  // Minus fifty DKP
  // DO NOT OPEN !!!
  const chosenRef = useRef<HTMLDivElement>();
  const once = useRef<Boolean>(false);

  useLayoutEffect(() => {
    console.log(offBoundsCount, once.current);
    if (!once.current && offBoundsCount >= 2) {
      once.current = true;
      divRef.current.scroll({top: chosenRef.current.offsetTop, behavior: 'smooth'})
    //   chosenRef.current.scrollIntoView({ behavior: "smooth", block:'nearest', inline: 'start' });
      console.log("scrolled");
    }
  }, [offBoundsCount, once.current, chosenRef.current]);

  {
    const rememberScroll = useRef<number>();

    const handleUpObserver = useCallback(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            rememberScroll.current =
              divRef.current.scrollHeight -
              divRef.current.scrollTop -
              divRef.current.clientHeight;
            expand(Direction.UP);
          } else {
            if (!once.current) {
              console.log("offboundsup");
              setOffBoundsCount((prev) => prev + 1);
            }
          }
        });
      },
      [expand]
    );

    useEffect(() => {
      if (!upperTriggerRef.current) return;

      const option = {
        root: divRef.current,
        rootMargin: "0px",
        threshold: 0,
      };

      const observer = new IntersectionObserver(handleUpObserver, option);
      observer.observe(upperTriggerRef.current);

      return () => {
        observer.disconnect();
      };
    }, [segmentDisplayArray[0], segmentId]);

    useLayoutEffect(() => {
      if (divRef.current.clientHeight < divRef.current.offsetHeight) return;
      divRef.current.scrollTop =
        divRef.current.scrollHeight -
        rememberScroll.current -
        divRef.current.clientHeight;
    }, [segmentDisplayArray[0]]);

    const handleDownObserver = useCallback(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            expand(Direction.DOWN);
          } else {
            if (!once.current) {
              console.log("offboundsdown");
              setOffBoundsCount((prev) => prev + 1);
            }
          }
        });
      },
      [expand]
    );

    useEffect(() => {
      if (!lowerTriggerRef.current) return;

      const option = {
        root: divRef.current,
        rootMargin: "0px",
        threshold: 0,
      };

      const observer = new IntersectionObserver(handleDownObserver, option);
      observer.observe(lowerTriggerRef.current);

      return () => {
        observer.disconnect();
      };
    }, [segmentDisplayArray[segmentDisplayArray.length - 1]]);
  }

  return (
    
    <div
      ref={divRef}
      className={`text-display ${
        offBoundsCount >= 2 ? "text-display__loaded" : ""
      }`}
    >
      {segmentDisplayArray.length > 0 && segment && (
        <>
          <div ref={upperTriggerRef} id="upper-trigger" />
          {segmentDisplayArray.map((info) => (
            <span
              ref={
                segment.id === info.segmentId ||
                segment.id === info.originalSegmentId
                  ? chosenRef
                  : null
              }
              key={`${info.segmentId}-${info.originalSegmentId}`}
            >
              <TextSegmentDisplay
                selectedSegmentId={segmentId}
                segmentId={info.segmentId}
                originalSegmentId={info.originalSegmentId}
              />
            </span>
          ))}
          <div ref={lowerTriggerRef} id="lower-trigger" />
        </>
      )}
    </div>
  );
};

export default TextDisplay;
