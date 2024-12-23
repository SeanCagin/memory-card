import { useState, useEffect } from "react";
import useSound from "use-sound";
import {getRandomElement, shuffle, cardHover, cardReset } from "./utility.js";
import openingSound from "/opening.mp3";
import tickSound from "/tick.mp3";
import starlightSound from "/starlight.mp3"
import partySound from "/party-tonight.mp3"
import summerSound from "/summertime.mp3"
import synthSound from "/synth.mp3"
import evilSound from "/evil.mp3"
import soundImg from "/sound.png"
import muteImg from "/mute.png"
import "./styles.css";

const GAMESTATES = {
    STANDARD: 0,
    INTERMISSION: 1,
    OVER: -1,
}

const MODES = {
    EASY: 0,
    NORMAL: 1,
    HARD: 2,
    IMPOSSIBLE: 3,
    GODLIKE: 4,
}


const BESTSCORE = {
    [MODES["EASY"]]: localStorage.getItem(MODES["EASY"]) || 0,
    [MODES["NORMAL"]]: localStorage.getItem(MODES["NORMAL"]) || 0,
    [MODES["HARD"]]: localStorage.getItem(MODES["HARD"]) || 0,
    [MODES["IMPOSSIBLE"]]: localStorage.getItem(MODES["IMPOSSIBLE"]) || 0,
    [MODES["GODLIKE"]]: localStorage.getItem(MODES["GODLIKE"]) || 0,
}

const SRCMAP = {};

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

    "Anti Pops": "https://media1.tenor.com/m/E4LLHy0FCBoAAAAd/anti-pops-evil.gif",
    "Celia": "https://media1.tenor.com/m/adpKYpSoH5AAAAAd/girar-fantasmin.gif",
    "Mr. Maellard": "https://media1.tenor.com/m/nfOPbIZ4p3MAAAAd/wipe-tears-mr-maellard.gif",
    "Starla": "https://media1.tenor.com/m/pmP8DAGjfCUAAAAC/starla-on-the-glass-regular-show.gif",

    "Gary": "https://media1.tenor.com/m/EePFAMcNrO0AAAAd/regular-show-gary-regular-show.gif",
    "Babies": "https://media1.tenor.com/m/HEr7kmeYi5wAAAAd/regular-show.gif",
    "GBF": "https://media1.tenor.com/m/N2ncytySZLQAAAAd/regularshow-gbf.gif",
    "Death": "https://media1.tenor.com/m/I-_tWOPip4gAAAAC/death-skips.gif",

    "DVD Dude": "https://media1.tenor.com/m/KOPB2RXssLYAAAAd/cool-sunglasses.gif",
    "Apple Sauce": "https://media1.tenor.com/m/Q-9V8GHT9oMAAAAd/hug-benson-dunwoody.gif",
    "Coffee Coffee": "https://media1.tenor.com/m/eEl37I8w2asAAAAd/coffee-coffeebean.gif",
    "Father time": "https://media1.tenor.com/m/2LiDaWxExGMAAAAd/s%C3%BCrekli-dizi-regular-show.gif",
    "Baby Ducks": "https://media1.tenor.com/m/SjGGNgYRm6YAAAAC/duck-karate-chop-regular-show.gif",
    "God of Basketball": "https://media1.tenor.com/m/6zGtivq3CBQAAAAd/regular-show-basketball-king.gif",
    "British Taxi": "https://media1.tenor.com/m/E0f0Xxxsn7kAAAAd/ello-govnar.gif",
    "Cart": "https://media1.tenor.com/m/ylUO59RfsPoAAAAd/screaming-mordecai.gif",
    "Party Horse": "https://media1.tenor.com/m/lyL0AYn5vIAAAAAC/head-bob-yeah.gif",
    "Chance Sureshot": "https://media1.tenor.com/m/FmZf3-02GZcAAAAd/gun-trick-gun.gif",
    "CJ": "https://media1.tenor.com/m/H0vNEZBinFYAAAAC/regular-show-cj.gif",
    "Video Guy": "https://media1.tenor.com/m/YkAPG8PlrpsAAAAd/the-regular-show-all-day.gif",
    "David": "https://media1.tenor.com/m/_NWNXa21ivUAAAAd/regular-show.gif",
    "Sensai": "https://media1.tenor.com/m/zP-Ytvb-2zcAAAAC/no-noo.gif",
    "Techmo": "https://media1.tenor.com/m/KwPYVVWL-VgAAAAd/regular-show-technology.gif",
    "Eggscelent Knight": "https://media1.tenor.com/m/M6NhTdS2yT0AAAAd/regular-show-farewell.gif",
    "Geese": "https://media1.tenor.com/m/2naYVC_BldoAAAAd/mordecai-sandwich.gif",
    "Gene": "https://media1.tenor.com/m/fNR6bnpYJiIAAAAC/regular-show-gene-gene.gif",
    "Earl": "https://media1.tenor.com/m/2euDRBWZ3YkAAAAd/twitch-evil-eye.gif",
    "Hot Dogs": "https://media1.tenor.com/m/iSUj-CPxd1UAAAAd/out-self-eat.gif",
}

