import {
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonContent,
  useIonRouter,
  IonIcon,
} from '@ionic/react';
import './Home.css';
import { useEffect, useState } from 'react';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';
import { connection } from '../connection/connection';
import AllMovies from '../components/AllMovies';
import Tabs from '../components/Tabs';
import { powerOutline } from 'ionicons/icons';

type TabType = 'películas' | 'series' | 'tv';

const Home: React.FC = () => {
  const [dataMovie, setDataMovie] = useState<any[]>([]);
  const [movieToSearch, setMovieToSearch] = useState('');
  const [isOnSearch, setIsOnSearch] = useState(false);
  const [tabs, setTabs] = useState<TabType>('películas');
  const navigate = useIonRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem('user');
    const user = stored ? JSON.parse(stored) : null;
    if (!user?.token) {
      navigate.push('/register', 'forward', 'push');
      return;
    }

    const fetchData = async () => {
      try {
        const mediaType =
          tabs === 'películas'
            ? 'all'
            : tabs === 'series'
            ? 'movie'
            : 'tv';

        const endpoint = movieToSearch
          ? `/search/${mediaType}?query=${encodeURIComponent(movieToSearch)}`
          : `/trending/${mediaType}/day`;

        const { data } = await connection.get(endpoint);
        setDataMovie(data.results);
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
          <IonIcon
            className="ion-icon"
            onClick={logOut}
            icon={powerOutline}
          />
          {!isOnSearch ? (
            <button
              onClick={() => setIsOnSearch(true)}
              className="search-button"
            >
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
          ) : (
            <button
              onClick={() => setIsOnSearch(false)}
              className="search-button"
            >
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
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </IonToolbar>

        {!isOnSearch ? (
          <Tabs tabs={tabs} setTabs={setTabs} />
        ) : (
          <SearchBar
            movieToSearch={movieToSearch}
            setMovieToSearch={setMovieToSearch}
          />
        )}
      </IonHeader>

      <IonContent className="custom-content" fullscreen>
        {tabs === 'películas' && <Card dataMovie={dataMovie} />}

        <AllMovies
          mediaType={tabs === 'películas' ? 'movie' : 'tv'}
          movieToSearch={movieToSearch}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
