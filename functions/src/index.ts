// import * as functions from 'firebase-functions';

const admin = require('firebase-admin');
admin.initializeApp();

///////////////////////////////

/* Enfource Unique Usernames on Registration */
// I got this function from this article: https://medium.com/@jqualls/firebase-firestore-unique-constraints-d0673b7a4952

// Because I did not write it, and it was not written in TypeScript I am giving a bunch of variables the type of 'any'
// simply to make it work and avoid running the risk of messing something up trying to type everything accurately.

// const cors = require('cors');
// const express = require('express');
// // const admin = require('firebase-admin');
// const functions = require('firebase-functions');
// const app = express();
// const db = admin.firestore();
// const usernames = db.collection('usernames');
// const users = db.collection('users');

// app.use(
//   cors({
//     origin: true, // allows all cross origin xhr requests
//   })
// );

// // verify firebase id token to secure the function
// app.use((req, res, next) => {
//   if (!req.headers.authorization) {
//     return res.status(403).json({ message: 'missing authorization header' });
//   }

//   let jwt = req.headers.authorization.trim();
//   return admin
//     .auth()
//     .verifyIdToken(jwt)
//     .then((claims) => {
//       req.user = claims; // gives us a user object to use below
//       next();
//     })
//     .catch((err) => {
//       return res.status(400).json({
//         message: 'invalid jwt',
//       });
//     });
// });

// // enforce uniqueness on username
// app.post('/:username', (req, res) => {
//   // ensure user supplied a username to attempt on
//   if (req.params.username.length <= 3) {
//     return res.status(400).json({
//       status: 400,
//       message: 'username must be at least 4 characters',
//     });
//   }

//   let username = req.params.username.trim().toLowerCase();
//   let unameRef = usernames.doc(username); // SS: ref to a document containing all usernames
//   let unameQuery = usernames.where('uid', '==', req.user.uid);
//   let userRef = users.doc(req.user.uid); // SS: ref to actual user document. This should be my usersCollection?

//   db.runTransaction((tx) => {
//     return (
//       tx
//         .get(unameRef)
//         .then((unameDoc) => {
//           // check if username is already assigned to the current user
//           if (unameDoc.exists && unameDoc.data.uid === req.user.uid) {
//             return Promise.reject({
//               status: 400,
//               code: 'USERNAME_OWNED_BY_REQUESTER',
//             });
//           }

//           // if its not assigned and exists someone else owns it
//           if (unameDoc.exists) {
//             return Promise.reject({ status: 400, code: 'USERNAME_TAKEN' });
//           }

//           return Promise.resolve();
//         })

//         // query usernamaes
//         .then(() => tx.get(unameQuery))

//         // allow a user to change their username by deleting a previously set one
//         // ensure user only has one username by deleting any references found
//         .then((querySnapshot) => {
//           return Promise.all(
//             querySnapshot.docs.map((doc) => tx.delete(doc.ref))
//           );
//         })

//         // assign the username to the authenticated user
//         .then(() => tx.set(unameRef, { uid: req.user.uid }, { merge: true }))

//         // write their new username to the user record for easy access
//         // username has been modified to ensure uniqueness trimmed & lowercased
//         .then(() => tx.set(userRef, { username: username }, { merge: true })) // SS: writing to user doc. edit to match my structure.
//     );
//   })
//     .then(() => {
//       res.json({
//         username: username, // return the formatted username
//         message: 'successfully acquired username',
//       });
//     })
//     .catch((err) => {
//       return res.status(err.code || 500).json(err);
//     });
// });

// module.exports = functions.https.onRequest(app);

///////////////////////////////

const cors = require('cors');
const express = require('express');
// const admin = require('firebase-admin');
const functions = require('firebase-functions');
const app = express();
const db = admin.firestore();
const usernames = db.collection('usernames');
const users = db.collection('users');

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
  let unameRef = usernames.doc(username); // SS: ref to a document containing all usernames
  let unameQuery = usernames.where('uid', '==', req.user.uid);
  let userRef = users.doc(req.user.uid); // SS: ref to actual user document. This should be my usersCollection?

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

        // query usernamaes
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
        .then(() => tx.set(userRef, { username: username }, { merge: true })) // SS: writing to user doc. edit to match my structure.
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
