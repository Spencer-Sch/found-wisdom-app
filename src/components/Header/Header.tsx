import React from 'react';

import {
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { home, person, cog, key } from 'ionicons/icons';

import { firebase } from '../../firebase/firebase';
import { getAuth, signOut } from 'firebase/auth';

import styles from './header.module.css';
import { Redirect } from 'react-router-dom';

const Header: React.FC = () => {
  const logoutHandler = () => {
    const auth = getAuth(firebase);
    signOut(auth)
      .then(() => {
        console.log('logging out...');
        // showSuccessToast('Goodbye!');
      })
      .catch((error) => {
        console.log('log out: ', error);
        // showErrorToast(error.message);
      });
  };

  return (
    <>
      <IonMenu side="start" contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonItem button={true} href="/">
              <IonIcon slot="start" icon={home} />
              <IonLabel>Home</IonLabel>
            </IonItem>
            <IonItem button={true} onClick={() => console.log('Account')}>
              <IonIcon slot="start" icon={person} />
              <IonLabel>Account</IonLabel>
            </IonItem>
            <IonItem button={true} onClick={() => console.log('Settings')}>
              <IonIcon slot="start" icon={cog} />
              <IonLabel>Settings</IonLabel>
            </IonItem>
            <IonItem button={true} onClick={() => logoutHandler()}>
              <IonIcon slot="start" icon={key} />
              <IonLabel>Log Out</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>

      <IonHeader>
        <IonToolbar className={styles.toolbar}>
          <IonTitle className="ion-text-center">Found Wisdom</IonTitle>
          <IonButtons slot="primary" className={styles.ion_buttons}>
            <IonMenuButton color="primary"></IonMenuButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
    </>
  );
};

export default Header;
