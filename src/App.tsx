import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import WisdomPage from './pages/WisdomPage/WisdomPage';
import WisdomEdit from './pages/WisdomEdit/WisdomEdit';
import Home from './pages/Home/Home';
import WisdomAdd from './pages/WisdomAdd/WisdomAdd';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/wisdom/edit/:wisdomid" component={WisdomEdit} />
        <Route exact path="/wisdom/:wisdomid" component={WisdomPage} />
        <Route exact path="/wisdom/add" component={WisdomAdd} />
        <Route exact path="/home">
          <Redirect to="/" />
        </Route>
        <Route exact path="/" component={Home} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
