import { IonCard, IonCardContent, IonCardHeader, IonItem } from '@ionic/react';
import React from 'react';

import './WisdomCard.css';

interface WisdomCardProps {
  id: string;
  title: string;
  date: string;
  text: string;
}

const WisdomCard: React.FC<WisdomCardProps> = (props) => {
  const { id, title, text } = props;

  return (
    <IonCard onClick={() => console.log('card was clicked')}>
      <IonCardHeader className="ion-text-uppercase" color="primary">
        {title}
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
