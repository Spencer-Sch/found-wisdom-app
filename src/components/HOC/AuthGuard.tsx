import React from 'react';
import { Redirect } from 'react-router-dom';

import { firebase } from '../../firebase/firebase';
import { getAuth } from 'firebase/auth';

/////////////////
import { useAuth } from '../../contexts/AuthContext';
/////////////////

const AuthGuard = (Component: any) => {
  /////////////////
  const { currentUser } = useAuth();
  /////////////////

  class AuthHoc extends React.Component {
    authCheck = () => {
      //////////////////
      // const user = getAuth(firebase).currentUser;
      // if (user) {
      //////////////////
      if (currentUser) {
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
