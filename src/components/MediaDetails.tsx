import React, { useEffect, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton,
  IonTitle, IonContent, IonGrid, IonRow, IonCol,
  IonCard, IonCardContent, IonBadge, IonList, IonItem, IonLabel
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { connection } from '../connection/connection';
import { sliceText } from '../js/sliceText';
import '../styles/movieDetails.css';

type MediaType = 'movie' | 'tv';

interface Params {
  mediaType: MediaType;
  id: string;
}

interface BaseCredits {
  cast: { cast_id: number; name: string; character: string; profile_path: string | null }[];
  crew: { credit_id: string; name: string; job: string }[];
}

interface MediaDetailsData {
  overview: string;
  genres: { id: number; name: string }[];
  spoken_languages: { iso_639_1: string; name: string }[];
  vote_average: number;
  vote_count: number;
  backdrop_path: string | null;
  adult: boolean;
  credits: BaseCredits;
  videos: { results: { id: string; key: string; name: string; site: string; type: string }[] };
  images: { backdrops: { file_path: string }[] };

  // movie-only
  title?: string;
  release_date?: string;
  runtime?: number;
  budget?: number;
  revenue?: number;

  // tv-only
  name?: string;
  first_air_date?: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
}

const MediaDetails: React.FC = () => {
  const { mediaType, id } = useParams<Params>();
  const [data, setData] = useState<MediaDetailsData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await connection.get(`/${mediaType}/${id}`, {
          params: { append_to_response: 'credits,videos,images' }
        });
        setData(data);
      } catch (err) {
        console.error(err);
        setError(true);
      }
    };
    fetchDetails();
  }, [mediaType, id]);

  if (error) {
    return (
      <IonPage>
        <IonContent>
          <div className="error">
            <h2>😢 {mediaType === 'movie' ? 'Película' : 'Serie'} no encontrada</h2>
            <p>El recurso solicitado no está disponible.</p>
            <IonButtons slot="start">
              <IonBackButton text="Volver" defaultHref="/home" />
            </IonButtons>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!data) {
    return (
      <IonPage>
        <IonContent>
          <div className="loading"><div className="loader"></div></div>
        </IonContent>
      </IonPage>
    );
  }

  const title = mediaType === 'movie' ? data.title! : data.name!;
  const date = mediaType === 'movie' ? data.release_date! : data.first_air_date!;
  const detailMeta = mediaType === 'movie'
    ? `${date} • ${data.runtime} min`
    : `${date} • ${data.number_of_seasons} temp. • ${data.number_of_episodes} eps.`;

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar className="ion-toolbar-menu">
          <IonButtons slot="start">
            <IonBackButton text="" defaultHref="/home" />
          </IonButtons>
          <IonTitle>{sliceText(title, 25)}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="movie-details">
        <div className="banner">
          <img
            alt={title}
            src={
              data.backdrop_path
                ? `https://image.tmdb.org/t/p/w780${data.backdrop_path}`
                : '/favicon.png'
            }
          />
          <div className="banner-overlay">
            <h1>{title}</h1>
            <p className="meta">
              {detailMeta} • ⭐ {data.vote_average.toFixed(1)}
              <span className="votes">({data.vote_count})</span> •
              {data.adult ? ' +18' : ' +13'}
            </p>
          </div>
        </div>

        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="8">
              {/* Sinopsis */}
              <section className="section">
                <h2>Sinopsis</h2>
                <p>{sliceText(data.overview, 1000)}</p>
              </section>

              {/* Géneros */}
              <section className="section">
                <h2>Géneros</h2>
                <div className="badges">
                  {data.genres.map(g => (
                    <IonBadge key={g.id} className="badge">{g.name}</IonBadge>
                  ))}
                </div>
              </section>

              {/* Idiomas */}
              <section className="section">
                <h2>Idiomas</h2>
                <p>{data.spoken_languages.map(l => l.name).join(', ')}</p>
              </section>

              {/* Sección extra para películas: presupuesto & recaudación */}
              {mediaType === 'movie' && (
                <section className="section">
                  <h2>Presupuesto & Recaudación</h2>
                  <p>
                    <strong>Presupuesto:</strong> ${data.budget!.toLocaleString()}<br/>
                    <strong>Recaudación:</strong> <span className={data.revenue! > data.budget! ? 'gain' : 'lost'}>${data.revenue!.toLocaleString()}</span><br/>
                    <strong>{data.revenue! > data.budget! ? 'Ganancias:' : 'Pérdidas:'}</strong> 
                    <span className={data.revenue! > data.budget! ? 'gain' : 'lost'}>
                      ${Math.abs(data.revenue! - data.budget!).toLocaleString()}
                    </span> {data.revenue! > data.budget! ? '⬆️' : '⬇️'}
                  </p>
                </section>
              )}

              {/* Reparto principal */}
              <section className="section">
                <h2>Reparto principal</h2>
                <IonGrid>
                  <IonRow>
                    {data.credits.cast.slice(0, 8).map(c => (
                      <IonCol key={c.cast_id} size="6" sizeSm="4" sizeMd="3">
                        <IonCard className="cast-card no-margin-card">
                          <img
                            alt={c.name}
                            src={
                              c.profile_path
                                ? `https://image.tmdb.org/t/p/w200${c.profile_path}`
                                : '/favicon.png'
                            }
                          />
                          <IonCardContent>
                            <h3>{c.name}</h3>
                            <p className="character">{c.character}</p>
                          </IonCardContent>
                        </IonCard>
                      </IonCol>
                    ))}
                  </IonRow>
                </IonGrid>
              </section>
            </IonCol>

            <IonCol size="12" sizeMd="4">
              {/* Equipo técnico */}
              <section className="section">
                <h2>Equipo técnico</h2>
                <IonList>
                  {data.credits.crew.slice(0, 6).map(cr => (
                    <IonItem key={cr.credit_id}>
                      <IonLabel>{cr.name} — {cr.job}</IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              </section>

              {/* Vídeos */}
              {data.videos.results.length > 0 && (
                <section className="section">
                  <h2>Vídeos</h2>
                  {data.videos.results
                    .filter(v => v.site === 'YouTube' && /trailer/i.test(v.type))
                    .slice(0,3)
                    .map(v => (
                      <iframe
                        key={v.id}
                        title={v.name}
                        src={`https://www.youtube.com/embed/${v.key}`}
                        frameBorder="0"
                        allowFullScreen
                        className="video-iframe"
                      />
                    ))}
                </section>
              )}

              {/* Imágenes */}
              {data.images.backdrops.length > 0 && (
                <section className="section">
                  <h2>Imágenes</h2>
                  <IonGrid>
                    <IonRow>
                      {data.images.backdrops.slice(0, 6).map((img, idx) => (
                        <IonCol key={idx} size="6">
                          <IonCard className="image-card">
                            <img
                              alt=""
                              src={`https://image.tmdb.org/t/p/w300${img.file_path}`}
                            />
                          </IonCard>
                        </IonCol>
                      ))}
                    </IonRow>
                  </IonGrid>
                </section>
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default MediaDetails;
