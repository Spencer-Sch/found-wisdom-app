import React, { useState } from 'react';

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
  IonLoading,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import styles from './wisdomEdit.module.css';

import { WisdomObj } from '../../models/WisdomObj.model';
/////////////////////
// commented out for a moment
// import { handleEdit } from '../../functions/wisdomFunctions';
/////////////////////

interface FormikValues {
  source: string;
  text: string;
}

// interface PropsData {
//   currentWisdom: WisdomObj;
//   handleEdit: (values: FormikValues) => void;
//   setShowEdit: (value: boolean) => void;
// }
// interface PropsData {
//   passingData: {
//     currentWisdom: WisdomObj;
//     storedWisdoms: WisdomObj[];
//     setShowEdit: (value: boolean) => void;
//   }
// }
interface PropsData {
  currentWisdom: WisdomObj;
  storedWisdoms: WisdomObj[];
  setShowEdit: (value: boolean) => void;
  wisdomid: string;
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
  wisdomid,
}) => {
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      const args = {
        values,
        wisdomid: wisdomid,
      };
      // See data restructure idea for Firestore (luke shared google doc)
      ////////////////////////
      // commented out for a moment
      // const updatedWisdoms = handleEdit(args);
      ////////////////////////
      // updateWisdomCollection()
      // update storedWisdoms locally to avoid another fetch when returning to Home?
      setLoading(false);
      setShowEdit(false);
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
        <IonLoading
          isOpen={loading}
          spinner="lines-sharp"
          cssClass={styles.my_custom_spinner}
          message="logging in..."
        />
      </IonContent>
    </>
  );
};

export default WisdomEdit;
