import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import WisdomPageModal from '../../components/WisdomPageModal/WisdomPageModal';

import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { home } from 'ionicons/icons';

interface WisdomObj {
  id: string;
  title: string;
  date: string;
  text: string;
}

const getStoredWisdoms = () => {
  const wisdomsString: string | null = localStorage.getItem('myWisdoms');
  if (wisdomsString) {
    return JSON.parse(wisdomsString);
  } else {
    return [];
  }
};

const WisdomPage: React.FC = () => {
  const { wisdomid }: { wisdomid: string } = useParams();

  const [storedWisdoms, setStoredWisdoms] = useState<WisdomObj[]>(
    getStoredWisdoms()
  );
  const [showModal, setShowModal] = useState(false);

  const wisdom = storedWisdoms.find((wisdom) => wisdom.id === wisdomid)!;

  const handleDelete = () => {
    setShowModal(true);
  };

  const deleteWisdom = () => {
    const filteredWisdoms = storedWisdoms.filter(
      (item) => item.id !== wisdomid
    );
    localStorage.setItem('myWisdoms', JSON.stringify(filteredWisdoms));
    setShowModal(false);
    window.location.replace(`/`);
  };

  return (
    <IonPage>
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
        {/* page content */}
        <IonGrid className="ion-no-padding ion-margin-top">
          <IonRow>
            <IonCol size="12">
              <IonText>
                <h1 className="ion-no-margin">{wisdom.title}</h1>
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="4" offset="8">
              <IonText color="medium">
                <p>{wisdom.date}</p>
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText>
                <p>{wisdom.text}</p>
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow className="ion-align-items-end ion-justify-content-end">
            <IonCol size="12">
              <IonButton
                expand="full"
                color="secondary"
                className="ion-text-uppercase"
                href={`/wisdom/edit/${wisdom.id}`}
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
    </IonPage>
  );
};

export default WisdomPage;
