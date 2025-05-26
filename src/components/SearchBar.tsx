import { IonSearchbar, IonTitle, IonToolbar } from '@ionic/react'
import React from 'react'
interface SearchBarProps {
  movieToSearch: string;
  setMovieToSearch: React.Dispatch<React.SetStateAction<string>>;
}
const SearchBar: React.FC<SearchBarProps> = ({movieToSearch,setMovieToSearch}) => {
    return (
    <>
    <IonToolbar className='ion-toolbar'>
          <IonSearchbar
          animated={true}
            value={movieToSearch}
            onIonClear={() => setMovieToSearch('')}
            onIonChange={(e) => setMovieToSearch(e.detail.value!)}
            placeholder="Busque una película..."
            className='ion-searchbar'
          ></IonSearchbar>
    </IonToolbar>
    </>
    )
}

export default SearchBar