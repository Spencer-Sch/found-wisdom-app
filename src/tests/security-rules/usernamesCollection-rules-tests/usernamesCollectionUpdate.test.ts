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
const theirUid: string = '890xyz';
const myAuth: Auth = {
  uid: myUid,
  name: 'spencer',
  email: 'abc@gmail.com',
};
const theirAuth: Auth = {
  uid: theirUid,
  name: 'calvin',
  email: 'xyz@gmail.com',
};
const USERNAMES_COLLECTION = 'usernamesCollection';

const username_correct_doc = {
  uid: '123abc',
};

/*====================
 INTERFACES
====================*/

interface Auth {
  uid: string;
  name: string;
  email: string;
}

/*====================
 TYPES
====================*/

type GetFirestore = (auth: Auth | null) => firestore.Firestore;
type GetAdminFirestore = () => firestore.Firestore;
type GetSetupDoc = (
  docId: string
) => firestore.DocumentReference<firestore.DocumentData>;
type GetTestDoc = (
  auth: Auth | null,
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

describe('Tests for usernamesCollection "allow update" security rules', () => {
  test("unauthorized user can't update a username doc", async () => {
    // setup
    const setupDoc = getSetupDoc(myUsername);
    await setupDoc.set(username_correct_doc);
    // test
    const testUpdate = getTestDoc(null, myUsername);
    await firebase.assertFails(
      testUpdate.update({
        uid: '1234abcd',
      })
    );
  });

  test("authorized user can't update a username doc for another user's username", async () => {
    // setup
    const setupDoc = getSetupDoc(myUsername);
    await setupDoc.set(username_correct_doc);
    // test
    const testUpdate = getTestDoc(theirAuth, myUsername);
    await firebase.assertFails(
      testUpdate.update({
        uid: '1234abcd',
      })
    );
  });

  test("authorized user can't update their own wisdom", async () => {
    // setup
    const setupDoc = getSetupDoc(myUsername);
    await setupDoc.set(username_correct_doc);
    // test
    const testUpdate = getTestDoc(myAuth, myUsername);
    await firebase.assertFails(
      testUpdate.update({
        uid: '1234abcd',
      })
    );
  });
});

/*====================
 TEST TEARDOWN
====================*/

afterAll(async () => {
  await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});
