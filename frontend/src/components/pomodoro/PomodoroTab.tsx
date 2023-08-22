import { Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import Timer from './Timer';
import TimerGraphic from './TimerGraphic';
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import './PomodoroTab.css';

// Componnent that holds the Pomodoro timer panel
const PomodoroTab: React.FC = () => {

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (e: any, i: number) => {
    setActiveTab(i);
  }

    return (
      <div className="pomodoro">
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Work" />
          <Tab label="Break" />
          <Tab label="Long break" />
        </Tabs>

        {/* Tab 1 (Work) */}
        {activeTab === 0 && (
          // <Timer minutes={25} seconds={0} />
          <CountdownCircleTimer
          isPlaying
          duration={10}
          colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
          colorsTime={[10, 6, 3, 0]}
          >
          {TimerGraphic}
        </CountdownCircleTimer>
        )}

        {/* Tab 2 (Break) */}
        {activeTab === 1 && (
          <Timer minutes={5} seconds={0} />
        )}

        {/* Tab 3 (Long break) */}
        {activeTab === 2 && (
          <Timer minutes={15} seconds={0} />
        )}

      </div>
    );
};

export default PomodoroTab;