import { useState, useEffect, useCallback, useRef } from 'react';
import { isMinute43, getMinute43Key } from '../utils/time';
import { soundManager } from '../audio/soundManager';

export function useHeartEventDetector() {
  const [isHeartEventActive, setIsHeartEventActive] = useState<boolean>(false);
  const lastTriggeredKeyRef = useRef<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const triggerHeartEvent = useCallback(() => {
    setIsHeartEventActive(true);
    soundManager.playHeartbeat(60);

    // Heart event lasts around 9 seconds then gracefully dissolves
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setIsHeartEventActive(false);
    }, 9000);
  }, []);

  const dismissHeartEvent = useCallback(() => {
    setIsHeartEventActive(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      if (isMinute43(now)) {
        const key = getMinute43Key(now);
        if (lastTriggeredKeyRef.current !== key) {
          lastTriggeredKeyRef.current = key;
          triggerHeartEvent();
        }
      }
    };

    // Check immediately on load
    checkTime();

    // Check every 2 seconds
    const interval = setInterval(checkTime, 2000);
    return () => {
      clearInterval(interval);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [triggerHeartEvent]);

  return {
    isHeartEventActive,
    triggerManualHeartEvent: triggerHeartEvent,
    dismissHeartEvent,
  };
}
