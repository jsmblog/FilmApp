import {
  IonButton,
  IonPage,
  useIonRouter,
  useIonLoading,
  useIonAlert
} from '@ionic/react';
import React, { useState } from 'react';
import { connectionToBackend } from '../connection/connectionToBackend';
import '../styles/login_and_signin.css';

const Login: React.FC = () => {
  const [dataLogin, setDataLogin] = useState({
    email: '',
    password: ''
  });

  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();
  const navigate = useIonRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDataLogin(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await present({
      message: 'Iniciando sesión...',
      spinner: 'circles' 
    });

    try {
      const { data } = await connectionToBackend.post('/login', dataLogin);
      const { dataUser, token } = data;
      const user = {
        id: dataUser?.id,
        token
      };
      sessionStorage.setItem('user', JSON.stringify(user));
      await dismiss();

      navigate.push('/home', 'forward', 'push');
    } catch (error: any) {
      await presentAlert({
          header: error?.response?.statusText || 'Error',
          message: error?.response?.data?.message || 'Ocurrió un error al iniciar sesión.',
          buttons: ['OK'],
        })
      console.log(error);
      await dismiss();
    }
  };

  return (
    <IonPage>
      <form className="form-container" onSubmit={handleSubmit}>
        <label className="form-label">
          Email
          <input
            className="form-input"
            placeholder="Email aquí"
            type="email"
            name="email"
            value={dataLogin.email}
            onChange={handleChange}
            required
          />
        </label>
        <label className="form-label">
          Contraseña
          <input
            className="form-input"
            placeholder="********"
            type="password"
            name="password"
            value={dataLogin.password}
            onChange={handleChange}
            required
          />
        </label>
        <button className="form-button" type="submit">
          Ingresar
        </button>
      </form>

      <IonButton className="link-button" routerLink="/register">
        No tengo una cuenta, registrarme.
      </IonButton>
    </IonPage>
  );
};

export default Login;
