// MuteContext.tsx
import React, {createContext, useContext, useState} from 'react';

interface MuteContextType {
  muted: boolean;
  toggleMute: () => void;
}

const MuteContext = createContext<MuteContextType | undefined>(undefined);

export const MuteProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [muted, setMuted] = useState(true);
  const toggleMute = () => setMuted(prev => !prev);

  return (
    <MuteContext.Provider value={{muted, toggleMute}}>
      {children}
    </MuteContext.Provider>
  );
};

export const useMute = () => {
  const context = useContext(MuteContext);
  if (!context) {
    throw new Error('useMute must be used within a MuteProvider');
  }
  return context;
};
