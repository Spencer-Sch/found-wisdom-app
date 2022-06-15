import { firestore } from '@firebase/testing';
const firebase = require('../../../node_modules/@firebase/testing');

/*====================
 CLI COMMANDS
====================*/

// to run emulators:
// $ firebase emulators:start

// to start up the rules test for jest:
// $ npm run test:rules

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
type GetAdminFirestore = () => firestore.Firestore;

/*====================
 CONSTANTS
====================*/

const MY_PROJECT_ID = 'foundwisdom-76365';
// const myId = 'user_abc';
// const theirId = 'user_xyz';
// const myAuth = { uid: myId, email: 'abc@gmail.com' };
const myUid: string = 'user_abc';
const theirId: string = 'user_xyz';
const myAuth: MyAuth = { uid: myUid, email: 'abc@gmail.com' };

/*====================
 HELPER FUNCTIONS
====================*/

const getFirestore: GetFirestore = (auth) => {
  return firebase
    .initializeTestApp({ projectId: MY_PROJECT_ID, auth: auth })
    .firestore();
};

const getAdminFirestore: GetAdminFirestore = () => {
  return firebase.initializeAdminApp({ projectId: MY_PROJECT_ID }).firestore();
};

/*====================
 TEST SETUP
====================*/

beforeEach(async () => {
  await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});

/*====================
 TESTS
====================*/

describe('Tests for usersCollection security rules', () => {
  test('unauthorized user should not be able to read from usersCollection', async () => {
    // setup usersCollection collection in emulator
    const admin = getAdminFirestore();
    const docId = myUid;
    const setupDoc = admin.collection('usersCollection').doc(docId);
    await setupDoc.set({ testData: 'testData' });

    // test code
    const db = getFirestore(null);
    const testRead = db.collection('usersCollection').doc(docId);
    await firebase.assertFails(testRead.get());
  });
});

/*====================
 TEST TEARDOWN
====================*/

afterAll(async () => {
  await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});
