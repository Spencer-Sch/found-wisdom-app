import { firestoreDB } from '../firebase/firebase';
import { getDocs, collection, query } from 'firebase/firestore';

import { WisdomObj } from '../models/models';

/////////////////////////////////////
// CONSTANTS
/////////////////////////////////////

const USERS_COLLECTION = 'usersCollection';
const WISDOMS_COLLECTION = 'wisdomsCollection';

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

interface UserWisdom {
  createdBy: string;
  wisdomData: {
    date: string;
    id: string;
    next: boolean;
    source: string;
    text: string;
  };
}

/////////////////////////////////////
// TYPES
/////////////////////////////////////

type FetchUserData = (userEmail: string) => Promise<UserData>;
type FetchWisdomsById = (wisdomIds: string[]) => Promise<WisdomObj[] | null>;

/////////////////////////////////////
// FIREBASE FUNCTIONS
/////////////////////////////////////

export const fetchUserData: FetchUserData = (userEmail: string) => {
  console.log('fetchUserData running...');
  const usersCollection = collection(firestoreDB, USERS_COLLECTION);
  const q = query(usersCollection);

  return getDocs(q)
    .then((snapshot) => {
      console.log('processing data checkpoint 1');
      const userDocs = snapshot.docs.map((item) => ({
        ...item.data(),
      }));
      return userDocs[0][userEmail];
    })
    .catch((error) => {
      console.error(error);
    });
};

export const fetchWisdomsById: FetchWisdomsById = (wisdomIds: string[]) => {
  console.log('fetchWisdomsById running...');
  const wisdomsCollection = collection(firestoreDB, WISDOMS_COLLECTION);
  const q = query(wisdomsCollection);

  return getDocs(q)
    .then((snapshot) => {
      console.log('processing data checkpoint 1');
      const wisdomsDoc = snapshot.docs.map((item) => ({
        ...item.data(),
      }));

      const userWisdoms: WisdomObj[] | [] = wisdomIds.map((item) => {
        return wisdomsDoc[0][item]['wisdomData'];
      });

      return userWisdoms.length > 0 ? userWisdoms : null;
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
};

/////////////////////////////////////
// turn into a function to be imported into the useEffect in WisdomPageWrapper
/////////////////////////////////////
// useEffect(() => {
//   console.log('WisdomPage useEffect running...');

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
