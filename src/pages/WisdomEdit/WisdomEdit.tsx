import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useFormik } from 'formik';

import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { DUMMY_DATA } from '../../dummy_data/dummy_data';

const WisdomEdit: React.FC = () => {
  const { wisdomid }: { wisdomid: string } = useParams();
  const wisdom = DUMMY_DATA.find((wisdom) => wisdom.id === wisdomid)!;

  const [title, setTitle] = useState(wisdom.title);
  const [text, setText] = useState(wisdom.text);

  const formik = useFormik({
    initialValues: {
      title: title,
      text: text,
    },
    onSubmit: (values) => {
      console.log({
        id: wisdomid,
        ...values,
      });
      DUMMY_DATA.forEach((item) => {
        if (item.id === wisdomid) {
          item.text = values.text;
          item.title = values.title;
        }
      });
      console.log(DUMMY_DATA);
    },
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="ion-text-center">Found Wisdom</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <form onSubmit={formik.handleSubmit}>
            <IonItem>
              <IonLabel position="stacked">Title</IonLabel>
              <IonInput
                id="title"
                name="title"
                type="text"
                onIonChange={formik.handleChange}
                value={formik.values.title}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Your Wisdom</IonLabel>
              <IonTextarea
                id="text"
                name="text"
                onIonChange={formik.handleChange}
                value={formik.values.text}
                autoGrow
              ></IonTextarea>
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

export default WisdomEdit;
