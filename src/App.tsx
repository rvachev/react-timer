import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  let timeoutId = -1;

  const [audio] = useState(new Audio("/src/assets/finish.mp3"));

  const [launched, setLaunched] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);

  const minutesRef = useRef<HTMLInputElement>(null);
  const secondsRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const rawdata = localStorage.getItem("time");
    const data = rawdata?.split(":");
    if (!data) return;
    setMinutes(parseNum(data[0]));
    setSeconds(parseNum(data[1]));
    minutesRef.current!.value = data[0];
    secondsRef.current!.value = data[1];

    launchTimer();
  }, []);

  useEffect(() => {
    if (!launched) return;
    localStorage.setItem("time", `${minutes}:${seconds}`);
    timeoutId = setTimeout(() => {
      if (seconds === 0 && minutes === 0) {
        stopTimer();
        return;
      }
      if (seconds < 1) {
        setMinutes((mins) => mins - 1);
        setSeconds(59);
        return;
      }
      setSeconds((secs) => secs - 1);
    }, 1000);
  }, [minutes, seconds, launched]);

  const resetTimer = () => {
    clearTimeout(timeoutId);
    setMinutes(0);
    setSeconds(0);
    setFinished(false);
  };

  const toggleTimer = () => {
    clearTimeout(timeoutId);
    setLaunched(false);
  };

  const stopTimer = () => {
    resetTimer();
    document.body.style.backgroundColor = "red";
    audio?.play();
    setFinished(true);
  };

  const launchTimer = () => {
    setMinutes(parseNum(minutesRef.current!.value));
    setSeconds(parseNum(secondsRef.current!.value));

    document.body.style.backgroundColor = "#242424";

    setLaunched(true);
    setFinished(false);
  };

  const formatTime = (time: number) => {
    return time.toString().length == 1 ? `0${time}` : time;
  };

  const parseNum = (num: string) => {
    return Number.isNaN(Number.parseInt(num)) ? 0 : Number.parseInt(num);
  };

  return (
    <div className="App">
      <div>
        <h1>
          {formatTime(minutes)}:{formatTime(seconds)}
        </h1>
      </div>

      <div className="inputs">
        <div>
          <label>Minutes</label>
          <input
            id="minuteInput"
            className="timeInput"
            ref={minutesRef}
            type="number"
            min={0}
            disabled={launched}
          ></input>
        </div>
        <div>
          <label>Seconds</label>
          <input
            className="timeInput"
            ref={secondsRef}
            type="number"
            min={0}
            max={59}
            disabled={launched}
          ></input>
        </div>
      </div>
      <button onClick={launchTimer} disabled={launched || finished}>
        Start
      </button>
      <button
        id="stopBtn"
        onClick={toggleTimer}
        disabled={!launched || finished}
      >
        Stop
      </button>
      <button
        onClick={() => {
          resetTimer();
          setLaunched(false);
          document.body.style.backgroundColor = "#242424";
          audio?.pause();
          audio!.currentTime = 0;
        }}
      >
        Reset
      </button>
    </div>
  );
}

export default App;
