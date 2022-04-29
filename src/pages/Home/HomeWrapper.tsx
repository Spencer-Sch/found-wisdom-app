import React from 'react';

import { IonLoading } from '@ionic/react';

import { useAuth } from '../../contexts/AuthContext';

import Home from './Home';

import styles from './home.module.css';

const HomeWrapper: React.FC = () => {
  const { renderHome } = useAuth();

  // console.log('HomeWrapper rendering...');
  return renderHome ? (
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
