import React from 'react';
import { useParams } from 'react-router-dom';

import { DUMMY_DATA } from '../../dummy_data/dummy_data';

import { format, parseISO } from 'date-fns';

import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonItem,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

const WisdomPage: React.FC = () => {
  const { wisdomid }: { wisdomid: string } = useParams();

  const wisdom = DUMMY_DATA.find((wisdom) => wisdom.id === wisdomid)!;

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
              {/* <IonItem> */}
              <IonText>
                <h1 className="ion-no-margin">{wisdom.title}</h1>
              </IonText>
              {/* </IonItem> */}
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="4" offset="8">
              {/* <IonItem> */}
              <IonText color="medium">
                <p>{format(parseISO(wisdom.date), 'MMM d, yyyy')}</p>
              </IonText>
              {/* </IonItem> */}
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              {/* <IonItem> */}
              <IonText>
                <p>{wisdom.text}</p>
              </IonText>
              {/* </IonItem> */}
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
