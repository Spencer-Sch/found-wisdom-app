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
      message="logging in..."
    />
  );
};

export default HomeWrapper;
