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

// src/tests/security-rules/wisdomsCollection-rules-tests/wisdomsCollectionUpdate.test.ts

describe('Tests for wisdomsCollection "allow update" security rules', () => {
  test("unauthorized user can't update a wisdom", async () => {
    // setup
    const setupDoc = getSetupDoc(wisdomUid1);
    await setupDoc.set(wisdom_correct_doc);
    // test
    const testUpdate = getTestDoc(null, wisdomUid1);
    await firebase.assertFails(
      testUpdate.update({
        createdBy: 'spencer',
        wisdomData: {
          date: 'Jun 29, 2022',
          id: 'd36cd4d3-536e-4776-b1ba-4f86b34ccb9b',
          source: 'attempting to update this text...',
          text: 'Something wise this person once said...',
        },
      })
    );
  });

  test("authorized user can't update a wisdom if 'createdby' field doesn't match their username", async () => {
    // setup
    const setupDoc = getSetupDoc(wisdomUid1);
    await setupDoc.set(wisdom_correct_doc);
    // test
    const testUpdate = getTestDoc(theirAuth, wisdomUid1);
    await firebase.assertFails(
      testUpdate.update({
        createdBy: 'spencer', // createdBy does not match 'displayName' from auth object
        wisdomData: {
          date: 'Jun 29, 2022',
          id: 'd36cd4d3-536e-4776-b1ba-4f86b34ccb9b',
          source: 'attempting to update this text...',
          text: 'Something wise this person once said...',
        },
      })
    );
  });

  test("authorized user can update a wisdom if 'createdby' field matches their username, all required fields are present and of valid type", async () => {
    // setup
    const setupDoc = getSetupDoc(wisdomUid1);
    await setupDoc.set(wisdom_correct_doc);
    // test
    const testUpdate = getTestDoc(myAuth, wisdomUid1);
    await firebase.assertSucceeds(
      testUpdate.update({
        createdBy: 'spencer', // createdBy does match 'displayName' from auth object
        wisdomData: {
          date: 'Jun 29, 2022',
          id: 'd36cd4d3-536e-4776-b1ba-4f86b34ccb9b',
          source: 'attempting to update this text...',
          text: 'also updating this text...',
        },
      })
    );
  });

  test("authorized user can't update a wisdom if 'createdBy' field is changed", async () => {
    // setup
    const setupDoc = getSetupDoc(wisdomUid1);
    await setupDoc.set(wisdom_correct_doc);
    // test
    const testUpdate = getTestDoc(myAuth, wisdomUid1);
    await firebase.assertFails(
      testUpdate.update({
        createdBy: 'bob', // changed field
        wisdomData: {
          date: 'Jun 29, 2022',
          id: 'd36cd4d3-536e-4776-b1ba-4f86b34ccb9b',
          source: 'Someone famous',
          text: 'Something wise this person once said...',
        },
      })
    );
  });

  test("authorized user can't update a wisdom if 'wisdomData.date' field is changed", async () => {
    // setup
    const setupDoc = getSetupDoc(wisdomUid1);
    await setupDoc.set(wisdom_correct_doc);
    // test
    const testUpdate = getTestDoc(myAuth, wisdomUid1);
    await firebase.assertFails(
      testUpdate.update({
        createdBy: 'spencer',
        wisdomData: {
          date: 'Apr 22, 2021', // changed field
          id: 'd36cd4d3-536e-4776-b1ba-4f86b34ccb9b',
          source: 'Someone famous',
          text: 'Something wise this person once said...',
        },
      })
    );
  });

  test("authorized user can't update a wisdom if 'wisdomData.id' field is changed", async () => {
    // setup
    const setupDoc = getSetupDoc(wisdomUid1);
    await setupDoc.set(wisdom_correct_doc);
    // test
    const testUpdate = getTestDoc(myAuth, wisdomUid1);
    await firebase.assertFails(
      testUpdate.update({
        createdBy: 'spencer',
        wisdomData: {
          date: 'Jun 29, 2022',
          id: 'abc123', // changed field
          source: 'Someone famous',
          text: 'Something wise this person once said...',
        },
      })
    );
  });

  /* 
  Test for 'createdBy' and 'wisdomData' fields missing opmitted on purpose.
  If these fields are not present on the request.resource.data when using the update() method
  those values will simply persists from the resource.data.
  */

  test("authorized user can't update a wisdom if 'wisdomData.date' field is missing", async () => {
    // setup
    const setupDoc = getSetupDoc(wisdomUid1);
    await setupDoc.set(wisdom_correct_doc);
    // test
    const testUpdate = getTestDoc(myAuth, wisdomUid1);
    await firebase.assertFails(
      testUpdate.update({
        createdBy: 'spencer',
        wisdomData: {
          // date: 'Jun 29, 2022', missing field
          id: 'd36cd4d3-536e-4776-b1ba-4f86b34ccb9b',
          source: 'attempting to update this text...',
          text: 'Something wise this person once said...',
        },
      })
    );
  });

  test("authorized user can't update a wisdom if 'wisdomData.id' field is missing", async () => {
    // setup
    const setupDoc = getSetupDoc(wisdomUid1);
    await setupDoc.set(wisdom_correct_doc);
    // test
    const testUpdate = getTestDoc(myAuth, wisdomUid1);
    await firebase.assertFails(
      testUpdate.update({
        createdBy: 'spencer',
        wisdomData: {
          date: 'Jun 29, 2022',
          // id: 'd36cd4d3-536e-4776-b1ba-4f86b34ccb9b', missing field
          source: 'Someone famous',
          text: 'Something wise this person once said...',
        },
      })
    );
  });

  test("authorized user can't update a wisdom if 'wisdomData.source' field is missing", async () => {
    // setup
    const setupDoc = getSetupDoc(wisdomUid1);
    await setupDoc.set(wisdom_correct_doc);
    // test
    const testUpdate = getTestDoc(myAuth, wisdomUid1);
    await firebase.assertFails(
      testUpdate.update({
        createdBy: 'spencer',
        wisdomData: {
          date: 'Jun 29, 2022',
          id: 'd36cd4d3-536e-4776-b1ba-4f86b34ccb9b',
          // source: 'Someone famous', missing field
          text: 'Something wise this person once said...',
        },
      })
    );
  });

  test("authorized user can't update a wisdom if 'wisdomData.text' field is missing", async () => {
    // setup
    const setupDoc = getSetupDoc(wisdomUid1);
    await setupDoc.set(wisdom_correct_doc);
    // test
    const testUpdate = getTestDoc(myAuth, wisdomUid1);
    await firebase.assertFails(
      testUpdate.update({
        createdBy: 'spencer',
        wisdomData: {
          date: 'Jun 29, 2022',
          id: 'd36cd4d3-536e-4776-b1ba-4f86b34ccb9b',
          source: 'Someone famous',
          // text: 'Something wise this person once said...', missing field
        },
      })
    );
  });

  test("authorized user can't update a wisdom with unrecognized field(s)", async () => {
    // setup
    const setupDoc = getSetupDoc(wisdomUid1);
    await setupDoc.set(wisdom_correct_doc);
    // test
    const testUpdate = getTestDoc(myAuth, wisdomUid1);
    await firebase.assertFails(
      testUpdate.update({
        favorite_color: 'green',
        createdBy: 'spencer',
        wisdomData: {
          date: 'Jun 29, 2022',
          id: 'd36cd4d3-536e-4776-b1ba-4f86b34ccb9b',
          source: 'Someone famous',
          text: 'Something wise this person once said...',
        },
      })
    );
  });

  test("authorized user can't update wisdomData object with unrecognized field(s)", async () => {
    // setup
    const setupDoc = getSetupDoc(wisdomUid1);
    await setupDoc.set(wisdom_correct_doc);
    // test
    const testUpdate = getTestDoc(myAuth, wisdomUid1);
    await firebase.assertFails(
      testUpdate.update({
        createdBy: 'spencer',
        wisdomData: {
          favorite_color: 'green',
          date: 'Jun 29, 2022',
          id: 'd36cd4d3-536e-4776-b1ba-4f86b34ccb9b',
          source: 'Someone famous',
          text: 'Something wise this person once said...',
        },
      })
    );
  });

  /* 
  Test for "can't update if 'createdBy' field is of wrong type" omitted on purpose.
  'createdBy' can't be changed once it has been created so this update test would be redundant
  */

  test("authorized user can't update a wisdom if 'wisdomData' field is of wrong type", async () => {
    // setup
    const setupDoc = getSetupDoc(wisdomUid1);
    await setupDoc.set(wisdom_correct_doc);
    // test
    const testUpdate = getTestDoc(myAuth, wisdomUid1);
    await firebase.assertFails(
      testUpdate.update({
        createdBy: 'spencer',
        wisdomData: `
          date: 'Jun 29, 2022',
          id: 'd36cd4d3-536e-4776-b1ba-4f86b34ccb9b',
          source: 'Someone famous',
          text: 'Something wise this person once said...',
        `,
      })
    );
  });

  /* 
  Test for "can't update if 'wisdomData.date' or 'wisdomData.id' fields are of wrong type" omitted on purpose.
  'wisdomData.date' and 'wisdomData.id' can't be changed once they has been created so these update tests would be redundant
  */

  test("authorized user can't update a wisdom if 'wisdomData.source' field is of wrong type", async () => {
    // setup
    const setupDoc = getSetupDoc(wisdomUid1);
    await setupDoc.set(wisdom_correct_doc);
    // test
    const testUpdate = getTestDoc(myAuth, wisdomUid1);
    await firebase.assertFails(
      testUpdate.update({
        createdBy: 'spencer',
        wisdomData: {
          date: 'Jun 29, 2022',
          id: 'd36cd4d3-536e-4776-b1ba-4f86b34ccb9b',
          source: 123, // wrong type
          text: 'Something wise this person once said...',
        },
      })
    );
  });

  test("authorized user can't update a wisdom if 'wisdomData.text' field is of wrong type", async () => {
    // setup
    const setupDoc = getSetupDoc(wisdomUid1);
    await setupDoc.set(wisdom_correct_doc);
    // test
    const testUpdate = getTestDoc(myAuth, wisdomUid1);
    await firebase.assertFails(
      testUpdate.update({
        createdBy: 'spencer',
        wisdomData: {
          date: 'Jun 29, 2022',
          id: 'd36cd4d3-536e-4776-b1ba-4f86b34ccb9b',
          source: 'Someone famous',
          text: 123, // wrong type
        },
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
