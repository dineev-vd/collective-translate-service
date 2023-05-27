import { MenuItem2 } from "@blueprintjs/popover2";
import { MultiSelect2 } from "@blueprintjs/select";
import { FC, useMemo, useState } from "react";
import { useGetTagsQuery } from "store/api/tags/tagsEndpoint";

type TagSelectProps = {
  tags: string[];
  setTags: (newTags: string[]) => void;
  disableCreate?: boolean;
};

const TagSelect: FC<TagSelectProps> = ({ setTags, tags, disableCreate }) => {
  const [query, setQuery] = useState("");

  const { data: existingTags } = useGetTagsQuery(query);

  const mergedTags = useMemo(() => {
    const set = new Set([...tags, ...(existingTags ?? []).map((t) => t.id)]);

    return Array.from(set);
  }, [tags, existingTags]);

  return (
    <MultiSelect2
      onQueryChange={setQuery}
      query={query}
      popoverProps={{ minimal: true, matchTargetWidth: true }}
      items={mergedTags ?? []}
      noResults={"Нет результатов"}
      placeholder="Начните вводить название тэга..."
      itemRenderer={(item, { handleClick }) => {
        return (
          <MenuItem2
            onClick={handleClick}
            roleStructure={"listoption"}
            text={item}
            selected={tags.indexOf(item) !== -1}
          />
        );
      }}
      tagRenderer={(tag) => <>{tag}</>}
      onItemSelect={(item) => {
        if (tags.indexOf(item) !== -1) {
          const newTags = [...tags];
          newTags.splice(newTags.indexOf(item), 1);
          setTags(newTags);

          return;
        }

        setTags([...tags, item]);
      }}
      onRemove={(tag) => {
        const arr = [...tags];
        arr.splice(arr.indexOf(tag), 1);
        setTags(arr);
      }}
      selectedItems={tags}
      createNewItemFromQuery={disableCreate ? undefined : (q) => q}
      createNewItemRenderer={(item, active, handleClick) => (
        <span onClick={handleClick}>
          Создать <b>{item}</b>
        </span>
      )}
      createNewItemPosition="first"
      resetOnSelect={true}
    />
  );
};

export default TagSelect;
