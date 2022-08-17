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
const myAuth: MyAuth = {
  uid: myUid,
  name: 'spencer',
  email: 'abc@gmail.com',
};
const USERNAMES_COLLECTION = 'usernamesCollection';

const username_correct_doc = {
  uid: '123abc',
};

/*====================
 INTERFACES
====================*/

interface MyAuth {
  uid: string;
  name: string;
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

describe('Tests for usernamesCollection "allow create" security rules', () => {
  test("unauthorized user can't write to usernamesCollection", async () => {
    const testWrite = getTestDoc(null, myUsername);
    await firebase.assertFails(testWrite.set(username_correct_doc));
  });

  test("authorized user can't create a username doc if 'uid' field doesn't match their uid", async () => {
    const testWrite = getTestDoc(myAuth, myUsername);
    await firebase.assertFails(
      testWrite.set({
        uid: '890xyz', // uid does not match 'uid' from auth object
      })
    );
  });

  // This test is attemtping to test the security rule authUsernameMatchesDocName().
  // with the security rule inactive this test was failing.
  // See Issue #1 in known_issues_log.md for details
  // test("authorized user can't create a username doc if 'docId' doesn't match their username", async () => {
  //   const testWrite = getTestDoc(myAuth, 'calvin');
  //   await firebase.assertFails(testWrite.set(username_correct_doc));
  // });

  test("authorized user can create a username doc if 'docId' matches their username, 'uid' matches their uid, and all required fields are present and of valid type", async () => {
    const testWrite = getTestDoc(myAuth, myUsername);
    await firebase.assertSucceeds(testWrite.set(username_correct_doc));
  });

  test("authorized user can't create a username doc if 'uid' field is missing", async () => {
    const testWrite = getTestDoc(myAuth, myUsername);
    await firebase.assertFails(
      testWrite.set({
        // uid: myUid, missing field
      })
    );
  });

  test("authorized user can't create a username doc if extra fields are present", async () => {
    const testWrite = getTestDoc(myAuth, myUsername);
    await firebase.assertFails(
      testWrite.set({
        uid: myUid,
        favoriteColor: 'green', // extra field
      })
    );
  });

  test("authorized user can't create a username doc if 'uid' field is an empty string", async () => {
    const testWrite = getTestDoc(myAuth, myUsername);
    await firebase.assertFails(
      testWrite.set({
        uid: '',
      })
    );
  });

  test("authorized user can't create a username doc if 'uid' field is of wrong type", async () => {
    const testWrite = getTestDoc(myAuth, myUsername);
    await firebase.assertFails(
      testWrite.set({
        uid: 123, // wrong type
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
