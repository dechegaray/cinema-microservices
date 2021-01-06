import React, { useMemo, useState } from "react";
import { useQuery } from "react-query";
import {
  fetchCinema,
  fetchCinemas,
  fetchCities,
  fetchCountries,
  fetchStates,
} from "../api";

export function Cinemas({ onMovieSelect }) {
  const [countryId, setCountryId] = useState(undefined);
  const [stateId, setStateId] = useState(undefined);
  const [cityId, setCityId] = useState(undefined);
  const [cinemaId, setCinemaId] = useState(undefined);

  const queryCountries = useQuery("countries", () => fetchCountries(), {
    retry: 1,
  });

  const queryStates = useQuery("states", () => fetchStates(countryId), {
    retry: 1,
    enabled: countryId,
  });

  const queryCities = useQuery("cities", () => fetchCities(stateId), {
    retry: 1,
    enabled: stateId,
  });

  const queryCinemas = useQuery("cinemas", () => fetchCinemas(cityId), {
    retry: 1,
    enabled: cityId,
  });

  const { data, isLoading, isError } = useQuery(
    "cinema",
    () => fetchCinema(cinemaId),
    {
      retry: 1,
      enabled: cinemaId,
    }
  );

  const schedule = useMemo(() => {
    const today = new Date();
    const newdate = new Date();
    newdate.setDate(today.getDate() + 5);

    return newdate;
  }, []);

  return (
    <section id="catalog">
      <form>
        <label for="countries">Countries</label>
        <select name="countries" onChange={(e) => setCountryId(e.target.value)}>
          {queryCountries.data?.map((country) => (
            <option value={country._id}>{country.name}</option>
          ))}
        </select>

        <label for="states">States</label>
        <select name="states" onChange={(e) => setStateId(e.target.value)}>
          {!queryStates.data ? (
            <option value="">Select a country</option>
          ) : (
            queryStates.data?.map((state) => (
              <option value={state._id}>{state.name}</option>
            ))
          )}
        </select>

        <label for="cities">Cities</label>
        <select name="cities" onChange={(e) => setCityId(e.target.value)}>
          {!queryCities.data ? (
            <option value="">Select a state</option>
          ) : (
            queryCities.data?.map((city) => (
              <option value={city._id}>{city.name}</option>
            ))
          )}
        </select>

        <label for="cinemas">Cinemas</label>
        <select name="cinemas" onChange={(e) => setCinemaId(e.target.value)}>
          {!queryCinemas.data ? (
            <option value="">Select a city</option>
          ) : (
            queryCinemas.data?.map((cinema) => (
              <option value={cinema._id}>{cinema.name}</option>
            ))
          )}
        </select>
      </form>

      <main>
        {isError && (
          <p>There was an error fetching the movies of the selected cinema</p>
        )}

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="premieres">
            {data.cinemaPremieres.map((movie) => {
              const handleClick = () =>
                onMovieSelect({
                  city: queryCities.data.find((city) => city._id === cityId),
                  cinema: queryCinemas.data.find(
                    (cine) => cine._id === cinemaId
                  ),
                  movie: {
                    title: movie.title,
                    format: "IMAX",
                  },
                  schedule,
                  cinemaRoom: 7,
                  seats: ["45"],
                  totalAmount: 15,
                });

              return (
                <div className="mini-movie" key={movie.title}>
                  <img src={`./img/${movie.id}`} alt="Mini movie poster" />
                  <h5>{movie.title}</h5>
                  <p>{movie.plot}</p>
                  <button onClick={handleClick}>Book</button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </section>
  );
}
