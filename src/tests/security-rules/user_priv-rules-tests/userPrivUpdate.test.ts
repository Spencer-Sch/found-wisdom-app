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
const myUid: string = 'user_abc';
const theirUid: string = 'user_xyz';
const myAuth: MyAuth = { uid: myUid, email: 'abc@gmail.com' };
const USERS_COLLECTION = 'usersCollection';
const USER_PRIV = 'user_priv';

const user_priv_correct_doc = {
  date_joined: '06/15/22',
  email: 'abc@gmail.com',
  password: 'password',
  uid: 'user_abc',
  username: 'spencer',
  profile_img: '',
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
    .collection(USER_PRIV)
    .doc(USER_PRIV);
};

const getTestDoc: GetTestDoc = (auth, docId) => {
  const db = getFirestore(auth);
  return db
    .collection(USERS_COLLECTION)
    .doc(docId)
    .collection(USER_PRIV)
    .doc(USER_PRIV);
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

describe('Tests for usersCollection/user_priv "allow update" security rules', () => {
  test("unathorized user can't update usersCollection/{userId}/user_priv/user_priv doc", async () => {
    // setup
    const setupDoc = getSetupDoc(myUid);
    await setupDoc.set(user_priv_correct_doc);
    // test
    const testUpdate = getTestDoc(null, myUid);
    await firebase.assertFails(testUpdate.update({ username: 'matthew' }));
  });
  test("authorized user can't update a usersCollection/{userId}/user_priv/user_priv doc under a different userId", async () => {
    // setup
    const setupDoc = getSetupDoc(theirUid);
    await setupDoc.set(user_priv_correct_doc);
    // test
    const testUpdate = getTestDoc(myAuth, myUid);
    await firebase.assertFails(testUpdate.update({ username: 'matthew' }));
  });
  test('authorized user can update their own usersCollection/{userId}/user_priv/user_priv doc as long as the doc meets all criteria', async () => {
    // setup
    const setupDoc = getSetupDoc(myUid);
    await setupDoc.set(user_priv_correct_doc);
    // test
    const testUpdate = getTestDoc(myAuth, myUid);
    await firebase.assertSucceeds(testUpdate.update({ username: 'matthew' }));
  });
  test("authorized user can't update 'date_joined' field in their own usersCollection/{userId}/user_priv/user_priv doc", async () => {
    // setup
    const setupDoc = getSetupDoc(myUid);
    await setupDoc.set(user_priv_correct_doc);
    // test
    const testUpdate = getTestDoc(myAuth, myUid);
    await firebase.assertFails(
      testUpdate.update({ date_joined: '01/01/1970' })
    );
  });
  test("authorized user can't update 'uid' field in their own usersCollection/{userId}/user_priv/user_priv doc", async () => {
    // setup
    const setupDoc = getSetupDoc(myUid);
    await setupDoc.set(user_priv_correct_doc);
    // test
    const testUpdate = getTestDoc(myAuth, myUid);
    await firebase.assertFails(testUpdate.update({ uid: 'user_789' }));
  });
  test("authorized user can't update their own usersCollection/{userId}/user_priv/user_priv doc with unrecognized field(s)", async () => {
    // setup
    const setupDoc = getSetupDoc(myUid);
    await setupDoc.set(user_priv_correct_doc);
    // test
    const testUpdate = getTestDoc(myAuth, myUid);
    await firebase.assertFails(testUpdate.update({ favorite_color: 'green' }));
  });
  test("authorized user can't update their own usersCollection/{userId}/user_priv/user_priv doc 'email' field if it is not a string", async () => {
    // setup
    const setupDoc = getSetupDoc(myUid);
    await setupDoc.set(user_priv_correct_doc);
    // test
    const testUpdate = getTestDoc(myAuth, myUid);
    await firebase.assertFails(testUpdate.update({ email: 123 }));
  });
  test("authorized user can't update their own usersCollection/{userId}/user_priv/user_priv doc 'password' field if it is not a string", async () => {
    // setup
    const setupDoc = getSetupDoc(myUid);
    await setupDoc.set(user_priv_correct_doc);
    // test
    const testUpdate = getTestDoc(myAuth, myUid);
    await firebase.assertFails(testUpdate.update({ password: 123 }));
  });
  test("authorized user can't update their own usersCollection/{userId}/user_priv/user_priv doc 'username' field if it is not a string", async () => {
    // setup
    const setupDoc = getSetupDoc(myUid);
    await setupDoc.set(user_priv_correct_doc);
    // test
    const testUpdate = getTestDoc(myAuth, myUid);
    await firebase.assertFails(testUpdate.update({ username: 123 }));
  });
  test("authorized user can't update their own usersCollection/{userId}/user_priv/user_priv doc 'profile_img' field if it is not a string", async () => {
    // setup
    const setupDoc = getSetupDoc(myUid);
    await setupDoc.set(user_priv_correct_doc);
    // test
    const testUpdate = getTestDoc(myAuth, myUid);
    await firebase.assertFails(testUpdate.update({ profile_img: 123 }));
  });
});

/*====================
 TEST TEARDOWN
====================*/

afterAll(async () => {
  await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});
