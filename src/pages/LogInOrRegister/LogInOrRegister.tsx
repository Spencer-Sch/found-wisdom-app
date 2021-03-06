import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { IonContent, IonPage } from '@ionic/react';

import LogInForm from '../../components/LogInForm/LogInForm';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import { useAuth } from '../../contexts/AuthContext';
import { useWisdomStore } from '../../contexts/WisdomStoreContext';

import styles from './logInOrRegister.module.css';

const LogInOrRegister: React.FC = () => {
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const { currentUser } = useAuth();
  const { setUserWisdoms } = useWisdomStore();

  useEffect(() => {
    setUserWisdoms!(null);
  }, [setUserWisdoms]);

  return (
    <>
      {!currentUser ? (
        <IonPage>
          <IonContent>
            {showRegisterForm ? (
              <RegisterForm setShowRegisterForm={setShowRegisterForm} />
            ) : (
              <LogInForm setShowRegisterForm={setShowRegisterForm} />
            )}
          </IonContent>
        </IonPage>
      ) : (
        <Redirect to={'/'} />
      )}
    </>
  );
};

export default LogInOrRegister;
