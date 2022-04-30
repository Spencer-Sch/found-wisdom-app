import React, { useContext, useState, createContext } from 'react';
import { WisdomData } from '../models/models';

import {
  User as FirebaseUser, // User type from firebase
} from 'firebase/auth';
import { fetchUserData, fetchWisdomsById } from '../actions/firebaseActions';

interface WisdomStoreContextResult {
  setUserWisdoms?: React.Dispatch<
    React.SetStateAction<WisdomData[] | [] | null>
  >;
  fetchWisdomData?: (user: FirebaseUser) => void;
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

  const fetchWisdomData = async (currentUser: FirebaseUser) => {
    console.log('Fetching Wisdom Data');
    const userData = await fetchUserData(currentUser!.displayName!);
    const defaultCollection: string[] = userData.wisdomCollections.default;
    const wisdomsArr = await fetchWisdomsById(defaultCollection);

    setUserWisdoms(wisdomsArr);
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
