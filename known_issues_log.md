# Known Issues Log

## A centralized location for detailed notes about known issues

---

- issues are in no particular order

### Issue #1

Issue Location(s):

- src/components/RegisterForm/RegisterForm.tsx
  - try block for addUserToDB()
- firestore.rules
  - usernamesCollection rules
- src/tests/security-rules/usernamesCollection-rules-tests/usernamesCollectionCreate.test.ts

Issue Details:
authUsernameMatchesDocName() in firestore.rules is denying permision when batch writing a new user on registration.
I debugged in the security rules emulator and everything came out as true and correct variables.
I used the built in playground in the rules tab on the firestore console and everything passed
but a new write to firestore on registration does not work if authUsernameMatchesDocName() is enabled.
I Looked hard to confirm that all variables going into the batch write are correct.
I have confirmed that the variables, auth credentials, etc are all present and matching.
I have no idea why this security rule is denying permissions.
