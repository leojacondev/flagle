import './App.css';
import { useState, useMemo, useEffect } from "react";
import styled from 'styled-components';
import AnswerBox from './components/AnswerBox';
import { getDistance, getCompassDirection } from "geolib";
import { useGuesses } from './hooks/useGuesses';
import { ToastContainer, Flip } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";
import { FlagGrid } from './components/FlagGrid';
import { Guesses } from './components/Guesses';
import { useScore } from './hooks/useScore';

const CentreWrapper = styled.div`
  margin: 0;
  overflow: auto;
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column; 

  @media (prefers-color-scheme: dark) {
    background-color: #121212;
}
`;

const Attempts = styled(({ score, attempts, max, ...props }) => (
  <div {...props}>
    Attempts: <span>{attempts}/{max}</span>
  </div>
))`
  display: block;
  font-size: 1.5em;
  margin-bottom: 1rem;
  span {
    font-weight: bold;
  }
  @media (prefers-color-scheme: dark) {
    color: #fff;
}
`;

const Footer = styled.div`
  display: block;
  font-size: 1rem;
  margin-top: auto;
  margin-bottom: 2rem;
  span {
    color: #1a76d2;
  }
  p {
    margin-bottom: 0;
    margin-top: 0.25rem;
  }
  @media (prefers-color-scheme: dark) {
    color: #fff;
    a {
      color: #fff
    }
  }
`;

const ScoreTag = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column; 
  align-items: center;
  font-size: 3vh;
  gap: 10px;
  @media (prefers-color-scheme: dark) {
    color: #fff;
  }
`;

const TitleBarDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => props.justify};
`;

const TitleBar = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr;
  margin-bottom: 1rem;
  @media (prefers-color-scheme: dark) {
    color: #fff;
  }
`;

const Title = styled.div`
  display: block;
  font-size: 4rem;
  span {
    color: #1a76d2;
  }
`;



const shuffle = arr => [...arr].sort(() => 0.5 - Math.random());


function App(props) {
  const [countryNames, setFlagNames] = useState(() => Object.keys(props.countryData));
  const [score, addPoint] = useScore()
  const [flippedArray, setFlippedArray] = useState([false, false, false, false, false, false]);
  const [randomOrder, setRandomOrder] = useState(() => shuffle([0,1,2,3,4,5]));
  const [end, setEnd] = useState(false);
  const [guesses, addGuess] = useGuesses();
  const trueCountry = useMemo(() => {
    const todaysCountry = countryNames[Math.floor(Math.random() * countryNames.length)];
    return todaysCountry
  }, [countryNames]);

  
  function refreshPage() {
    window.location.reload(false);
  }

  useEffect(() => {
    revealTiles();
    getRemainingTiles();
    if (guesses.length >= props.attempts || guesses[guesses.length - 1]?.distance === 0) {
      setEnd(true);
      setFlippedArray([true, true, true, true, true, true]);
      if (guesses[guesses.length - 1].distance === 0) {
        toast(`🎉 ${trueCountry} 🎉`);
        addPoint()
      } else {
        toast(`🤔 ${trueCountry} 🤔`);
      }
      setTimeout(() =>{
        refreshPage();
      }, 2000);
    } 
  }, [guesses]);

  const onIncorrect = () => {
    revealRandomTile();
  };

  const revealRandomTile = () => {
    const [tile] = randomOrder;
    setRandomOrder(randomOrder.length > 1 ? randomOrder.slice(1) : shuffle([0,1,2,3,4,5]));
    const newFlipped = flippedArray.slice();
    newFlipped[tile] = true;
    setFlippedArray(newFlipped);
    return tile;
  };
  
  const getRemainingTiles = () => {
    const remainingTiles = [];
    const usedTiles = guesses.map(guess => guess.tile);
    for (const i of [0,1,2,3,4,5]) {
        if (!usedTiles.includes(i)) {
          remainingTiles.push(i);
        }
      }
    setRandomOrder(shuffle(remainingTiles));
    return remainingTiles;
  };

  const revealTiles = () => {
    const newFlipped = flippedArray.slice();
    for (const guess of guesses) {
      newFlipped[guess.tile] = true;
      setFlippedArray(newFlipped);
    }
  };

  const onGuess = guess => {
    const tileNum = revealRandomTile();
    const {code:guessCode, ...guessGeo} = props.countryData[guess];
    const {code:answerCode, ...answerGeo} = props.countryData[trueCountry];
    addGuess({name: guess,
              distance: getDistance(guessGeo, answerGeo),
              direction: getCompassDirection(guessGeo, answerGeo),
              tile: tileNum});
  };


  const countryInfo = useMemo(() => props.countryData[trueCountry], [trueCountry]);

  return (
    <div className='App'>
      <ToastContainer
        hideProgressBar
        position="top-center"
        transition={Flip}
        autoClose={false}
      />
      <CentreWrapper>
        <TitleBar>
          <TitleBarDiv justify="flex-end"/>
          <Title>FLAG<span>LE</span> UNLIMITED</Title>
        </TitleBar>
        <FlagGrid
          end={end}
          countryInfo={countryInfo}
          flippedArray={flippedArray}
        >
        </FlagGrid>
        <AnswerBox
          answer={trueCountry}
          onCorrect={() => { }}
          onIncorrect={onIncorrect}
          disabled={end}
          countries={Object.keys(props.countryData)}
          onGuess={onGuess}
        />
        <Attempts attempts={guesses.length} max={props.attempts} />
        <Guesses
          guesses={guesses}
        />

        <ScoreTag>Score: {score}</ScoreTag>

        <Footer>A fork from @ryanbarouki/flagle but unlimited! Made with &hearts; by @leojacondev for @loonapastel!</Footer>
      </CentreWrapper>
    </div>
  );
}

export default App;
