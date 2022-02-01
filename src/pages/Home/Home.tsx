import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { add } from 'ionicons/icons';

import './Home.css';

import WisdomList from '../../components/WisdomList/WisdomList';

const dummyCardData = [
  { id: 'w1', title: 'Title 1', date: '08/20/1990', text: 'This is wisdom #1' },
  { id: 'w2', title: 'Title 2', date: '08/22/1990', text: 'This is wisdom #2' },
];

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="ion-text-center">Found Wisdom</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Wisdom</IonTitle>
          </IonToolbar>
        </IonHeader>
        {/* Page Content Here */}
        <WisdomList items={dummyCardData} />
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="secondary">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Home;
