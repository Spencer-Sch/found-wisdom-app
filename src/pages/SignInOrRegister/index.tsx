import { IonContent, IonPage } from '@ionic/react';
import React, { useState } from 'react';

import { Redirect } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import SignInUser from '../../components/SignInUser/SignInUser';
import RegisterNewUser from '../../components/RegisterNewUser/RegisterNewUser';

import styles from './signInOrRegister.module.css';

const SignInOrRegister: React.FC = (props: any) => {
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const { currentUser } = useAuth();

  return (
    <>
      {!currentUser ? (
        <IonPage>
          <IonContent>
            {showRegisterForm ? (
              <RegisterNewUser
                {...props}
                setShowRegisterForm={setShowRegisterForm}
              />
            ) : (
              <SignInUser
                {...props}
                setShowRegisterForm={setShowRegisterForm}
              />
            )}
          </IonContent>
        </IonPage>
      ) : (
        <Redirect to={'/'} />
      )}
    </>
  );
};

export default SignInOrRegister;
