import { IonCard, IonCardContent, IonCardHeader, IonItem } from '@ionic/react';
import React from 'react';

import './WisdomCard.css';

const WisdomCard: React.FC = () => {
  return (
    <IonCard onClick={() => console.log('card was clicked')}>
      <IonCardHeader className="ion-text-uppercase" color="primary">
        Wisdom Title
      </IonCardHeader>
      <IonItem
        className="ion-no-padding"
        onClick={() => console.log('card was clicked')}
        href="/wisdom"
      >
        <IonCardContent>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cupiditate
          rem adipisci dolore eaque ipsum, dolor voluptas magnam aliquam
          eligendi doloremque quos eius aspernatur ut nesciunt, maiores pariatur
          ipsa laborum inventore!
        </IonCardContent>
      </IonItem>
    </IonCard>
  );
};

export default WisdomCard;
