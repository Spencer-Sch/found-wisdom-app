import React, { useEffect, useState } from 'react';

import WisdomCard from '../WisdomCard/WisdomCard';

import styles from './WisdomList.module.css';

import { WisdomObj } from '../../models/WisdomObj.model';
import {
  IonCol,
  IonContent,
  IonGrid,
  IonItemDivider,
  IonRow,
  IonText,
} from '@ionic/react';

const WisdomList: React.FC = () => {
  const [storedWisdoms, setStoredWisdoms] = useState<WisdomObj[]>([]);

  useEffect(() => {
    const wisdomsString: string | null = localStorage.getItem('myWisdoms');
    if (wisdomsString) {
      const wisdomsArr: WisdomObj[] = JSON.parse(wisdomsString);
      setStoredWisdoms(wisdomsArr);
    }
  }, []);

  return (
    <div>
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
            {/* <IonItemDivider className="ion-no-padding"> */}
            <IonCol className="ion-text-center">
              <IonText color="dark" className={styles.ss_larger_text}>
                <p className={styles.ss_faded_text}>
                  You haven't added <br /> any wisdom yet...
                </p>
              </IonText>
            </IonCol>
            {/* </IonItemDivider> */}
          </IonRow>
        </IonGrid>
      )}
    </div>
  );
};

export default WisdomList;
