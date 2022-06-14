import React, { useContext, useState, createContext } from 'react';

import { wisdomsCollection } from '../actions/firebaseActions';
import { WisdomData } from '../models/models';
import { getDocs, query, where } from 'firebase/firestore';

interface WisdomStoreContextResult {
  setUserWisdoms?: React.Dispatch<
    React.SetStateAction<WisdomData[] | [] | null>
  >;
  fetchWisdomData?: (username: string) => void;
  userWisdoms: WisdomData[] | null;
}

const defaultState = {
  userWisdoms: null,
};

const WisdomStoreContext =
  createContext<WisdomStoreContextResult>(defaultState);

export function useWisdomStore() {
  return useContext(WisdomStoreContext);
}

export const WisdomStoreProvider: React.FC = ({ children }) => {
  const [userWisdoms, setUserWisdoms] = useState<WisdomData[] | [] | null>(
    null
  );

  const fetchWisdomData = async (username: string) => {
    // TODO: this query will need to be limited and ordered in the future!!!
    const q = query(wisdomsCollection, where('createdBy', '==', username));
    const querySnapshot = await getDocs(q);
    const wisdomData: WisdomData[] = [];
    querySnapshot.forEach((doc) => {
      const wisdom = doc.data().wisdomData;
      wisdomData.push(wisdom);
    });
    setUserWisdoms(wisdomData);
  };

  const value = {
    userWisdoms,
    setUserWisdoms,
    fetchWisdomData,
  };

  return (
    <WisdomStoreContext.Provider value={value}>
      {children}
    </WisdomStoreContext.Provider>
  );
};
