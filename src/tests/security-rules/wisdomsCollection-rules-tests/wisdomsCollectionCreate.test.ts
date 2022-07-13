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
const myAuth: MyAuth = {
  uid: myUid,
  name: 'spencer',
  email: 'abc@gmail.com',
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

describe('Tests for wisdomsCollection "allow create" security rules', () => {
  test("unauthorized user can't write to wisdomsCollection", async () => {
    const testWrite = getTestDoc(null, wisdomUid1);
    await firebase.assertFails(testWrite.set(wisdom_correct_doc));
  });

  test("authorized user can't create a wisdom if 'createdby' field doesn't match their username", async () => {
    const testWrite = getTestDoc(myAuth, wisdomUid1);
    await firebase.assertFails(
      testWrite.set({
        createdBy: 'bob', // createdBy does not match 'displayName' from auth object
        wisdomData: {
          date: 'Jun 29, 2022',
          id: 'd36cd4d3-536e-4776-b1ba-4f86b34ccb9b',
          source: 'Someone famous',
          text: 'Something wise this person once said...',
        },
      })
    );
  });

  test("authorized user can create a wisdom if 'createdby' field matches their username", async () => {
    const testWrite = getTestDoc(myAuth, wisdomUid1);
    await firebase.assertSucceeds(
      testWrite.set({
        createdBy: 'spencer', // createdBy does match 'displayName' from auth object
        wisdomData: {
          date: 'Jun 29, 2022',
          id: 'd36cd4d3-536e-4776-b1ba-4f86b34ccb9b',
          source: 'Someone famous',
          text: 'Something wise this person once said...',
        },
      })
    );
  });

  test('authorized user can create a wisdom if all required fields are present and of valid type', async () => {
    const testWrite = getTestDoc(myAuth, wisdomUid1);
    await firebase.assertSucceeds(
      testWrite.set({
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

  test("authorized user can't create a wisdom if 'createdBy' field is missing", async () => {
    const testWrite = getTestDoc(myAuth, wisdomUid1);
    await firebase.assertFails(
      testWrite.set({
        // createdBy: 'spencer', missing field
        wisdomData: {
          date: 'Jun 29, 2022',
          id: 'd36cd4d3-536e-4776-b1ba-4f86b34ccb9b',
          source: 'Someone famous',
          text: 'Something wise this person once said...',
        },
      })
    );
  });

  test("authorized user can't create a wisdom if 'wisdomData' field is missing", async () => {
    const testWrite = getTestDoc(myAuth, wisdomUid1);
    await firebase.assertFails(
      testWrite.set({
        createdBy: 'spencer',
        // wisdomData: {  missing field
        //   date: 'Jun 29, 2022',
        //   id: 'd36cd4d3-536e-4776-b1ba-4f86b34ccb9b',
        //   source: 'Someone famous',
        //   text: 'Something wise this person once said...',
        // },
      })
    );
  });

  test("authorized user can't create a wisdom if 'wisdomData.date' field is missing", async () => {
    const testWrite = getTestDoc(myAuth, wisdomUid1);
    await firebase.assertFails(
      testWrite.set({
        createdBy: 'spencer',
        wisdomData: {
          // date: 'Jun 29, 2022', missing field
          id: 'd36cd4d3-536e-4776-b1ba-4f86b34ccb9b',
          source: 'Someone famous',
          text: 'Something wise this person once said...',
        },
      })
    );
  });

  test("authorized user can't create a wisdom if 'wisdomData.id' field is missing", async () => {
    const testWrite = getTestDoc(myAuth, wisdomUid1);
    await firebase.assertFails(
      testWrite.set({
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

  test("authorized user can't create a wisdom if 'wisdomData.source' field is missing", async () => {
    const testWrite = getTestDoc(myAuth, wisdomUid1);
    await firebase.assertFails(
      testWrite.set({
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

  test("authorized user can't create a wisdom if 'wisdomData.text' field is missing", async () => {
    const testWrite = getTestDoc(myAuth, wisdomUid1);
    await firebase.assertFails(
      testWrite.set({
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

  test("authorized user can't create a wisdom if 'wisdomData.id' field is an empty string", async () => {
    const testWrite = getTestDoc(myAuth, wisdomUid1);
    await firebase.assertFails(
      testWrite.set({
        createdBy: 'spencer',
        wisdomData: {
          date: 'Jun 29, 2022',
          id: '',
          source: 'Someone famous',
          text: 'Something wise this person once said...',
        },
      })
    );
  });

  test("authorized user can't create a wisdom if 'createdBy' field is of wrong type", async () => {
    const testWrite = getTestDoc(myAuth, wisdomUid1);
    await firebase.assertFails(
      testWrite.set({
        createdBy: 123, // wrong type
        wisdomData: {
          date: 'Jun 29, 2022',
          id: 'd36cd4d3-536e-4776-b1ba-4f86b34ccb9b',
          source: 'Someone famous',
          text: 'Something wise this person once said...',
        },
      })
    );
  });

  test("authorized user can't create a wisdom if 'wisdomData' field is of wrong type", async () => {
    const testWrite = getTestDoc(myAuth, wisdomUid1);
    await firebase.assertFails(
      testWrite.set({
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

  test("authorized user can't create a wisdom if 'wisdomData.date' field is of wrong type", async () => {
    const testWrite = getTestDoc(myAuth, wisdomUid1);
    await firebase.assertFails(
      testWrite.set({
        createdBy: 'spencer',
        wisdomData: {
          date: 123, // wrong type
          id: 'd36cd4d3-536e-4776-b1ba-4f86b34ccb9b',
          source: 'Someone famous',
          text: 'Something wise this person once said...',
        },
      })
    );
  });

  test("authorized user can't create a wisdom if 'wisdomData.id' field is of wrong type", async () => {
    const testWrite = getTestDoc(myAuth, wisdomUid1);
    await firebase.assertFails(
      testWrite.set({
        createdBy: 'spencer',
        wisdomData: {
          date: 'Jun 29, 2022',
          id: 123, // wrong type
          source: 'Someone famous',
          text: 'Something wise this person once said...',
        },
      })
    );
  });

  test("authorized user can't create a wisdom if 'wisdomData.source' field is of wrong type", async () => {
    const testWrite = getTestDoc(myAuth, wisdomUid1);
    await firebase.assertFails(
      testWrite.set({
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

  test("authorized user can't create a wisdom if 'wisdomData.text' field is of wrong type", async () => {
    const testWrite = getTestDoc(myAuth, wisdomUid1);
    await firebase.assertFails(
      testWrite.set({
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
