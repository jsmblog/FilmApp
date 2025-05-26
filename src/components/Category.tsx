import React, { useEffect, useState, useCallback } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonCard,
    IonButtons,
    IonBackButton
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { connection } from '../connection/connection';

interface Params { id: string; name: string; }

const Category: React.FC = () => {
    const { id, name } = useParams<Params>();
    const [movies, setMovies] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchByGenre = useCallback(async (page = 1) => {
        try {
            const { data } = await connection.get(
                `/discover/movie?with_genres=${id}&language=es-ES&page=${page}`
            );
            setMovies(prev => page === 1 ? data.results : [...prev, ...data.results]);
            setTotalPages(data.total_pages);
        } catch (err) {
            console.error(err);
        }
    }, [id]);

    useEffect(() => {
        fetchByGenre(1);
        setCurrentPage(1);
    }, [id, fetchByGenre]);

    const loadMore = async (e: CustomEvent<void>) => {
        const nextPage = currentPage + 1;
        if (nextPage <= totalPages) {
            await fetchByGenre(nextPage);
            setCurrentPage(nextPage);
        }
        (e.target as HTMLIonInfiniteScrollElement).complete();
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className="ion-toolbar-menu">
                    <IonButtons slot="start">
                        <IonBackButton text='' defaultHref="/home" />
                    </IonButtons>
                    <IonTitle className='title-app'>{decodeURIComponent(name)}</IonTitle>
                </IonToolbar>

            </IonHeader>
            <IonContent className="custom-content" fullscreen>
                <IonGrid className="no-gap-grid">
                    <IonRow className="ion-no-padding">
                        {movies.map(movie => (
                            <IonCol
                                key={movie.id}
                                size="6"
                                sizeSm="4"
                                sizeMd="3"
                                sizeLg="2"
                                className="ion-no-padding"
                            >
                                <IonCard
                                routerLink={`/movie/${movie.id}`}
                                className="no-margin-card">
                                    <img
                                        alt={movie.title}
                                        src={
                                            movie.poster_path
                                                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                                : '/favicon.png'
                                        }
                                        style={{ width: '100%', height: 'auto', display: 'block' }}
                                    />
                                </IonCard>
                            </IonCol>
                        ))}
                    </IonRow>
                </IonGrid>
                <IonInfiniteScroll
                    threshold="100px"
                    onIonInfinite={loadMore}
                    disabled={currentPage >= totalPages}
                >
                    <IonInfiniteScrollContent loadingText="Cargando más películas..." />
                </IonInfiniteScroll>
            </IonContent>
        </IonPage>
    );
};

export default Category;