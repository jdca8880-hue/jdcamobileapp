import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../lib/api';
import { useLiveSubscription } from './useLiveSubscription';

export function useLiveMatch(matchId, initialMatch) {
  const [liveData, setLiveData] = useState(initialMatch);

  const isLive = initialMatch?.status === 'LIVE' || initialMatch?.status === 'IN_PROGRESS' || initialMatch?.status === 'INNINGS_BREAK';

  const handleUpdate = useCallback((_matchId, scorecard) => {
    setLiveData(prev => ({
      ...prev,
      scorecard
    }));

    window.dispatchEvent(new CustomEvent('live-scorecard-updated', {
      detail: { matchId: _matchId, scorecard }
    }));
  }, []);

  useLiveSubscription(matchId, handleUpdate, isLive);

  return liveData;
}
