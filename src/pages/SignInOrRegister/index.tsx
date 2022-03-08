import { IonContent, IonPage } from '@ionic/react';
import React, { useState } from 'react';

import { Redirect } from 'react-router-dom';

import styles from './signInOrRegister.module.css';
import SignInUser from '../../components/SignInUser/SignInUser';
import RegisterNewUser from '../../components/RegisterNewUser/RegisterNewUser';

const SignInOrRegister: React.FC = (props: any) => {
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  return (
    <>
      {!props.user ? (
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
