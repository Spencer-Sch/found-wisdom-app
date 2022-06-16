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
const USER_CATEGORIES = 'user_categories';

const user_categories_correct_doc = {
  userCategories: [],
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
    .doc(USER_CATEGORIES);
};

const getTestDoc: GetTestDoc = (auth, docId) => {
  const db = getFirestore(auth);
  return db
    .collection(USERS_COLLECTION)
    .doc(docId)
    .collection(WISDOM_IDS)
    .doc(USER_CATEGORIES);
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

describe('Tests for usersCollection/{userId}/wisdom_ids/user_categories "allow update" security rules', () => {
  test("unathorized user can't update usersCollection/{userId}/wisdom_ids/user_categories doc", async () => {
    // setup
    const setupDoc = getSetupDoc(myUid);
    await setupDoc.set(user_categories_correct_doc);
    // test
    const testUpdate = getTestDoc(null, myUid);
    await firebase.assertFails(
      testUpdate.update({ userCategories: ['newId'] })
    );
  });
  test("authorized user can't update a usersCollection/{userId}/wisdom_ids/user_categories doc under a different userId", async () => {
    // setup
    const setupDoc = getSetupDoc(theirUid);
    await setupDoc.set(user_categories_correct_doc);
    // test
    const testUpdate = getTestDoc(myAuth, theirUid);
    await firebase.assertFails(
      testUpdate.update({ userCategories: ['newId'] })
    );
  });
  test('authorized user can update their own usersCollection/{userId}/wisdom_ids/user_categories doc as long as the doc meets all criteria', async () => {
    // setup
    const setupDoc = getSetupDoc(myUid);
    await setupDoc.set(user_categories_correct_doc);
    // test
    const testUpdate = getTestDoc(myAuth, myUid);
    await firebase.assertSucceeds(
      testUpdate.update({ userCategories: ['newId'] })
    );
  });
  test('authorized user can update their own usersCollection/{userId}/wisdom_ids/user_categories doc back to an empty array as long as the doc meets all criteria', async () => {
    // setup
    const setupDoc = getSetupDoc(myUid);
    await setupDoc.set({ userCategories: ['currentId'] });
    // test
    const testUpdate = getTestDoc(myAuth, myUid);
    await firebase.assertSucceeds(testUpdate.update({ userCategories: [] }));
  });
  test("authorized user can't update their own usersCollection/{userId}/wisdom_ids/user_categories doc with unrecognized field(s)", async () => {
    // setup
    const setupDoc = getSetupDoc(myUid);
    await setupDoc.set(user_categories_correct_doc);
    // test
    const testUpdate = getTestDoc(myAuth, myUid);
    await firebase.assertFails(testUpdate.update({ favorite_color: 'green' }));
  });
  test("authorized user can't update their own usersCollection/{userId}/wisdom_ids/user_categories doc 'userCategories' field to a value that is not an array", async () => {
    // setup
    const setupDoc = getSetupDoc(myUid);
    await setupDoc.set(user_categories_correct_doc);
    // test
    const testUpdate = getTestDoc(myAuth, myUid);
    await firebase.assertFails(testUpdate.update({ userCategories: 123 }));
  });
});

/*====================
 TEST TEARDOWN
====================*/

afterAll(async () => {
  await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});
