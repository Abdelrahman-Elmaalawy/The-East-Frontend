// src/context/ShakeContext.jsx
import { createContext, useContext, useState } from 'react';

const ShakeContext = createContext();

export function ShakeProvider({ children }) {
  const [shakeTrigger, setShakeTrigger] = useState(false);

  return (
    <ShakeContext.Provider value={{ shakeTrigger, setShakeTrigger }}>
      {children}
    </ShakeContext.Provider>
  );
}

export const useShake = () => useContext(ShakeContext);
