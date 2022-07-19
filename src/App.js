import { useState } from 'react';
import './App.css';
import displayIcon from './image/display.jpg';
import clearIcon from './image/clear.jpg';

function App() {
  const [drawResult, setDrawResult] = useState({primaryNumber: new Array(7).fill(null), secondaryNumber: [null]});

  const [primaryNumberArray, setPrimaryNumberArray] = useState(generateArray(35));
  const [secondaryNumberArray, setSecondaryNumberArray] = useState(generateArray(20));

  const getDrawResult = () => {
    fetch('https://data.api.thelott.com/sales/vmax/web/data/lotto/latestresults', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json;charset=utf-8'
      }, 
      body: JSON.stringify({
        CompanyId: "GoldenCasket",
        MaxDrawCountPerProduct: 1,
        OptionalProductFilter: ["Powerball"]
      }) 
    }).then(res => res.json()).then(data => {
      const drawPrimaryNumber = data.DrawResults[0].PrimaryNumbers;
      const drawSecondaryNumber = data.DrawResults[0].SecondaryNumbers;
      setDrawResult({
        primaryNumber: drawPrimaryNumber,
        secondaryNumber: drawSecondaryNumber
      })
      setPrimaryNumberArray(prePrimaryNumberArray => prePrimaryNumberArray.map(x => {
        if (drawPrimaryNumber.includes(x.number)) x.hasDraw = true;
        return x
      }))
      setSecondaryNumberArray(preSecondaryNumberArray => preSecondaryNumberArray.map(x => {
        if (drawSecondaryNumber.includes(x.number)) x.hasDraw = true;
        return x
      }))
    })
  }

  const clearDrawResult = () => {
    setDrawResult({
      primaryNumber: new Array(7).fill(null),
      secondaryNumber: [null]
    })
    setPrimaryNumberArray(prePrimaryNumberArray => prePrimaryNumberArray.map(x => {
      x.hasDraw = false;
      return x
    }))
    setSecondaryNumberArray(preSecondaryNumberArray => preSecondaryNumberArray.map(x => {
      x.hasDraw = false;
      return x
    }))
  }

  return (
    <div className="App flex">
      <div className="ticket-layout">
        <div className="header-zone flex">
          <div className="sequence">1</div>
          <ul className="draw-result-zone flex">
            {
              drawResult.primaryNumber.map((x, index) => {
                return <li key={index} className={x? 'number-item primary-number-activated':'number-item'}>{x}</li>
              })
            }
            <li className={drawResult.secondaryNumber[0]? 'number-item secondary-number-activated':'number-item'}>{drawResult.secondaryNumber[0]? drawResult.secondaryNumber[0]:'PB'}</li>
          </ul>
          <div className="operation-zone flex">
            <img alt="" className="icon pointer" src={displayIcon} onClick={getDrawResult} />
            <img alt="" className="icon pointer" src={clearIcon} onClick={clearDrawResult} />
          </div>
        </div>
        <div className="draw-number">
          <ul className="draw-number-zone flex">
            {primaryNumberArray.map(x => {
              return <li key={x.number} className={x.hasDraw? 'draw-number-item item-active':'draw-number-item'}>{x.number}</li>
            })}
          </ul>
          <div className="select-word">SELECT YOUR POWERBALL</div>
          <ul className="draw-number-zone flex">
            {secondaryNumberArray.map(x => {
              return <li key={x.number} className={x.hasDraw? 'draw-number-item item-active':'draw-number-item'}>{x.number}</li>
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function generateArray (num) {
  return new Array(num).fill(null).map((x, index) => ({number: index + 1, hasDraw: false}))
}

export default App;
