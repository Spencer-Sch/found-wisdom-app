// import * as functions from 'firebase-functions';

const admin = require('firebase-admin');
admin.initializeApp();

///////////////////////////////

const cors = require('cors');
const express = require('express');
// const admin = require('firebase-admin');
const functions = require('firebase-functions');
const app = express();
const db = admin.firestore();
////////////////////
// Original
// const usernames = db.collection('usernames');
// const users = db.collection('users');
////////////////////
const usernamesCollection = db.collection('usernamesCollection');
const usersCollection = db.collection('usersCollection');

app.use(
  cors({
    origin: true, // allows all cross origin xhr requests
  })
);

// verify firebase id token to secure the function
app.use((req: any, res: any, next: any) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ message: 'missing authorization header' });
  }

  let jwt = req.headers.authorization.trim();
  return admin
    .auth()
    .verifyIdToken(jwt)
    .then((claims: any) => {
      req.user = claims; // gives us a user object to use below
      next();
    })
    .catch((err: any) => {
      return res.status(400).json({
        message: 'invalid jwt',
      });
    });
});

// enforce uniqueness on username
app.post('/:username', (req: any, res: any) => {
  // ensure user supplied a username to attempt on
  if (req.params.username.length <= 3) {
    return res.status(400).json({
      status: 400,
      message: 'username must be at least 4 characters',
    });
  }

  let username = req.params.username.trim().toLowerCase();
  //////////////////////
  // Original
  // let unameRef = usernames.doc(username);
  //////////////////////
  let unameRef = usernamesCollection.doc(username); // SS: ref to a collection containing all usernames
  let unameQuery = usernamesCollection.where('uid', '==', req.user.uid);
  //////////////////////
  // Original
  // let userRef = users.doc(req.user.uid);
  //////////////////////
  let userRef = usersCollection.doc(req.user.uid); // SS: ref to actual user document.

  db.runTransaction((tx: any) => {
    return (
      tx
        .get(unameRef)
        .then((unameDoc: any) => {
          // check if username is already assigned to the current user
          if (unameDoc.exists && unameDoc.data.uid === req.user.uid) {
            return Promise.reject({
              status: 400,
              code: 'USERNAME_OWNED_BY_REQUESTER',
            });
          }

          // if its not assigned and exists someone else owns it
          if (unameDoc.exists) {
            return Promise.reject({ status: 400, code: 'USERNAME_TAKEN' });
          }

          return Promise.resolve();
        })
        /* 
        TODO
        Split function here???
        fn1 would contain all code above
        and be used when a new user is registered

        fn2 would contain all code in this file
        and be used when a user changes their username
        */

        /*
        TODO
        MY ADDITION
        before updating a user's username:
        update "createdBy" in all wisdom docs associated with user's current username
        Process:
        does req.user contain the user's current username or displayName?
        if so:
           query wisdomsCollection for all wisdoms where('createdBy', '==', req.user.username or .displayName)
        if not:
           use req.user.uid to get() the user's doc from usersCollection.
           get the user's username
           then:
           query wisdomsCollection for all wisdoms where('createdBy', '==', username)
        then:
        .then((querySnapshot: any) => {
          return Promise.all( // THIS PROCESS NEEDS TO BE DOUBLE CHECKED!!!
            querySnapshot.docs.map((doc: any) => tx.set(doc.ref, { createdBy: username }, { merge: true })
          );
        })
        */

        // query usernamesCollection
        .then(() => tx.get(unameQuery))

        // allow a user to change their username by deleting a previously set one
        // ensure user only has one username by deleting any references found
        .then((querySnapshot: any) => {
          return Promise.all(
            querySnapshot.docs.map((doc: any) => tx.delete(doc.ref))
          );
        })

        // assign the username to the authenticated user
        .then(() => tx.set(unameRef, { uid: req.user.uid }, { merge: true }))

        // write their new username to the user record for easy access
        // username has been modified to ensure uniqueness trimmed & lowercased
        /////////////////////////////
        // Original
        // .then(() => tx.set(userRef, { username: username }, { merge: true })) // SS: writing to user doc.
        /////////////////////////////
        .then(() =>
          tx.set(
            userRef,
            {
              user_priv: { user_priv: { username: username } },
              user_pub: { user_pub: { username: username } },
            },
            { merge: true }
          )
        )
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

module.exports = functions.https.onRequest(app);
