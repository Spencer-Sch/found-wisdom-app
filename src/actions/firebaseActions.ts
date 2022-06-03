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
  DocumentReference,
  DocumentData,
  writeBatch,
  getDoc,
  arrayUnion,
  deleteDoc,
} from 'firebase/firestore';

import {
  createNewUserObj,
  createNewUserPrivObj,
  createNewUserPubObj,
} from '../functions/userFunctions';
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
type BuildUserDocRef = (
  uid: string,
  subCollectionName: string,
  subColDocName: string
) => DocumentReference<DocumentData>;

type AddUserToDB = (
  email: string,
  password: string,
  uid: string,
  username: string
) => void;

type FetchUserData = (username: string) => Promise<UsersCollectionUserObj>;

type FetchWisdomsById = (
  wisdomIds: string[]
) => Promise<WisdomData[] | null> | [];

type FetchCurrentWisdom = (wisdomid: string) => Promise<WisdomData | null>;

type UploadEditedWisdom = (editedWisdom: WisdomData) => void;

type UploadNewWisdom = (newWisdom: WisdomObj) => void;

type AddToUserWisdomIdList = (uid: string, wisdomId: string) => void;

// type AddToUserWisdomCollections = (
//   username: string,
//   wisdomId: string,
//   userWisdomCollections: {
//     default: string[];
//     nextWisdomToPush: string | null;
//     userCreatedCategory?: string[] | undefined;
//   }
// ) => void;

type RemoveFromUserWisdomIds = (
  username: string,
  filteredCollection: string[] | [],
  newNextWisdomToPush: string | null
) => void;

// type RemoveFromUserWisdomCollections = (
//   username: string,
//   filteredCollection: string[] | [],
//   userNextWisdomToPush: string | null,
//   newNextWisdomToPush: string | null
// ) => void;

type RemoveWisdomFromWisdomsCollection = (wisdomId: string) => void;

export type DeleteWisdomFromFirestore = (
  username: string,
  wisdomId: string
) => void;

/////////////////////////////////////
// FIREBASE FUNCTIONS
/////////////////////////////////////

const buildUserDocRef: BuildUserDocRef = (
  uid,
  subCollectionName,
  subColDocName
) => {
  return doc(
    firestoreDB,
    USERS_COLLECTION,
    `${uid}`,
    `${subCollectionName}`,
    `${subColDocName}`
  );
};

