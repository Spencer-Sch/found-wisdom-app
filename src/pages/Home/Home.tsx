import React, { useEffect, useState } from 'react';

import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { add, alertSharp } from 'ionicons/icons';

import './Home.css';

import { WisdomObj } from '../../models/WisdomObj.model';

import WisdomList from '../../components/WisdomList/WisdomList';

////////////////////////////////////
// THIS CODE IS TO PRE-LOAD WISDOMS SO I DON'T
// HAVE TO KEEP DOING IT MANUALLY DURING DEVELOPMENT
////////////////////////////////////

import { wisdomData } from './wisdomData';

const getStoredWisdoms = () => {
  const wisdomsString: string | null = localStorage.getItem('myWisdoms');
  if (wisdomsString) {
    return JSON.parse(wisdomsString);
  } else {
    return [];
  }
};

const loadWisdoms = () => {
  const wisdomsToUpload: WisdomObj[] = getStoredWisdoms();
  wisdomData.forEach((item) => {
    wisdomsToUpload.push(item);
  });
  localStorage.setItem('myWisdoms', JSON.stringify(wisdomsToUpload));
};
// loadWisdoms();

////////////////////////////////////

const Home: React.FC = () => {
  const [storedWisdoms, setStoredWisdoms] = useState<WisdomObj[]>([]);

  useEffect(() => {
    const wisdomsString: string | null = localStorage.getItem('myWisdoms');
    if (wisdomsString) {
      const wisdomsArr: WisdomObj[] = JSON.parse(wisdomsString);
      setStoredWisdoms(wisdomsArr);
    }
  }, []);

  const pushNotification = () => {
    // NEXT STEP: WHEN END OF ARRAY IS HIT SET NEXT BACK TO FIRST ITEM
    let wisdomToShow: WisdomObj;
    let nextWisdom: WisdomObj;
    const editedState = [...storedWisdoms];

    storedWisdoms.forEach((item, idx) => {
      if (item.next === true) {
        wisdomToShow = {
          ...item,
          next: false,
        };

        editedState[idx] = { ...wisdomToShow };

        nextWisdom = {
          ...storedWisdoms[idx + 1],
          next: true,
        };

        editedState[idx + 1] = { ...nextWisdom };
      }
    });

    localStorage.setItem('myWisdoms', JSON.stringify(editedState));
    setStoredWisdoms(editedState);
    console.log(editedState);

    // if (wisdomToShow!) {
    alert(wisdomToShow!.text);
    // }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="ion-text-center">Found Wisdom</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Wisdom</IonTitle>
          </IonToolbar>
        </IonHeader>
        {/* Page Content Here */}
        <WisdomList storedWisdoms={storedWisdoms} />
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="secondary" href="wisdom/add">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
        {/* Temp button to activate "push notification" functionality */}
        <IonFab vertical="bottom" horizontal="start" slot="fixed">
          <IonFabButton color="tertiary" onClick={pushNotification}>
            <IonIcon icon={alertSharp} />
          </IonFabButton>
        </IonFab>
        {/* /////////////////////////////////////////////////////// */}
      </IonContent>
    </IonPage>
  );
};

export default Home;
