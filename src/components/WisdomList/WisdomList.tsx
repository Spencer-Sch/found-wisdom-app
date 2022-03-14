import React from 'react';

import { IonCol, IonGrid, IonRow, IonText } from '@ionic/react';

import WisdomCard from '../WisdomCard/WisdomCard';

import styles from './WisdomList.module.css';

import { WisdomObj } from '../../models/WisdomObj.model';

interface PropsData {
  storedWisdoms: WisdomObj[] | null;
}

const WisdomList: React.FC<PropsData> = ({ storedWisdoms }) => {
  if (!storedWisdoms) {
    console.log('from WisdomList: storedWisdoms is null!');
    storedWisdoms = [];
  }

  return (
    <div style={{ overflow: 'scroll' }}>
      {storedWisdoms.length > 0 ? (
        storedWisdoms.map((item: WisdomObj) => (
          <WisdomCard
            key={item.id}
            id={item.id}
            source={item.source}
            text={item.text}
          />
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
