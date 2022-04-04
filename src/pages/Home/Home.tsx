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

import WisdomList from '../../components/WisdomList/WisdomList';
import { useAuth } from '../../contexts/AuthContext';
import { fetchUserData, fetchWisdomsById } from '../../actions/firebaseActions';

import styles from './home.module.css';

const Home: React.FC = () => {
  const [storedWisdoms, setStoredWisdoms] = useState<WisdomData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  console.log('Home rendering...');

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

  // const pushNotification = () => {
  //   //////////////////////////////////////////
  //   // REFACTOR???
  //   //////////////////////////////////////////
  //   if (!storedWisdoms) {
  //     // improve error handeling!!!
  //     console.error('from pushNotification in Home: storedWisdoms is null!');
  //     return;
  //   }
  //   //////////////////////////////////////////
  //   let wisdomToShow: WisdomData;
  //   let nextWisdom: WisdomData;
  //   const editedState = [...storedWisdoms];

  //   storedWisdoms.forEach((item, idx) => {
  //     if (item.next === true) {
  //       wisdomToShow = {
  //         ...item,
  //         next: false,
  //       };

  //       editedState[idx] = { ...wisdomToShow };

  //       if (idx === storedWisdoms.length - 1) {
  //         nextWisdom = {
  //           ...storedWisdoms[0],
  //           next: true,
  //         };

  //         editedState[0] = { ...nextWisdom };
  //       } else {
  //         nextWisdom = {
  //           ...storedWisdoms[idx + 1],
  //           next: true,
  //         };

  //         editedState[idx + 1] = { ...nextWisdom };
  //       }
  //     }
  //   });

  //   localStorage.setItem('myWisdoms', JSON.stringify(editedState));
  //   setStoredWisdoms(editedState);

  //   alert(wisdomToShow!.text);
  // };

  return (
    <IonPage>
      {/* <IonHeader>
        <IonToolbar>
          <IonTitle className="ion-text-center">Found Wisdom</IonTitle>
        </IonToolbar>
      </IonHeader> */}
      {/* <IonContent fullscreen> */}
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">Wisdom</IonTitle>
        </IonToolbar>
      </IonHeader>
      {/* Page Content Here */}
      {/* ///////////////////////////// */}
      <WisdomList storedWisdoms={storedWisdoms} />
      {/* {!loading && <WisdomList storedWisdoms={storedWisdoms} />} */}
      {/* ///////////////////////////// */}
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton color="secondary" href="wisdom/add">
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
      {/* Temp button to activate "push notification" functionality */}
      {/* <IonFab vertical="bottom" horizontal="start" slot="fixed">
        <IonFabButton color="tertiary" onClick={pushNotification}>
          <IonIcon icon={alertSharp} />
        </IonFabButton>
      </IonFab> */}
      {/* /////////////////////////////////////////////////////// */}
      {/* </IonContent> */}
      {loading && (
        <IonLoading
          isOpen={loading}
          spinner="lines-sharp"
          cssClass={styles.my_custom_spinner}
          message="home fetching data..."
        />
      )}
    </IonPage>
  );
};

export default Home;