export const addUserToDB: AddUserToDB = async (
  email,
  password,
  uid,
  username
) => {
  const batch = writeBatch(firestoreDB);

  const user_priv_ref = buildUserDocRef(uid, 'user_priv', 'user_priv');
  batch.set(
    user_priv_ref,
    createNewUserPrivObj(email, password, uid, username)
  );

  const user_pub_ref = buildUserDocRef(uid, 'user_pub', 'user_pub');
  batch.set(user_pub_ref, createNewUserPubObj(username));

  const next_wisdom_to_push_ref = buildUserDocRef(
    uid,
    'wisdom_ids',
    'next_wisdom_to_push'
  );
  batch.set(next_wisdom_to_push_ref, { wisdomId: null });

  const user_categories_ref = buildUserDocRef(
    uid,
    'wisdom_ids',
    'user_categories'
  );
  batch.set(user_categories_ref, { userCategories: [] });

  const wisdoms_all_ref = buildUserDocRef(uid, 'wisdom_ids', 'wisdoms_all');
  batch.set(wisdoms_all_ref, { ids: [] });

  try {
    await batch.commit(); // should I check for resolve on the returned promise???
  } catch (e) {
    console.error(
      'Error from firebaseActions -> addUserToDB: (batch write) ',
      e
    );
  }
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

export const fetchUserData: FetchUserData = (uid) => {
  // so far, this function is not used...
  return getDocs(Q_USERS_COLLECTION)
    .then((snapshot) => {
      const userDocs = snapshot.docs.map((item) => ({
        ...item.data(),
      }));
      return userDocs[0][`${uid}`];
    })
    .catch((error) => {
      // improve error handeling!!!
      console.error('fetchUserData Error:', error);
    });
};

// export const fetchUserData: FetchUserData = (username) => {
//   return getDocs(Q_USERS_COLLECTION)
//     .then((snapshot) => {
//       const userDocs = snapshot.docs.map((item) => ({
//         ...item.data(),
//       }));
//       return userDocs[0][`${username}`];
//     })
//     .catch((error) => {
//       // improve error handeling!!!
//       console.error('fetchUserData Error:', error);
//     });
// };

export const fetchWisdomsById: FetchWisdomsById = (wisdomIds) => {
  if (wisdomIds.length === 0) {
    return [];
  }
  // I need to query the whole of wisdomsCollection to find the docs who's names match the ids in the incoming 'wisdomIds' array
  // create a forEach loop and getDoc for every wisdomId? That would result in a lot of reads...
  //////////////////////
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
// export const fetchWisdomsById: FetchWisdomsById = (wisdomIds) => {
//   if (wisdomIds.length === 0) {
//     return [];
//   }
//   return getDocs(Q_WISDOMS_COLLECTION)
//     .then((snapshot) => {
//       const wisdomsDoc = snapshot.docs.map((item) => ({
//         ...item.data(),
//       }));

//       const userWisdoms: WisdomData[] | [] = wisdomIds.map((item) => {
//         return wisdomsDoc[0][item]['wisdomData'];
//       });

//       return userWisdoms.length > 0 ? userWisdoms : null;
//     })
//     .catch((error) => {
//       // improve error handeling!!!
//       console.error(error);
//       return null;
//     });
// };

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
  const docRef = doc(wisdomsCollection, editedWisdom.id);
  await updateDoc(docRef, { wisdomData: { ...editedWisdom } });
};

// export const uploadEditedWisdom: UploadEditedWisdom = async (editedWisdom) => {
//   const wisdomPath = `${editedWisdom.id}.wisdomData`;
//   const docRef = doc(wisdomsCollection, wisdomsCollectionDocId);
//   await updateDoc(docRef, { [`${wisdomPath}`]: { ...editedWisdom } });
// };

export const uploadNewWisdom: UploadNewWisdom = async (newWisdom) => {
  const docRef = doc(wisdomsCollection, newWisdom.wisdomData.id);
  await setDoc(docRef, { ...newWisdom });
};

// export const uploadNewWisdom: UploadNewWisdom = async (newWisdom) => {
//   const docRef = doc(wisdomsCollection, wisdomsCollectionDocId);
//   await updateDoc(docRef, { [newWisdom.wisdomData.id]: { ...newWisdom } });
// };

const addToUserWisdomIdList: AddToUserWisdomIdList = async (uid, wisdomId) => {
  const next_wisdom_to_push_DocRef = doc(
    usersCollection,
    uid,
    'wisdom_ids',
    'next_wisdom_to_push'
  );
  const wisdoms_all_DocRef = doc(
    usersCollection,
    uid,
    'wisdom_ids',
    'wisdoms_all'
  );

  // const wisdoms_all_snapshot = await getDoc(wisdoms_all_DocRef);
  // const wisdoms_all = wisdoms_all_snapshot.data();
  // if (!wisdoms_all) {
  //   console.error(
  //     'wisdoms_all is null or undefined. Sent from firebaseActions.ts -> addToUserWisdomIdList'
  //   );
  //   return;
  // }

  // add wisdomId to the array located at wisdoms_all.ids
  try {
    await updateDoc(wisdoms_all_DocRef, { ids: arrayUnion(wisdomId) });
  } catch (e) {
    console.error(
      'error from firebaseActions.ts -> addToUserWisdomIdList -> add wisdomId to wisdoms_all.ids: ',
      e
    );
  }

  // get the current value stored in next_wisdom_to_push
  let nextWisdomToPushId;
  try {
    const NWTP_snapshot = await getDoc(next_wisdom_to_push_DocRef);
    const next_wisdom_to_push = NWTP_snapshot.data();
    // if (!next_wisdom_to_push) {
    if (typeof next_wisdom_to_push === 'undefined') {
      console.error(
        'next_wisdom_to_push is undefined (does not exist). Sent from firebaseActions.ts -> addToUserWisdomIdList'
      );
      return;
    }
    nextWisdomToPushId = next_wisdom_to_push.wisdomId;
  } catch (e) {
    console.error(
      'error from firebaseActions.ts -> addToUserWisdomIdList -> get the current value stored in next_wisdom_to_push:',
      e
    );
  }

  // if nextWisdomToPushId is null, add this wisdomId, else do nothing
  try {
    if (nextWisdomToPushId === null) {
      await updateDoc(next_wisdom_to_push_DocRef, {
        wisdomId: wisdomId,
      });
    }
  } catch (e) {
    console.error(
      'error from firebaseActions.ts -> addToUserWisdomIdList -> if nextWisdomToPushId is null, add this wisdomId:',
      e
    );
  }
};

// export const addToUserWisdomCollections: AddToUserWisdomCollections = async (
//   username,
//   wisdomId,
//   userWisdomCollections
// ) => {
//   const docRef = doc(usersCollection, usersCollectionDocId);
//   const userWisdomCollectionsPath = `${username}.wisdomCollections`;
//   const nextWisdomToPush = userWisdomCollections.nextWisdomToPush;
//   const defaultCollection = userWisdomCollections.default;

//   if (nextWisdomToPush === null) {
//     await updateDoc(docRef, {
//       [userWisdomCollectionsPath]: {
//         default: [...defaultCollection, wisdomId],
//         nextWisdomToPush: wisdomId,
//       },
//     });
//   } else {
//     await updateDoc(docRef, {
//       [userWisdomCollectionsPath]: {
//         default: [...defaultCollection, wisdomId],
//         nextWisdomToPush: nextWisdomToPush,
//       },
//     });
//   }
// };

export const addNewWisdomToFirestore: AddNewWisdomToFirestore = async (
  newWisdom,
  uid
) => {
  // upload new wisdom to wisdomsCollection
  uploadNewWisdom(newWisdom);

  // upload new wisdomId to user's wisdom_all and maybe to next_wisdom_to_push
  const wisdomId = newWisdom.wisdomData.id;
  addToUserWisdomIdList(uid, wisdomId);
};

// export const addNewWisdomToFirestore: AddNewWisdomToFirestore = async (
//   values,
//   username
// ) => {
//   // create and upload new wisdom to wisdomsCollection
//   const newWisdom = buildNewWisdom(values, username);
//   uploadNewWisdom(newWisdom);

//   // upload new wisdom to user's wisdomCollections
//   const userData = await fetchUserData(username);
//   const userWisdomCollections = userData.wisdomCollections;
//   const wisdomId = newWisdom.wisdomData.id;
//   addToUserWisdomCollections(username, wisdomId, userWisdomCollections);
// };

export const removeFromUserWisdomIds: RemoveFromUserWisdomIds = async (
  uid,
  filteredCollection,
  newNextWisdomToPush
) => {
  if (newNextWisdomToPush !== '') {
    // next_wisdoms_to_push needs to be updated
    const batch = writeBatch(firestoreDB);

    const next_wisdom_to_push_ref = buildUserDocRef(
      uid,
      'wisdom_ids',
      'next_wisdom_to_push'
    );
    batch.set(next_wisdom_to_push_ref, { wisdomId: newNextWisdomToPush });

    const wisdoms_all_ref = buildUserDocRef(uid, 'wisdom_ids', 'wisdoms_all');
    batch.set(wisdoms_all_ref, { ids: [...filteredCollection] });

    try {
      await batch.commit(); // should I check for resolve on the returned promise???
    } catch (e) {
      // TODO: improve error handeling!!!
      console.error(
        'Error from firebaseActions -> removeFromUserWisdomIds: (batch write) ',
        e
      );
    }
  } else {
    // next_wisdoms_to_push DOES NOT needs to be updated
    try {
      const wisdoms_all_ref = buildUserDocRef(uid, 'wisdom_ids', 'wisdoms_all');
      await updateDoc(wisdoms_all_ref, { ids: [...filteredCollection] });
    } catch (e) {
      // TODO: improve error handeling!!!
      console.error(
        'Error from firebaseActions -> removeFromUserWisdomIds: (else block) ',
        e
      );
    }
  }
};

// export const removeFromUserWisdomCollections: RemoveFromUserWisdomCollections =
//   async (
//     uid,
//     filteredCollection,
//     userNextWisdomToPush,
//     newNextWisdomToPush
//   ) => {
//     const docRef = doc(usersCollection, usersCollectionDocId);
//     const userWisdomCollectionsPath = `${uid}.wisdomCollections`;

//     if (newNextWisdomToPush === '') {
//       await updateDoc(docRef, {
//         [userWisdomCollectionsPath]: {
//           default: [...filteredCollection],
//           nextWisdomToPush: userNextWisdomToPush,
//         },
//       });
//     } else {
//       await updateDoc(docRef, {
//         [userWisdomCollectionsPath]: {
//           default: [...filteredCollection],
//           nextWisdomToPush: newNextWisdomToPush,
//         },
//       });
//     }
//   };

export const removeWisdomFromWisdomsCollection: RemoveWisdomFromWisdomsCollection =
  async (wisdomId) => {
    try {
      const docRef = doc(wisdomsCollection, wisdomId);
      await deleteDoc(docRef);
    } catch (e) {
      // TODO: improve error handeling!!!
      console.error(
        'error from firebaseActions.ts -> removeWisdomFromWisdomsCollection: ',
        e
      );
    }
  };

export const deleteWisdomFromFirestore: DeleteWisdomFromFirestore = async (
  uid,
  wisdomId
) => {
  const wisdoms_all_docRef = buildUserDocRef(uid, 'wisdom_ids', 'wisdoms_all');
  const next_wisdom_to_push_docRef = buildUserDocRef(
    uid,
    'wisdom_ids',
    'next_wisdom_to_push'
  );

  /////////////////////
  // const wisdoms_all_snapshot = await getDoc(wisdoms_all_docRef);
  // const next_wisdom_to_push_snapshot = await getDoc(next_wisdom_to_push_docRef);

  let wisdoms_all_snapshot;
  let next_wisdom_to_push_snapshot;

  try {
    wisdoms_all_snapshot = await getDoc(wisdoms_all_docRef);
    next_wisdom_to_push_snapshot = await getDoc(next_wisdom_to_push_docRef);
  } catch (e) {
    // TODO: improve error handeling!!!
    console.error('firebaseActions.ts -> deleteWisdomFromFirestore: ', e);
    return;
  }
  /////////////////////

  const wisdoms_all_data = wisdoms_all_snapshot.data();
  const next_wisdom_to_push_data = next_wisdom_to_push_snapshot.data();

  const userWisdomIds: string[] | [] = wisdoms_all_data
    ? wisdoms_all_data.ids
    : [];
  const userNextWisdomToPush: string = next_wisdom_to_push_data
    ? next_wisdom_to_push_data.wisdomId
    : '';

  let newNextWisdomToPush: string | null = '';

  if (userNextWisdomToPush === wisdomId && userWisdomIds.length > 1) {
    newNextWisdomToPush = getNextWisdomId(wisdomId, userWisdomIds);
  }

  if (userNextWisdomToPush === wisdomId && userWisdomIds.length === 1) {
    newNextWisdomToPush = null;
  }

  const filteredCollection = filterDeletedItem(userWisdomIds, wisdomId);

  removeFromUserWisdomIds(uid, filteredCollection, newNextWisdomToPush);
  removeWisdomFromWisdomsCollection(wisdomId);
};

// export const deleteWisdomFromFirestore: DeleteWisdomFromFirestore = async (
//   username,
//   wisdomId
// ) => {
//   const { wisdomCollections } = await fetchUserData(username);
//   const userNextWisdomToPush = wisdomCollections.nextWisdomToPush;
//   const userWisdoms = wisdomCollections.default;
//   let newNextWisdomToPush: string | null = '';

//   if (userNextWisdomToPush === wisdomId && userWisdoms.length > 1) {
//     newNextWisdomToPush = getNextWisdomId(wisdomId, userWisdoms);
//   }

//   if (userNextWisdomToPush === wisdomId && userWisdoms.length === 1) {
//     newNextWisdomToPush = null;
//   }

//   const filteredCollection = filterDeletedItem(userWisdoms, wisdomId);

//   removeFromUserWisdomCollections(
//     username,
//     filteredCollection,
//     userNextWisdomToPush,
//     newNextWisdomToPush
//   );

//   removeWisdomFromWisdomsCollection(wisdomId);
// };

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
