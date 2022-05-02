import React from 'react';
import { useHistory } from 'react-router-dom';

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

import { useAuth } from '../../contexts/AuthContext';

import styles from './header.module.css';
import { menuController } from '@ionic/core/components';
import { useWisdomStore } from '../../contexts/WisdomStoreContext';

const Header: React.FC = () => {
  const { signOutUser, setRenderHome } = useAuth();
  const { setUserWisdoms } = useWisdomStore();
  const history = useHistory();

  const logoutHandler = async () => {
    try {
      await menuController.close();
      await signOutUser!();
      setUserWisdoms!(null);
    } catch (e) {
      // TODO: IMPROVE ERROR HANDLING!
      console.error(e);
    }
  };

  return (
    <>
      <IonMenu side="start" contentId="ion-router-outlet">
        {/* <IonMenu side="start" contentId="page-content"> */}
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonItem
              button={true}
              onClick={async () => {
                // flip these calls for different visual order
                await menuController.close();
                setRenderHome!(true);
                history.replace('/');
              }}
            >
              {/* <IonItem button={true} routerLink="/"> */}
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

      <IonHeader id="headerEl">
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
