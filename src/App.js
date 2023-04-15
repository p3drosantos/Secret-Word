import { useCallback, useEffect, useState } from 'react';
import { wordsList } from './data/words';

import './App.css';

import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages= [ 
  { id:1, name:"start" },
  { id:2, name:"game" },
  { id:3, name:"end" },
]

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  const [pickedCategory, setPickedCategory] = useState("")
  const [pickedWord, setpickedWord] = useState("")
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(3)
  const [score, setScore] = useState(0)

  const pickWordAndCategory = () => {
    //pick a random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]
    console.log(category)

    //pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]
    console.log(word)

    return {word, category}
  }


  
  //start game
  const startGame = () => {
    //pick word and pick category
    const {word , category} = pickWordAndCategory()

    //create as array orf letters
    const wordLetters = word.toLowerCase().split("")

    console.log(word, category)
    console.log(wordLetters)

    //fill states
    setPickedCategory(category)
    setpickedWord(word)
    setLetters(wordLetters)
    


    setGameStage(stages[1].name)
  }

  //process the letter input
  const verifyLetter = () => {
    setGameStage(stages[2].name)
  }

  const retry = () => {
    setGameStage(stages[0].name)

  }

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame = {startGame}/>}
      {gameStage === "game" && 
        <Game 
            verifyLetter={verifyLetter}
            pickedWord={pickedWord}
            pickedCategory={pickedCategory}
            letters={letters}
            guessedLetters={guessedLetters}
            wrongLetters={wrongLetters}
            guesses={guesses}
            score={score}
        />}
      {gameStage === "end" && <GameOver retry={retry}/>}
    </div>
  );
}

export default App;
