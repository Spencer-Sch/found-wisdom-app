import React from 'react';
import { Redirect } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';

const AuthGuard = (Component: any) => {
  const { currentUser } = useAuth();

  class AuthHoc extends React.Component {
    authCheck = () => {
      if (currentUser) {
        return <Component {...this.props} />;
      } else {
        return <Redirect to="/login_register" />;
      }
    };

    render() {
      return this.authCheck();
    }
  }

  return AuthHoc;
};

export default AuthGuard;
