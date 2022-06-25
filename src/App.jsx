import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import words from "./wordle.json";
import "./app.css";

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

const word = words[parseInt(Math.random() * words.length)].toUpperCase();

const App = () => {
  const [letters, setLetters] = useState([]);
  const [currentRow, setCurrentRow] = useState(1); // indice da linha atual no array
  const [isEnterPressed, setIsEnterPressed] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const resetGame = useCallback(() => {
    setLetters([]);
    setCurrentRow(1);
    setIsEnterPressed(false);
  }, []);

  const checkEnd = useCallback(
    (currentTryWord) => {
      if (word === currentTryWord) {
        setFeedbackMessage("Você ganhou!");
        resetGame();
      } else if (currentRow === 6) {
        setFeedbackMessage("Você perdeu!");
        resetGame();
      }
    },
    [currentRow, resetGame]
  );

  const handleValidateWord = useCallback(() => {
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
        const indexGlobalLetter = (currentRow - 1) * 5 + indexLetter;

        if (word[indexLetter] === current.letter) {
          current.status = "RIGHT-POSITION";
        } else if (word.includes(current.letter)) {
          current.status = "WRONG-POSITION";
        }

        tempLetters[indexGlobalLetter] = current;
      });

      setLetters(tempLetters);
      setIsEnterPressed(true);
      checkEnd(currentTryWord);
    } else {
      setFeedbackMessage("Palavra inexistente!");
      setIsEnterPressed(false);
    }
  }, [checkEnd, currentRow, letters]);

  const handleKeyPress = useCallback(
    (key) => {
      setFeedbackMessage("");
      if (key === "BACKSPACE") {
        setLetters(letters.slice(0, -1));
      } else if (key === "ENTER") {
        handleValidateWord();
      } else {
        setLetters([...letters, { letter: key, status: "NOT-VERIFIED" }]);
        setIsEnterPressed(false);
        setCurrentRow(Math.floor(letters.length / 5) + 1);
      }
    },
    [letters, handleValidateWord]
  );

  const checkIsKeyDisabled = useCallback(
    (key) => {
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
    },
    [letters.length, isEnterPressed, currentRow]
  );

  const checkBagroundColor = (letter) => {
    if (letter?.status) {
      switch (letter.status) {
        case "NOT-VERIFIED":
          return "#3A3A3C";
        case "WRONG-POSITION":
          return "#B59F3B";
        case "RIGHT-POSITION":
          return "#538D3E";
        default:
          break;
      }
    }
  };

  const getFeedbackColor = () => {
    if (feedbackMessage === "Você ganhou!") return "#538D3E";
    else if (feedbackMessage === "Você perdeu!") {
      return "#A33A3C";
    } else {
      return "#B59F3B";
    }
  };

  const handleUserKeyPress = useCallback(
    (event) => {
      const key = event.key.toUpperCase();
      if (keys.includes(key) && !checkIsKeyDisabled(key)) handleKeyPress(key);
    },
    [handleKeyPress, checkIsKeyDisabled]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);

    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [handleUserKeyPress]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
      }}
    >
      <div
        style={{
          borderBottom: "1px solid rgb(58, 58, 60)",
          width: "100vw",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: "5px" }}>Wordle</h1>
      </div>
      {feedbackMessage && (
        <p
          style={{
            backgroundColor: getFeedbackColor(),
            borderRadius: 3,
            padding: 10,
          }}
        >
          {feedbackMessage}
        </p>
      )}
      <div
        style={{
          height: 420,
          width: 350,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {Array(30)
          .fill(emptyLetter)
          .map((_, index) => (
            <div
              className="containers"
              key={index}
              style={{
                boxSizing: "border-box",
                width: "calc(80% / 5)",
                height: "calc(95% / 6)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: checkBagroundColor(letters[index]),
              }}
            >
              <span>{letters[index]?.letter}</span>
            </div>
          ))}
      </div>
      <div>
        <KeyboardRow
          initialIndex={0}
          finalIndex={10}
          {...{ handleKeyPress, checkIsKeyDisabled, letters }}
        />
        <KeyboardRow
          initialIndex={10}
          finalIndex={19}
          {...{ handleKeyPress, checkIsKeyDisabled, letters }}
        />
        <KeyboardRow
          initialIndex={19}
          finalIndex={30}
          {...{ handleKeyPress, checkIsKeyDisabled, letters }}
        />
      </div>
    </div>
  );
};

export default App;

const KeyboardRow = ({
  initialIndex,
  finalIndex,
  handleKeyPress,
  checkIsKeyDisabled,
  letters = [],
}) => {
  const checkBagroundColor = (key) => {
    const wasTried = letters.some((letter) => letter.letter === key);
    const isInWrongPosition = letters.some(
      (letter) => letter.letter === key && letter.status === "WRONG-POSITION"
    );
    const isInRightPosition = letters.some(
      (letter) => letter.letter === key && letter.status === "RIGHT-POSITION"
    );
    if (isInRightPosition) return "#538D3E";
    else if (isInWrongPosition) return "#B59F3B";
    else if (wasTried) return "#3A3A3C";
    else return "#818384";
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {keys.slice(initialIndex, finalIndex).map((key, index) => (
        <button
          key={key + index}
          onClick={() => {
            handleKeyPress(key);
          }}
          disabled={checkIsKeyDisabled(key)}
          style={{
            width: key === "ENTER" || key === "BACKSPACE" ? 110 : undefined,
            padding: key === "ENTER" || key === "BACKSPACE" ? 0 : undefined,
            color: "white",
            backgroundColor: checkBagroundColor(key),
          }}
        >
          {key}
        </button>
      ))}
    </div>
  );
};
