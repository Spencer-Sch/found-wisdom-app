import { firestore } from '@firebase/testing';
const firebase = require('../../../node_modules/@firebase/testing');

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
const COLLECTION_NAME = 'enterNameHere';
const SUBCOLLECTION_DOC_NAME = 'enterNameHere';

const correct_doc = {
  correct_fields_here: 'data',
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
    .collection(COLLECTION_NAME)
    .doc(docId)
    .collection(SUBCOLLECTION_DOC_NAME)
    .doc(SUBCOLLECTION_DOC_NAME);
};

const getTestDoc: GetTestDoc = (auth, docId) => {
  const db = getFirestore(auth);
  return db
    .collection(COLLECTION_NAME)
    .doc(docId)
    .collection(SUBCOLLECTION_DOC_NAME)
    .doc(SUBCOLLECTION_DOC_NAME);
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

describe('[ specify which collection/document you are testing against here ]', () => {
  test('[ describe test specifics here ]', async () => {
    //setup
    const setupDoc = getSetupDoc(myUid);
    await setupDoc.set(correct_doc);
    // test
    const testDoc = getTestDoc(myAuth, myUid);
    return firebase.assertSucceeds(testDoc.get());
  });
});

/*====================
 TEST TEARDOWN
====================*/

afterAll(async () => {
  await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});
