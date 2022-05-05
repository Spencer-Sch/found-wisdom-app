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
          <UserAccountListItem
            name="username"
            itemData={username}
            button
            buttonText="change"
          />
          <UserAccountListItem name="date joined" itemData={dateJoined} />
          <UserAccountListItem
            name="email"
            itemData={email}
            button
            buttonText="change"
          />
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default UserAccount;

{
  /* <IonListHeader lines="full">
            <IonLabel color="primary">
              <h2>Account Info</h2>
            </IonLabel>
          </IonListHeader>
          <IonItem lines="full">
            <IonLabel class="ion-padding-bottom" position="stacked">
              Username
            </IonLabel>
            <IonText class="ion-padding-bottom">spencer</IonText>
          </IonItem>
          <IonItem lines="full">
            <IonLabel class="ion-padding-bottom" position="stacked">
              Joined On
            </IonLabel>
            <IonText class="ion-padding-bottom">05/23/22</IonText>
          </IonItem>
          <IonItem class="" lines="full">
            <IonLabel class="ion-padding-bottom" position="stacked">
              Account Email
            </IonLabel>
            <IonText class="ion-padding-bottom">spencer@test.com</IonText>
            <IonItem>
              <IonButton fill="outline" size="small" slot="end">
                Change
              </IonButton>
            </IonItem>
          </IonItem>
          <IonItem lines="full">
            <IonLabel class="ion-padding-bottom" position="stacked">
              Password
            </IonLabel>
            <IonButton fill="outline" size="small" slot="end">
              Change
            </IonButton>
          </IonItem> */
}
