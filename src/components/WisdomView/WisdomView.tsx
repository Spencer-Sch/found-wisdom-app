import React from 'react';

import WisdomPageModal from '../../components/WisdomPageModal/WisdomPageModal';

import './WisdomView.css';

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

import { WisdomObj } from '../../models/WisdomObj.model';

interface PropsData {
  showModal: boolean;
  currentWisdom: WisdomObj;
  handleDelete: () => void;
  deleteWisdom: () => void;
  setShowModal: (value: boolean) => void;
  setShowEdit: (value: boolean) => void;
}

const WisdomPage: React.FC<PropsData> = ({
  showModal,
  currentWisdom,
  handleDelete,
  deleteWisdom,
  setShowModal,
  setShowEdit,
}) => {
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="ion-text-center">Found Wisdom</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ss-content-relative">
        {/* confirm delete modal */}
        {/* {showModal && (
          <WisdomPageModal
            deleteWisdom={deleteWisdom}
            setShowModal={setShowModal}
          />
        )} */}
        {/* content */}
        <IonGrid className="ss-grid ion-no-padding ion-margin-top ss-move-back">
          <IonRow>
            <IonRow className="ion-margin-horizontal">
              <IonItemDivider className="ion-no-padding">
                <IonCol>
                  <IonText color="dark" className="ss-larger-text">
                    <p>{currentWisdom.text}</p>
                  </IonText>
                </IonCol>
              </IonItemDivider>
            </IonRow>
            <IonRow className="ion-margin-horizontal ion-align-items-center ion-justify-content-between ss-row">
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
                onClick={() => handleDelete()}
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
        {showModal && (
          <WisdomPageModal
            deleteWisdom={deleteWisdom}
            setShowModal={setShowModal}
          />
        )}
      </IonContent>
    </>
  );
};

export default WisdomPage;