const EASY = 8;
const NORMAL = 12;
const HARD = 16;
const IMPOSSIBLE = 20;

const CARDS_GOD = [];

for (let key in CHARACTERS) {
    CARDS_GOD.push(key);
}

const CARDS_EASY = CARDS_GOD.slice(0, EASY);
const CARDS_NORMAL = CARDS_GOD.slice(0, NORMAL);
const CARDS_HARD = CARDS_GOD.slice(0, HARD);
const CARDS_IMPOSSIBLE = CARDS_GOD.slice(0, IMPOSSIBLE);



function Card({imgSrc, clickFunc, name, mouseMove, mouseLeave}) {
    return (
        <div className="cardHolder">
            <div className="card" onMouseMove={mouseMove} onMouseLeave={mouseLeave} onClick={() => {clickFunc(name)}} >
                <div className="gifHolder"><img className="cardImg" src={imgSrc} /></div>
                <h2 className="charName">{name}</h2>
            </div>
        </div>
    );
}

function diffToCardset(difficulty) {
    switch(difficulty) {
        case MODES.EASY: return CARDS_EASY;
        case MODES.NORMAL: return CARDS_NORMAL;
        case MODES.HARD: return CARDS_HARD;
        case MODES.IMPOSSIBLE: return CARDS_IMPOSSIBLE;
        case MODES.GODLIKE: return CARDS_GOD;
    }
}

