import React, { useState } from 'react';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonTextarea,
} from '@ionic/react';

import styles from './wisdomEdit.module.css';

import { WisdomData } from '../../models/models';

import {
  handleEdit,
  updateEditedWisdomInWisdomStore,
} from '../../functions/wisdomFunctions';

import { uploadEditedWisdom } from '../../actions/firebaseActions';
import { useWisdomStore } from '../../contexts/WisdomStoreContext';

interface PropsData {
  currentWisdom: WisdomData;
  setShowEdit: (value: boolean) => void;
  setCurrentWisdom: (value: WisdomData) => void;
}

const WisdomEdit: React.FC<PropsData> = ({
  currentWisdom,
  setShowEdit,
  setCurrentWisdom,
}) => {
  const [loading, setLoading] = useState(false);
  const { source, text } = currentWisdom;

  const { userWisdoms, setUserWisdoms } = useWisdomStore();

  const headerElHeight = document.getElementById('headerEl')?.offsetHeight;

  const formik = useFormik({
    initialValues: {
      source: source,
      text: text,
    },
    validationSchema: Yup.object({
      source: Yup.string(),
      text: Yup.string().required('some text is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      const editedWisdom = handleEdit(values, currentWisdom);
      await uploadEditedWisdom(editedWisdom);
      // update WisdomStoreContext with editedWisdom
      updateEditedWisdomInWisdomStore(
        editedWisdom,
        userWisdoms,
        setUserWisdoms!
      );
      setCurrentWisdom(editedWisdom);
      setLoading(false);
      setShowEdit(false);
    },
  });

  return (
    <>
      <IonList style={{ marginTop: `${headerElHeight}px` }}>
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
        message="editing wisdom..."
      />
    </>
  );
};

export default WisdomEdit;
