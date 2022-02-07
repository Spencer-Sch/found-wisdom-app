import React, { useEffect, useMemo, useRef, useState } from 'react';
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

interface WisdomObj {
  id: string;
  title: string;
  date: string;
  text: string;
}

const getStoredWisdoms = () => {
  // this function is being called 4 times for every onChange happening in the input elements.  Not sure how to solve this problem.
  const wisdomsString: string | null = localStorage.getItem('myWisdoms');
  if (wisdomsString) {
    return JSON.parse(wisdomsString);
  } else {
    return [];
  }
};

const WisdomEdit: React.FC = () => {
  const { wisdomid }: { wisdomid: string } = useParams();

  const [storedWisdoms, setStoredWisdoms] = useState<WisdomObj[]>(
    getStoredWisdoms()
  );

  const { title, text } = storedWisdoms.find(
    (wisdom) => wisdom.id === wisdomid
  )!;

  const formik = useFormik({
    initialValues: {
      title: title,
      text: text,
    },
    onSubmit: (values) => {
      console.log('value: ', values);
      storedWisdoms.forEach((item) => {
        if (item.id === wisdomid) {
          item.text = values.text;
          item.title = values.title;
        }
      });
      localStorage.setItem('myWisdoms', JSON.stringify(storedWisdoms));
      window.location.replace(`/wisdom/${wisdomid}`);
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
            >
              save
            </IonButton>
          </form>
          <IonButton
            expand="full"
            color="danger"
            className="ion-text-uppercase"
            href={`/wisdom/${wisdomid}`}
          >
            cancel
          </IonButton>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default WisdomEdit;
