import axios from "axios";
import "./cities.json";

function getErrorMessage(error, defaultText) {
  const { data, status, statusText } = error.response;
  const errorMsg = data || defaultText;
  console.error(`${errorMsg}. HTTP ${status}: ${statusText}`);

  return error;
}

export function fetchMovies() {
  const baseUrl = process.env.API_HOST_MOVIES;

  if (!baseUrl) {
    throw new Error("Movies API host was not defined!");
  }

  return axios
    .get(`${baseUrl}/movies`)
    .then(({ data }) => data)
    .catch((error) => {
      const errorMsg = getErrorMessage(
        error,
        "There was an error fetching the movies from the API"
      );
      throw new Error(errorMsg);
    });
}

export function fetchCinemas(cityId) {
  const baseUrl = process.env.API_HOST_CINEMA;

  if (!baseUrl) {
    throw new Error("Cinema API host was not defined!");
  }

  return axios
    .get(`${baseUrl}/cinemas`, { data: { cityId } })
    .then(({ data }) => data)
    .catch((error) => {
      const errorMsg = getErrorMessage(
        error,
        "There was an error fetching the cinemas from the API"
      );
      throw new Error(errorMsg);
    });
}

export function fetchCinema(id) {
  const baseUrl = process.env.API_HOST_CINEMA;

  if (!baseUrl) {
    throw new Error("Cinema API host was not defined!");
  }

  return axios
    .get(`${baseUrl}/cinemas/${id}`)
    .then(({ data }) => data)
    .catch((error) => {
      const errorMsg = getErrorMessage(
        error,
        "There was an error fetching the cinema details from the API"
      );
      throw new Error(errorMsg);
    });
}

export function fetchCountries() {
  const baseUrl = process.env.API_HOST_CINEMA;

  if (!baseUrl) {
    throw new Error("Cinema API host was not defined!");
  }

  return axios
    .get(`${baseUrl}/countries`)
    .then(({ data }) => data)
    .catch((error) => {
      const errorMsg = getErrorMessage(
        error,
        "There was an error fetching the countries from the API"
      );
      throw new Error(errorMsg);
    });
}

export function fetchStates(countryId) {
  const baseUrl = process.env.API_HOST_CINEMA;

  if (!baseUrl) {
    throw new Error("Cinema API host was not defined!");
  }

  return axios
    .get(`${baseUrl}/countries/${countryId}`)
    .then(({ data }) => data)
    .catch((error) => {
      const errorMsg = getErrorMessage(
        error,
        "There was an error fetching the states from the API"
      );
      throw new Error(errorMsg);
    });
}

export function fetchCities(countryId, stateId) {
  const baseUrl = process.env.API_HOST_CINEMA;

  if (!baseUrl) {
    throw new Error("Cinema API host was not defined!");
  }

  return axios
    .get(`${baseUrl}/countries/${countryId}/${stateId}`)
    .then(({ data }) => data)
    .catch((error) => {
      const errorMsg = getErrorMessage(
        error,
        "There was an error fetching the cities from the API"
      );
      throw new Error(errorMsg);
    });
}

export function bookMovie() {
  const baseUrl = process.env.API_HOST_BOOKING;

  if (!baseUrl) {
    throw new Error("Booking API host was not defined!");
  }

  return axios
    .post(`${baseUrl}/cinemas`)
    .then(({ data }) => data)
    .catch((error) => {
      const errorMsg = getErrorMessage(
        error,
        "There was an error booking the selected movie from the API"
      );
      throw new Error(errorMsg);
    });
}
