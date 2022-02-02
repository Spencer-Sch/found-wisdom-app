import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonDatetime,
  IonGrid,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonPopover,
  IonRow,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { DUMMY_DATA } from '../../dummy_data/dummy_data';

const WisdomPage: React.FC = (props) => {
  const { wisdomid }: { wisdomid: string } = useParams();
  const wisdom = DUMMY_DATA.find((wisdom) => wisdom.id === wisdomid)!;

  const [date, setDate] = useState(wisdom.date);
  const [title, setTitle] = useState(wisdom.title);
  const [text, setText] = useState(wisdom.text);
  const [showModal, setShowModal] = useState(false);

  const updateDate = (data: any) => {
    setDate(data);
  };
  console.log('curent selected date: ', date);

  // const dateChangeHandler = (data: any) => {
  //   console.log(data);
  // };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="ion-text-center">Found Wisdom</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonLabel position="stacked">Title</IonLabel>
            <IonInput value={title} />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Date</IonLabel>
            <IonText className="ion-margin-top">
              <p style={{ margin: '0' }}>{date}</p>
            </IonText>
            <IonButton onClick={() => setShowModal(true)}>choose</IonButton>
            <IonModal isOpen={showModal}>
              <IonContent>
                <IonDatetime
                  presentation="date"
                  onIonChange={(ev) => updateDate(ev.detail.value!)}
                >
                  <IonButtons slot="buttons">
                    <IonButton
                      color="secondary"
                      onClick={(ev) => {
                        setShowModal(false);
                      }}
                    >
                      confirm
                    </IonButton>
                  </IonButtons>
                </IonDatetime>
              </IonContent>
            </IonModal>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Your Wisdom</IonLabel>
            <IonTextarea autoGrow value={text}></IonTextarea>
          </IonItem>
          <IonButton
            expand="full"
            color="secondary"
            className="ion-text-uppercase"
            href={`/wisdom/${wisdom.id}`}
          >
            save
          </IonButton>
          <IonButton
            expand="full"
            color="danger"
            className="ion-text-uppercase"
            href={`/wisdom/${wisdom.id}`}
          >
            cancel
          </IonButton>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default WisdomPage;
