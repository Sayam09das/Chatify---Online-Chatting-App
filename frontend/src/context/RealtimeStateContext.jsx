import React, { createContext, useContext, useMemo, useReducer } from 'react';

const initialState = {
  activeChatId: null,
  unreadByChat: {},
  call: {
    callId: null,
    type: null,
    status: 'idle', // idle | ringing | connecting | in_call | ended
    isIncoming: false,
    peer: null,
    error: null,
    startedAt: null,
  },
};

const RealtimeStateContext = createContext(null);

function realtimeReducer(state, action) {
  switch (action.type) {
    case 'SET_ACTIVE_CHAT':
      return { ...state, activeChatId: action.payload || null };
    case 'INCREMENT_UNREAD': {
      const chatId = action.payload;
      if (!chatId) return state;
      return {
        ...state,
        unreadByChat: {
          ...state.unreadByChat,
          [chatId]: (state.unreadByChat[chatId] || 0) + 1,
        },
      };
    }
    case 'RESET_UNREAD': {
      const chatId = action.payload;
      if (!chatId) return state;
      return {
        ...state,
        unreadByChat: {
          ...state.unreadByChat,
          [chatId]: 0,
        },
      };
    }
    case 'SET_CALL':
      return {
        ...state,
        call: {
          ...state.call,
          ...action.payload,
        },
      };
    case 'CLEAR_CALL':
      return {
        ...state,
        call: { ...initialState.call },
      };
    default:
      return state;
  }
}

export function RealtimeStateProvider({ children }) {
  const [state, dispatch] = useReducer(realtimeReducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return (
    <RealtimeStateContext.Provider value={value}>
      {children}
    </RealtimeStateContext.Provider>
  );
}

export function useRealtimeState() {
  const ctx = useContext(RealtimeStateContext);
  if (!ctx) {
    throw new Error('useRealtimeState must be used inside RealtimeStateProvider');
  }
  return ctx;
}
