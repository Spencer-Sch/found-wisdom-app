import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useFormik } from 'formik';
import * as Yup from 'yup';

// import { v4 as uuidv4 } from 'uuid';

// import { format } from 'date-fns';

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
    onSubmit: (values) => {
      setLoading(true);
      const newWisdom = buildNewWisdom(values);
      ///////////////////////////////////////////////////
      // Where do I check and alter the 'next' propery of the new wisdom?
      // I need to check if this is the first wisdom to be added to a users wisdomCollections
      // PROBLEM:
      // If, in the future, multiple users can have access to the same wisdom in the usersCollection doc, how do I keep each user's 'next' property unique?
      // POSSIBLE SOLUTION:
      // the 'next' property isn't a property on the wisdomData object, it's a property somewhere inside the user object. It would contain the uuid of the next wisdom to be pushed and would update each time that user is pushed.
      ///////////////////////////////////////////////////
      // uploadNewWisdom(newWisdom)
      // updateUsersWisdomCollections(wisdomID)

      setLoading(false);
      ///////////////////////////////////////////////////////////
      // const valuesToSave = {
      //   ...values,
      //   source: values.source === '' ? 'unknown' : values.source,
      //   date: format(new Date(), 'MMM dd, yyyy'),
      //   id: uuidv4(),
      //   next: false,
      // };

      if (storedWisdoms.length > 0) {
        storedWisdoms.push(valuesToSave);
        localStorage.setItem('myWisdoms', JSON.stringify(storedWisdoms));
      } else {
        const wisdomsArr = [{ ...valuesToSave, next: true }];
        localStorage.setItem('myWisdoms', JSON.stringify(wisdomsArr));
      }
      history.replace('/');
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
          message="logging in..."
        />
      )}
      {/* </IonContent> */}
    </IonPage>
  );
};

export default WisdomAdd;
