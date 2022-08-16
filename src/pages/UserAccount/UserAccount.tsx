import {
  IonContent,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
} from '@ionic/react';
import React from 'react';
import UserAccountListItem from '../../components/UserAccountListItem/UserAccountListItem';

import styles from './userAccount.module.css';

interface UserInfo {
  date_joined: string;
  email: string;
  profile_img: string;
  uid: string;
  username: string;
}

const UserAccount: React.FC<UserInfo> = ({ date_joined, email, username }) => {
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
          <UserAccountListItem name="date joined" itemData={date_joined} />
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
