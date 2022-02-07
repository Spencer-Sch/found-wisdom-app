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
    <IonCard className="card">
      {/* <IonCardHeader className="ion-text-uppercase" color="primary">
        {source}
      </IonCardHeader> */}
      <IonItem className="ion-no-padding" href={`/wisdom/${id}`}>
        <IonCardContent>{text}</IonCardContent>
      </IonItem>
    </IonCard>
  );
};

export default WisdomCard;
