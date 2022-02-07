import React from 'react';

import { useFormik } from 'formik';

// WisdomPageWisdomEditMerge

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

interface FomikValues {
  title: string;
  text: string;
}

interface WisdomObj {
  id: string;
  title: string;
  date: string;
  text: string;
}

interface PropsData {
  currentWisdom: WisdomObj;
  handleEdit: (values: FomikValues) => void;
  setShowEdit: (value: boolean) => void;
}

const WisdomEdit: React.FC<PropsData> = ({
  currentWisdom,
  handleEdit,
  setShowEdit,
}) => {
  const { title, text } = currentWisdom;

  const formik = useFormik({
    initialValues: {
      title: title,
      text: text,
    },
    onSubmit: (values) => {
      handleEdit(values);
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
            onClick={() => setShowEdit(false)}
          >
            cancel
          </IonButton>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default WisdomEdit;
