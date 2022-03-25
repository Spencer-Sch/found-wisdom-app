import {
  firestoreDB,
  wisdomsCollectionDocId,
  usersCollectionDocId,
} from '../firebase/firebase';
import { doc, getDocs, updateDoc, collection, query } from 'firebase/firestore';

import { createNewUserObj } from '../functions/userFunctions';
import {
  WisdomData,
  WisdomObj,
  UsersCollectionUserObj,
} from '../models/models';

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
type UpdateUserObj = (
  username: string,
  wisdomId: string,
  userWisdomCollections: {
    default: string[];
    nextWisdomToPush: string | null;
    userCreatedCategory?: string[] | undefined;
  }
) => void;

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

export const updateUserObj: UpdateUserObj = async (
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
/////////////////////////////
// Firestore useEffect backup
/////////////////////////////
// useEffect(() => {
//   console.log('WisdomPageWrapper useEffect running...');

//   if (!storedWisdoms) {
//     console.log('getting data from firebase...');
//     setLoading(true);

//     const userCollection = collection(firestoreDB, currentUser!.email!);
//     // const userCollection = collection(firestoreDB, 'test1@test.com');

//     // console.log('userCollection: ', userCollection);

//     const q = query(userCollection);
//     getDocs(q)
//       .then((snapshot) => {
//         console.log('processing data checkpoint 1');
//         const userDoc = snapshot.docs.map((item) => ({
//           ...item.data(),
//         }));
//         const userObj = userDoc[0];
//         const userWisdoms = userObj.userWisdoms;
//         console.log('setting StoredWisdoms state');
//         setStoredWisdoms(userWisdoms);
//       })
//       .catch((error) => {
//         console.error(error);
//       })
//       .finally(() => {
//         console.log('processing data checkpoint 2');
//         setLoading(false);
//       });
//   }
// }, [storedWisdoms]);
