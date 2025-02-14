import React, {useEffect, useState} from 'react';

function Card({title}) {
    const [count, setCount] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);

    useEffect(() => {
        console.log(`${title} has been liked: ${hasLiked}`);
    },[hasLiked]);

    return (
        <div onClick={() => setCount(count + 1)}>
            <h1 className="titleHeading">{title} <br/> {count || null}</h1>
            <button onClick={() => setHasLiked(!hasLiked)} className="button">
                {hasLiked ? 'Liked' : 'Like'}
            </button>
        </div>
    );
}

export default Card;