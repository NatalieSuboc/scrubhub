import { useRef, useState, useEffect, EventHandler } from 'react';
import './Timer.css';

const ONE_SECOND = 1000;

interface ITimerProps {
  minutes: number,
  seconds: number
}

const Timer = (props: ITimerProps) => {

  const { minutes, seconds } = props; // destructured props

  const [mins, setMins] = useState(minutes);
  const [secs, setSecs] = useState(seconds);

  useEffect(() => {
      secs > 0 && setTimeout(() => setSecs(secs - 1), ONE_SECOND);
    }, [secs]);

  return (
    <div className="timer">
      <input type="button" value="Start" />
      <h1>{mins >= 10 ? mins : '0' + mins}:{secs >= 10 ? secs : '0' + secs}</h1>
    </div>
  );
};

export default Timer;