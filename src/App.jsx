import { useState, useEffect } from 'react'

const keys = [
  'Q',
  'W',
  'E',
  'R',
  'T',
  'Y',
  'U',
  'I',
  'O',
  'P',
  'A',
  'S',
  'D',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'ENTER',
  'Z',
  'X',
  'C',
  'V',
  'B',
  'N',
  'M',
  'BACKSPACE',
]

const emptyWords = [[], [], [], [], [], []]

const App = () => {
  const [words, setWords] = useState(emptyWords)
  // let currentWord = 0
  //talvez isso n funcione, acho q tem q ser um state
  const [currentWord, setCurrentWord] = useState(0)

  const handleBackspace = () => {
    const wordsClone = [...emptyWords]
    wordsClone[currentWord].pop()
    setWords(wordsClone)
  }

  const handleKeyPress = (key) => {
    if (currentWord > 5) return

    if (key === 'BACKSPACE') {
      handleBackspace()
    } else if (words[currentWord].length < 5 && key !== 'ENTER') {
      const wordsClone = [...emptyWords]
      wordsClone[currentWord].push(key)
      setWords(wordsClone)
    } else if (words[currentWord].length === 5 && key === 'ENTER') {
      setCurrentWord(currentWord + 1)
    }
  }

  return (
    <>
      <h1>Wordle</h1>

      {words.map((word, index1) => (
        <div key={index1}>
          {word.map((letter, index) => (
            <div
              style={{ backgroundColor: `rgb(${30 * index1}, ${30 * index1}, ${30 * index1}` }}
              key={letter + index}
            >
              {letter}
            </div>
          ))}
        </div>
      ))}

      <Keyboard handleKeyPress={handleKeyPress} />
    </>
  )
}

export default App

const Keyboard = ({ handleKeyPress }) => (
  <>
    {keys.map((key, index) => (
      <button
        key={key + index}
        onClick={() => {
          handleKeyPress(key)
        }}
      >
        {key}
      </button>
    ))}
  </>
)
