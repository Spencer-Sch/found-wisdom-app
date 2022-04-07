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

import Header from '../../components/Header/Header';
import { AddNewWisdom } from '../../models/models';
import { buildNewWisdom } from '../../functions/wisdomFunctions';
import { useAuth } from '../../contexts/AuthContext';
import {
  uploadNewWisdom,
  fetchUserData,
  addToUserWisdomCollections,
} from '../../actions/firebaseActions';

const WisdomAdd: React.FC = () => {
  // console.log('WisdomAdd Render');

  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const { currentUser, setRenderHome } = useAuth();

  const formik = useFormik({
    initialValues: {
      source: '',
      text: '',
    },
    validationSchema: Yup.object({
      source: Yup.string().trim(),
      text: Yup.string().trim().required('some text is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      await addNewWisdom(values);
      setLoading(false);
      setRenderHome!(true);
      history.replace('/');
    },
  });

  const addNewWisdom: AddNewWisdom = async (values) => {
    // create and upload new wisdom to wisdomsCollection
    const username = currentUser!.displayName!;
    const userData = await fetchUserData(username);
    const newWisdom = buildNewWisdom(values, username);
    uploadNewWisdom(newWisdom);

    // upload new wisdom to user's wisdomCollections
    const userWisdomCollections = userData.wisdomCollections;
    const wisdomId = newWisdom.wisdomData.id;
    addToUserWisdomCollections(username, wisdomId, userWisdomCollections);
  };

  return (
    <IonPage>
      <Header />
      <IonContent id="page-content" fullscreen>
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
            routerLink="/"
          >
            cancel
          </IonButton>
        </IonList>
        <IonLoading
          isOpen={loading}
          spinner="lines-sharp"
          cssClass={styles.my_custom_spinner}
          message="uploading wisdom..."
        />
      </IonContent>
    </IonPage>
  );
};

export default WisdomAdd;
