export const getErrorMsg = (error: any) => {
  // used on log in and registration pages
  // if error.code matches an error in my list, return corresponding message
  // else return default message
  const messages = [
    {
      code: 'auth/email-already-in-use',
      msg: 'email already in use',
      input: 'email',
    },
    {
      code: 'auth/email-change-needs-verification',
      msg: 'email needs to be verified',
      input: 'email',
    },
    { code: 'auth/weak-password', msg: 'weak password', input: 'password' },
    {
      code: 'auth/wrong-password',
      msg: 'incorrect password',
      input: 'password',
    },
    {
      code: 'auth/user-not-found',
      msg: 'user not found or incorrect email',
      input: 'email',
    },
  ];

  // set up default value
  let result = { msg: error.code, input: 'password2' };

  for (let item of messages) {
    if (error.code === item.code) {
      result = { msg: item.msg, input: item.input };
      break;
    }
  }

  return result;
};
