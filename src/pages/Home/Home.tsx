import React, { useEffect, useState } from 'react';

import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { add } from 'ionicons/icons';

import { WisdomData } from '../../models/models';

import Header from '../../components/Header/Header';
import WisdomList from '../../components/WisdomList/WisdomList';
import { useAuth } from '../../contexts/AuthContext';
import { fetchUserData, fetchWisdomsById } from '../../actions/firebaseActions';

import styles from './home.module.css';

const Home: React.FC = () => {
  const [storedWisdoms, setStoredWisdoms] = useState<WisdomData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  // console.log('Home rendering...');

  useEffect(() => {
    if (!currentUser) {
      console.error('from useEffect in Home: currentUser is null!');
      return;
    }

    if (!storedWisdoms) {
      getDataToDisplay();
    }

    async function getDataToDisplay() {
      setLoading(true);
      const userData = await fetchUserData(currentUser!.displayName!);
      const defaultCollection: string[] = userData.wisdomCollections.default;
      const userWisdoms = await fetchWisdomsById(defaultCollection);

      setStoredWisdoms(userWisdoms);
      setLoading(false);
    }
  }, [storedWisdoms, currentUser]);

  return (
    <IonPage>
      <Header />
      <IonContent id="page-content" fullscreen>
        <WisdomList storedWisdoms={storedWisdoms} />
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="secondary" href="wisdom/add">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
        <IonLoading
          isOpen={loading}
          spinner="lines-sharp"
          cssClass={styles.my_custom_spinner}
          message="home fetching data..."
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
