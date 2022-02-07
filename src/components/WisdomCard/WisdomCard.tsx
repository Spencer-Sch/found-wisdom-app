import { IonCard, IonCardContent, IonCardHeader, IonItem } from '@ionic/react';
import React from 'react';

import './WisdomCard.css';

interface WisdomCardProps {
  id: string;
  source: string;
  text: string;
}

const WisdomCard: React.FC<WisdomCardProps> = ({ id, source, text }) => {
  return (
    <IonCard onClick={() => console.log('card was clicked')}>
      <IonCardHeader className="ion-text-uppercase" color="primary">
        {source}
      </IonCardHeader>
      <IonItem
        className="ion-no-padding"
        onClick={() => console.log('card was clicked')}
        href={`/wisdom/${id}`}
      >
        <IonCardContent>{text}</IonCardContent>
      </IonItem>
    </IonCard>
  );
};

export default WisdomCard;
