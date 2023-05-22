import { FC } from "react";
import { useGetSimilarQuery } from "store/api/similar/getSimilar";

type SimilarProps = {
  segmentId: string;
};

const Similar: FC<SimilarProps> = ({ segmentId }) => {
  const { data } = useGetSimilarQuery(segmentId);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {data &&
        data.map((segment, index) => (
          <>
            <div>
              <p>
                Сегмент <span style={{ color: "gray" }}>#{index + 1}</span>
              </p>
              <b>Оригинал</b>
              <p>{segment.originaltext}</p>
              <b>Перевод</b>
              <p>{segment.translatedtext}</p>
            </div>
            <hr style={{ width: "100%" }}></hr>
          </>
        ))}
    </div>
  );
};

export default Similar;
