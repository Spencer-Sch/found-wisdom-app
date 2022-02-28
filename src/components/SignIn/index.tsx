import {
  IonButton,
  IonContent,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonPage,
  IonText,
} from '@ionic/react';
import React, { useState } from 'react';

import { firebase } from '../../firebase/firebase';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import { Redirect } from 'react-router-dom';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import styles from './signin.module.css';

const SignIn = (props: any) => {
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
        // props.history.push('/');
        props.history.replace('/');
        // console.log(props.history);
        setLoading(false);
        // <Redirect to="/" />;
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.message);
      });
  };

  return (
    <IonPage>
      <IonContent>
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

            {loading ? (
              <IonLoading
                isOpen={loading}
                spinner="lines-sharp"
                cssClass={styles.my_custom_spinner}
                message="logging in..."
              />
            ) : (
              <IonButton
                expand="full"
                type="submit"
                color="primary"
                className="ion-text-uppercase"
              >
                log in
              </IonButton>
            )}
          </form>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default SignIn;
