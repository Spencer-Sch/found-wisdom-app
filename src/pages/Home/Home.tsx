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

// import { WisdomData } from '../../models/models';

import WisdomList from '../../components/WisdomList/WisdomList';
import { useAuth } from '../../contexts/AuthContext';
// import { fetchUserData, fetchWisdomsById } from '../../actions/firebaseActions';

import styles from './home.module.css';
// import { useUtility } from '../../contexts/UtilityContext';
import { useWisdomStore } from '../../contexts/WisdomStoreContext';

const Home: React.FC = () => {
  // Old Code
  // const [storedWisdoms, setStoredWisdoms] = useState<WisdomData[] | null>(null);
  // const [loading, setLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [reloadCount, setReloadCount] = useState(0);
  const { currentUser } = useAuth();
  // const { didDelete, setDidDelete } = useUtility();

  const { userWisdoms, fetchWisdomData } = useWisdomStore();

  const history = useHistory();

  console.log('Home rendering...');

  useEffect(() => {
    console.log('Home useEffect...');
    if (!currentUser) {
      // TODO: better error handeling
      console.error('from useEffect in Home: currentUser is null!');
      return;
    }

    if (reloadCount > 10) {
      // TODO: change from console.error to an on screen error message and kick the user back to the login screen.
      console.error(
        'Something went wrong. Timed out waiting for displayName to update. Please reload the application.'
      );
      return;
    }

    if (!currentUser.displayName) {
      // TODO: redundant checks on the status of displayName between here and inside fetchWisdomData in WisdomStoreContext?
      setTimeout(() => {
        setReload((prev) => !prev);
        setReloadCount((prev) => prev + 1);
      }, 1000);
      return;
    }

    if (!userWisdoms) {
      // setLoading(true);
      fetchWisdomData!(currentUser);
      // setLoading(false);
    }

    if (userWisdoms) {
      // TODO: turn into an else on the above if statement?
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
  }, [currentUser, reload, reloadCount, fetchWisdomData, userWisdoms]);
  // }, [storedWisdoms, currentUser, didDelete]);

  return (
    <IonPage>
      <IonContent id="page-content" fullscreen>
        <WisdomList loading={loading} />
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
