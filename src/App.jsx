import React, {useEffect, useState} from 'react';
import Search from "./components/Search.jsx";

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
    const [loading, setLoading] = useState(false);

    const fetchMovies = async () => {
        setLoading(true);
        setErrorMessage("");
        try{
            const endPoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
            const response = await fetch(endPoint, API_OPTIONS);
            if (!response.ok) {
                throw new Error("Could not fetch movies");
            }
            const data = await response.json();

            if (data.Response === 'False') {
                setErrorMessage(data.error || 'Failed to fetch movies');
                setMovieList([]);
                return;
            }else {
                setMovieList(data.results || []);
            }
        }catch(e){
            console.log(e);
            setErrorMessage("Error fetching movies. please try again later.");
        }finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMovies();
    }, [])

    return (
        <main>
            <div className="wrapper">
                <header>
                    <img src="./hero-img.png" alt="Hero Banner"/>
                    <h1>Find <span className="text-gradient">Movies</span> you will Enjoy
                    Without the Hassle</h1>
                    <Search serchTerm={searchTerm} setSerchTerm={setSearchTerm} />
                </header>

                <section className="all-movies">
                    <h2>All Movies</h2>
                    {loading ? (
                        <p className='text-white'>Loading...</p>
                    ) : errorMessage ? (
                        <p className='text-red-500'>{errorMessage}</p>
                    ) : (
                        <ul>
                            {movieList.map((movie) => (
                                <p className='text-white'>{movie.title}</p>
                            ))}
                        </ul>
                    )}
                </section>

                <h1 className="text-white">{searchTerm}</h1>
            </div>
        </main>
    );
};

export default App;