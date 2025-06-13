import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonContent,
  IonIcon,
  IonAlert,
  IonModal,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  useIonRouter,
} from '@ionic/react';
import { powerOutline, heartOutline, searchOutline } from 'ionicons/icons';
import Card from '../components/Card';
import AllMovies from '../components/AllMovies';
import TabsIonic, { TabType } from '../components/TabsIonic';
import { connection } from '../connection/connection';
import './Home.css';

interface AlertInputs {
  titleInput?: string;
  actorInput?: string;
}

type FavoriteItem = { id: number; title: string; mediaType: string; posterPath: string | null };

const Home: React.FC = () => {
  const [dataMovie, setDataMovie] = useState<any[]>([]);
  const [movieToSearch, setMovieToSearch] = useState('');
  const [tabs, setTabs] = useState<TabType>('películas');
  const [showSearchAlert, setShowSearchAlert] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const navigate = useIonRouter();

  // Load user & protect route
  useEffect(() => {
    const stored = sessionStorage.getItem('user');
    const user = stored ? JSON.parse(stored) : null;
    if (!user?.token) navigate.push('/register', 'forward', 'push');
  }, [navigate]);

  // Fetch movies/trending/search
  useEffect(() => {
    const fetchData = async () => {
      try {
        const mediaType = tabs === 'películas' ? 'movie' : 'tv';
        let results: any[] = [];
        if (movieToSearch) {
          if (movieToSearch.startsWith('actor :')) {
            const actor = movieToSearch.replace('actor :', '');
            const { data: pd } = await connection.get(
              `/search/person?query=${encodeURIComponent(actor)}`
            );
            const ids = pd.results.map((p: any) => p.id).join(',');
            if (ids) {
              const { data: cd } = await connection.get(
                `/discover/${mediaType}?with_cast=${ids}`
              );
              results = cd.results;
            }
          } else {
            const { data } = await connection.get(
              `/search/${mediaType}?query=${encodeURIComponent(movieToSearch)}`
            );
            results = data.results;
          }
        } else {
          const { data } = await connection.get(`/trending/${mediaType}/day`);
          results = data.results;
        }
        setDataMovie(results);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, [movieToSearch, tabs]);

  // Search alert toggle
  const openSearchAlert = () => setShowSearchAlert(true);

  // Favorites modal toggle
  const toggleFavorites = () => {
    const stored = sessionStorage.getItem('favorites');
    setFavorites(stored ? JSON.parse(stored) : []);
    setShowFavorites(s => !s);
  };

  // Logout
  const logOut = () => {
    sessionStorage.removeItem('user');
    navigate.push('/login', 'forward', 'push');
  };

  // Handle search submission
  const handleSearch = (inputs: AlertInputs) => {
    if (inputs.actorInput && !inputs.titleInput) setMovieToSearch(`actor :${inputs.actorInput}`);
    else if (inputs.titleInput && !inputs.actorInput) setMovieToSearch(inputs.titleInput);
    else setMovieToSearch('');
  };

  return (
    <IonPage id="main-content">
      <IonHeader>
        <IonToolbar className="custom-header">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>FilmApp</IonTitle>

          <IonButtons slot="end">
            <IonButton fill="clear" onClick={toggleFavorites}>
              <IonIcon icon={heartOutline} />
            </IonButton>
            <IonButton fill="clear" onClick={logOut}>
              <IonIcon icon={powerOutline} />
            </IonButton>
          </IonButtons>

          <IonButtons slot="end">
            <IonButton fill="clear" onClick={openSearchAlert}>
              <IonIcon icon={searchOutline} />
            </IonButton>
          </IonButtons>

          <IonAlert
            isOpen={showSearchAlert}
            onDidDismiss={() => setShowSearchAlert(false)}
            header="Buscar película"
            inputs={[
              { name: 'titleInput', type: 'text', placeholder: 'Título de película' },
              { name: 'actorInput', type: 'text', placeholder: 'Nombre de actor' }
            ]}
            buttons={[
              { text: 'Cancelar', role: 'cancel' },
              { text: 'Buscar', handler: handleSearch }
            ]}
          />
        </IonToolbar>
      </IonHeader>
        <TabsIonic tabs={tabs} setTabs={setTabs} />

      <IonContent fullscreen className="custom-content">
        {tabs === 'películas' && (
          <>
            <Card dataMovie={dataMovie} movieToSearch={movieToSearch} />
            <AllMovies mediaType="movie" movieToSearch={movieToSearch} />
          </>
        )}
        {(tabs === 'series' || tabs === 'tv') && (
          <AllMovies mediaType="tv" movieToSearch={movieToSearch} />
        )}

        <IonModal isOpen={showFavorites} onDidDismiss={() => setShowFavorites(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Favoritos</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowFavorites(false)}>Cerrar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {favorites.length > 0 ? (
              <IonList>
                {favorites.map(f => (
                  <IonItem key={`${f.mediaType}-${f.id}`} button routerLink={`/${f.mediaType}/${f.id}`}>
                    <IonLabel>{f.title}</IonLabel>
                  </IonItem>
                ))}
              </IonList>
            ) : (
              <p className="no-favorites">No tienes favoritos aún.</p>
            )}
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Home;
