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
  // global-state steps:
  // storedWisdoms state will be removed and replaced with:
  // CODE SKETCH:
  // const [globalState, dispatch] = useStore();
  // const storedWisdoms = globalState.storedWisdoms;
  const [storedWisdoms, setStoredWisdoms] = useState<WisdomData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const { didDelete, setDidDelete } = useUtility();

  const history = useHistory();

  console.log('Home rendering...');

  useEffect(() => {
    // global-state steps:
    // at some point, this useEffect will change from pulling data from firebase and storing it to
    // grabbing the updated global-store data and passing it to WisdomList.tsx
    console.log('Home useEffect...');
    if (!currentUser) {
      console.error('from useEffect in Home: currentUser is null!');
      return;
    }

    if (didDelete) {
      setStoredWisdoms(null);
    }

    if (!storedWisdoms) {
      // this storedWisdoms should come from global-store
      // global-store steps:
      // THIS DISPATCH SHOULD NOT HAPPEN HERE!
      // Home.tsx SHOULD RENDER AFTER THIS FETCH HAS CONCLUDED!
      // CODE SKETCH:
      // dispatch('FETCH_WISDOM_DATA', currentUser);
      getDataToDisplay();
    }

    async function getDataToDisplay() {
      // global-store steps:
      // this function will be exported to an actions file and
      // called in the FETCH_WISDOM_DATA action in data-store.ts
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
        <WisdomList storedWisdoms={storedWisdoms} />{' '}
        {/* this storedWisdoms should come from global-store */}
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