function Page() {
    const [opening, {sound: openingSettings, stop: stopOpening}] = useSound(openingSound);
    const [tick, {sound: tickSettings, stop: stopTick}] = useSound(tickSound);
    const [starlightSoundObj, {sound: starlightSoundSettings, stop: stopStarlight}] = useSound(starlightSound, { volume: 0.4, interrupt: true, loop: true});
    const [partySoundObj, {sound: partySoundSettings, stop: stopParty}] = useSound(partySound, { volume: 0.2, interrupt: true, loop: true });
    const [summerSoundObj, {sound: summerSoundSettings, stop: stopSummer}] = useSound(summerSound, { volume: 0.4, interrupt: true, loop: true });
    const [synthSoundObj, {sound: synthSoundSettings, stop: stopSynth}] = useSound(synthSound, { volume: 0.4, interrupt: true, loop: true });
    const [godlikeSoundObj, {sound: godlikeSoundSettings, stop: stopGodlike}] = useSound(evilSound, { volume: 0.6, interrupt: true, loop: true });
    const [godlikeOn, setGodlike] = useState(localStorage.getItem("???") || 0);
    const [pregameState, changePregame] = useState(0);
    const [difficulty, changeDifficulty] = useState(MODES.EASY);
    const [cardCount, changeCardCount] = useState(4);
    const [intState, setIntState] = useState(false);
    const [isMute, setMute] = useState((localStorage.getItem("mute") == "true") || 0);
    const sounds = {hardSong: starlightSoundObj, mediumSong: partySoundObj, easySong: summerSoundObj, impossibleSong: synthSoundObj, godlikeSong: godlikeSoundObj, tick};

    
    useEffect(() => {
        const soundArr = [[openingSettings, 1], [tickSettings, 1], [starlightSoundSettings, 0.4], [partySoundSettings, 0.2], [summerSoundSettings, 0.4], [synthSoundSettings, 0.4], [godlikeSoundSettings, 0.6]];
        soundArr.forEach(([soundObj, volume]) => {
          if (soundObj) {
            soundObj.volume(isMute ? 0 : volume);
          }
        });
    }, [isMute, openingSettings, tickSettings, starlightSoundSettings, partySoundSettings, summerSoundSettings, synthSoundSettings, godlikeSoundSettings]);

    function muteAllSounds() {
        const stopArr = [stopOpening, stopTick, stopStarlight, stopSummer, stopParty, stopSynth, stopGodlike];
        stopArr.forEach((stop) => {
            stop();
        });
    }

    useEffect(() => {
        if (pregameState == 1) {
            setTimeout(() => {
                changePregame(pregameState + 1);
            }, 4500);
            opening();
        } else if (pregameState > 1) {
            setIntState(true);
            setTimeout(() => {
                setIntState(false);
            }, 200);
            tick();
        } 
        if (pregameState == 4 && difficulty == MODES["GODLIKE"]) {
            let root = document.querySelector(":root");
            if(root.style.getPropertyValue("--alternative-background") != "var(--alternative-background)") {
                root.style.setProperty("background", "var(--alternative-background)");
            }
        } else {
            let root = document.querySelector(":root");
            if(root.style.getPropertyValue("--alternative-background") != "var(--background)") {
                root.style.setProperty("background", "var(--background)");
            }
        }
    }, [pregameState]);
    if (pregameState == 0) {
        return (<>
            <StartScreen pregameState={pregameState} changePregame={changePregame} />;
            <Mute isMute={isMute} setMute={setMute} tick={tick} />
        </>);
    } else if (pregameState == 1) {
        return (<>
            <RulesScreen text={`Don't click the same card twice`} />
            <Mute isMute={isMute} setMute={setMute} tick={tick} />
        </>);
    } else if (pregameState == 2) {
        return (<>
            <ChooseDifficulty changeDifficulty={changeDifficulty} changePregame={changePregame} pregameState={pregameState} on={!intState} godlikeOn={godlikeOn}/>
            <Mute isMute={isMute} setMute={setMute} tick={tick} />
        </>);
    } else if (pregameState == 3) { 
        return (<>
            <ChooseCardCount changeCardCount={changeCardCount} changePregame={changePregame} pregameState={pregameState} on={!intState} />
            <Mute isMute={isMute} setMute={setMute} tick={tick} />
        </>);
    } else if (pregameState == 4) {
        return (<><Game 
            difficulty={difficulty} 
            numCardsShown={cardCount} 
            sounds={sounds}
            changePregame={changePregame}
            pregameState={pregameState} />
        <Mute isMute={isMute} setMute={setMute} tick={tick} />
        </>)
    } else if (pregameState == 5) {
        return (<><EndScreen text={`YOU'RE FIRED!`} muteFunc={muteAllSounds} changePregame={changePregame} tick={tick} setGodlike={setGodlike} godlikeVal={godlikeOn} />
            <Mute isMute={isMute} setMute={setMute} tick={tick} /></>
        );
    } else if (pregameState == 6) {
        let nodeText = `Wooooooooooooooaaaaaaaaaaaaah`;
        let godlikeVal = godlikeOn;
        if ((difficulty == MODES["IMPOSSIBLE"]) && (godlikeOn == 0)) {
            nodeText = `NEW DIFFICULTY UNLOCKED`;
            localStorage.setItem("???", godlikeOn);
            godlikeVal = 1;
        } else if (difficulty == MODES["GODLIKE"]) {
            nodeText = `Once you do the hard stuff, it becomes not that hard.`;
        }
        return (<><EndScreen text={nodeText} muteFunc={muteAllSounds} changePregame={changePregame} tick={tick} setGodlike={setGodlike} godlikeVal={godlikeVal} />
            <Mute isMute={isMute} setMute={setMute} tick={tick} /></>
        );
    }
}

