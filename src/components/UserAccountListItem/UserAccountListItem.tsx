import React from 'react';
import { IonButton, IonItem, IonLabel, IonText } from '@ionic/react';

import styles from './userAccountListItem.module.css';

interface PropsData {
  name: string;
  itemData?: string;
  button?: boolean;
  buttonText?: string;
}

const UserAccountListItem: React.FC<PropsData> = ({
  name,
  button = false,
  itemData,
  buttonText = 'button text',
}) => {
  const passwordItemText = name === 'password' ? '******************' : null;

  return (
    <IonItem lines="full">
      <IonLabel class="ion-padding-bottom" position="stacked">
        {name}
      </IonLabel>
      {passwordItemText ? (
        <IonText class={`ion-padding-bottom ${styles.ss_password_text}`}>
          {passwordItemText}
        </IonText>
      ) : (
        <IonText class="ion-padding-bottom">{itemData ? itemData : ''}</IonText>
      )}
      {button && (
        <IonButton fill="outline" size="small" slot="end">
          {buttonText ? buttonText : 'button text'}
        </IonButton>
      )}
    </IonItem>
  );
};

export default UserAccountListItem;

// <IonItem lines="full">
//   <IonLabel class="ion-padding-bottom" position="stacked">
//     Username
//   </IonLabel>
//   <IonText class="ion-padding-bottom">spencer</IonText>
// </IonItem>
// <IonItem lines="full">
//   <IonLabel class="ion-padding-bottom" position="stacked">
//     Joined On
//   </IonLabel>
//   <IonText class="ion-padding-bottom">05/23/22</IonText>
// </IonItem>
// <IonItem class="" lines="full">
//   <IonLabel class="ion-padding-bottom" position="stacked">
//     Account Email
//   </IonLabel>
//   <IonText class="ion-padding-bottom">spencer@test.com</IonText>
//   <IonItem>
//     <IonButton fill="outline" size="small" slot="end">
//       Change
//     </IonButton>
//   </IonItem>
// </IonItem>
// <IonItem lines="full">
//   <IonLabel class="ion-padding-bottom" position="stacked">
//     Password
//   </IonLabel>
//   <IonButton fill="outline" size="small" slot="end">
//     Change
//   </IonButton>
// </IonItem>
