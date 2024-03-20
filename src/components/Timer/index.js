import { useEffect, useRef, useState } from 'react';
import '../../styles/login/main.css';

function Timer(props) {
  const { m, onToggleCountDown, onSetTimeout, isInputReset } = props;
  const [min, setMin] = useState(m);
  const [sec, setSec] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    if (isInputReset === true) {
      clearInterval(timer.current);
      setMin(m);
      setSec(0);
      timer.current = setInterval(() => {
        setSec(prevSec => {
          if (prevSec === 0) return 59;
          return prevSec - 1;
        });
      }, 1000);
    }
  }, [isInputReset]);
  useEffect(() => {
    // eslint-disable-next-line prefer-const
    timer.current = setInterval(() => {
      setSec(prevSec => {
        if (prevSec === 0) return 59;
        return prevSec - 1;
      });
    }, 1000);
    return () => {
      clearInterval(timer.current);
    };
  }, []);

  useEffect(() => {
    if (sec === 59) setMin(prevMin => prevMin - 1);
  }, [sec]);

  useEffect(() => {
    if (min === 0 && sec === 0) {
      onToggleCountDown();
      onSetTimeout();
    }
  }, [min, sec]);

  const format = s => {
    if (s < 10) return `0${s}`;
    return s;
  };

  return (
    <div className="timer">
      {format(min)}:{format(sec)}
    </div>
  );
}

export default Timer;