function Mute({isMute, setMute, tick}) {
    return (<div className="mute">
        <img src={isMute ? muteImg : soundImg} className="soundImg" onClick={() => {
            setMute(!isMute)
            localStorage.setItem("mute", !isMute);
            tick();
        }} />
    </div>);
}

function StartScreen({changePregame, pregameState}) {
    return (<div className="settings">
            <h1 className="settingsHeader">Turn on your volume</h1>
            <div className="settingOpts">
                <div className="settingOpt" onClick={() => changePregame(pregameState + 1)}>Start</div>
            </div>
        </div>);
}

function EndScreen({text, changePregame, muteFunc, tick, setGodlike, godlikeVal}) {
    function updateGame(state) {
        setGodlike(godlikeVal);
        if (state == 0) {
            setTimeout(tick, 100);
        }
        changePregame(state);
        muteFunc();
    }
    return (<div className="settings">
        <h1 className="settingsHeader">{text}</h1>
        <div className="settingOpts">
            <div className="settingOpt" onClick={() => updateGame(2)}>Play Again</div>
            <div className="settingOpt" onClick={() => updateGame(0)}>Title screen</div>
        </div>
    </div>);
}


function RulesScreen({text}) {
    return (<div className="settings"><div className="settingsHeader">{text}</div></div>);
}

function ChooseDifficulty({changeDifficulty, changePregame, pregameState, on, godlikeOn}) { // on checks if we are in an intermission state or not
    function chooseMode(mode) {
        if (on) {
            changeDifficulty(mode);
            changePregame(pregameState + 1);
        }
    }
    let lastNode = (godlikeOn == 1) ? <div className="settingOpt godlike"  onClick={() => chooseMode(MODES.GODLIKE)}>???</div> : <></>;
    return (
        <div className="settings">
            <h1 className="settingsHeader">Difficulty</h1>
            <div className="settingOpts">
                <div className="settingOpt" onClick={() => chooseMode(MODES.EASY)}>Easy</div>
                <div className="settingOpt"  onClick={() => chooseMode(MODES.NORMAL)}>Medium</div>
                <div className="settingOpt"  onClick={() => chooseMode(MODES.HARD)}>Hard</div>
                <div className="settingOpt"  onClick={() => chooseMode(MODES.IMPOSSIBLE)}>Impossible</div>
                {lastNode}
            </div>
        </div>);
}

function ChooseCardCount({changeCardCount, changePregame, pregameState, on}) {
    let cardCountArray = [2, 3, 4, 5, 6];
    return (
        <div className="settings">
            <h1 className="settingsHeader">Choose the Number of Cards</h1>
            <div className="settingOpts">
            {cardCountArray.map((item, index) => {
                return (
                    <div key={index} className={"settingOpt"} onClick={() => {
                            if(on) {
                                changeCardCount(item);
                                changePregame(pregameState + 1);
                            }
                        }}>{item}</div>
                );
            })}
            </div>
        </div>);
}


function Game({CARDS, difficulty, numCardsShown, sounds, changePregame, pregameState}) {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function loadImages() {
            for (let key in CHARACTERS) {
                let src = "";
                try {
                    const response = await fetch(CHARACTERS[key]);
                    if (!response.ok) {
                      throw new Error(`Failed to fetch ${CHARACTERS[key]}: ${response.statusText}`);
                    } else {
                        let blob = await response.blob();
                        src = URL.createObjectURL(blob);
                    }
                } catch (error) {
                    console.error(error);
                }
                SRCMAP[key] = src;
            }
            
            setLoading(false);
        }
        loadImages();
    }, []);

    useEffect(() => {
        if (!loading) {
            if (difficulty == MODES.EASY) {
                sounds.easySong();
            } else if (difficulty == MODES.NORMAL) {
                sounds.mediumSong();
            } else if (difficulty == MODES.HARD) {
                sounds.hardSong();
            } else if (difficulty == MODES.IMPOSSIBLE) {
                sounds.impossibleSong();
            } else {
                sounds.godlikeSong();
            }
        }
    }, [loading]);

    // const [difficulty, changeDifficulty] = useState(DIFFICULTIES.EASY);
    if (!loading) {
        return (
            <div className="page">
                <Gameboard CARDS={CARDS} numCardsShown={numCardsShown} difficulty={difficulty} clickSound={sounds.tick} changePregame={changePregame} pregameState={pregameState}/>
            </div>
        );
    } else {
        return (<Fulltext text={"Loading..."} />);
    }
}

