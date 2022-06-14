import { useState } from 'react';
import { useHistory } from 'react-router-dom';
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

import { useFormik } from 'formik';
import * as Yup from 'yup';

import {
  addNewWisdomToContext,
  buildNewWisdom,
} from '../../functions/wisdomFunctions';
import { addNewWisdomToFirestore } from '../../actions/firebaseActions';
import { useAuth } from '../../contexts/AuthContext';
import { useWisdomStore } from '../../contexts/WisdomStoreContext';

import styles from './wisdomAdd.module.css';

const WisdomAdd: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { userWisdoms, setUserWisdoms } = useWisdomStore();
  const { currentUser } = useAuth();
  const history = useHistory();

  const headerElHeight = document.getElementById('headerEl')?.offsetHeight;

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
      const username = currentUser!.displayName!;
      const uid = currentUser!.uid;
      const newWisdom = buildNewWisdom(values, username);
      addNewWisdomToFirestore(newWisdom, uid);
      addNewWisdomToContext(newWisdom, userWisdoms, setUserWisdoms!);
      setLoading(false);
      history.replace('/');
    },
  });

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
