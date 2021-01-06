import React from "react";
import { useQuery } from "react-query";
import { fetchMovies } from "../api";

export function Movies() {
  const { data, isLoading, isFetching, isError, error } = useQuery(
    "movies",
    () => fetchMovies(),
    {
      retry: 1,
    }
  );

  if (isError) {
    <section id="movies">
      <p className="error-msg">
        {error || "There was an error fetching the data"}
      </p>
    </section>;
  }

  if (isLoading) {
    <section id="movies">
      <i className="loader"></i>
    </section>;
  }

  return (
    <section id="movies">
      {isFetching && <i className="small-loader"></i>}

      {data.map((movie) => {
        return (
          <div className="movie" key={movie.title}>
            <img src={`./img/${movie.id}`} alt="Movie poster" />
            <h5>{movie.title}</h5>
            <h6>
              {movie.releaseYear} / {movie.format}
            </h6>
            <p>{movie.plot}</p>
          </div>
        );
      })}
    </section>
  );
}
