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
 CONSTANTS
====================*/

const MY_PROJECT_ID = 'foundwisdom-76365';
const myUsername: string = 'spencer';
const myUid: string = '123abc';
const myAuth: MyAuth = { uid: myUid, email: 'abc@gmail.com' };
const USERNAMES_COLLECTION = 'usernamesCollection';

const username_correct_doc = {
  uid: '123abc',
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
  return admin.collection(USERNAMES_COLLECTION).doc(docId);
};

const getTestDoc: GetTestDoc = (auth, docId) => {
  const db = getFirestore(auth);
  return db.collection(USERNAMES_COLLECTION).doc(docId);
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

describe('Tests for usernamesCollection "allow read" security rules', () => {
  test("unauthorized user can't read from usernamesCollection", async () => {
    // setup
    const setupDoc = getSetupDoc(myUsername);
    await setupDoc.set(username_correct_doc);
    // test
    const testRead = getTestDoc(null, myUsername);
    await firebase.assertFails(testRead.get());
  });

  test("authorized user can't read from usernamesCollection", async () => {
    // setup
    const setupDoc = getSetupDoc(myUsername);
    await setupDoc.set(username_correct_doc);
    // test
    const testRead = getTestDoc(myAuth, myUsername);
    await firebase.assertFails(testRead.get());
  });
});

/*====================
 TEST TEARDOWN
====================*/

afterAll(async () => {
  await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});
