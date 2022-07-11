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
const WISDOMS_ALL = 'wisdoms_all';

const wisdoms_all_correct_doc_string = {
  ids: ['123abc'],
};

const wisdoms_all_correct_doc_empty = {
  ids: [],
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
    .doc(WISDOMS_ALL);
};

const getTestDoc: GetTestDoc = (auth, docId) => {
  const db = getFirestore(auth);
  return db
    .collection(USERS_COLLECTION)
    .doc(docId)
    .collection(WISDOM_IDS)
    .doc(WISDOMS_ALL);
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

describe('Tests for usersCollection/{userId}/wisdom_ids/wisdoms_all "allow update" security rules', () => {
  test("unathorized user can't update usersCollection/{userId}/wisdom_ids/wisdoms_all doc", async () => {
    // setup
    const setupDoc = getSetupDoc(myUid);
    await setupDoc.set(wisdoms_all_correct_doc_empty);
    // test
    const testUpdate = getTestDoc(null, myUid);
    await firebase.assertFails(
      testUpdate.update(wisdoms_all_correct_doc_string)
    );
  });
  test("authorized user can't update a usersCollection/{userId}/wisdom_ids/wisdoms_all doc under a different userId", async () => {
    // setup
    const setupDoc = getSetupDoc(theirUid);
    await setupDoc.set(wisdoms_all_correct_doc_empty);
    // test
    const testUpdate = getTestDoc(myAuth, theirUid);
    await firebase.assertFails(
      testUpdate.update(wisdoms_all_correct_doc_string)
    );
  });
  test('authorized user can update their own usersCollection/{userId}/wisdom_ids/wisdoms_all doc from empty array to an array containing a string as long as the doc meets all criteria', async () => {
    // setup
    const setupDoc = getSetupDoc(myUid);
    await setupDoc.set(wisdoms_all_correct_doc_empty);
    // test
    const testUpdate = getTestDoc(myAuth, myUid);
    await firebase.assertSucceeds(
      testUpdate.update(wisdoms_all_correct_doc_string)
    );
  });
  test('authorized user can update their own usersCollection/{userId}/wisdom_ids/wisdoms_all doc array by adding another string as long as the doc meets all criteria', async () => {
    // setup
    const setupDoc = getSetupDoc(myUid);
    await setupDoc.set(wisdoms_all_correct_doc_string);
    // test
    const testUpdate = getTestDoc(myAuth, myUid);
    await firebase.assertSucceeds(
      testUpdate.update({ ids: ['123abc', '890xyz'] })
    );
  });
  test('authorized user can update their own usersCollection/{userId}/wisdom_ids/wisdoms_all doc array to an empty array as long as the doc meets all criteria', async () => {
    // setup
    const setupDoc = getSetupDoc(myUid);
    await setupDoc.set(wisdoms_all_correct_doc_string);
    // test
    const testUpdate = getTestDoc(myAuth, myUid);
    await firebase.assertSucceeds(testUpdate.update({ ids: [] }));
  });
  test("authorized user can't update their own usersCollection/{userId}/wisdom_ids/wisdoms_all doc with unrecognized field(s)", async () => {
    // setup
    const setupDoc = getSetupDoc(myUid);
    await setupDoc.set(wisdoms_all_correct_doc_empty);
    // test
    const testUpdate = getTestDoc(myAuth, myUid);
    await firebase.assertFails(testUpdate.update({ favorite_color: 'green' }));
  });
  test("authorized user can't update their own usersCollection/{userId}/wisdom_ids/wisdoms_all doc 'ids' field to a value other than an array of strings or an empty array", async () => {
    // setup
    const setupDoc = getSetupDoc(myUid);
    await setupDoc.set(wisdoms_all_correct_doc_empty);
    // test
    const testUpdate = getTestDoc(myAuth, myUid);
    await firebase.assertFails(testUpdate.update({ ids: 123 }));
  });
});

/*====================
 TEST TEARDOWN
====================*/

afterAll(async () => {
  await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});
