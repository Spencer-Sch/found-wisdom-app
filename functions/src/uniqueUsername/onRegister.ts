import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
// admin.initializeApp();

const cors = require('cors');
const express = require('express');
const onRegisterHandler = express();
const db = admin.firestore();
const usernamesCollection = db.collection('usernamesCollection');

onRegisterHandler.use(
  cors({
    origin: true, // allows all cross origin xhr requests
  })
);

// enforce uniqueness on username
onRegisterHandler.post('/:username', (req: any, res: any) => {
  // ensure user supplied a username to attempt on
  if (req.params.username.length <= 3) {
    return res.status(400).json({
      status: 400,
      message: 'username must be at least 4 characters',
    });
  }

  let username = req.params.username.trim().toLowerCase();
  let unameRef = usernamesCollection.doc(username); // SS: ref to a collection containing all usernames

  db.runTransaction((tx: any) => {
    return (
      tx
        .get(unameRef)
        .then((unameDoc: any) => {
          // check if username is already assigned to a user
          if (unameDoc.exists) {
            return Promise.reject({ status: 400, code: 'USERNAME_TAKEN' });
          }

          return Promise.resolve();
        })

        ////////////////
        // THIS WILL BE DONE CLIENT SIDE INSIDE OF addUserToDB() inside RegisterForm.tsx
        // assign the username to the authenticated user
        .then(() => tx.set(unameRef, { uid: req.user.uid }, { merge: true }))
      ////////////////
    );
  })
    .then(() => {
      res.json({
        username: username, // return the formatted username
        message: 'successfully acquired username',
      });
    })
    .catch((err: any) => {
      return res.status(err.code || 500).json(err);
    });
});

module.exports = functions.https.onRequest(onRegisterHandler);
