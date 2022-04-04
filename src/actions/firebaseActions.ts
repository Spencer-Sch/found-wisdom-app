import {
  firestoreDB,
  wisdomsCollectionDocId,
  usersCollectionDocId,
} from '../firebase/firebase';
import {
  doc,
  getDocs,
  updateDoc,
  collection,
  query,
  deleteField,
} from 'firebase/firestore';

import { createNewUserObj } from '../functions/userFunctions';
import {
  WisdomData,
  WisdomObj,
  UsersCollectionUserObj,
} from '../models/models';
import {
  filterDeletedItem,
  getNextWisdomId,
} from '../functions/wisdomFunctions';

/////////////////////////////////////
// CONSTANTS
/////////////////////////////////////
// MOVE TO FIREBASE.TS ???

const USERS_COLLECTION = 'usersCollection';
const WISDOMS_COLLECTION = 'wisdomsCollection';

export const wisdomsCollection = collection(firestoreDB, WISDOMS_COLLECTION);
export const usersCollection = collection(firestoreDB, USERS_COLLECTION);

const Q_WISDOMS_COLLECTION = query(wisdomsCollection);
const Q_USERS_COLLECTION = query(usersCollection);

/////////////////////////////////////
// TYPES
/////////////////////////////////////

type AddUserToDB = (username: string, email: string, password: string) => void;
type FetchUserData = (username: string) => Promise<UsersCollectionUserObj>;
type FetchWisdomsById = (
  wisdomIds: string[]
) => Promise<WisdomData[] | null> | [];
type FetchCurrentWisdom = (wisdomid: string) => Promise<WisdomData | null>;
type UploadEditedWisdom = (editedWisdom: WisdomData) => void;
type UploadNewWisdom = (newWisdom: WisdomObj) => void;
type AddToUserWisdomCollections = (
  username: string,
  wisdomId: string,
  userWisdomCollections: {
    default: string[];
    nextWisdomToPush: string | null;
    userCreatedCategory?: string[] | undefined;
  }
) => void;
type RemoveFromUserWisdomCollections = (
  username: string,
  filteredCollection: string[] | [],
  userNextWisdomToPush: string | null,
  newNextWisdomToPush: string | null
) => void;
type RemoveWisdomFromWisdomsCollection = (wisdomId: string) => void;
export type HandleDelete = (username: string, wisdomId: string) => void;

/////////////////////////////////////
// FIREBASE FUNCTIONS
/////////////////////////////////////

export const addUserToDB: AddUserToDB = async (username, email, password) => {
  const newUserObj = createNewUserObj(username, email, password);

  const docRef = doc(usersCollection, usersCollectionDocId);
  await updateDoc(docRef, { [`${username}`]: { ...newUserObj } });
  // try {
  // } catch (error) {
  //   console.error('Error from create addUserToDB: ', error);
  // }
};

export const fetchUserData: FetchUserData = (username) => {
  return getDocs(Q_USERS_COLLECTION)
    .then((snapshot) => {
      const userDocs = snapshot.docs.map((item) => ({
        ...item.data(),
      }));
      return userDocs[0][`${username}`];
    })
    .catch((error) => {
      // improve error handeling!!!
      console.error('fetchUserData Error:', error);
    });
};

export const fetchWisdomsById: FetchWisdomsById = (wisdomIds) => {
  if (wisdomIds.length === 0) {
    return [];
  }
  return getDocs(Q_WISDOMS_COLLECTION)
    .then((snapshot) => {
      const wisdomsDoc = snapshot.docs.map((item) => ({
        ...item.data(),
      }));

      const userWisdoms: WisdomData[] | [] = wisdomIds.map((item) => {
        return wisdomsDoc[0][item]['wisdomData'];
      });

      return userWisdoms.length > 0 ? userWisdoms : null;
    })
    .catch((error) => {
      // improve error handeling!!!
      console.error(error);
      return null;
    });
};

