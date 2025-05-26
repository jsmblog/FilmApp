import React, { useEffect, useState } from 'react';
import { IonButton, IonContent, IonHeader, IonMenu, IonTitle, IonToolbar } from '@ionic/react';
import { connection } from '../connection/connection';
import '../styles/menu.css';

interface Genre { id: number; name: string; }

const Menu: React.FC = () => {
  const [listGenres, setListGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const { data } = await connection.get('/genre/movie/list');
        setListGenres(data.genres);
      } catch (error) {
        console.error(error);
      }
    };
    fetchGenres();
  }, []);

  return (
    <IonMenu contentId="main-content" side="start" type="push">
      <IonHeader>
        <IonToolbar >
          <IonTitle className="title-app">FilmApp</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-content-menu">
        {listGenres.map(({ id, name }) => (
          <IonButton
            key={id}
            className="button-menu"
            fill="outline"
            routerLink={`/category/${id}/${encodeURIComponent(name)}`}
          >
            {name}
          </IonButton>
        ))}
      </IonContent>
    </IonMenu>
  );
};

export default Menu;