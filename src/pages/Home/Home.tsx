import React, { useEffect, useState } from 'react';

import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { add } from 'ionicons/icons';

import './Home.css';

import { WisdomObj } from '../../models/WisdomObj.model';

import WisdomList from '../../components/WisdomList/WisdomList';

const Home: React.FC = () => {
  const [storedWisdoms, setStoredWisdoms] = useState<WisdomObj[]>([]);

  useEffect(() => {
    const wisdomsString: string | null = localStorage.getItem('myWisdoms');
    if (wisdomsString) {
      const wisdomsArr: WisdomObj[] = JSON.parse(wisdomsString);
      setStoredWisdoms(wisdomsArr);
    }
  }, []);

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
      </IonContent>
    </IonPage>
  );
};

export default Home;
