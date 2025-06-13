const API_KEY = '4287ad07';

export async function searchMovies({ search, page = 1 }) {
  if (search === '') return null;
  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${search}&page=${page}`);
    if (!response.ok) {
      throw new Error(`No se ha podido concretar la solicitud ${response.status}`);
    }
    const json = await response.json();

    const movies = json.Search;

    return movies?.map(movie => ({
      id: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster,
    }));
  } catch (error) {
    console.error(error.message);
  }
}

export async function getMovieById(id) {
  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`);
    if (!response.ok) throw new Error("No se pudo cargar el detalle");
    const movie = await response.json();
    return movie;
  } catch (error) {
    console.error(error.message);
  }
}
