import React from 'react';

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

import { WisdomObj } from '../../models/WisdomObj.model';

interface FomikValues {
  source: string;
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
  const { source, text } = currentWisdom;

  const formik = useFormik({
    initialValues: {
      source: source,
      text: text,
    },
    onSubmit: (values) => {
      handleEdit(values);
    },
  });

  return (
    <IonPage>
      {/* <IonHeader>
        <IonToolbar>
          <IonTitle className="ion-text-center">Found Wisdom</IonTitle>
        </IonToolbar>
      </IonHeader> */}
      {/* <IonContent> */}
      <IonList>
        <form onSubmit={formik.handleSubmit}>
          <IonItem>
            <IonLabel position="stacked">Source</IonLabel>
            <IonInput
              id="source"
              name="source"
              type="text"
              onIonChange={formik.handleChange}
              value={formik.values.source}
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
      {/* </IonContent> */}
    </IonPage>
  );
};

export default WisdomEdit;
