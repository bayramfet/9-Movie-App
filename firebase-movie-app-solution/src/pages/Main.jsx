import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";
import { AuthContext } from "../context/AuthContextProvider";

const API_KEY = process.env.REACT_APP_TMDB_KEY;
const FEATURED_API = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}`;
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;

const Main = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    getMovies(FEATURED_API);
  }, []);

  const getMovies = (API) => {
    setLoading(true);
    axios
      .get(API)
      .then((res) => setMovies(res.data.results))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchText && currentUser) {
      getMovies(SEARCH_API + searchText);
    } else if (!currentUser) {
      alert("please log in to see details");
    } else {
      alert("please enter a text");
    }
    setSearchText("");
  };
  return (
    <>
      <form className="flex justify-center p-2" onSubmit={handleSubmit}>
        <input
          type="search"
          className="w-80 h-8 rounded-md outline-none border p-1 m-2"
          placeholder="Search a movie..."
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
        />
        <button className="text-white" type="submit">
          Search
        </button>
      </form>
      <div className="flex justify-center flex-wrap">
        {loading ? (
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600 mt-52"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          movies.map((movie) => <MovieCard key={movie.id} {...movie} />)
        )}
      </div>
    </>
  );
};

export default Main;