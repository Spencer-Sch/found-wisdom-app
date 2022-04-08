import React from 'react';

import { IonCol, IonGrid, IonRow, IonText } from '@ionic/react';

import WisdomCard from '../WisdomCard/WisdomCard';

import styles from './WisdomList.module.css';

import { WisdomData } from '../../models/models';

interface PropsData {
  storedWisdoms: WisdomData[] | null;
}

const WisdomList: React.FC<PropsData> = ({ storedWisdoms }) => {
  if (!storedWisdoms) {
    storedWisdoms = [];
  }

  const headerElHeight = document.getElementById('headerEl')?.offsetHeight;

  return (
    <div style={{ overflow: 'scroll', marginTop: `${headerElHeight}px` }}>
      {storedWisdoms.length > 0 ? (
        storedWisdoms.map((item: WisdomData) => (
          <WisdomCard key={item.id} id={item.id} text={item.text} />
        ))
      ) : (
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
      )}
    </div>
  );
};

export default WisdomList;
