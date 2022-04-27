import React from 'react';

import { IonLoading } from '@ionic/react';

import { useAuth } from '../../contexts/AuthContext';

import Home from './Home';

import styles from './home.module.css';

const HomeWrapper: React.FC = () => {
  // global-state steps:
  // CODE SKETCH:
  // const [globalState] = useStore();
  const { renderHome } = useAuth();

  // console.log('HomeWrapper rendering...');

  // CODE SKETCH:
  // return globalState.storedWisdoms ? (
  return renderHome ? (
    // global-store steps:
    // instead of using renderHome to gate the Home.tsx component
    // watch the global-store state of storedWisdoms, which by default will be null
    // once it is set to actual data then Home.tsx renders
    <Home />
  ) : (
    <IonLoading
      isOpen={true}
      spinner="lines-sharp"
      cssClass={styles.my_custom_spinner}
      message="loading home..."
    />
    // TODO: add a timeout that will trigger an error message if loading takes longer than 30 seconds
  );
};

export default HomeWrapper;
