import { IonCard, IonCardContent, IonItem } from '@ionic/react';
import React from 'react';

import styles from './WisdomCard.module.css';

interface WisdomCardProps {
  id: string;
  source: string;
  text: string;
}

const WisdomCard: React.FC<WisdomCardProps> = ({ id, source, text }) => {
  return (
    <IonCard className={styles.ss_card}>
      <IonItem className="ion-no-padding" href={`/wisdom/${id}`}>
        <IonCardContent>{text}</IonCardContent>
      </IonItem>
    </IonCard>
  );
};

export default WisdomCard;
