import { GetProjectDto } from "common/dto/project.dto";
import { GetSuggestionDto } from "common/dto/suggestion.dto";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  useApproveSuggestionMutation,
  useDenySuggestionMutation,
  useVoteForSuggestionMutation,
} from "store/api/suggestions/getSuggestions";
import { selectUser } from "store/userReducer";

const Suggestion: React.FC<{
  suggestion: GetSuggestionDto;
  project: GetProjectDto;
}> = ({ suggestion, project }) => {
  const user = useSelector(selectUser);

  const [triggerApprove] = useApproveSuggestionMutation();
  const [triggerDeny] = useDenySuggestionMutation();
  const [triggerVote] = useVoteForSuggestionMutation();

  const handleApprove = () => {
    triggerApprove(suggestion.id);
  };

  const handleDeny = () => {
    triggerDeny(suggestion.id);
  };

  return (
    <div>
      <div style={{ marginTop: "10px" }}>
        <b>Предложение:</b>
      </div>
      <div
        style={{
          margin: "10px 0",
          border: "1px solid gray",
          borderRadius: "10px",
          padding: "10px",
        }}
      >
        {suggestion.suggestion}
      </div>
      <div style={{ marginBottom: "10px" }}>
        Автор:{" "}
        <span>
          <Link to={`/profile/${suggestion.author.id}`}>
            {suggestion.author.name}
          </Link>
        </span>
      </div>
      {(project.editorsId.includes(user.id.toString()) ||
        project.ownerId == user.id.toString()) && (
        <>
          <button
            style={{ marginRight: "5px" }}
            onClick={() => handleApprove()}
          >
            Одобрить
          </button>
          <button onClick={() => handleDeny()}>Отклонить</button>
          <button onClick={() => triggerVote(suggestion.id)}>Голосовать</button>
          {suggestion.votersIds.length && (
            <span>{suggestion.votersIds.length} лайков</span>
          )}
        </>
      )}
    </div>
  );
};

export default Suggestion;
