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

import WisdomList from '../../components/WisdomList/WisdomList';
import { useAuth } from '../../contexts/AuthContext';
import { useWisdomStore } from '../../contexts/WisdomStoreContext';

import styles from './home.module.css';

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [reloadCount, setReloadCount] = useState(0);
  const { currentUser } = useAuth();
  const { userWisdoms, fetchWisdomData } = useWisdomStore();
  const history = useHistory();

  useEffect(() => {
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
      setTimeout(() => {
        setReloadCount((prev) => prev + 1);
      }, 1000);
      return;
    }

    if (!userWisdoms) {
      fetchWisdomData!(currentUser.displayName);
    } else {
      setLoading(false);
    }
  }, [currentUser, reloadCount, fetchWisdomData, userWisdoms]);

  return (
    <IonPage>
      <IonContent id="page-content" fullscreen>
        <WisdomList loading={loading} />
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton
            color="secondary"
            routerDirection="forward"
            // onClick={() => {
            //   history.replace('/add');
            // }}
            routerLink="/add"
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
