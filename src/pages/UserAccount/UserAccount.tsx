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
  date_joined: string;
  email: string;
  password: string;
  profile_img: string;
  uid: string;
  username: string;
}

const UserAccount: React.FC<UserInfo> = ({
  date_joined,
  email,
  password,
  username,
}) => {
  const headerElHeight = document.getElementById('headerEl')?.offsetHeight;

  const censorPassword = (password: string) => {
    const firstChar = password[0];
    const lastChar = password[password.length - 1];
    const middlePortion = password.slice(1, password.length - 1);

    const starStr = middlePortion
      .split('')
      .map(() => '*')
      .join('');
    const censoredPassword = firstChar + starStr + lastChar;
    return censoredPassword;
  };

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
          <UserAccountListItem
            name="password"
            itemData={censorPassword(password)}
            button
            buttonText="change"
          />
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default UserAccount;
