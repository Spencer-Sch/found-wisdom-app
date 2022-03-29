import React from 'react';

import WisdomPageModal from '../../components/WisdomPageModal/WisdomPageModal';

import styles from './WisdomView.module.css';

import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItemDivider,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { home } from 'ionicons/icons';

import { WisdomData } from '../../models/models';

// interface PropsData {
//   showDeleteModal: boolean;
//   currentWisdom: WisdomData;
//   handleDelete: () => void;
//   setShowDeleteModal: (value: boolean) => void;
//   setShowEdit: (value: boolean) => void;
// }
interface PropsData {
  currentWisdom: WisdomData;
  setShowEdit: (value: boolean) => void;
  setShowDeleteModal: (value: boolean) => void;
  showDeleteModal: boolean;
}

// const WisdomPage: React.FC<PropsData> = ({
//   showDeleteModal,
//   currentWisdom,
//   handleDelete,
//   setShowDeleteModal,
//   setShowEdit,
// }) => {
const WisdomPage: React.FC<PropsData> = ({
  currentWisdom,
  setShowEdit,
  setShowDeleteModal,
  showDeleteModal,
}) => {
  return (
    <>
      {/* <IonHeader>
        <IonToolbar>
          <IonTitle className="ion-text-center">Found Wisdom</IonTitle>
        </IonToolbar>
      </IonHeader> */}
      <IonContent>
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
              <IonButton fill="outline" expand="block" color="primary" href="/">
                <IonIcon color="primary" slot="icon-only" icon={home} />
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
        {/* confirm delete modal */}
        {showDeleteModal && (
          <WisdomPageModal
            wisdomId={currentWisdom.id}
            setShowDeleteModal={setShowDeleteModal}
          />
        )}
      </IonContent>
    </>
  );
};

export default WisdomPage;
