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
const wisdomUid1: string = 'wisdom_abc';
const myUid: string = 'user_abc';
const theirUid: string = 'user_xyz';
const myAuth: Auth = {
  uid: myUid,
  name: 'spencer',
  email: 'abc@gmail.com',
};
const theirAuth: Auth = {
  uid: theirUid,
  name: 'bob',
  email: 'xyz@gmail.com',
};
const WISDOMS_COLLECTION = 'wisdomsCollection';

const wisdom_correct_doc = {
  createdBy: 'spencer',
  wisdomData: {
    date: 'Jun 29, 2022',
    id: 'd36cd4d3-536e-4776-b1ba-4f86b34ccb9b',
    source: 'Someone famous',
    text: 'Something wise this person once said...',
  },
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
  return admin.collection(WISDOMS_COLLECTION).doc(docId);
};

const getTestDoc: GetTestDoc = (auth, docId) => {
  const db = getFirestore(auth);
  return db.collection(WISDOMS_COLLECTION).doc(docId);
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

// src/tests/security-rules/wisdomsCollection-rules-tests/wisdomsCollectionDelete.test.ts

describe('Tests for wisdomsCollection "allow delete" security rules', () => {
  test("unauthorized user can't delete a wisdom", async () => {
    // setup
    const setupDoc = getSetupDoc(wisdomUid1);
    await setupDoc.set(wisdom_correct_doc);
    // test
    const testUpdate = getTestDoc(null, wisdomUid1);
    await firebase.assertFails(testUpdate.delete());
  });

  test("authorized user can't delete a wisdom if 'createdby' field doesn't match their username", async () => {
    // setup
    const setupDoc = getSetupDoc(wisdomUid1);
    await setupDoc.set(wisdom_correct_doc);
    // test
    const testUpdate = getTestDoc(theirAuth, wisdomUid1);
    await firebase.assertFails(testUpdate.delete());
  });

  test("authorized user can delete a wisdom if 'createdby' field matches their username", async () => {
    // setup
    const setupDoc = getSetupDoc(wisdomUid1);
    await setupDoc.set(wisdom_correct_doc);
    // test
    const testUpdate = getTestDoc(myAuth, wisdomUid1);
    await firebase.assertSucceeds(testUpdate.delete());
  });
});

/*====================
 TEST TEARDOWN
====================*/

afterAll(async () => {
  await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});
