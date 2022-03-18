import { firestoreDB, wisdomsCollectionDocId } from '../firebase/firebase';
import { doc, getDocs, updateDoc, collection, query } from 'firebase/firestore';

import { WisdomObj } from '../models/models';

/////////////////////////////////////
// CONSTANTS
/////////////////////////////////////

const USERS_COLLECTION = 'usersCollection';
const WISDOMS_COLLECTION = 'wisdomsCollection';

const wisdomsCollection = collection(firestoreDB, WISDOMS_COLLECTION);
const usersCollection = collection(firestoreDB, USERS_COLLECTION);

const Q_WISDOM_COLLECTION = query(wisdomsCollection);
const Q_USER_COLLECTION = query(usersCollection);

/////////////////////////////////////
// INTERFACES
/////////////////////////////////////

interface UserData {
  userId: string;
  userInfo: {
    username: string;
    userEmail: string;
    userPassword: string;
    dateJoined: string;
  };
  wisdomCollections: {
    default: string[];
    userGeneratedCollection?: string[];
  };
}

// interface UserWisdom {
//   // keep for potential future use. rename for clarity.
//   createdBy: string;
//   wisdomData: {
//     date: string;
//     id: string;
//     next: boolean;
//     source: string;
//     text: string;
//   };
// }

/////////////////////////////////////
// TYPES
/////////////////////////////////////

type FetchUserData = (userEmail: string) => Promise<UserData>;
type FetchWisdomsById = (wisdomIds: string[]) => Promise<WisdomObj[] | null>;
type FetchCurrentWisdom = (wisdomid: string) => Promise<WisdomObj | null>;
type UploadEditedWisdom = (editedWisdom: WisdomObj) => void;

/////////////////////////////////////
// FIREBASE FUNCTIONS
/////////////////////////////////////

////////////////////////////////////
// THIS CODE IS TO PRE-LOAD WISDOMS SO I DON'T
// HAVE TO KEEP DOING IT MANUALLY DURING DEVELOPMENT
////////////////////////////////////

// import { wisdomData } from './wisdomData';

// const loadWisdoms = () => {
//   const wisdomsToUpload: WisdomObj[] = getStoredWisdoms();
//   wisdomData.forEach((item) => {
//     wisdomsToUpload.push(item);
//   });
//   localStorage.setItem('myWisdoms', JSON.stringify(wisdomsToUpload));
// };
// loadWisdoms();

////////////////////////////////////

export const fetchUserData: FetchUserData = (userEmail) => {
  // console.log('fetchUserData running...');
  return getDocs(Q_USER_COLLECTION)
    .then((snapshot) => {
      // console.log('processing data checkpoint 1');
      const userDocs = snapshot.docs.map((item) => ({
        ...item.data(),
      }));
      return userDocs[0][userEmail];
    })
    .catch((error) => {
      console.error(error);
    });
};

export const fetchWisdomsById: FetchWisdomsById = (wisdomIds) => {
  // console.log('fetchWisdomsById running...');
  return getDocs(Q_WISDOM_COLLECTION)
    .then((snapshot) => {
      // console.log('processing data checkpoint 1');
      const wisdomsDoc = snapshot.docs.map((item) => ({
        ...item.data(),
      }));

      const userWisdoms: WisdomObj[] | [] = wisdomIds.map((item) => {
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
  console.log('fetchCurrentWisdom running...');

  return getDocs(Q_WISDOM_COLLECTION)
    .then((snapshot) => {
      // console.log('processing data checkpoint 1');
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
  console.log('uploadEditedWisdom running...');

  const wisdomPath = `${editedWisdom.id}.wisdomData`;

  const docRef = doc(wisdomsCollection, wisdomsCollectionDocId);
  ///////////////////////
  // This should work now. Double check once firestore lets me write/read again
  await updateDoc(docRef, { [`${wisdomPath}`]: { ...editedWisdom } });
  ///////////////////////
};

export const firebaseActions = 'firebaseActions placeholder';

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
