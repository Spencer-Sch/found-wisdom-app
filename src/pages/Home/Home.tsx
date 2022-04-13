import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonLoading,
  IonPage,
} from '@ionic/react';

import { add } from 'ionicons/icons';

import { WisdomData } from '../../models/models';

import WisdomList from '../../components/WisdomList/WisdomList';
import { useAuth } from '../../contexts/AuthContext';
import { fetchUserData, fetchWisdomsById } from '../../actions/firebaseActions';

import styles from './home.module.css';
import { useUtility } from '../../contexts/UtilityContext';

const Home: React.FC = () => {
  const [storedWisdoms, setStoredWisdoms] = useState<WisdomData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const { didDelete, setDidDelete } = useUtility();

  const history = useHistory();

  console.log('Home rendering...');

  useEffect(() => {
    console.log('Home useEffect...');
    if (!currentUser) {
      console.error('from useEffect in Home: currentUser is null!');
      return;
    }

    if (didDelete) {
      setStoredWisdoms(null);
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
      setDidDelete!(false);
      setLoading(false);
    }

    return console.log('unmounting Home...');
  }, [storedWisdoms, currentUser, didDelete]);

  return (
    <IonPage>
      <IonContent id="page-content" fullscreen>
        <WisdomList storedWisdoms={storedWisdoms} />
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton
            color="secondary"
            routerDirection="forward"
            onClick={() => {
              history.replace('/add');
            }}
          >
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
