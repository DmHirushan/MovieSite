import React from 'react';

const Search = ({searchTerm, setSearchTerm}) => {
    return (
        <div className="search">
            <img src="Search.svg" alt="Search" />
            <input
                type="text"
                placeholder="Search through thousend of movies"
                value={searchTerm}
                onChange={e => setSerchTerm(e.target.value)}
            />
            <h1 className="text-white">{searchTerm}</h1>
        </div>
    );
};

export default Search;