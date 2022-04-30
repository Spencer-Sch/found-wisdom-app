import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonTextarea,
} from '@ionic/react';

import styles from './wisdomAdd.module.css';

// import { AddNewWisdomToDB } from '../../models/models';
import {
  addNewWisdomToContext,
  buildNewWisdom,
} from '../../functions/wisdomFunctions';
import { useAuth } from '../../contexts/AuthContext';
import {
  uploadNewWisdom,
  fetchUserData,
  addToUserWisdomCollections,
  addNewWisdomToFirestore,
} from '../../actions/firebaseActions';
import { useWisdomStore } from '../../contexts/WisdomStoreContext';

const WisdomAdd: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const headerElHeight = document.getElementById('headerEl')?.offsetHeight;

  const { currentUser } = useAuth();

  const { userWisdoms, setUserWisdoms } = useWisdomStore();

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
      const username = currentUser!.displayName!; // new code
      // await addNewWisdom(values); // old code
      // await addNewWisdomToDB(values); // new local call
      await addNewWisdomToFirestore(values, username); // new code / new imported call
      addNewWisdomToContext(values, username, userWisdoms, setUserWisdoms!); // new code
      setLoading(false);
      history.replace('/');
    },
  });

  // old caode
  // TODO: move to firebaseActions.ts ???
  // const addNewWisdomToDB: AddNewWisdomToDB = async (values) => {
  //   // create and upload new wisdom to wisdomsCollection
  //   const username = currentUser!.displayName!;
  //   const newWisdom = buildNewWisdom(values, username);
  //   uploadNewWisdom(newWisdom);

  //   // upload new wisdom to user's wisdomCollections
  //   const userData = await fetchUserData(username);
  //   const userWisdomCollections = userData.wisdomCollections;
  //   const wisdomId = newWisdom.wisdomData.id;
  //   addToUserWisdomCollections(username, wisdomId, userWisdomCollections);
  // };

  return (
    <IonPage>
      <IonContent id="page-content">
        <IonList style={{ marginTop: `${headerElHeight}px` }}>
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
            routerDirection="back"
            onClick={() => {
              history.replace('/');
            }}
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
