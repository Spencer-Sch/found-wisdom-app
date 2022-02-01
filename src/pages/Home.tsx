import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import './Home.css';

import WisdomList from '../components/WisdomList/WisdomList';

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
        <WisdomList />
      </IonContent>
    </IonPage>
  );
};

export default Home;
