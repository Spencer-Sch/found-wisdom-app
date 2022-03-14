import React from 'react';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import styles from './wisdomEdit.module.css';

import { WisdomObj } from '../../models/WisdomObj.model';
import { handleEdit } from '../../functions/wisdomFunctions';

interface FormikValues {
  source: string;
  text: string;
}

// interface PropsData {
//   currentWisdom: WisdomObj;
//   handleEdit: (values: FormikValues) => void;
//   setShowEdit: (value: boolean) => void;
// }
interface PropsData {
  currentWisdom: WisdomObj;
  storedWisdoms: WisdomObj[];
  setShowEdit: (value: boolean) => void;
}

// const WisdomEdit: React.FC<PropsData> = ({
//   currentWisdom,
//   handleEdit,
//   setShowEdit,
// }) => {
const WisdomEdit: React.FC<PropsData> = ({
  currentWisdom,
  storedWisdoms,
  setShowEdit,
}) => {
  const { source, text } = currentWisdom;

  const formik = useFormik({
    initialValues: {
      source: source,
      text: text,
    },
    validationSchema: Yup.object({
      source: Yup.string(),
      text: Yup.string().required('some text is required'),
    }),
    onSubmit: (values) => {
      const args = {
        values,
        storedWisdoms,
        // this would need to be passed through props
        wisdomid: '123',
        ///////////////////////
        setShowEdit,
      };
      handleEdit(args);
      ///////////////////
      // OLD CODE
      // handleEdit(values);
      ///////////////////
    },
  });

  return (
    <>
      {/* <IonHeader>
        <IonToolbar>
          <IonTitle className="ion-text-center">Found Wisdom</IonTitle>
        </IonToolbar>
      </IonHeader> */}
      <IonContent>
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
                onIonBlur={formik.handleBlur}
                value={formik.values.text}
                autoGrow
              ></IonTextarea>
            </IonItem>
            {formik.touched.text && formik.errors.text ? (
              <div className={`${styles.ss_form_error_label} ion-text-center`}>
                {formik.errors.text}
              </div>
            ) : null}
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
    </>
  );
};

export default WisdomEdit;
