import { useState, useEffect } from "react";
import {getRandomElement, shuffle} from "./utility.js";
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

const CHARACTERS = {
    "Mordecai": "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHppcm41bDF6bzNxdGRzNmp5Mnlzb243Y285ajl3dHFqc3p5dnR3biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ivxJxZcowzMdY3aF3A/giphy.webp",
    "Benson": "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDN0OXc0aW9venllYjA2bGJ5eDdzcm14M3hsbXVpcWY1bG42YWc5MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/OVHR3Eb88KFzi/giphy.webp",
    "Death Bear": "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3Rzd25lZW9jbXp5N2JuYWFvZm91cmVka25jcTRlaGd2bmowbDNpdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dkWwpmNH1WzT2/giphy.webp",
    "Muscle Man": "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXZhbmEybDkwNWZ6a2U4ZmxhNnc1YXI2d2s4MWd2MHg0NnRueDVhYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lmeh2XGMCbCdW/giphy.webp",
    "Rigby": "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExb3VndTkzdXkxN2p3bWFmcnpmZXVoZ2N4c3ptZTNteTdnd2h0NGtxYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/XgjP1yCu4y2ZbnDIhR/giphy.webp",
    "Pops": "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDIwNTdyNzY4c3lxNTFrbWkxeTA1bDB3YndzMXk0N3Zpb2FwMzNkbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/iZ0pJCIN1el8Y/giphy.webp",
    "Margaret": "https://media1.tenor.com/m/AoOIvlfj6lYAAAAd/tengo-tanto-que-contarte-margarita.gif",
    "Eileen": "https://media1.tenor.com/m/HLQkXAofwcwAAAAd/there-there-soothe.gif",
    "Skips": "https://media1.tenor.com/m/_MxYn__0gbEAAAAC/regular-show-skips.gif",
    "Thomas": "https://media1.tenor.com/m/ejW5QVz8Un8AAAAd/regular-show.gif",
    "Fives": "https://media1.tenor.com/m/1276GVEXs84AAAAd/high-five-ghost-regular-show.gif",
    "Don": "https://media1.tenor.com/m/OaMQPLExzrMAAAAd/regularshow-hug.gif",
    "Death": "https://y.yarn.co/cb08e357-b7e0-439a-ab8c-798f1722bde2_text.gif",
    "Anti Pops": "https://media1.tenor.com/m/E4LLHy0FCBoAAAAd/anti-pops-evil.gif",
    "Celia": "https://media1.tenor.com/m/adpKYpSoH5AAAAAd/girar-fantasmin.gif",
    "Mr. Maellard": "https://media1.tenor.com/m/nfOPbIZ4p3MAAAAd/wipe-tears-mr-maellard.gif",
    "Starla": "https://media1.tenor.com/m/pmP8DAGjfCUAAAAC/starla-on-the-glass-regular-show.gif",
    "Gary": "https://media1.tenor.com/m/EePFAMcNrO0AAAAd/regular-show-gary-regular-show.gif",
    "Guardians of Eternal Youth": "https://media1.tenor.com/m/HEr7kmeYi5wAAAAd/regular-show.gif",
    "Garett Bobby Furgeson": "https://media1.tenor.com/m/N2ncytySZLQAAAAd/regularshow-gbf.gif",
}

const EASY = 8;
const NORMAL = 12;
const HARD = 16;

const CARDS_IMPOSSIBLE = [];

for (let key in CHARACTERS) {
    CARDS_IMPOSSIBLE.push(key);
}

const CARDS_EASY = CARDS_IMPOSSIBLE.slice(0, EASY);
const CARDS_NORMAL = CARDS_IMPOSSIBLE.slice(0, NORMAL);
const CARDS_HARD = CARDS_IMPOSSIBLE.slice(0, HARD);


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
            <Gameboard CARDS={CARDS_IMPOSSIBLE} numCardsShown={4} />
        </div>
    );
}

function Gameboard({diffculty, numCardsShown, CARDS}) {
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
    renderCards.push(getRandomElement(unusedCards));
    while (renderCards.length < numCardsShown) {
        let randCard = getRandomElement(CARDS);
        if (renderCards.indexOf(randCard) == -1) {
            renderCards.push(randCard);
        }
        // handle API calls
    }
    shuffle(renderCards);


    renderArray = renderCards.map((item) => <Card imgSrc={CHARACTERS[item]} clickFunc={clickFunc} name={item} key={item} />);
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