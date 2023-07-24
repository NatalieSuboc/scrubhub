import { useState, useEffect } from 'react';
import '../../stylesheets/pomodoro/Timer.css';

const ONE_SECOND = 1000;
const SECONDS_IN_A_MINUTE = 60;

interface ITimerProps {
  minutes: number,
  seconds: number
}

const Timer = (props: ITimerProps) => {

  const { minutes, seconds } = props; // destructured props passed in

  const [totalSeconds, setTotalSeconds] = useState(seconds + minutes * SECONDS_IN_A_MINUTE);
  const [play, setPlay] = useState(false);

  useEffect(() => {
        if (!play) { return; }
        totalSeconds > 0 && setTimeout(() => setTotalSeconds(totalSeconds - 1), ONE_SECOND);
    }, [totalSeconds, play]);

  // Triggers time to alternate between start and stop
  const triggerTimer = (() => { 
    setPlay(!play); 
  });

  // Reset timer to original value
  const resetTimer = (() => {
    setTotalSeconds(seconds + minutes * SECONDS_IN_A_MINUTE);
  });

  // TODO The timer is slightly inprecise and will continue the countdown for 1 second
  // after the Pause button is hit, fix later
  const getTimeRemaining = (() => {
    // Ex: 130 seconds -> 2 minutes (floor(130/60)), 10 seconds (130 % 60)
    const total = totalSeconds;
    const m = Math.floor(total / SECONDS_IN_A_MINUTE);
    const s = total % SECONDS_IN_A_MINUTE;
    return { minutes: m, seconds: s };
  });

  const formattedTimeRemaining = (() => {
    const { minutes, seconds } = getTimeRemaining();
    const formattedMins = minutes >= 10 ? minutes : '0' + minutes;
    const formattedSecs = seconds >= 10 ? seconds: '0' + seconds;
    let time = formattedMins + ":" + formattedSecs;
    return time;
  });

  return (
    <div className="timer">
      <h1>{formattedTimeRemaining()}</h1>
      <input type="button" value={play ? "Pause" : "Start"} onClick={triggerTimer} />
      <input type="button" value="Reset" onClick={resetTimer} />
    </div>
  );
};

export default Timer;