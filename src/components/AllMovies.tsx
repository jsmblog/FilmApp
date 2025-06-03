import React, { useCallback, useEffect, useState } from 'react';
import { 
  IonInfiniteScroll, 
  IonInfiniteScrollContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard
} from '@ionic/react';
import { connection } from '../connection/connection';

interface AllMoviesProps {
  movieToSearch: string;
  mediaType: 'movie' | 'tv';
}

const AllMovies: React.FC<AllMoviesProps> = ({ movieToSearch, mediaType }) => {
  const [dataMovie, setDataMovie] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const fetchData = useCallback(async (page = 1, searchQuery = "") => {
    try {
      const endpoint = searchQuery
        ? `/search/${mediaType}?query=${searchQuery}&page=${page}`
        : `/trending/${mediaType}/day?page=${page}`;

      const { data } = await connection.get(endpoint);
      setDataMovie(prev => page === 1 ? data.results : [...prev, ...data.results]);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error(error);
    }
  }, [mediaType]);

  // Cuando cambie la búsqueda o el tipo de media, recargamos desde página 1
  useEffect(() => {
    fetchData(1, movieToSearch);
    setCurrentPage(1);
  }, [movieToSearch, mediaType, fetchData]);

  const loadMore = async (e: CustomEvent<void>) => {
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages) {
      await fetchData(nextPage, movieToSearch);
      setCurrentPage(nextPage);
    }
    (e.target as HTMLIonInfiniteScrollElement).complete();
  };

  return (
    <>
      <IonGrid className="no-gap-grid">
        <IonRow className="ion-no-padding">
          {dataMovie.map(item => {
            const { id, title, name, poster_path,backdrop_path } = item;
            return (
              <IonCol key={id} size="6" sizeSm="4" sizeMd="3" sizeLg="2" className="ion-no-padding">
                <IonCard routerLink={`/${mediaType}/${id}`} className="no-margin-card">
                  <img
                    className="card-image"
                    alt={title || name}
                    src={
                      poster_path
                        ? `https://image.tmdb.org/t/p/w500${poster_path || backdrop_path}`
                        : '/favicon.png'
                    }
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </IonCard>
              </IonCol>
            );
          })}
        </IonRow>
      </IonGrid>

      <IonInfiniteScroll
        threshold="100px"
        onIonInfinite={loadMore}
        disabled={currentPage >= totalPages}
      >
        <IonInfiniteScrollContent loadingText="Cargando más..." />
      </IonInfiniteScroll>
    </>
  );
};

export default AllMovies;
