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

const NWTP_correct_doc_null = {
  wisdomId: null,
};

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

describe('Tests for usersCollection/{userId}/wisdom_ids/next_wisdom_to_push "allow update" security rules', () => {
  test("unathorized user can't update usersCollection/{userId}/wisdom_ids/next_wisdom_to_push doc", async () => {
    // setup
    const setupDoc = getSetupDoc(myUid);
    await setupDoc.set(NWTP_correct_doc_null);
    // test
    const testUpdate = getTestDoc(null, myUid);
    await firebase.assertFails(testUpdate.update({ wisdomId: 'nextWisdomId' }));
  });
  test("authorized user can't update a usersCollection/{userId}/wisdom_ids/next_wisdom_to_push doc under a different userId", async () => {
    // setup
    const setupDoc = getSetupDoc(theirUid);
    await setupDoc.set(NWTP_correct_doc_null);
    // test
    const testUpdate = getTestDoc(myAuth, theirUid);
    await firebase.assertFails(testUpdate.update({ wisdomId: 'nextWisdomId' }));
  });
  test('authorized user can update their own usersCollection/{userId}/wisdom_ids/next_wisdom_to_push doc from null to a string as long as the doc meets all criteria', async () => {
    // setup
    const setupDoc = getSetupDoc(myUid);
    await setupDoc.set(NWTP_correct_doc_null);
    // test
    const testUpdate = getTestDoc(myAuth, myUid);
    await firebase.assertSucceeds(testUpdate.update(NWTP_correct_doc_string));
  });
  test('authorized user can update their own usersCollection/{userId}/wisdom_ids/next_wisdom_to_push doc from a string to another string as long as the doc meets all criteria', async () => {
    // setup
    const setupDoc = getSetupDoc(myUid);
    await setupDoc.set(NWTP_correct_doc_string);
    // test
    const testUpdate = getTestDoc(myAuth, myUid);
    await firebase.assertSucceeds(testUpdate.update({ wisdomId: '890xyz' }));
  });
  test('authorized user can update their own usersCollection/{userId}/wisdom_ids/next_wisdom_to_push doc from a string to null as long as the doc meets all criteria', async () => {
    // setup
    const setupDoc = getSetupDoc(myUid);
    await setupDoc.set(NWTP_correct_doc_string);
    // test
    const testUpdate = getTestDoc(myAuth, myUid);
    await firebase.assertSucceeds(testUpdate.update({ wisdomId: null }));
  });
  test("authorized user can't update their own usersCollection/{userId}/wisdom_ids/next_wisdom_to_push doc with unrecognized field(s)", async () => {
    // setup
    const setupDoc = getSetupDoc(myUid);
    await setupDoc.set(NWTP_correct_doc_null);
    // test
    const testUpdate = getTestDoc(myAuth, myUid);
    await firebase.assertFails(testUpdate.update({ favorite_color: 'green' }));
  });
  test("authorized user can't update their own usersCollection/{userId}/wisdom_ids/next_wisdom_to_push doc 'wisdomId' field to a value that is not either a string or null", async () => {
    // setup
    const setupDoc = getSetupDoc(myUid);
    await setupDoc.set(NWTP_correct_doc_null);
    // test
    const testUpdate = getTestDoc(myAuth, myUid);
    await firebase.assertFails(testUpdate.update({ wisdomId: 123 }));
  });
});

/*====================
 TEST TEARDOWN
====================*/

afterAll(async () => {
  await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});
