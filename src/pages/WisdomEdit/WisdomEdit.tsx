import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

// import { useFormik } from 'formik';

// import { format, parseISO } from 'date-fns';

import {
  IonButton,
  IonContent,
  IonDatetime,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { DUMMY_DATA } from '../../dummy_data/dummy_data';

const WisdomPage: React.FC = (props) => {
  const { wisdomid }: { wisdomid: string } = useParams();
  const wisdom = DUMMY_DATA.find((wisdom) => wisdom.id === wisdomid)!;

  // const [date, setDate] = useState(
  //   format(parseISO(wisdom.date), 'MMM d, yyyy')
  // );
  const [title, setTitle] = useState(wisdom.title);
  const [text, setText] = useState(wisdom.text);

  // const formik = useFormik({
  //   initialValues: {
  //     title: title,
  //     date: date,
  //     text: text,
  //   },
  //   onSubmit: (values) => {
  //     console.log(JSON.stringify(values, null, 2));
  //   },
  // });

  // const updateDate = (dateTime: string) => {
  //   setDate(format(parseISO(dateTime), 'MMM d, yyyy'));
  // };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="ion-text-center">Found Wisdom</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {/* <form onSubmit={formik.handleSubmit}> */}
          {/* <form onSubmit={console.log('submit')}> */}
          <form>
            <IonItem>
              <IonLabel position="stacked">Title</IonLabel>
              <IonInput
                // id="title"
                // name="title"
                // type="text"
                // onIonChange={formik.handleChange}
                // value={formik.values.title}
                value={title}
              />
            </IonItem>
            {/* <IonItem>
              <IonLabel position="stacked">Date</IonLabel>
              <IonText className="ion-margin-top ion-margin-bottom">
                {/* <span style={{ margin: '0' }}>{formik.values.date}</span> 
                <span>{date}</span>
              </IonText>*/}
            {/* Date read only ? */}
            {/* <IonButton
                id="open-modal"
                className="ion-margin-bottom ion-margin-top"
              >
                choose
              </IonButton>
              <IonModal trigger="open-modal">
                <IonContent>
                  <IonDatetime
                    // id="date"
                    // name="date"
                    // onIonChange={formik.handleChange}
                    showDefaultButtons={true}
                    presentation="date"
                    onIonChange={(ev) => {
                      updateDate(ev.detail.value!);
                    }}
                  ></IonDatetime>
                </IonContent>
              </IonModal> */}
            {/* </IonItem> */}
            <IonItem>
              <IonLabel position="stacked">Your Wisdom</IonLabel>
              <IonTextarea
                // id="text"
                // name="text"
                // onIonChange={formik.handleChange}
                // value={formik.values.text}
                value={text}
                autoGrow
              ></IonTextarea>
            </IonItem>
            <IonButton
              expand="full"
              type="submit"
              color="secondary"
              className="ion-text-uppercase"
              href={`/wisdom/${wisdom.id}`}
            >
              save
            </IonButton>
          </form>
          <IonButton
            expand="full"
            color="danger"
            className="ion-text-uppercase"
            href={`/wisdom/${wisdom.id}`}
          >
            cancel
          </IonButton>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default WisdomPage;
