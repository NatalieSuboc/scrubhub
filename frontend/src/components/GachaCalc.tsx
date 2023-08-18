import { useState } from 'react';

const GachaCalc: React.FC = () => {
    
    const FIVE_STAR_RATE = 0.006;
    const FIVE_STAR_RATE_SOFT = 0.20;
    const SOFT_CAP = 75;
    const CAP = 90;

    const [guaranteed, setGuaranteed] = useState(false);
    const [rolls, setRolls] = useState(0);

    const rollOne: any = (() => {
        if (rolls == CAP) {
            console.log("You won!");
            fiftyFifty();
            return;
        }
        var roll = Math.random();
        var rate = rolls < SOFT_CAP ? FIVE_STAR_RATE : FIVE_STAR_RATE_SOFT;
        setRolls(rolls + 1);
        if (roll <= rate) {
            console.log("You won with " + rolls + " rolls!");
            fiftyFifty();
        } else {
            console.log("Rolls: " + rolls);
        }
    });

    const fiftyFifty = (() => {
        var roll = Math.random(); 
        if (roll < 0.5 || guaranteed) {
            console.log("You won the 50/50!");
            setGuaranteed(false);
        } else {
            console.log("You lost the 50/50!");
            setGuaranteed(true);
        }
    });

    const rollTen = (() => {

    });
    
    return (
        <div className="gacha">
            <input type="button" value="Roll Once" onClick={rollOne} />
            <input type="button" value="Roll Ten Times" onClick={rollTen} />
        </div>
    );
};

export default GachaCalc;