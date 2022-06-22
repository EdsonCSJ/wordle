import { useState } from 'react'

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

const emptyLetter = { letter: '', status: 'NOT-VERIFIED' }

//NOT-VERIFIED, WRONG-POSITION, RIGHT-POSITION

const App = () => {
  const [letters, setLetters] = useState([])
  const [currentWord, setCurrentWord] = useState(1)
  const [isEnterPressed, setIsEnterPressed] = useState(false)

  const handleValidateWord = () => {
    console.log(letters.slice((currentWord - 1) * 5, (currentWord - 1) * 5 + 5))
    letters.slice((currentWord - 1) * 5, (currentWord - 1) * 5 + 5).forEach((letter, index) => {
      console.log({ index })
      console.log({ indexInLetter: index * currentWord })
      checkIfIsInWord(letter, index * currentWord)
    })
  }

  const checkIfIsInWord = (letter, slicedIndex) => {
    // console.log(letter)
    // console.log(slicedIndex)
    if ('WORDY'.includes(letter)) {
      setLetters(
        letters.map((letter, index) => (index === slicedIndex ? { letter: letter, status: 'WRONG-POSITION' } : letter))
      )
    }
  }

  const handleKeyPress = (key) => {
    if (key === 'BACKSPACE') {
      setLetters(letters.slice(0, -1))
      setCurrentWord(Math.floor(letters.length / 5) + 1)
    } else if (key === 'ENTER') {
      setIsEnterPressed(true)
      handleValidateWord()
    } else {
      setLetters([...letters, { letter: key, status: 'NOT-VERIFIED' }])
      setIsEnterPressed(false)
      setCurrentWord(Math.floor(letters.length / 5) + 1)
    }
  }

  const checkIsKeyDisabled = (key) => {
    if (letters.length >= 30 && isEnterPressed) return true
    else if (key === 'ENTER' && isEnterPressed) return true
    else if (key === 'BACKSPACE' && isEnterPressed) return true
    else if (letters.length >= currentWord * 5 && !isEnterPressed && key !== 'ENTER' && key !== 'BACKSPACE') return true
    else if (letters.length < currentWord * 5 && key === 'ENTER') return true
    else if (letters.length / 5 + 1 === currentWord && key === 'BACKSPACE') return true
    else return false
  }

  const checkBagroundColor = (letter) => {
    if (letter?.status) {
      switch (letter.status) {
        case 'NOT-VERIFIED':
          return 'transparent'
        case 'WRONG-POSITION':
          return 'yellow'
        case 'RIGHT-POSITION':
          return 'green'
        default:
          break
      }
    }
  }

  return (
    <>
      <h1>Wordle</h1>

      <div style={{ height: 500, width: 500, display: 'flex', flexWrap: 'wrap' }}>
        {Array(30)
          .fill(emptyLetter)
          .map((_, index) => (
            <div
              key={index}
              style={{
                border: '1px solid black',
                boxSizing: 'border-box',
                width: 'calc(100% / 5)',
                height: 'calc(100% / 6)',
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                backgroundColor: checkBagroundColor(letters[index]),
              }}
            >
              <span>{letters[index]?.letter}</span>
            </div>
          ))}
      </div>

      {keys.map((key, index) => (
        <button
          key={key + index}
          onClick={() => {
            handleKeyPress(key)
          }}
          disabled={checkIsKeyDisabled(key)}
        >
          {key}
        </button>
      ))}
      <button
        onClick={() => {
          setLetters([])
          setCurrentWord(1)
          setIsEnterPressed(false)
        }}
      >
        reset
      </button>
    </>
  )
}

export default App
