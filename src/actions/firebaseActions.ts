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
  setDoc,
} from 'firebase/firestore';

import { createNewUserObj } from '../functions/userFunctions';
import {
  WisdomData,
  WisdomObj,
  UsersCollectionUserObj,
  AddNewWisdomToFirestore,
} from '../models/models';
import {
  buildNewWisdom,
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

//////////////////////////////
// New AddUserToDB Type
//////////////////////////////
// type AddUserToDB = (
//   uid: string,
//   username: string,
//   email: string,
//   password: string
// ) => void;
//////////////////////////////
// Previous AddUserToDB Type
//////////////////////////////
type AddUserToDB = (username: string, email: string, password: string) => void;
//////////////////////////////
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
export type DeleteWisdomFromFirestore = (
  username: string,
  wisdomId: string
) => void;

/////////////////////////////////////
// FIREBASE FUNCTIONS
/////////////////////////////////////

export const addUserToDB: AddUserToDB = async (
  // uid,
  username,
  email,
  password
) => {
  // const newUserObj = createNewUserObj(username, email, password);

  const docRef = doc(
    firestoreDB,
    USERS_COLLECTION,
    `${username}`,
    'user_priv',
    'user_priv'
  ); // successfully created a sub-collection and doc within said sub-collection
  await setDoc(docRef, { username, email, password }); // should return a promise to check for resolve!!!???

  // await updateDoc(docRef, { [`${username}`]: { ...newUserObj } });
  // try {
  // } catch (error) {
  //   console.error('Error from create addUserToDB: ', error);
  // }
};

///////////////////////////////////
// Previous addUserToDB function
///////////////////////////////////
// export const addUserToDB: AddUserToDB = async (username, email, password) => {
//   const newUserObj = createNewUserObj(username, email, password);

//   const docRef = doc(usersCollection, usersCollectionDocId);
//   await updateDoc(docRef, { [`${username}`]: { ...newUserObj } });
//   // try {
//   // } catch (error) {
//   //   console.error('Error from create addUserToDB: ', error);
//   // }
// };
///////////////////////////////////

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
  const nextWisdomToPush = userWisdomCollections.nextWisdomToPush;
  const defaultCollection = userWisdomCollections.default;

  if (nextWisdomToPush === null) {
    await updateDoc(docRef, {
      [userWisdomCollectionsPath]: {
        default: [...defaultCollection, wisdomId],
        nextWisdomToPush: wisdomId,
      },
    });
  } else {
    await updateDoc(docRef, {
      [userWisdomCollectionsPath]: {
        default: [...defaultCollection, wisdomId],
        nextWisdomToPush: nextWisdomToPush,
      },
    });
  }
};

export const addNewWisdomToFirestore: AddNewWisdomToFirestore = async (
  values,
  username
) => {
  // create and upload new wisdom to wisdomsCollection
  const newWisdom = buildNewWisdom(values, username);
  uploadNewWisdom(newWisdom);

  // upload new wisdom to user's wisdomCollections
  const userData = await fetchUserData(username);
  const userWisdomCollections = userData.wisdomCollections;
  const wisdomId = newWisdom.wisdomData.id;
  addToUserWisdomCollections(username, wisdomId, userWisdomCollections);
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

export const deleteWisdomFromFirestore: DeleteWisdomFromFirestore = async (
  username,
  wisdomId
) => {
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

  removeFromUserWisdomCollections(
    username,
    filteredCollection,
    userNextWisdomToPush,
    newNextWisdomToPush
  );

  removeWisdomFromWisdomsCollection(wisdomId);
};

////////////////////////////////////////
// OLD PUSH NOTIFICATION CODE BACKUP
////////////////////////////////////////

// const pushNotification = () => {
//   //////////////////////////////////////////
//   // REFACTOR???
//   //////////////////////////////////////////
//   if (!storedWisdoms) {
//     // improve error handeling!!!
//     console.error('from pushNotification in Home: storedWisdoms is null!');
//     return;
//   }
//   //////////////////////////////////////////
//   let wisdomToShow: WisdomData;
//   let nextWisdom: WisdomData;
//   const editedState = [...storedWisdoms];

//   storedWisdoms.forEach((item, idx) => {
//     if (item.next === true) {
//       wisdomToShow = {
//         ...item,
//         next: false,
//       };

//       editedState[idx] = { ...wisdomToShow };

//       if (idx === storedWisdoms.length - 1) {
//         nextWisdom = {
//           ...storedWisdoms[0],
//           next: true,
//         };

//         editedState[0] = { ...nextWisdom };
//       } else {
//         nextWisdom = {
//           ...storedWisdoms[idx + 1],
//           next: true,
//         };

//         editedState[idx + 1] = { ...nextWisdom };
//       }
//     }
//   });

//   localStorage.setItem('myWisdoms', JSON.stringify(editedState));
//   setStoredWisdoms(editedState);

//   alert(wisdomToShow!.text);
// };
