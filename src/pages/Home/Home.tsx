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
import { useWisdomStore } from '../../contexts/WisdomStoreContext';

const Home: React.FC = () => {
  // Old Code
  // const [storedWisdoms, setStoredWisdoms] = useState<WisdomData[] | null>(null);
  // const [loading, setLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { didDelete, setDidDelete } = useUtility();

  const { userWisdoms, fetchWisdomData } = useWisdomStore();

  const history = useHistory();

  console.log('Home rendering...');

  useEffect(() => {
    console.log('Home useEffect...');
    if (!currentUser) {
      console.error('from useEffect in Home: currentUser is null!');
      return;
    }

    if (!userWisdoms) {
      // setLoading(true);
      fetchWisdomData!(currentUser);
      // setLoading(false);
    }

    if (userWisdoms) {
      setLoading(false);
    }

    ///////////////////////
    // Old Code
    // if (didDelete) {
    //   setStoredWisdoms(null);
    // }
    ///////////////////////
    ///////////////////////
    // Old Code
    // if (!storedWisdoms) {
    //   getDataToDisplay();
    // }
    ///////////////////////
    ///////////////////////
    // Old Code
    // async function getDataToDisplay() {
    // setLoading(true);
    // const userData = await fetchUserData(currentUser!.displayName!);
    // const defaultCollection: string[] = userData.wisdomCollections.default;
    // const userWisdoms = await fetchWisdomsById(defaultCollection);

    // setStoredWisdoms(userWisdoms);
    // setDidDelete!(false);
    // setLoading(false);
    ///////////////////////
    // }

    return console.log('unmounting Home...');
  }, [currentUser, fetchWisdomData, userWisdoms]);
  // }, [storedWisdoms, currentUser, didDelete]);

  return (
    <IonPage>
      <IonContent id="page-content" fullscreen>
        <WisdomList />
        {/* /////////////////////// */}
        {/* old code */}
        {/* <WisdomList storedWisdoms={storedWisdoms} />{' '} */}
        {/* /////////////////////// */}
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
