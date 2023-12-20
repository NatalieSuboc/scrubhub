// const TimerGraphic = ({ remainingTime }: { remainingTime: number }) => {
// interface TimerGraphicProps {
//   dimension: string;
//   time: number;
// }


// const TimerGraphic = ({dimension, time}: TimerGraphicProps) => {
const TimerGraphic = (time: number) =>{
  const getTimeMinutes = Math.floor(time / 60 | 0);

  if (time === 0) {
    return <div className="timerG">Out of Time</div>;
  }
  
  // console.log(time);
  if (time < 60) {
    return (
      <div className="timer">
        <div className="text">Remaining</div>
        <div className="value">{Math.ceil(time)}</div>
        <div className="text">seconds</div>
      </div>
    );
  }else{
  return (
    <div className="timer">
      <div className="text">Remaining</div>
      <div className="value">{getTimeMinutes}</div>
      <div className="text">minutes</div>
    </div>
      // <div className="timerG">
      //   <div className="time">{getTimeMinutes}</div>
      //   <div>{dimension}</div>
      // </div>
  );
  }

};

export default TimerGraphic;

//https://www.npmjs.com/package/react-countdown-circle-timer