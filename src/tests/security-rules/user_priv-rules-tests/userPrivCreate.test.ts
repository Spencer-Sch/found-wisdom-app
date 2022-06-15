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
// type GetAdminFirestore = () => firestore.Firestore;

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
 HELPER FUNCTIONS
====================*/

const getFirestore: GetFirestore = (auth) => {
  return firebase
    .initializeTestApp({ projectId: MY_PROJECT_ID, auth: auth })
    .firestore();
};

// const getAdminFirestore: GetAdminFirestore = () => {
//   return firebase.initializeAdminApp({ projectId: MY_PROJECT_ID }).firestore();
// };

/*====================
 TEST SETUP
====================*/

beforeEach(async () => {
  await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});

/*====================
 TESTS
====================*/

describe('Tests for usersCollection/user_priv "allow create" security rules', () => {
  test("unathorized user can't create usersCollection/{userId}/user_priv/user_priv doc", async () => {
    const db = getFirestore(null);
    const testCreate = db
      .collection(USERS_COLLECTION)
      .doc(myUid)
      .collection(USER_PRIV)
      .doc(USER_PRIV);
    await firebase.assertFails(testCreate.set({ testData: 'testData' }));
  });
  test("authorized user can't create a usersCollection/{userId}/user_priv/user_priv doc under a different userId", async () => {
    const db = getFirestore(myAuth);
    const testWrite = db
      .collection(USERS_COLLECTION)
      .doc(theirUid)
      .collection(USER_PRIV)
      .doc(USER_PRIV);
    await firebase.assertFails(testWrite.set({ testData: 'testData' }));
  });
  test('authorized user can create their own usersCollection/{userId}/user_priv/user_priv doc as long as the doc meets all criteria', async () => {
    const db = getFirestore(myAuth);
    const testWrite = db
      .collection(USERS_COLLECTION)
      .doc(myUid)
      .collection(USER_PRIV)
      .doc(USER_PRIV);
    await firebase.assertSucceeds(testWrite.set(user_priv_correct_doc));
  });
  test("authorized user can't create usersCollection/{userId}/user_priv/user_priv doc if 'date_joined' field is missing", async () => {
    const testDoc = {
      // date_joined: '06/15/22', is missing
      email: 'abc@gmail.com',
      password: 'password',
      uid: 'user_abc',
      username: 'spencer',
      profile_img: '',
    };
    const db = getFirestore(myAuth);
    const testWrite = db
      .collection(USERS_COLLECTION)
      .doc(myUid)
      .collection(USER_PRIV)
      .doc(USER_PRIV);
    await firebase.assertFails(testWrite.set(testDoc));
  });
  test("authorized user can't create usersCollection/{userId}/user_priv/user_priv doc if 'email' field is missing", async () => {
    const testDoc = {
      date_joined: '06/15/22',
      // email: 'abc@gmail.com', is missing
      password: 'password',
      uid: 'user_abc',
      username: 'spencer',
      profile_img: '',
    };
    const db = getFirestore(myAuth);
    const testWrite = db
      .collection(USERS_COLLECTION)
      .doc(myUid)
      .collection(USER_PRIV)
      .doc(USER_PRIV);
    await firebase.assertFails(testWrite.set(testDoc));
  });
  test("authorized user can't create usersCollection/{userId}/user_priv/user_priv doc if 'password' field is missing", async () => {
    const testDoc = {
      date_joined: '06/15/22',
      email: 'abc@gmail.com',
      // password: 'password', is missing
      uid: 'user_abc',
      username: 'spencer',
      profile_img: '',
    };
    const db = getFirestore(myAuth);
    const testWrite = db
      .collection(USERS_COLLECTION)
      .doc(myUid)
      .collection(USER_PRIV)
      .doc(USER_PRIV);
    await firebase.assertFails(testWrite.set(testDoc));
  });
  test("authorized user can't create usersCollection/{userId}/user_priv/user_priv doc if 'uid' field is missing", async () => {
    const testDoc = {
      date_joined: '06/15/22',
      email: 'abc@gmail.com',
      password: 'password',
      // uid: 'user_abc', is missing
      username: 'spencer',
      profile_img: '',
    };
    const db = getFirestore(myAuth);
    const testWrite = db
      .collection(USERS_COLLECTION)
      .doc(myUid)
      .collection(USER_PRIV)
      .doc(USER_PRIV);
    await firebase.assertFails(testWrite.set(testDoc));
  });
  test("authorized user can't create usersCollection/{userId}/user_priv/user_priv doc if 'username' field is missing", async () => {
    const testDoc = {
      date_joined: '06/15/22',
      email: 'abc@gmail.com',
      password: 'password',
      uid: 'user_abc',
      // username: 'spencer', is missing
      profile_img: '',
    };
    const db = getFirestore(myAuth);
    const testWrite = db
      .collection(USERS_COLLECTION)
      .doc(myUid)
      .collection(USER_PRIV)
      .doc(USER_PRIV);
    await firebase.assertFails(testWrite.set(testDoc));
  });
  test("authorized user can't create usersCollection/{userId}/user_priv/user_priv doc if 'profile_img' field is missing", async () => {
    const testDoc = {
      date_joined: '06/15/22',
      email: 'abc@gmail.com',
      password: 'password',
      uid: 'user_abc',
      username: 'spencer',
      // profile_img: '', is missing
    };
    const db = getFirestore(myAuth);
    const testWrite = db
      .collection(USERS_COLLECTION)
      .doc(myUid)
      .collection(USER_PRIV)
      .doc(USER_PRIV);
    await firebase.assertFails(testWrite.set(testDoc));
  });
  test("authorized user can't create usersCollection/{userId}/user_priv/user_priv doc if 'date_joined' field is not a string", async () => {
    const testDoc = {
      date_joined: 123,
      email: 'abc@gmail.com',
      password: 'password',
      uid: 'user_abc',
      username: 'spencer',
      profile_img: '',
    };
    const db = getFirestore(myAuth);
    const testWrite = db
      .collection(USERS_COLLECTION)
      .doc(myUid)
      .collection(USER_PRIV)
      .doc(USER_PRIV);
    await firebase.assertFails(testWrite.set(testDoc));
  });
  test("authorized user can't create usersCollection/{userId}/user_priv/user_priv doc if 'email' field is not a string", async () => {
    const testDoc = {
      date_joined: '06/15/22',
      email: 123,
      password: 'password',
      uid: 'user_abc',
      username: 'spencer',
      profile_img: '',
    };
    const db = getFirestore(myAuth);
    const testWrite = db
      .collection(USERS_COLLECTION)
      .doc(myUid)
      .collection(USER_PRIV)
      .doc(USER_PRIV);
    await firebase.assertFails(testWrite.set(testDoc));
  });
  test("authorized user can't create usersCollection/{userId}/user_priv/user_priv doc if 'password' field is not a string", async () => {
    const testDoc = {
      date_joined: '06/15/22',
      email: 'abc@gmail.com',
      password: 123,
      uid: 'user_abc',
      username: 'spencer',
      profile_img: '',
    };
    const db = getFirestore(myAuth);
    const testWrite = db
      .collection(USERS_COLLECTION)
      .doc(myUid)
      .collection(USER_PRIV)
      .doc(USER_PRIV);
    await firebase.assertFails(testWrite.set(testDoc));
  });
  test("authorized user can't create usersCollection/{userId}/user_priv/user_priv doc if 'uid' field is not a string", async () => {
    const testDoc = {
      date_joined: '06/15/22',
      email: 'abc@gmail.com',
      password: 'password',
      uid: 123,
      username: 'spencer',
      profile_img: '',
    };
    const db = getFirestore(myAuth);
    const testWrite = db
      .collection(USERS_COLLECTION)
      .doc(myUid)
      .collection(USER_PRIV)
      .doc(USER_PRIV);
    await firebase.assertFails(testWrite.set(testDoc));
  });
  test("authorized user can't create usersCollection/{userId}/user_priv/user_priv doc if 'username' field is not a string", async () => {
    const testDoc = {
      date_joined: '06/15/22',
      email: 'abc@gmail.com',
      password: 'password',
      uid: 'user_abc',
      username: 123,
      profile_img: '',
    };
    const db = getFirestore(myAuth);
    const testWrite = db
      .collection(USERS_COLLECTION)
      .doc(myUid)
      .collection(USER_PRIV)
      .doc(USER_PRIV);
    await firebase.assertFails(testWrite.set(testDoc));
  });
  test("authorized user can't create usersCollection/{userId}/user_priv/user_priv doc if 'profile_img' field is not a string", async () => {
    const testDoc = {
      date_joined: '06/15/22',
      email: 'abc@gmail.com',
      password: 'password',
      uid: 'user_abc',
      username: 'spencer',
      profile_img: 123,
    };
    const db = getFirestore(myAuth);
    const testWrite = db
      .collection(USERS_COLLECTION)
      .doc(myUid)
      .collection(USER_PRIV)
      .doc(USER_PRIV);
    await firebase.assertFails(testWrite.set(testDoc));
  });
});

/*====================
 TEST TEARDOWN
====================*/

afterAll(async () => {
  await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});
