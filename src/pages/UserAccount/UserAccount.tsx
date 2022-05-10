import {
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonText,
} from '@ionic/react';
import React from 'react';
import UserAccountListItem from '../../components/UserAccountListItem/UserAccountListItem';

import styles from './userAccount.module.css';

interface UserInfo {
  username: string;
  email: string;
  dateJoined: string;
}

const UserAccount: React.FC<UserInfo> = ({ username, email, dateJoined }) => {
  const headerElHeight = document.getElementById('headerEl')?.offsetHeight;

  return (
    <IonPage>
      <IonContent id="page-content">
        <IonList style={{ marginTop: `${headerElHeight}px` }}>
          <IonListHeader lines="full">
            <IonLabel color="primary">
              <h2>Account Info</h2>
            </IonLabel>
          </IonListHeader>
          <UserAccountListItem name="date joined" itemData={dateJoined} />
          <UserAccountListItem
            name="username"
            itemData={username}
            button
            buttonText="change"
          />
          <UserAccountListItem
            name="email"
            itemData={email}
            button
            buttonText="change"
          />
          <UserAccountListItem name="password" button buttonText="change" />
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default UserAccount;
