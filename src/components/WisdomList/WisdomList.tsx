import React from 'react';
import { IonCol, IonGrid, IonRow, IonText } from '@ionic/react';

import WisdomCard from '../WisdomCard/WisdomCard';
import { useWisdomStore } from '../../contexts/WisdomStoreContext';
import { WisdomData } from '../../models/models';

import styles from './WisdomList.module.css';

interface PropsData {
  loading: boolean;
}

const WisdomList: React.FC<PropsData> = ({ loading }) => {
  const { userWisdoms } = useWisdomStore();

  let storedWisdoms: [] | WisdomData[];

  if (!userWisdoms) {
    storedWisdoms = [];
  } else {
    storedWisdoms = userWisdoms;
  }

  const headerElHeight = document.getElementById('headerEl')?.offsetHeight;

  const loadingPlaceholderEl = (
    <IonGrid>
      <IonRow className="ion-margin-horizontal">
        <IonCol className="ion-text-center">
          <IonText color="dark" className={styles.ss_larger_text}>
            <p className={styles.ss_faded_text}>Searching for wisdom...</p>
          </IonText>
        </IonCol>
      </IonRow>
    </IonGrid>
  );

  const loadedCardsEl = storedWisdoms.map((item: WisdomData) => (
    <WisdomCard key={item.id} id={item.id} text={item.text} />
  ));

  const noCardsEl = (
    <IonGrid>
      <IonRow className="ion-margin-horizontal">
        <IonCol className="ion-text-center">
          <IonText color="dark" className={styles.ss_larger_text}>
            <p className={styles.ss_faded_text}>
              You haven't added <br /> any wisdom yet...
            </p>
          </IonText>
        </IonCol>
      </IonRow>
    </IonGrid>
  );

  const cardsOrNoCards = storedWisdoms.length > 0 ? loadedCardsEl : noCardsEl;

  const content = loading ? loadingPlaceholderEl : cardsOrNoCards;

  return (
    <div style={{ overflow: 'scroll', marginTop: `${headerElHeight}px` }}>
      {content}
    </div>
  );
};

export default WisdomList;
