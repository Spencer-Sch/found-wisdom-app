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
  const passwordItemContent = (
    <>
      <p
        style={{
          fontStyle: 'italic',
          display: 'inline-block',
          margin: 0,
          color: 'gray',
        }}
      >
        "keep it secret, keep it safe"
      </p>
      <span> 🧙‍♂️</span>
    </>
  );
  return (
    <IonItem lines="full">
      <IonLabel class="ion-padding-bottom" position="stacked">
        {name}
      </IonLabel>
      <IonText class={'ion-padding-bottom'}>
        {name === 'password' ? passwordItemContent : itemData ? itemData : ''}
      </IonText>
      {button && (
        <IonButton fill="outline" size="small" slot="end">
          {buttonText ? buttonText : 'button text'}
        </IonButton>
      )}
    </IonItem>
  );
};

export default UserAccountListItem;
