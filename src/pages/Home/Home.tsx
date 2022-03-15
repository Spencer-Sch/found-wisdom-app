import React, { useEffect, useState } from 'react';

import { firebase, firestoreDB } from '../../firebase/firebase';
import { getDocs, collection, query } from 'firebase/firestore';

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

import { add, alertSharp } from 'ionicons/icons';

import { WisdomObj } from '../../models/WisdomObj.model';

import WisdomList from '../../components/WisdomList/WisdomList';
import { useAuth } from '../../contexts/AuthContext';

import styles from './home.module.css';

////////////////////////////////////
// THIS CODE IS TO PRE-LOAD WISDOMS SO I DON'T
// HAVE TO KEEP DOING IT MANUALLY DURING DEVELOPMENT
////////////////////////////////////

// import { wisdomData } from './wisdomData';

// const loadWisdoms = () => {
//   const wisdomsToUpload: WisdomObj[] = getStoredWisdoms();
//   wisdomData.forEach((item) => {
//     wisdomsToUpload.push(item);
//   });
//   localStorage.setItem('myWisdoms', JSON.stringify(wisdomsToUpload));
// };
// loadWisdoms();

////////////////////////////////////

const Home: React.FC = () => {
  const [storedWisdoms, setStoredWisdoms] = useState<WisdomObj[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  console.log('Home rendering...');

  //////////////////////////////////////////
  // firebase useEffect
  //////////////////////////////////////////
  useEffect(() => {
    if (!currentUser) {
      console.error('from useEffect in Home: currentUser is null!');
      return;
    }

    if (!storedWisdoms) {
      console.log('from useEffect in Home: fetching data...');
      setLoading(true);

      const userCollection = collection(firestoreDB, currentUser.email!);

      const q = query(userCollection);
      // extract getDocs, userCollection/query out to thier own functions
      getDocs(q)
        .then((snapshot) => {
          const userDoc = snapshot.docs.map((item) => ({
            ...item.data(),
          }));
          const userObj = userDoc[0];
          const userWisdoms = userObj.userWisdoms;
          setStoredWisdoms(userWisdoms);
        })
        .catch((error) => {
          // If error then setStoredWisdoms() to a placeholder wisdom with error message inside
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [storedWisdoms]);
  //////////////////////////////////////////

  const pushNotification = () => {
    //////////////////////////////////////////
    // REFACTOR???
    //////////////////////////////////////////
    if (!storedWisdoms) {
      console.error('from pushNotification in Home: storedWisdoms is null!');
      return;
    }
    //////////////////////////////////////////
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

        if (idx === storedWisdoms.length - 1) {
          nextWisdom = {
            ...storedWisdoms[0],
            next: true,
          };

          editedState[0] = { ...nextWisdom };
        } else {
          nextWisdom = {
            ...storedWisdoms[idx + 1],
            next: true,
          };

          editedState[idx + 1] = { ...nextWisdom };
        }
      }
    });

    localStorage.setItem('myWisdoms', JSON.stringify(editedState));
    setStoredWisdoms(editedState);

    alert(wisdomToShow!.text);
  };

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
      {!loading && <WisdomList storedWisdoms={storedWisdoms} />}
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
      {/* </IonContent> */}
      {loading && (
        <IonLoading
          isOpen={loading}
          spinner="lines-sharp"
          cssClass={styles.my_custom_spinner}
          message="logging in..."
        />
      )}
    </IonPage>
  );
};

export default Home;
