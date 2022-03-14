/////////////////////////////////////
// FIREBASE FUNCTIONS
/////////////////////////////////////

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

/////////////////////////////////////
// LOCAL STORAGE FUNCTIONS
/////////////////////////////////////

//////////////////////////////////////////
// const getStoredWisdoms = () => {
//   const wisdomsString: string | null = localStorage.getItem('myWisdoms');
//   if (wisdomsString) {
//     return JSON.parse(wisdomsString);
//   } else {
//     return [];
//   }
// };
//////////////////////////////////////////

//////////////////////////////////////////
// localStorage
// const [storedWisdoms, setStoredWisdoms] = useState<WisdomObj[]>(
//   getStoredWisdoms()
// );
//////////////////////////////////////////

export const firebaseActions = 'firebaseActions placeholder';
