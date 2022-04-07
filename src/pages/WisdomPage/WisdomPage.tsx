import React, { useState } from 'react';
import { IonContent, IonPage } from '@ionic/react';

import Header from '../../components/Header/Header';
import WisdomView from '../../components/WisdomView/WisdomView';
import WisdomEdit from '../../components/WisdomEdit/WisdomEdit';
import { WisdomData } from '../../models/models';

import styles from './wisdomPage.module.css';

interface PropsData {
  passingData: {
    currentWisdom: WisdomData;
    setCurrentWisdom: (value: WisdomData) => void;
  };
}

const WisdomPage: React.FC<PropsData> = ({ passingData }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { currentWisdom } = passingData;

  return (
    <IonPage>
      <Header />
      <IonContent id="page-content" fullscreen>
        {!showEdit ? (
          <WisdomView
            currentWisdom={currentWisdom}
            setShowEdit={setShowEdit}
            setShowDeleteModal={setShowDeleteModal}
            showDeleteModal={showDeleteModal}
          />
        ) : (
          <WisdomEdit {...passingData} setShowEdit={setShowEdit} />
        )}
      </IonContent>
    </IonPage>
  );
};

export default WisdomPage;
