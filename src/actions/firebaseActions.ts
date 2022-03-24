import {
  firestoreDB,
  wisdomsCollectionDocId,
  usersCollectionDocId,
} from '../firebase/firebase';
import { doc, getDocs, updateDoc, collection, query } from 'firebase/firestore';

import { createNewUserObj } from '../functions/userFunctions';
import { WisdomData, UsersCollectionUserObj } from '../models/models';

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

type FetchUserData = (username: string) => Promise<UsersCollectionUserObj>;
type FetchWisdomsById = (
  wisdomIds: string[]
) => Promise<WisdomData[] | null> | [];
type FetchCurrentWisdom = (wisdomid: string) => Promise<WisdomData | null>;
type UploadEditedWisdom = (editedWisdom: WisdomData) => void;

/////////////////////////////////////
// FIREBASE FUNCTIONS
/////////////////////////////////////

export const addUserToDB = async (
  username: string,
  email: string,
  password: string
) => {
  const newUserObj = createNewUserObj(username, email, password);

  const docRef = doc(usersCollection, usersCollectionDocId);
  await updateDoc(docRef, { [`${username}`]: { ...newUserObj } });
  // try {
  // } catch (error) {
  //   console.error('Error from create addUserToDB: ', error);
  // }
};

export const fetchUserData: FetchUserData = (username) => {
  console.log('fetchUserData -> username: ', username);
  // console.log('fetchUserData running...');
  return getDocs(Q_USERS_COLLECTION)
    .then((snapshot) => {
      const userDocs = snapshot.docs.map((item) => ({
        ...item.data(),
      }));
      console.log('fetchUserData return value: ', userDocs[0][`${username}`]);
      return userDocs[0][`${username}`];
    })
    .catch((error) => {
      // improve error handeling!!!
      console.error('fetchUserData Error:', error);
    });
};

export const fetchWisdomsById: FetchWisdomsById = (wisdomIds) => {
  // console.log('fetchWisdomsById running...');
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
  // console.log('fetchCurrentWisdom running...');

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
  // console.log('uploadEditedWisdom running...');

  const wisdomPath = `${editedWisdom.id}.wisdomData`;

  const docRef = doc(wisdomsCollection, wisdomsCollectionDocId);
  await updateDoc(docRef, { [`${wisdomPath}`]: { ...editedWisdom } });
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
