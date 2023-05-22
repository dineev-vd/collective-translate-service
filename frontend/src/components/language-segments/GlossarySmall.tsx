import { FC, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetGlossaryByLanguageQuery } from "store/api/glossary/getGlossaryByLanguage";

const GlossarySmall: FC = () => {
  const { languageId } = useParams();
  const { data: glossary } = useGetGlossaryByLanguageQuery(languageId);

  const [search, setSearchValue] = useState("");

  const results = useMemo(
    () =>
      glossary?.entries
        .filter((e) => e.phrase.indexOf(search) !== -1)
        .map(({ description, phrase, proposedTranslation }) => (
          <div>
            <p>
              <b>{phrase}</b>
            </p>
            <div>
              Описание
              <p>{description}</p>
            </div>
            <div>
              Предложенный перевод
              <p>{proposedTranslation}</p>
            </div>
          </div>
        )),
    [glossary, search]
  );

  return (
    <div>
      {glossary?.entries &&
        (glossary.entries.length ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <input
              placeholder="Начните вводить значение..."
              onChange={(e) => setSearchValue(e.target.value)}
              value={search}
            ></input>
            {results.length ? results : <h3>По запросу ничего не найдено</h3>}
          </div>
        ) : (
          <h3 style={{ color: "gray" }}>В глоссарии пока нет записей</h3>
        ))}
    </div>
  );
};

export default GlossarySmall;
