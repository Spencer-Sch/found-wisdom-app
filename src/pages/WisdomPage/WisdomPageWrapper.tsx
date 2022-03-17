import { IonLoading } from '@ionic/react';
import React, { useEffect, useState } from 'react';

// import { firestoreDB } from '../../firebase/firebase';
// import { getDocs, collection, query } from 'firebase/firestore';

import { useAuth } from '../../contexts/AuthContext';

import WisdomPage from './WisdomPage';

import { WisdomObj } from '../../models/WisdomObj.model';

import styles from './wisdomPage.module.css';
import { useParams } from 'react-router';

const WisdomPageWrapper: React.FC = () => {
  const { wisdomid }: { wisdomid: string } = useParams();
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const [currentWisdom, setCurrentWisdom] = useState<WisdomObj | null>(null);

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
    console.log('WisdomPageWrapper useEffect running...');

    if (!currentUser) {
      console.error(
        'from useEffect in WisdomPageWrapper: currentUser is null!'
      );
      return;
    }

    if (!currentWisdom) {
      console.log('getting data from firebase...');
      setLoading(true);
      //////////////////
      // commented out for a moment
      // async code? need addtional handling?
      // setCurrentWisdom(fetchWisdomById(wisdomid)); // query wisdomsCollection
      //////////////////

      setLoading(false);
    }
  }, []); // set storedWisdoms as a dependency???

  //////////////////////////////////////////

  // const wisdomViewData = {
  //   currentWisdom,
  // };

  // const wisdomEditData = {
  //   currentWisdom,
  //   storedWisdoms,
  //   wisdomid: wisdomid,
  // };

  const wisdomData = currentWisdom
    ? {
        currentWisdom,
        wisdomid: wisdomid,
      }
    : null;

  // return currentWisdom && storedWisdoms ? (
  return currentWisdom ? (
    <WisdomPage wisdomData={wisdomData!} />
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