function Gameboard({difficulty, numCardsShown, clickSound, pregameState, changePregame}) {
    const CARDS = diffToCardset(difficulty);
    const [usedCards, updateUsedCards] = useState([]);
    const [gameState, updateGameState] = useState(GAMESTATES.STANDARD);
    const [cardState, updateCardState] = useState([]);

    const unusedCards = CARDS.filter(card => {return usedCards.indexOf(card) == -1});
    const score = usedCards.length;
    updateBest(score, difficulty);

    useEffect(() => {
        if (score == 0) {
            fillCards();
        } else {
            updateGameState(GAMESTATES.INTERMISSION);
            setTimeout(() => {
                updateGameState(GAMESTATES.STANDARD);
                fillCards();
            }, 1000);
        }
    }, [usedCards]);

    function fillCards() {
        let randomCards = [];
        randomCards.push(getRandomElement(unusedCards));
        while (randomCards.length < numCardsShown) {
            let randCard = getRandomElement(CARDS);
            if (randomCards.indexOf(randCard) === -1) {
                randomCards.push(randCard);
            }
        }
        shuffle(randomCards);
        updateCardState(randomCards);
    }

    function clickFunc(card) {
        if (usedCards.indexOf(card) == -1) { // user clicked an unused card.
            if (score != CARDS.length - 1) {
                clickSound();
            } else {
                updateBest(score + 1, difficulty);
                if ((localStorage.getItem(difficulty) || 0) < BESTSCORE[difficulty]) {
                    localStorage.setItem((difficulty), BESTSCORE[difficulty]);
                }
                changePregame(pregameState + 2);
            }
            let temp = usedCards.slice();
            temp.push(card);
            updateUsedCards(temp);
        }
        else {
            if ((localStorage.getItem(difficulty) || 0) < BESTSCORE[difficulty]) {
                localStorage.setItem((difficulty), BESTSCORE[difficulty]);
            }
            changePregame(pregameState + 1);
            console.log("ggs");
        }
    }


    return (
        <>
        <Controls score={score} difficulty={difficulty} />
        <div className="gameboard ">
            <CardSet type={gameState} renderCards={cardState} clickFunc={clickFunc} difficulty={difficulty} />
            <div className="mainScore">{score + 1} / {CARDS.length}</div>
        </div>
        </>
    );
}

function Controls({score, difficulty}) { // Score and Best score
    return (<div className="score">
        <div className="currScore">Score: {score}</div>
        <div className="bestScore">Best Score: {BESTSCORE[difficulty]}</div>
    </div>);
}

function updateBest(score, difficulty) {
    if (score > BESTSCORE[difficulty]) {
        BESTSCORE[difficulty] = score;
    }
}

function CardSet({type, renderCards, clickFunc}) {
    return (
    <div key={type} className={"cardList " + (type == GAMESTATES.INTERMISSION ? "flip" : "")}>
        {renderCards.map((item) => <Card 
            imgSrc={SRCMAP[item]} 
            clickFunc={type == GAMESTATES.STANDARD ? clickFunc : () => {}} 
            name={item} 
            key={item} 
            mouseMove={type == GAMESTATES.STANDARD ? cardHover : () => {}}
            mouseLeave={type == GAMESTATES.STANDARD ? cardReset : () => {}}/>)}
    </div>);
}

function Fulltext({text}) {
    return (
        <h1 className="fulltext">{text}</h1>
    );
}


export default Page;