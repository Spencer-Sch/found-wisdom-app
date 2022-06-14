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
  return (
    <IonItem lines="full">
      <IonLabel class="ion-padding-bottom" position="stacked">
        {name}
      </IonLabel>
      <IonText class="ion-padding-bottom">{itemData ? itemData : ''}</IonText>
      {button && (
        <IonButton fill="outline" size="small" slot="end">
          {buttonText ? buttonText : 'button text'}
        </IonButton>
      )}
    </IonItem>
  );
};

export default UserAccountListItem;
