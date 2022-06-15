import { firestore } from '@firebase/testing';
const firebase = require('../../../../node_modules/@firebase/testing');

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
const myUid: string = 'user_abc';
const theirUid: string = 'user_xyz';
const myAuth: MyAuth = { uid: myUid, email: 'abc@gmail.com' };
const USERS_COLLECTION = 'usersCollection';

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
  test("unauthorized user can't read from usersCollection", async () => {
    // setup
    const admin = getAdminFirestore();
    const docId = myUid;
    const setupDoc = admin.collection(USERS_COLLECTION).doc(docId);
    await setupDoc.set({ testData: 'testData' });

    // test
    const db = getFirestore(null);
    const testRead = db.collection(USERS_COLLECTION).doc(docId);
    await firebase.assertFails(testRead.get());
  });

  test("authorized user can't read another user's doc", async () => {
    // setup
    const admin = getAdminFirestore();
    const setupDoc = admin.collection(USERS_COLLECTION).doc(theirUid);
    await setupDoc.set({ testData: 'testData' });

    // test
    const db = getFirestore(myAuth);
    const testRead = db.collection(USERS_COLLECTION).doc(theirUid);
    await firebase.assertFails(testRead.get());
  });

  test('authorized user can read their own doc', async () => {
    // setup
    const admin = getAdminFirestore();
    const setupDoc = admin.collection(USERS_COLLECTION).doc(myUid);
    await setupDoc.set({ testData: 'testData' });

    // test
    const db = getFirestore(myAuth);
    const testRead = db.collection(USERS_COLLECTION).doc(myUid);
    await firebase.assertSucceeds(testRead.get());
  });

  test("unauthorized user can't write to usersCollection", async () => {
    const db = getFirestore(null);
    const testWrite = db.collection(USERS_COLLECTION).doc('non_user');
    await firebase.assertFails(testWrite.set({ testData: 'testData' }));
  });

  test("authorized user can't write to another user's doc", async () => {
    // setup
    const admin = getAdminFirestore();
    const setupDoc = admin.collection(USERS_COLLECTION).doc(theirUid);
    await setupDoc.set({ testData: 'testData' });

    // test
    const db = getFirestore(myAuth);
    const testWrite = db.collection(USERS_COLLECTION).doc(theirUid);
    await firebase.assertFails(testWrite.set({ newData: 'newData' }));
  });

  test('authorized user can write to their own doc', async () => {
    // setup
    const admin = getAdminFirestore();
    const setupDoc = admin.collection(USERS_COLLECTION).doc(myUid);
    await setupDoc.set({ testData: 'testData' });

    // test
    const db = getFirestore(myAuth);
    const testWrite = db.collection(USERS_COLLECTION).doc(myUid);
    await firebase.assertSucceeds(testWrite.set({ newData: 'newData' }));
  });
});

/*====================
 TEST TEARDOWN
====================*/

afterAll(async () => {
  await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});
