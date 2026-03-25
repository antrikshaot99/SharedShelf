import { useQuery } from "@apollo/client";
import { GET_BOOKS, GET_GENRES } from "../graphql/queries";

/**
 * Custom hook for book catalog operations
 * Fetches books, genres, and provides filtering utilities
 */
export const useBooks = (genre = null, status = null) => {
  const { loading, error, data, refetch } = useQuery(GET_BOOKS, {
    variables: { genre, status }
  });

  const books = data?.books || [];

  return {
    books,
    loading,
    error,
    refetch
  };
};

/**
 * Custom hook for fetching all genres
 */
export const useGenres = () => {
  const { loading, error, data } = useQuery(GET_GENRES);
  const genres = data?.genres || [];

  return {
    genres,
    loading,
    error
  };
};
