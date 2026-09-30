import { useState, useEffect } from 'react';
import { calculateElapsedTime, ElapsedTime } from '../utils/time';

export function useElapsedTimer(meetingDateIso: string): ElapsedTime {
  const [elapsed, setElapsed] = useState<ElapsedTime>(() =>
    calculateElapsedTime(meetingDateIso)
  );

  useEffect(() => {
    // Initial sync
    setElapsed(calculateElapsedTime(meetingDateIso));

    const interval = setInterval(() => {
      setElapsed(calculateElapsedTime(meetingDateIso));
    }, 1000);

    return () => clearInterval(interval);
  }, [meetingDateIso]);

  return elapsed;
}
