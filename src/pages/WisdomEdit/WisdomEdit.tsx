import React, { useState } from 'react';

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

const WisdomPage: React.FC = (props) => {
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
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
            <IonInput value={title} />
          </IonItem>
          <IonItem>
            <IonInput value={date} />
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
            <IonTextarea autoGrow value={text}></IonTextarea>
          </IonItem>
          <IonButton
            expand="full"
            color="secondary"
            className="ion-text-uppercase"
            href="/wisdom"
          >
            save
          </IonButton>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default WisdomPage;
