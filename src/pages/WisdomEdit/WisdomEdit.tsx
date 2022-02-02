import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  IonButton,
  IonContent,
  IonDatetime,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
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

  const formatDate = (dateTime: string) => {
    const slicedDate = dateTime.slice(0, dateTime.indexOf('T'));
    const [year, month, day] = slicedDate.split('-');
    return `${month}/${day}/${year}`;
  };

  const updateDate = (dateTime: string) => {
    const formatedDate = formatDate(dateTime);
    setDate(formatedDate);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="ion-text-center">Found Wisdom</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log('submited.');
            }}
          >
            <IonItem>
              <IonLabel position="stacked">Title</IonLabel>
              <IonInput value={title} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Date</IonLabel>
              <IonText className="ion-margin-top">
                <span style={{ margin: '0' }}>{date}</span>
              </IonText>
              <IonButton
                id="open-modal"
                className="ion-margin-bottom ion-margin-top"
              >
                choose
              </IonButton>
              <IonModal trigger="open-modal">
                <IonContent>
                  <IonDatetime
                    showDefaultButtons={true}
                    presentation="date"
                    onIonChange={(ev) => {
                      updateDate(ev.detail.value!);
                    }}
                  ></IonDatetime>
                </IonContent>
              </IonModal>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Your Wisdom</IonLabel>
              <IonTextarea autoGrow value={text}></IonTextarea>
            </IonItem>
            <IonButton
              expand="full"
              type="submit"
              color="secondary"
              className="ion-text-uppercase"
              href={`/wisdom/${wisdom.id}`}
            >
              save
            </IonButton>
          </form>
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
