import { 
  IonHeader, IonPage, IonToolbar, IonTitle, 
  IonButtons, IonMenuButton, IonContent 
} from '@ionic/react';
import './Home.css';
import { useEffect, useState } from 'react';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';
import { connection } from '../connection/connection.js';
import AllMovies from '../components/AllMovies';
import Tabs from '../components/Tabs';

const Home: React.FC = () => {
  const [dataMovie, setDataMovie] = useState<any[]>([]);
  const [movieToSearch, setMovieToSearch] = useState("");
  const [isOnSearch, setIsOnSearch] = useState(false);
  // 'películas' o 'series' o 'tv'
  const [tabs, setTabs] = useState<'películas'|'series'|'tv'>('películas');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mediaType = (tabs === 'películas') ? 'all' : (tabs === 'series') ? 'movie' : 'tv';
        const endpoint = movieToSearch
          ? `/search/${mediaType}?query=${movieToSearch}`
          : `/trending/${mediaType}/day`;

        const { data } = await connection.get(endpoint);
        setDataMovie(data.results);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [movieToSearch, tabs]); 

  return (
    <IonPage id="main-content">
      <IonHeader>
        <IonToolbar className="custom-header">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle className='title-app'>FilmApp</IonTitle>
          {!isOnSearch ? <button onClick={() => setIsOnSearch(true)} className='search-button'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="search">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button> :
            <button onClick={() => setIsOnSearch(false)} className='search-button'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="search">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>

            </button>}
        </IonToolbar>

        {/* Pestañas */}
        {!isOnSearch
          ? <Tabs tabs={tabs} setTabs={setTabs} />
          : <SearchBar 
              movieToSearch={movieToSearch} 
              setMovieToSearch={setMovieToSearch} 
            />
        }
      </IonHeader>

      <IonContent className="custom-content" fullscreen>
        {tabs === 'películas' && <Card dataMovie={dataMovie} />}

        <AllMovies 
          mediaType={(tabs === 'películas') ? 'movie' : 'tv'} 
          movieToSearch={movieToSearch} 
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
