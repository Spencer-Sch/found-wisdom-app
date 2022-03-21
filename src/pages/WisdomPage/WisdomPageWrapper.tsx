import { IonLoading } from '@ionic/react';
import React, { useEffect, useState } from 'react';

import { useAuth } from '../../contexts/AuthContext';
import { fetchCurrentWisdom } from '../../actions/firebaseActions';

import WisdomPage from './WisdomPage';

import { WisdomData } from '../../models/models';

import styles from './wisdomPage.module.css';
import { useParams } from 'react-router';

const WisdomPageWrapper: React.FC = () => {
  const { wisdomid }: { wisdomid: string } = useParams();
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const [currentWisdom, setCurrentWisdom] = useState<WisdomData | null>(null);

  // const [storedWisdoms, setStoredWisdoms] = useState<WisdomObj[] | null>(null); //Firestore data stored here
  // const [storedWisdoms, setStoredWisdoms] = useState<WisdomObj[] | null>([]); //Firestore data stored here

  ///////////////////////////////////////////////
  // ORIGINAL CODE
  // const currentWisdom = storedWisdoms.find(
  //   (wisdom) => wisdom.id === wisdomid
  // )!;
  ///////////////////////////////////////////////
  // MOST RECENTLY USED CODE
  // const currentWisdom = storedWisdoms
  //   ? storedWisdoms.find((wisdom) => wisdom.id === wisdomid)!
  //   : null;
  ///////////////////////////////////////////////

  useEffect(() => {
    // console.log('WisdomPageWrapper useEffect running...');

    if (!currentUser) {
      // improve error handeling!!!
      console.error(
        'from useEffect in WisdomPageWrapper: currentUser is null!'
      );
      return;
    }

    if (!currentWisdom) {
      getSelectedWisdom();
    }

    async function getSelectedWisdom() {
      // console.log('getting data from firebase...');
      setLoading(true);
      const returnedWisdom = await fetchCurrentWisdom(wisdomid);
      setCurrentWisdom(returnedWisdom);
      setLoading(false);
    }
  }, [currentUser, currentWisdom, wisdomid]);

  //////////////////////////////////////////

  // const wisdomViewData = {
  //   currentWisdom,
  // };

  // const wisdomEditData = {
  //   currentWisdom,
  //   storedWisdoms,
  //   wisdomid: wisdomid,
  // };

  const passingData = currentWisdom
    ? {
        currentWisdom,
        setCurrentWisdom,
      }
    : null;

  // return currentWisdom && storedWisdoms ? (
  return currentWisdom ? (
    <WisdomPage passingData={passingData!} />
  ) : (
    // <WisdomPage
    //   wisdomViewData={wisdomViewData}
    //   wisdomEditData={wisdomEditData}
    // />
    // <WisdomPage currentWisdom={currentWisdom} storedWisdoms={storedWisdoms} />
    // further error handeling???
    // add a timer to time out and kick back to home page?
    <IonLoading
      isOpen={true}
      spinner="lines-sharp"
      cssClass={styles.my_custom_spinner}
      message="logging in..."
    />
  );
};

export default WisdomPageWrapper;
