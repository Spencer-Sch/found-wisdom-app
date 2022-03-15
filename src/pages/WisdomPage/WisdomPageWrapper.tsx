import { IonLoading } from '@ionic/react';
import React, { useEffect, useState } from 'react';

import { firestoreDB } from '../../firebase/firebase';
import { getDocs, collection, query } from 'firebase/firestore';

import { useAuth } from '../../contexts/AuthContext';

import WisdomPage from './WisdomPage';

import { WisdomObj } from '../../models/WisdomObj.model';

import styles from './wisdomPage.module.css';
import { useParams } from 'react-router';

const WisdomPageWrapper: React.FC = () => {
  const { wisdomid }: { wisdomid: string } = useParams();
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  // const [currentWisdom, setCurrentWisdom] = useState<WisdomObj>([]);

  const [storedWisdoms, setStoredWisdoms] = useState<WisdomObj[] | null>(null); //Firestore data stored here
  // const [storedWisdoms, setStoredWisdoms] = useState<WisdomObj[] | null>([]); //Firestore data stored here

  ///////////////////////////////////////////////
  // ORIGINAL CODE
  // const currentWisdom = storedWisdoms.find(
  //   (wisdom) => wisdom.id === wisdomid
  // )!;
  ///////////////////////////////////////////////
  const currentWisdom = storedWisdoms
    ? storedWisdoms.find((wisdom) => wisdom.id === wisdomid)!
    : null;
  ///////////////////////////////////////////////

  //////////////////////////////////////////
  // firebase useEffect
  //////////////////////////////////////////

  useEffect(() => {
    console.log('WisdomPageWrapper useEffect running...');

    if (!storedWisdoms) {
      console.log('getting data from firebase...');
      setLoading(true);

      const userCollection = collection(firestoreDB, currentUser!.email!);
      // const userCollection = collection(firestoreDB, 'test1@test.com');

      // console.log('userCollection: ', userCollection);

      const q = query(userCollection);
      getDocs(q)
        .then((snapshot) => {
          console.log('processing data checkpoint 1');
          const userDoc = snapshot.docs.map((item) => ({
            ...item.data(),
          }));
          const userObj = userDoc[0];
          const userWisdoms = userObj.userWisdoms;
          console.log('setting StoredWisdoms state');
          setStoredWisdoms(userWisdoms);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          console.log('processing data checkpoint 2');
          setLoading(false);
        });
    }
  }, [storedWisdoms]);

  //////////////////////////////////////////

  return currentWisdom && storedWisdoms ? (
    <WisdomPage currentWisdom={currentWisdom} storedWisdoms={storedWisdoms} />
  ) : (
    // further error handeling???
    // add a timer to time out and kick back to home page?
    <IonLoading
      isOpen={true}
      // isOpen={loading}
      spinner="lines-sharp"
      cssClass={styles.my_custom_spinner}
      message="logging in..."
    />
  );
};

export default WisdomPageWrapper;
