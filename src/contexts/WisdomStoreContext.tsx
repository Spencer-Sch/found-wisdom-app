import React, { useContext, useState, createContext } from 'react';

import {
  User as FirebaseUser, // User type from firebase
} from 'firebase/auth';

import { firestoreDB } from '../firebase/firebase';

import {
  fetchUserData,
  fetchWisdomsById,
  wisdomsCollection,
} from '../actions/firebaseActions';
import { WisdomData } from '../models/models';
import { doc, getDoc, getDocs, query, where } from 'firebase/firestore';

interface WisdomStoreContextResult {
  setUserWisdoms?: React.Dispatch<
    React.SetStateAction<WisdomData[] | [] | null>
  >;
  fetchWisdomData?: (username: string) => void;
  // fetchWisdomData?: (uid: string) => Promise<void>;
  ///////////////////
  // fetchWisdomData?: (user: FirebaseUser) => void;
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
      console.log(doc.id, ' => ', doc.data());
      const wisdom = doc.data().wisdomData;
      wisdomData.push(wisdom);
    });
    setUserWisdoms(wisdomData);

    // For initial Home.tsx load, I DON'T NEED TO GET THE IDS
    // fetchWisdomIds
    // maybe export this into its own function?
    // const wisdomsAllRef = doc(
    //   firestoreDB,
    //   'usersCollection',
    //   uid,
    //   'wisdom_ids',
    //   'wisdoms_all'
    // );
    // const snapshot = await getDoc(wisdomsAllRef);
    // const wisdoms_all_obj = snapshot.data();
    // if (wisdoms_all_obj) {
    //   const wisdomIds: string[] = wisdoms_all_obj.ids;

    // next step: refactor fetchWisdomsById to work with new Firebase model
    // const wisdomsArr = await fetchWisdomsById(wisdomIds);
    // }
    ///////////////////////

    // setUserWisdoms(wisdomsArr);
  };

  // const fetchWisdomData = async (currentUser: FirebaseUser) => {
  //   const userData = await fetchUserData(currentUser!.displayName!);
  //   const defaultCollection: string[] = userData.wisdomCollections.default;
  //   const wisdomsArr = await fetchWisdomsById(defaultCollection);

  //   setUserWisdoms(wisdomsArr);
  // };

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
