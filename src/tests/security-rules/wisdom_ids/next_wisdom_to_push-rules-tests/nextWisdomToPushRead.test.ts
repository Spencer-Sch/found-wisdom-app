import { firestore } from '@firebase/testing';
const firebase = require('../../../../../node_modules/@firebase/testing');

/*====================
 CLI COMMANDS
====================*/

// to run emulators:
// $ firebase emulators:start

// to start up the rules test for jest:
// $ npm run test:rules

/*====================
 CONSTANTS
====================*/

const MY_PROJECT_ID = 'foundwisdom-76365';
const myUid: string = 'user_abc';
const theirUid: string = 'user_xyz';
const myAuth: MyAuth = { uid: myUid, email: 'abc@gmail.com' };
const USERS_COLLECTION = 'usersCollection';
const WISDOM_IDS = 'wisdom_ids';
const NEXT_WISDOM_TO_PUSH = 'next_wisdom_to_push';

const NWTP_correct_doc_string = {
  wisdomId: '123abc',
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
type GetAdminFirestore = () => firestore.Firestore;
type GetSetupDoc = (
  docId: string
) => firestore.DocumentReference<firestore.DocumentData>;
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

const getAdminFirestore: GetAdminFirestore = () => {
  return firebase.initializeAdminApp({ projectId: MY_PROJECT_ID }).firestore();
};

const getSetupDoc: GetSetupDoc = (docId) => {
  const admin = getAdminFirestore();
  return admin
    .collection(USERS_COLLECTION)
    .doc(docId)
    .collection(WISDOM_IDS)
    .doc(NEXT_WISDOM_TO_PUSH);
};

const getTestDoc: GetTestDoc = (auth, docId) => {
  const db = getFirestore(auth);
  return db
    .collection(USERS_COLLECTION)
    .doc(docId)
    .collection(WISDOM_IDS)
    .doc(NEXT_WISDOM_TO_PUSH);
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

describe('Tests for usersCollection/{userId}/wisdom_ids/next_wisdom_to_push "allow read" security rules', () => {
  test("unauthorized user can't read from usersCollection/{userId}/wisdom_ids/next_wisdom_to_push", async () => {
    // setup
    const setupDoc = getSetupDoc(myUid);
    await setupDoc.set(NWTP_correct_doc_string);
    // test
    const testRead = getTestDoc(null, myUid);
    await firebase.assertFails(testRead.get());
  });
  test('authorized user can read their own usersCollection/{userId}/wisdom_ids/next_wisdom_to_push doc', async () => {
    // setup
    const setupDoc = getSetupDoc(myUid);
    await setupDoc.set(NWTP_correct_doc_string);
    // test
    const testRead = getTestDoc(myAuth, myUid);
    await firebase.assertSucceeds(testRead.get());
  });
  test("authorized user can't read another user's usersCollection/{userId}/wisdom_ids/next_wisdom_to_push doc", async () => {
    // setup
    const setupDoc = getSetupDoc(theirUid);
    await setupDoc.set(NWTP_correct_doc_string);
    // test
    const testRead = getTestDoc(myAuth, theirUid);
    await firebase.assertFails(testRead.get());
  });
});

/*====================
 TEST TEARDOWN
====================*/

afterAll(async () => {
  await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});
