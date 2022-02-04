import React from 'react';

import { useFormik } from 'formik';

import { v4 as uuidv4 } from 'uuid';

import { format } from 'date-fns';

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

const WisdomAdd: React.FC = () => {
  const formik = useFormik({
    initialValues: {
      id: '',
      title: '',
      date: '',
      text: '',
    },
    onSubmit: (values) => {
      values.date = format(new Date(), 'MMM dd, yyyy');
      values.id = uuidv4();
      console.log(values);
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
              <IonLabel position="stacked"></IonLabel>
              <IonInput
                id="title"
                name="title"
                type="text"
                onIonChange={formik.handleChange}
                placeholder="Enter Title Here"
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked"></IonLabel>
              <IonTextarea
                id="text"
                name="text"
                onIonChange={formik.handleChange}
                placeholder="Enter Wisdom Here"
                autoGrow
              ></IonTextarea>
            </IonItem>
            <IonButton
              expand="full"
              type="submit"
              color="secondary"
              className="ion-text-uppercase"
              href="/home"
            >
              save
            </IonButton>
          </form>
          <IonButton
            expand="full"
            color="danger"
            className="ion-text-uppercase"
            href="/home"
          >
            cancel
          </IonButton>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default WisdomAdd;