export const fetchCurrentWisdom: FetchCurrentWisdom = (wisdomid) => {
  return getDocs(Q_WISDOMS_COLLECTION)
    .then((snapshot) => {
      const wisdomsDoc = snapshot.docs.map((item) => ({
        ...item.data(),
      }));

      return wisdomsDoc[0][wisdomid]['wisdomData'];
    })
    .catch((error) => {
      // improve error handeling!!!
      console.error(error);
      return null;
    });
};

export const uploadEditedWisdom: UploadEditedWisdom = async (editedWisdom) => {
  const wisdomPath = `${editedWisdom.id}.wisdomData`;
  const docRef = doc(wisdomsCollection, wisdomsCollectionDocId);
  await updateDoc(docRef, { [`${wisdomPath}`]: { ...editedWisdom } });
};

export const uploadNewWisdom: UploadNewWisdom = async (newWisdom) => {
  const docRef = doc(wisdomsCollection, wisdomsCollectionDocId);
  await updateDoc(docRef, { [newWisdom.wisdomData.id]: { ...newWisdom } });
};

export const addToUserWisdomCollections: AddToUserWisdomCollections = async (
  username,
  wisdomId,
  userWisdomCollections
) => {
  const docRef = doc(usersCollection, usersCollectionDocId);
  const userWisdomCollectionsPath = `${username}.wisdomCollections`;

  if (userWisdomCollections.nextWisdomToPush === null) {
    await updateDoc(docRef, {
      [userWisdomCollectionsPath]: {
        default: [...userWisdomCollections.default, wisdomId],
        nextWisdomToPush: wisdomId,
      },
    });
  } else {
    await updateDoc(docRef, {
      [userWisdomCollectionsPath]: {
        default: [...userWisdomCollections.default, wisdomId],
        nextWisdomToPush: userWisdomCollections.nextWisdomToPush,
      },
    });
  }
};

export const removeFromUserWisdomCollections: RemoveFromUserWisdomCollections =
  async (
    username,
    filteredCollection,
    userNextWisdomToPush,
    newNextWisdomToPush
  ) => {
    const docRef = doc(usersCollection, usersCollectionDocId);
    const userWisdomCollectionsPath = `${username}.wisdomCollections`;

    if (newNextWisdomToPush === '') {
      await updateDoc(docRef, {
        [userWisdomCollectionsPath]: {
          default: [...filteredCollection],
          nextWisdomToPush: userNextWisdomToPush,
        },
      });
    } else {
      await updateDoc(docRef, {
        [userWisdomCollectionsPath]: {
          default: [...filteredCollection],
          nextWisdomToPush: newNextWisdomToPush,
        },
      });
    }
  };

export const removeWisdomFromWisdomsCollection: RemoveWisdomFromWisdomsCollection =
  async (wisdomId) => {
    const docRef = doc(wisdomsCollection, wisdomsCollectionDocId);
    await updateDoc(docRef, { [wisdomId]: deleteField() });
  };

export const handleDelete: HandleDelete = async (username, wisdomId) => {
  console.log('deleteing wisdom...');
  const { wisdomCollections } = await fetchUserData(username);
  const userNextWisdomToPush = wisdomCollections.nextWisdomToPush;
  const userWisdoms = wisdomCollections.default;
  let newNextWisdomToPush: string | null = '';

  if (userNextWisdomToPush === wisdomId && userWisdoms.length > 1) {
    newNextWisdomToPush = getNextWisdomId(wisdomId, userWisdoms);
  }

  if (userNextWisdomToPush === wisdomId && userWisdoms.length === 1) {
    newNextWisdomToPush = null;
  }

  const filteredCollection = filterDeletedItem(userWisdoms, wisdomId);

  await removeFromUserWisdomCollections(
    username,
    filteredCollection,
    userNextWisdomToPush,
    newNextWisdomToPush
  );

  await removeWisdomFromWisdomsCollection(wisdomId);
};
