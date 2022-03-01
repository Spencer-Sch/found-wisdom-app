import React from 'react';

import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuButton,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { home, person, cog, key } from 'ionicons/icons';

import styles from './header.module.css';

const Header = () => {
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
            <IonItem button={true}>
              <IonIcon slot="start" icon={home} />
              <IonLabel>Home</IonLabel>
            </IonItem>
            <IonItem button={true}>
              <IonIcon slot="start" icon={person} />
              <IonLabel>Account</IonLabel>
            </IonItem>
            <IonItem button={true}>
              <IonIcon slot="start" icon={cog} />
              <IonLabel>Settings</IonLabel>
            </IonItem>
            <IonItem button={true}>
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
