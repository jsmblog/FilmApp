import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/scrollbar';
import { FreeMode, Scrollbar } from 'swiper/modules';
import { sliceText } from '../js/sliceText';

const Card: React.FC<{ dataMovie: any[] }> = ({ dataMovie = [] }) => {
  const language = {
    'en': 'Inglés',
    'es': 'Español',
    'fr': 'Francés',
    'it': 'Italiano',
    'de': 'Alemán',
    'ja': 'Japonés',
    'xx': 'Coreano'
  };

  const swiperParams = {
    slidesPerView: 'auto' as const,
    spaceBetween: 10,
    freeMode: true,
    scrollbar: {
      hide: false,
      draggable: true
    },
    modules: [FreeMode, Scrollbar],
    breakpoints: {
      640: { spaceBetween: 15 },
      768: { slidesPerView: 'auto' as const, spaceBetween: 20 },
      1024: { slidesPerView: 'auto' as const, spaceBetween: 25 }
    }
  };

  return (
    <div className='movie-container'>
      <h3 className='title-movie'>Películas en tendencia</h3>
      <Swiper
        {...swiperParams}
        className="custom-swiper"
      >
        {dataMovie.map((movie, index) => {
          const {
            id,
            title,
            poster_path,
            backdrop_path,
            original_language,
            release_date,
            overview,
            name,
          } = movie;
          return <SwiperSlide key={id || index}>
            <IonCard
             routerLink={`/movie/${id}`}
              disabled={!id}
             className="movie-card no-margin-card">
              <img
                className='movie-poster'
                alt={title}
                src={poster_path
                  ? `https://image.tmdb.org/t/p/w500${poster_path}`
                  : '/favicon.png'}
              />
              <IonCardHeader
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.49), rgba(0, 0, 0, 0.8)), url(https://image.tmdb.org/t/p/w500${backdrop_path})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  color: 'white'
                }}
                className="movie-header"
              >

                <IonCardTitle className="movie-title">{title || name}</IonCardTitle>
                <IonCardSubtitle className="movie-language">
                  Idioma: {language[original_language as keyof typeof language] || 'Desconocido'}
                </IonCardSubtitle>
                <IonCardSubtitle className="movie-date">
                  {release_date}
                </IonCardSubtitle>
                <IonCardContent className="movie-overview">
                  {sliceText(overview, 200)}
                </IonCardContent>
              </IonCardHeader>
            </IonCard>
          </SwiperSlide>
        })}
      </Swiper>

      {dataMovie.length === 0 &&
        <div className='no-results'>No hay resultados ☹️</div>}
    </div>
  );
};

export default Card;