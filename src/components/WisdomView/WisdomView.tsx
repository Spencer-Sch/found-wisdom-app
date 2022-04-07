import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonItemDivider,
  IonLoading,
  IonRow,
  IonText,
} from '@ionic/react';

import { home } from 'ionicons/icons';

import { deleteWisdomFromFirestore } from '../../actions/firebaseActions';
import WisdomPageModal from '../../components/WisdomPageModal/WisdomPageModal';
import { WisdomData } from '../../models/models';
import { useAuth } from '../../contexts/AuthContext';

import styles from './WisdomView.module.css';

interface PropsData {
  currentWisdom: WisdomData;
  setShowEdit: (value: boolean) => void;
  setShowDeleteModal: (value: boolean) => void;
  showDeleteModal: boolean;
}

const WisdomView: React.FC<PropsData> = ({
  currentWisdom,
  setShowEdit,
  setShowDeleteModal,
  showDeleteModal,
}) => {
  const { currentUser } = useAuth();
  const username = currentUser!.displayName!;
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    setShowDeleteModal(false);
    await deleteWisdomFromFirestore(username, currentWisdom.id);
    setLoading(false);
    history.replace('/');
  };

  return (
    <>
      <IonGrid
        className={`${styles.ss_grid} ${styles.ss_move_back} ion-no-padding ion-margin-top`}
      >
        <IonRow>
          <IonRow className="ion-margin-horizontal">
            <IonItemDivider className="ion-no-padding">
              <IonCol>
                <IonText color="dark" className={styles.ss_larger_text}>
                  <p>{currentWisdom.text}</p>
                </IonText>
              </IonCol>
            </IonItemDivider>
          </IonRow>
          <IonRow
            className={`${styles.ss_row} ion-margin-horizontal ion-align-items-center ion-justify-content-between`}
          >
            <IonCol size="auto">
              <IonText color="medium">
                <p>{currentWisdom.date}</p>
              </IonText>
            </IonCol>
            <IonCol size="auto" className="ion-justify-content-end">
              <IonText color="medium">
                <p>-{currentWisdom.source}</p>
              </IonText>
            </IonCol>
          </IonRow>
        </IonRow>
        <IonRow className="ion-align-items-end ion-justify-content-end">
          <IonCol size="12">
            <IonButton
              expand="full"
              color="secondary"
              className="ion-text-uppercase"
              onClick={() => setShowEdit(true)}
            >
              edit
            </IonButton>
            <IonButton
              expand="full"
              color="danger"
              className="ion-text-uppercase"
              onClick={() => setShowDeleteModal(true)}
            >
              delete
            </IonButton>
            <IonButton
              fill="outline"
              expand="block"
              color="primary"
              routerLink="/"
            >
              <IonIcon color="primary" slot="icon-only" icon={home} />
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
      {/* confirm delete modal */}
      {showDeleteModal && (
        <WisdomPageModal
          handleDelete={handleDelete}
          setShowDeleteModal={setShowDeleteModal}
        />
      )}
      {/* Loading Spinner */}
      <IonLoading
        isOpen={loading}
        spinner="lines-sharp"
        cssClass={styles.my_custom_spinner}
        message="WisdomView deleting wisdom..."
      />
    </>
  );
};

export default WisdomView;
