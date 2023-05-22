const Pager: React.FC<{
  page: number;
  maxPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}> = ({page, maxPages, setPage}) => {
  return (
    <div>
      <span style={{marginRight: "5px"}}>Страница:</span>
      <button style={{marginLeft: "1px"}} onClick={() => setPage(prev => prev - 10 > 1 ? prev - 10 : 1)}>{"<<"}</button>
      <button style={{marginLeft: "1px"}} onClick={() => setPage(prev => prev - 1 > 1 ? prev - 1 : 1)}>{"<"}</button>
      <span style={{margin: "0 5px"}}>{page}</span>
      <button style={{marginLeft: "1px"}} onClick={() => setPage(prev => prev + 1 <= maxPages ? prev + 1 : maxPages)}>{">"}</button>
      <button style={{marginLeft: "1px"}} onClick={() => setPage(prev => prev + 10 <= maxPages ? prev + 10 : maxPages)}>{">>"}</button>
    </div>
  );
};

export default Pager;
