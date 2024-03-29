import React, { useEffect, useState } from 'react';
import {
  IonButton,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonText,
} from '@ionic/react';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useAuth } from '../../contexts/AuthContext';
import { SubmitLogInForm } from '../../models/models';

import styles from './logInForm.module.css';
import { getErrorMsg } from '../../functions_client/utilFunctions';

interface PropsData {
  setShowRegisterForm: (value: boolean) => void;
}

const LogInForm: React.FC<PropsData> = ({ setShowRegisterForm }) => {
  const [loading, setLoading] = useState(false);
  const { logIn, renderHome, setRenderHome } = useAuth();

  useEffect(() => {
    if (renderHome) {
      setRenderHome!(false);
    }
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
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

  const submitForm: SubmitLogInForm = ({ email, password }) => {
    logIn!(email, password)
      .then(() => {
        setRenderHome!(true);
      })
      .catch((error) => {
        const errorMsg = getErrorMsg(error);

        errorMsg.input === 'email'
          ? (formik.errors.email = errorMsg.msg)
          : (formik.errors.password = errorMsg.msg);
        setLoading(false);
      });
  };

  return (
    <>
      <IonGrid
        className={`${styles.ss_grid} ${styles.ss_move_back} ion-no-padding ion-margin-top`}
        style={{ padding: '1rem' }}
      >
        <form onSubmit={formik.handleSubmit} className={styles.ss_form}>
          <IonText color="dark" className="ion-text-center">
            <h2>Log In</h2>
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
          <div className={`ion-text-center ${styles.ss_div}`}>
            new user?{' '}
            <span
              className={styles.ss_span}
              onClick={() => setShowRegisterForm(true)}
            >
              register here
            </span>
          </div>
        </form>
      </IonGrid>
      <IonLoading
        isOpen={loading}
        spinner="lines-sharp"
        cssClass={styles.my_custom_spinner}
        message="logging in..."
      />
    </>
  );
};

export default LogInForm;
