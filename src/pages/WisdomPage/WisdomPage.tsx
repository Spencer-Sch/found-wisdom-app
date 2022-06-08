import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonPage,
  useIonViewDidEnter,
  useIonViewDidLeave,
} from '@ionic/react';

import WisdomView from '../../components/WisdomView/WisdomView';
import WisdomEdit from '../../components/WisdomEdit/WisdomEdit';
import { WisdomData } from '../../models/models';

import styles from './wisdomPage.module.css';

interface PropsData {
  passingData: {
    currentWisdom: WisdomData;
    setCurrentWisdom: (value: WisdomData | null) => void;
  };
}

const WisdomPage: React.FC<PropsData> = ({ passingData }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { currentWisdom, setCurrentWisdom } = passingData;

  useIonViewDidEnter(() => {
    console.log('WisdomPage Did Enter');
  });
  useIonViewDidLeave(() => {
    console.log('WisdomPage Did Leave');
  });

  useEffect(() => {
    console.log('WisdomPage rendering...');

    return () => {
      console.log('WisdomPage unmounting...');
    };
  });

  return (
    <IonPage>
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
