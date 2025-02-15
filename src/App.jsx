import React, {useEffect, useState} from 'react';
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import {useDebounce} from "react-use";
import {getTrendingMovies, updateSearchCount} from "./appwrite.js";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
    },
};


const App = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [movieList, setMovieList] = useState([]);
    const [trendingList, setTrendingList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

    // Debounce the search term to prevent making too many API requests
    // by waiting for the user to stop typing for 500ms
    useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

    const fetchMovies = async (query = '') => {
        setLoading(true);
        setErrorMessage("");
        try {
            const endPoint = query
                ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
                : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

            const response = await fetch(endPoint, API_OPTIONS);
            if (!response.ok) {
                throw new Error("Could not fetch movies");
            }

            const data = await response.json();
            if (!data.results || data.results.length === 0) {
                setErrorMessage('No movies found');
                setMovieList([]);
                return;
            }

            setMovieList(data.results || []);

            if (query && data.results.length > 0) {
                await updateSearchCount(query, data.results[0]);
            }

        } catch (e) {
            console.log(e);
            setErrorMessage("Error fetching movies. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const loadTrendingMovies = async () => {
        try{
            const movies = await getTrendingMovies();
            setTrendingList(movies);
        } catch (error) {
            console.log('Error fetching trending movies : ', error);
        }
    }

    useEffect(() => {
        fetchMovies(debouncedSearchTerm);
    }, [debouncedSearchTerm])

    useEffect(() => {
        loadTrendingMovies()
    }, [])

    return (
        <main>
            <div className="wrapper">
                <header>
                    <img src="./hero-img.png" alt="Hero Banner"/>
                    <h1>Find <span className="text-gradient">Movies</span> you will Enjoy
                    Without the Hassle</h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>

                {trendingList.length > 0 && (
                    <section className='trending'>
                        <h2>Trending Movies</h2>
                        <ul>
                            {trendingList.map((movie, index) => (
                                <li key={movie.$id}>
                                    <p>{index + 1}</p>
                                    <img src={movie.poster_url} alt={movie.title} />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                <section className="all-movies">
                    <h2>All Movies</h2>
                    {loading ? (
                        <Spinner/>
                    ) : errorMessage ? (
                        <p className='text-red-500'>{errorMessage}</p>
                    ) : (
                        <ul>
                            {movieList.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </ul>
                    )}
                </section>

            </div>
        </main>
    );
};

export default App;