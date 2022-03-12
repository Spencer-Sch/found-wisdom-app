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
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { add, alertSharp } from 'ionicons/icons';

import { WisdomObj } from '../../models/WisdomObj.model';

import WisdomList from '../../components/WisdomList/WisdomList';

import './Home.css';

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

// interface PropsData {
//   user: any;
// }

// const Home: React.FC<PropsData> = (props: any) => {
const Home: React.FC = () => {
  const [storedWisdoms, setStoredWisdoms] = useState<WisdomObj[]>([]);
  const [loading, setLoading] = useState(false);

  //////////////////////////////////////////
  // localStorage useEffect
  //////////////////////////////////////////
  // useEffect(() => {
  //   const wisdomsString: string | null = localStorage.getItem('myWisdoms');
  //   if (wisdomsString) {
  //     const wisdomsArr: WisdomObj[] = JSON.parse(wisdomsString);
  //     setStoredWisdoms(wisdomsArr);
  //   }
  // }, []);

  //////////////////////////////////////////
  // firebase useEffect
  //////////////////////////////////////////
  useEffect(() => {
    console.log('inside firebase useEffect');
    console.log(storedWisdoms);
    if (storedWisdoms.length < 1) {
      // setLoading(true);

      // const userCollection = collection(firestoreDB, props.user.email);
      const userCollection = collection(firestoreDB, 'test1@test.com');

      const q = query(userCollection);
      getDocs(q).then((snapshot) => {
        const wisdoms = snapshot.docs.map((item) => ({
          ...item.data(),
        }));
        console.log('snapshot', wisdoms[0]);
        console.log('snapshot', wisdoms[0]);
      });
    }
  }, [storedWisdoms]);

  const pushNotification = () => {
    //////////////////////////////////////////
    // REFACTOR!!!!!
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
      {/* </IonContent> */}
    </IonPage>
  );
};

export default Home;
