import React from 'react';
import { Redirect } from 'react-router-dom';

import { firebase } from '../../firebase/firebase';
import { getAuth } from 'firebase/auth';

const AuthGuard = (Component: any) => {
  class AuthHoc extends React.Component {
    authCheck = () => {
      const user = getAuth(firebase).currentUser;
      if (user) {
        return <Component {...this.props} />;
      } else {
        return <Redirect to="/sign_in" />;
      }
    };

    render() {
      return this.authCheck();
    }
  }

  return AuthHoc;
};

export default AuthGuard;
