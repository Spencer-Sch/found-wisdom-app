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
      source: '',
      text: '',
    },
    onSubmit: (values) => {
      const valuesToSave = {
        ...values,
        date: format(new Date(), 'MMM dd, yyyy'),
        id: uuidv4(),
      };

      const currentStorage = localStorage.getItem('myWisdoms');

      if (currentStorage) {
        const storageArr = JSON.parse(currentStorage);
        storageArr.push(valuesToSave);
        localStorage.setItem('myWisdoms', JSON.stringify(storageArr));
      } else {
        const wisdomsArr = [valuesToSave];
        localStorage.setItem('myWisdoms', JSON.stringify(wisdomsArr));
      }
      window.location.replace('/');
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
                id="source"
                name="source"
                type="text"
                onIonChange={formik.handleChange}
                placeholder="Enter Source Here"
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
            >
              save
            </IonButton>
          </form>
          <IonButton
            expand="full"
            color="danger"
            className="ion-text-uppercase"
            href="/"
          >
            cancel
          </IonButton>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default WisdomAdd;
