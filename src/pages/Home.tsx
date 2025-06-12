import {
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonContent,
  IonIcon,
  IonAlert,
  useIonRouter,
} from '@ionic/react';
import './Home.css';
import { useEffect, useState } from 'react';
import Card from '../components/Card';
import { connection } from '../connection/connection';
import AllMovies from '../components/AllMovies';
import Tabs from '../components/Tabs';
import { powerOutline } from 'ionicons/icons';

type TabType = 'películas' | 'series' | 'tv';

type AlertInputs = {
  titleInput?: string;
  actorInput?: string;
};

const Home: React.FC = () => {
  const [dataMovie, setDataMovie] = useState<any[]>([]);
  const [movieToSearch, setMovieToSearch] = useState('');
  const [tabs, setTabs] = useState<TabType>('películas');
  const [showSearchAlert, setShowSearchAlert] = useState(false);
  const navigate = useIonRouter();

  // Open alert with two inputs
  const openSearchAlert = () => setShowSearchAlert(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('user');
    const user = stored ? JSON.parse(stored) : null;
    if (!user?.token) {
      navigate.push('/register', 'forward', 'push');
      return;
    }

    const fetchData = async () => {
      try {
        const mediaType = tabs === 'películas' ? 'movie' : 'tv';

        if (movieToSearch) {
          if (movieToSearch.startsWith('actor :')) {
            const actorName = movieToSearch.replace('actor :', '');
            const { data: personData } = await connection.get(
              `/search/person?query=${encodeURIComponent(actorName)}`
            );
            const actorIds = personData.results.map((p: any) => p.id).join(',');
            if (actorIds) {
              const { data: castData } = await connection.get(
                `/discover/${mediaType}?with_cast=${actorIds}`
              );
              setDataMovie(castData.results);
            } else {
              setDataMovie([]);
            }
          } else {
            // title search
            const { data } = await connection.get(
              `/search/${mediaType}?query=${encodeURIComponent(movieToSearch)}`
            );
            setDataMovie(data.results);
          }
        } else {
          const endpoint = `/trending/${mediaType}/day`;
          const { data } = await connection.get(endpoint);
          setDataMovie(data.results);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [movieToSearch, tabs, navigate]);

  const logOut = () => {
    sessionStorage.removeItem('user');
    navigate.push('/login', 'forward', 'push');
  };

  return (
    <IonPage id="main-content">
      <IonHeader>
        <IonToolbar className="custom-header">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle className="title-app">FilmApp</IonTitle>
          <IonIcon className="ion-icon" onClick={logOut} icon={powerOutline} />

          {/* Search Alert Button */}
          <button onClick={openSearchAlert} className="search-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="search"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>

          <IonAlert
            isOpen={showSearchAlert}
            onDidDismiss={() => setShowSearchAlert(false)}
            header="Buscar película"
            inputs={[
              {
                name: 'titleInput',
                type: 'text',
                placeholder: 'Título de película',
              },
              {
                name: 'actorInput',
                type: 'text',
                placeholder: 'Nombre de actor',
              },
            ]}
            buttons={[
              { text: 'Cancelar', role: 'cancel' },
              {
                text: 'Buscar',
                handler: (inputs: AlertInputs) => {
                  // Determine mode based on input
                  if (inputs.actorInput && !inputs.titleInput) {
                    setMovieToSearch(`actor :${inputs.actorInput}`);
                  } else if (inputs.titleInput && !inputs.actorInput) {
                    setMovieToSearch(inputs.titleInput);
                  } else {
                    setMovieToSearch('');
                  }
                },
              },
            ]}
          />
        </IonToolbar>

        {/* Tabs always shown */}
        <Tabs tabs={tabs} setTabs={setTabs} />
      </IonHeader>

      <IonContent className="custom-content" fullscreen>
        {tabs === 'películas' && <Card dataMovie={dataMovie} movieToSearch={movieToSearch} />}
        <AllMovies mediaType={tabs === 'películas' ? 'movie' : 'tv'} movieToSearch={movieToSearch} />
      </IonContent>
    </IonPage>
  );
};

export default Home;
