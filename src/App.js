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

const guessesQuantity = 3

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  const [pickedCategory, setPickedCategory] = useState("")
  const [pickedWord, setpickedWord] = useState("")
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQuantity)
  const [score, setScore] = useState(0)

  const pickWordAndCategory = useCallback(() => {
    //pick a random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]
    

    //pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]
    

    return {word, category}
  },[words])


  
  //start game
  const startGame = useCallback(() => {
    //clear all letters
    clearLetterState()

    //pick word and pick category
    const {word , category} = pickWordAndCategory()

    //create as array orf letters
    const wordLetters = word.toLowerCase().split("")
    
    
    //fill states
    setPickedCategory(category)
    setpickedWord(word)
    setLetters(wordLetters)
    
  

    setGameStage(stages[1].name)
  },[pickWordAndCategory])

  //process the letter input
  const verifyLetter = (letter) => {
     const normalizedLetters = letter.toLowerCase()

    //check if letter has already benn ultized
    if(guessedLetters.includes(normalizedLetters) || wrongLetters.includes(normalizedLetters)){
      return;
    }

    //push guessed letter or remove a guess
    if(letters.includes(normalizedLetters)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetters
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetters
      ])

        setGuesses((actualGuesses) => actualGuesses - 1)
      }
    } 

    const clearLetterState = () => {
      setGuessedLetters([])
      setWrongLetters([])
    }
    // check if guesses ender
    useEffect(() =>{
      if(guesses <= 0){
        //reset all states
      clearLetterState()

        setGameStage(stages[2].name)
      }
    },[guesses])

    //check win condition
    useEffect(() =>{

      const uniqueLetters = [...new Set(letters)]

      //win condition
      if(guessedLetters.length === uniqueLetters.length) {
        //add score
        setScore((actualScore) => actualScore += 100)

        // restart game with new word
        startGame()
      }

    },[guessedLetters, startGame, letters])

    
  //restart the game
  const retry = () => {
    setScore(0)
    setGuesses(guessesQuantity)

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
      {gameStage === "end" && <GameOver score={score} retry={retry}/>}
    </div>
  );
}

export default App;
