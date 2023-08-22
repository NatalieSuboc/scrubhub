const TimerGraphic = ({ remainingTime }: { remainingTime: number }) => {
    if (remainingTime === 0) {
    return <div className="timer">Out of Time</div>;
  }

  return (
    <div className="timer">
      <div className="text">Remaining</div>
      <div className="value">{remainingTime}</div>
      <div className="text">seconds</div>
    </div>
  );
};

export default TimerGraphic;

//https://www.npmjs.com/package/react-countdown-circle-timer