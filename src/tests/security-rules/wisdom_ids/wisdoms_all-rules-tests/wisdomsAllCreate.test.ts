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

describe('Tests for usersCollection/{userId}/wisdom_ids/wisdoms_all "allow create" security rules', () => {
  test("unathorized user can't create usersCollection/{userId}/wisdom_ids/wisdoms_all doc", async () => {
    const testCreate = getTestDoc(null, myUid);
    await firebase.assertFails(testCreate.set(wisdoms_all_correct_doc_empty));
  });
  test("authorized user can't create a usersCollection/{userId}/wisdom_ids/wisdoms_all doc under a different userId", async () => {
    const testCreate = getTestDoc(myAuth, theirUid);
    await firebase.assertFails(testCreate.set(wisdoms_all_correct_doc_empty));
  });
  test('authorized user can create their own usersCollection/{userId}/wisdom_ids/wisdoms_all doc as long as the doc meets all criteria', async () => {
    const testCreate = getTestDoc(myAuth, myUid);
    await firebase.assertSucceeds(
      testCreate.set(wisdoms_all_correct_doc_empty)
    );
  });
  test("authorized user can't create their own usersCollection/{userId}/wisdom_ids/wisdoms_all doc with unrecognized field(s)", async () => {
    const testDoc = {
      ids: [],
      favorite_color: 'green', // unrecognized field
    };
    const testCreate = getTestDoc(myAuth, myUid);
    await firebase.assertFails(testCreate.set(testDoc));
  });
  test("authorized user can't create usersCollection/{userId}/wisdom_ids/wisdoms_all doc if 'ids' field is missing", async () => {
    const testDoc = {
      // ids: [], is missing
    };
    const testCreate = getTestDoc(myAuth, myUid);
    await firebase.assertFails(testCreate.set(testDoc));
  });
  test("authorized user can't create usersCollection/{userId}/wisdom_ids/wisdoms_all doc if 'ids' field is not an empty array", async () => {
    const testCreate = getTestDoc(myAuth, myUid);
    await firebase.assertFails(testCreate.set(wisdoms_all_correct_doc_string));
  });
});

/*====================
 TEST TEARDOWN
====================*/

afterAll(async () => {
  await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});
