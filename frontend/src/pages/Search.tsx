import { useSearchContext } from '../contexts/SearchContext';

const Search = () => {
  const search = useSearchContext();
  console.log(`🚀  search =>`, search);

  return <div>SEARCH PAGE</div>;
};

export default Search;
