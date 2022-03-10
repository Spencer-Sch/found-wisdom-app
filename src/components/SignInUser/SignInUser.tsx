import {
  IonButton,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonText,
} from '@ionic/react';
import React, { useState } from 'react';

import { firebase } from '../../firebase/firebase';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import { Redirect } from 'react-router-dom';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import styles from './signInNewUser.module.css';

interface PropsData {
  setShowRegisterForm: (value: boolean) => void;
}

const SignInUser: React.FC<PropsData> = (props: any) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: 'admin@fw.com',
      password: 'qwerty123456',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('email is required'),
      password: Yup.string().required('password is required'),
    }),
    onSubmit: (values) => {
      setLoading(true);
      submitForm(values);
    },
  });

  const submitForm = (values: { email: string; password: string }) => {
    const auth = getAuth(firebase);

    signInWithEmailAndPassword(auth, values.email, values.password)
      .then(() => {
        props.history.replace('/');
      })
      .catch((error) => {
        console.log('sign in: ', error);
      });
  };

  return (
    <IonGrid
      className={`${styles.ss_grid} ${styles.ss_move_back} ion-no-padding ion-margin-top`}
      style={{ padding: '1rem' }}
    >
      <form onSubmit={formik.handleSubmit} className={styles.ss_form}>
        <IonText color="dark" className="ion-text-center">
          <h2>Please Log In</h2>
        </IonText>

        <IonItem>
          <IonLabel position="stacked"></IonLabel>
          <IonInput
            id="email"
            name="email"
            type="text"
            onIonChange={formik.handleChange}
            onIonBlur={formik.handleBlur}
            value={formik.values.email}
            placeholder="Enter Email Here"
          />
        </IonItem>
        {formik.touched.email && formik.errors.email ? (
          <div className={`${styles.ss_form_error_label} ion-text-center`}>
            {formik.errors.email}
          </div>
        ) : null}

        <IonItem>
          <IonLabel position="stacked"></IonLabel>
          <IonInput
            id="password"
            name="password"
            type="password"
            onIonChange={formik.handleChange}
            onIonBlur={formik.handleBlur}
            value={formik.values.password}
            placeholder="Enter Password Here"
          />
        </IonItem>
        {formik.touched.password && formik.errors.password ? (
          <div className={`${styles.ss_form_error_label} ion-text-center`}>
            {formik.errors.password}
          </div>
        ) : null}

        <IonButton
          expand="block"
          type="submit"
          color="primary"
          disabled={loading}
          className="ion-text-uppercase"
        >
          log in
        </IonButton>
        <IonButton
          fill="clear"
          expand="block"
          color="secondary"
          disabled={loading}
          className="ion-text-lowercase"
          onClick={() => props.setShowRegisterForm(true)}
        >
          new user? register here.
        </IonButton>

        {loading ? (
          <IonLoading
            isOpen={loading}
            spinner="lines-sharp"
            cssClass={styles.my_custom_spinner}
            message="logging in..."
          />
        ) : (
          <>
            {/* <IonButton
              expand="block"
              type="submit"
              color="primary"
              className="ion-text-uppercase"
            >
              log in
            </IonButton> */}
            {/* <IonButton
              fill="clear"
              expand="block"
              color="secondary"
              className="ion-text-lowercase"
              onClick={() => props.setShowRegisterForm(true)}
            >
              new user? register here.
            </IonButton> */}
          </>
        )}
      </form>
    </IonGrid>
  );
};

export default SignInUser;
