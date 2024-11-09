import { useState, useEffect } from "react";
import specialRand from "./utility.js";
import logoSrc from "/logo.svg";

const GAMESTATES = {
    STANDARD: 0,
    INTERMISSION: 1,
    OVER: -1,
}

const DIFFICULTIES = {
    EASY: 0,
    NORMAL: 1,
    HARD: 2,
}

const CARDS = ["mordecai", "benson", "margaret", "CJ", "rigby", "eileen", "skips", "pops", "musclem man", "highfive ghost", "don", "death"];

function Card({imgSrc, clickFunc, name}) {
    return (
        <div className="card">
            <img className="cardImg" onClick={() => {clickFunc(name)}} src={imgSrc} />
            {name}
        </div>
    );
}

function Page() {
    // const [diffculty, changeDifficulty] = useState(DIFFICULTIES.EASY);
    return (
        <div className="page">
            <Controls />
            <Gameboard diffculty={DIFFICULTIES.EASY} numCardsShown={4} />
        </div>
    );
}

function Gameboard({diffculty, numCardsShown}) {
    const [gameState, updateGameState] = useState(GAMESTATES.INTERMISSION);
    const [usedCards, updateUsedCards] = useState([]);
    const unusedCards = CARDS.filter(card => {return usedCards.indexOf(card) == -1});
    let renderCards = [];
    let renderArray = [];

    function clickFunc(card) {
        if (usedCards.indexOf(card) == -1) { // user clicked an unused card.
            let temp = usedCards.slice();
            temp.push(card);
            updateUsedCards(temp);
        }
        else {
            updateGameState(GAMESTATES.OVER);
            console.log("ggs");
        }
    }

    renderCards = [];
    renderCards.push(specialRand(unusedCards));
    while (renderCards.length < numCardsShown) {
        let randCard = specialRand(CARDS);
        if (renderCards.indexOf(randCard) == -1) {
            renderCards.push(randCard);
        }
        // handle API calls
    }


    renderArray = renderCards.map((item) => <Card imgSrc={logoSrc /*API CALL VAL*/} clickFunc={clickFunc} name={item} key={item} />);
    return (<div className="cardList">
        {renderArray}
    </div>);
}

function Controls() { // Score and Best score
    return <div>
        Score: 3
        Best Score: 5
    </div>
}

export default Page;