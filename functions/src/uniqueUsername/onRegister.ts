import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const cors = require('cors');
const express = require('express');
const onRegisterHandler = express();
const db = admin.firestore();
const usernamesCollection = db.collection('usernamesCollection');

onRegisterHandler.use(cors());

// enforce uniqueness on username
onRegisterHandler.get('/:username', (req: any, res: any) => {
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
    return tx.get(unameRef).then((unameDoc: any) => {
      // check if username is already assigned to a user
      if (unameDoc.exists) {
        ////////////////////
        // This version throws a CORS error in the browser console. I don't know why.
        // return Promise.reject({ status: 400, code: 'USERNAME_TAKEN' });
        ////////////////////
        return Promise.reject({
          status: 400,
          message: 'username already taken',
        });
      }

      return Promise.resolve();
    });
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
