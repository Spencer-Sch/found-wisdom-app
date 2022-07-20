import { firestore } from '@firebase/testing';
const firebase = require('../../node_modules/@firebase/testing');

/*====================
 CLI COMMANDS
====================*/

// to run emulators:
// $ firebase emulators:start

// to start up the Functions test for jest:
// $ npm run test:funcs

/*====================
 CONSTANTS
====================*/

const MY_PROJECT_ID = 'foundwisdom-76365';
const myUid: string = 'user_abc';
// const theirUid: string = 'user_xyz';
const myAuth: MyAuth = { uid: myUid, email: 'abc@gmail.com' };
const USERS_COLLECTION = 'usersCollection';
const USER_PUB = 'user_pub';

const user_pub_correct_doc = {
  date_joined: '06/15/22',
  username: 'spencer',
  profile_img: '',
};

/*====================
 INTERFACES
====================*/

interface MyAuth {
  uid: string;
  email: string;
}

/*====================
 TYPES
====================*/

type GetFirestore = (auth: MyAuth | null) => firestore.Firestore;
type GetTestDoc = (
  auth: MyAuth | null,
  docId: string
) => firestore.DocumentReference<firestore.DocumentData>;

/*====================
 HELPER FUNCTIONS
====================*/

const getFirestore: GetFirestore = (auth) => {
  return firebase
    .initializeTestApp({ projectId: MY_PROJECT_ID, auth: auth })
    .firestore();
};

const getTestDoc: GetTestDoc = (auth, docId) => {
  const db = getFirestore(auth);
  return db
    .collection(USERS_COLLECTION)
    .doc(docId)
    .collection(USER_PUB)
    .doc(USER_PUB);
};

/*====================
 TEST SETUP
====================*/

// beforeEach(async () => {
//   await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
// });

/*====================
 TESTS
====================*/

describe('Cloud Functions Tests', () => {
  test('Unique Username function test', async () => {
    const testCreate = getTestDoc(myAuth, myUid);
    await testCreate.set(user_pub_correct_doc);
    // await firebase.assertFails(testCreate.set(user_pub_correct_doc));
  });
});

/*====================
 TEST TEARDOWN
====================*/

// afterAll(async () => {
//   await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
// });
