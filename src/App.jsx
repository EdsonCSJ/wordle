import { useMemo } from "react";
import { useEffect } from "react";
import { useState } from "react";
import words from "./wordle.json";

const keys = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "ENTER",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
  "BACKSPACE",
];

const emptyLetter = { letter: "", status: "NOT-VERIFIED" };

//NOT-VERIFIED, WRONG-POSITION, RIGHT-POSITION

const getNewWord = () =>
  words[parseInt(Math.random() * words.length)].toUpperCase();

const App = () => {
  const [letters, setLetters] = useState([]);
  const [currentRow, setCurrentRow] = useState(1); // indice da linha atual no array
  const [isEnterPressed, setIsEnterPressed] = useState(false);
  const [currentWord, setCurrentWord] = useState(getNewWord());

  const handleValidateWord = () => {
    const currentTryWords = letters.slice(
      (currentRow - 1) * 5,
      (currentRow - 1) * 5 + 5
    );

    const currentTryWord = currentTryWords
      .map((current) => current.letter)
      .join("");

    if (words.includes(currentTryWord.toLowerCase())) {
      let tempLetters = [...letters];

      currentTryWords.forEach((current, indexLetter) => {
        const indexLetterWord = currentWord.indexOf(current.letter);
        const indexGlobalLetter = (currentRow - 1) * 5 + indexLetter;

        if (indexLetterWord >= 0) {
          if (indexLetter === indexLetterWord) {
            current.status = "RIGHT-POSITION";
          } else {
            current.status = "WRONG-POSITION";
          }
        }

        tempLetters[indexGlobalLetter] = current;
      });

      setLetters(tempLetters);
      setIsEnterPressed(true);
      checkEnd(currentTryWord);
    } else {
      alert("Palavra inexistente!");
      setIsEnterPressed(false);
    }
  };

  const checkEnd = (currentTryWord) => {
    if (currentWord === currentTryWord) {
      alert("Você ganhou!", resetGame());
    } else if (currentRow === 6) {
      alert("Você perdeu!");
    }
  };

  const resetGame = () => {
    setLetters([]);
    setCurrentRow(1);
    setIsEnterPressed(false);
    setCurrentWord(getNewWord());
  };

  const handleKeyPress = (key) => {
    console.log(key);

    if (key === "BACKSPACE") {
      setLetters(letters.slice(0, -1));
    } else if (key === "ENTER") {
      handleValidateWord();
    } else {
      setLetters([...letters, { letter: key, status: "NOT-VERIFIED" }]);
      setIsEnterPressed(false);
      setCurrentRow(Math.floor(letters.length / 5) + 1);
    }

    console.log(letters);
  };

  const checkIsKeyDisabled = (key) => {
    if (letters.length >= 30 && isEnterPressed) return true;
    else if (key === "ENTER" && isEnterPressed) return true;
    else if (key === "BACKSPACE" && isEnterPressed) return true;
    else if (
      letters.length >= currentRow * 5 &&
      !isEnterPressed &&
      key !== "ENTER" &&
      key !== "BACKSPACE"
    )
      return true;
    else if (letters.length < currentRow * 5 && key === "ENTER") return true;
    else if (letters.length / 5 + 1 === currentRow && key === "BACKSPACE")
      return true;
    else return false;
  };

  const checkBagroundColor = (letter) => {
    if (letter?.status) {
      switch (letter.status) {
        case "NOT-VERIFIED":
          return "transparent";
        case "WRONG-POSITION":
          return "yellow";
        case "RIGHT-POSITION":
          return "green";
        default:
          break;
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keypress", (event) => {
      const { key } = event;
      event.stopImmediatePropagation();
      handleKeyPress(key.toUpperCase());
    });
  });

  return (
    <>
      <h1>Wordle</h1>

      <div
        style={{ height: 500, width: 500, display: "flex", flexWrap: "wrap" }}
      >
        {Array(30)
          .fill(emptyLetter)
          .map((_, index) => (
            <div
              key={index}
              style={{
                border: "1px solid black",
                boxSizing: "border-box",
                width: "calc(100% / 5)",
                height: "calc(100% / 6)",
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
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
            handleKeyPress(key);
          }}
          disabled={checkIsKeyDisabled(key)}
        >
          {key}
        </button>
      ))}
      <button
        onClick={() => {
          resetGame();
        }}
      >
        reset
      </button>
    </>
  );
};

export default App;
