import { useState } from 'react';
import { useHistory } from 'react-router-dom';

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
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import styles from './wisdomAdd.module.css';

import { WisdomData } from '../../models/models';
import { buildNewWisdom } from '../../functions/wisdomFunctions';
import { useAuth } from '../../contexts/AuthContext';
import { uploadNewWisdom } from '../../actions/firebaseActions';

const getStoredWisdoms = () => {
  console.log('WisdomAdd getItem');
  const wisdomsString: string | null = localStorage.getItem('myWisdoms');
  if (wisdomsString) {
    return JSON.parse(wisdomsString);
  } else {
    return [];
  }
};

const WisdomAdd: React.FC = () => {
  console.log('WisdomAdd Render');

  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const { currentUser } = useAuth();

  const storedWisdoms: WisdomData[] = getStoredWisdoms();

  const formik = useFormik({
    initialValues: {
      source: '',
      text: '',
    },
    validationSchema: Yup.object({
      source: Yup.string(),
      text: Yup.string().required('some text is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      const newWisdom = buildNewWisdom(values, currentUser!.displayName!);
      const wisdomId = newWisdom.wisdomData.id;
      await uploadNewWisdom(newWisdom);
      ///////////////////////////////////////////////////
      // PROBLEM:
      // I need to check if this is the first wisdom to be added to a users wisdomCollections
      ///////////////////////////////////////////////////
      // uploadNewWisdom(newWisdom)
      // updateUsersWisdomCollections(wisdomID)

      setLoading(false);
      history.replace('/');
      ///////////////////////////////////////////////////////////
      // const valuesToSave = {
      //   ...values,
      //   source: values.source === '' ? 'unknown' : values.source,
      //   date: format(new Date(), 'MMM dd, yyyy'),
      //   id: uuidv4(),
      //   next: false,
      // };

      // if (storedWisdoms.length > 0) {
      //   storedWisdoms.push(valuesToSave);
      //   localStorage.setItem('myWisdoms', JSON.stringify(storedWisdoms));
      // } else {
      //   const wisdomsArr = [{ ...valuesToSave, next: true }];
      //   localStorage.setItem('myWisdoms', JSON.stringify(wisdomsArr));
      // }
      // window.location.replace('/');
    },
  });

  return (
    <IonPage>
      {/* <IonHeader>
        <IonToolbar>
          <IonTitle className="ion-text-center">Found Wisdom</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent> */}
      <IonList>
        <form onSubmit={formik.handleSubmit}>
          <IonItem>
            <IonLabel position="stacked"></IonLabel>
            <IonInput
              id="source"
              name="source"
              type="text"
              onIonChange={formik.handleChange}
              value={formik.values.source}
              placeholder="Enter Source Here"
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked"></IonLabel>
            <IonTextarea
              id="text"
              name="text"
              onIonChange={formik.handleChange}
              onIonBlur={formik.handleBlur}
              value={formik.values.text}
              placeholder="Enter Wisdom Here"
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
          href="/"
        >
          cancel
        </IonButton>
      </IonList>
      {loading && (
        <IonLoading
          isOpen={loading}
          spinner="lines-sharp"
          cssClass={styles.my_custom_spinner}
          message="uploading wisdom..."
        />
      )}
      {/* </IonContent> */}
    </IonPage>
  );
};

export default WisdomAdd;
