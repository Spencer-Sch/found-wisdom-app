import { IonCard, IonCardContent, IonItem } from '@ionic/react';
import React from 'react';

import styles from './WisdomCard.module.css';

interface WisdomCardProps {
  id: string;
  text: string;
}

const WisdomCard: React.FC<WisdomCardProps> = ({ id, text }) => {
  return (
    <IonCard className={styles.ss_card} routerLink={`/wisdom/${id}`}>
      <IonItem className="ion-no-padding">
        <IonCardContent>{text}</IonCardContent>
      </IonItem>
    </IonCard>
  );
};

export default WisdomCard;
