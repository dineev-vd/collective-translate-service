import CommentsView from "components/comments/CommentsView";
import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import { useCreateGlossaryEntryMutation } from "store/api/glossary/createGlossaryEntry";
import { useGetGlossaryEntriesQuery } from "store/api/glossary/getEntries";

const GlossaryEntries: FC = () => {
  const { glossaryId } = useParams();

  const { data: glossaryEntries } = useGetGlossaryEntriesQuery(glossaryId);

  const [phrase, setPhrase] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [proposedTranslation, setProposedTranslation] = useState<string>("");

  const [trigger] = useCreateGlossaryEntryMutation();

  return (
    <div>
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", width: 700 }}>
          {glossaryEntries &&
            (glossaryEntries.length ? (
              glossaryEntries.map(
                ({ id, description, phrase, proposedTranslation }) => (
                  <div>
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
                  </div>
                )
              )
            ) : (
              <h3 style={{ color: "gray" }}>В глоссарии пока нет записей</h3>
            ))}
        </div>
        <div style={{ width: 1, backgroundColor: "gray" }} />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            trigger({ description, phrase, proposedTranslation, glossaryId });
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            width: 200,
          }}
        >
          <div>
            Фраза
            <input
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
            ></input>
          </div>
          <div>
            Описание
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div>
            Предложенный перевод
            <input
              value={proposedTranslation}
              onChange={(e) => setProposedTranslation(e.target.value)}
            ></input>
          </div>
          <button type="submit">Добавить запись в глоссарий</button>
        </form>
      </div>
      <div style={{ width: 500 }}>
        <h2>Комментарии</h2>
        <CommentsView id={glossaryId} type={"glossary"} />
      </div>
    </div>
  );
};

export default GlossaryEntries;
