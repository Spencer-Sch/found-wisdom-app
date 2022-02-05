import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

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

  const wisdom = storedWisdoms.find((wisdom) => wisdom.id === wisdomid)!;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="ion-text-center">Found Wisdom</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
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
              >
                delete
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default WisdomPage;
