import React from 'react';
import { IonButton, IonItem, IonLabel, IonText } from '@ionic/react';

interface PropsData {
  name: string;
  itemData: string;
  button?: boolean;
  buttonText?: string;
}

const UserAccountListItem: React.FC<PropsData> = ({
  name,
  button = false,
  itemData,
  buttonText = 'button text',
}) => {
  return (
    <IonItem lines="full">
      <IonLabel class="ion-padding-bottom" position="stacked">
        {name}
      </IonLabel>
      <IonText class="ion-padding-bottom">{itemData}</IonText>
      {button && (
        <IonButton fill="outline" size="small" slot="end">
          {buttonText}
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
