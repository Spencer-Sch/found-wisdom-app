import React from 'react';

import WisdomPageModal from '../../components/WisdomPageModal/WisdomPageModal';

import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
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
        {showModal && (
          <WisdomPageModal
            deleteWisdom={deleteWisdom}
            setShowModal={setShowModal}
          />
        )}
        {/* content */}
        <IonGrid className="ion-no-padding ion-margin-top">
          <IonRow>
            <IonCol size="12">
              <IonText>
                <h1 className="ion-no-margin">{currentWisdom.source}</h1>
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="4" offset="8">
              <IonText color="medium">
                <p>{currentWisdom.date}</p>
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText>
                <p>{currentWisdom.text}</p>
              </IonText>
            </IonCol>
          </IonRow>
          {/* buttons */}
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
      </IonContent>
    </>
  );
};

export default WisdomPage;
