import {
  IonButton,
  IonPage,
  useIonRouter,
  useIonLoading,
  useIonAlert,
  IonIcon
} from '@ionic/react';
import React, { useState } from 'react';
import { mail, lockClosed, eye, eyeOff } from 'ionicons/icons';
import { connectionToBackend } from '../connection/connectionToBackend';
import '../styles/login_and_signin.css';

const Login: React.FC = () => {
  const [dataLogin, setDataLogin] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
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
          mode:'ios'
        })
      console.log(error);
      await dismiss();
    }
  };

  return (
    <IonPage className="auth-page">
      <div className="auth-background">
        <div className="auth-container">
          <div className="auth-header">
            <h1 className="auth-title">Bienvenido de nuevo</h1>
            <p className="auth-subtitle">Ingresa a tu cuenta para continuar</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="input-wrapper">
                <IonIcon icon={mail} className="input-icon" />
                <input
                  className="auth-input"
                  placeholder="Correo electrónico"
                  type="email"
                  name="email"
                  value={dataLogin.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="input-wrapper">
                <IonIcon icon={lockClosed} className="input-icon" />
                <input
                  className="auth-input"
                  placeholder="Contraseña"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={dataLogin.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <IonIcon icon={showPassword ? eyeOff : eye} />
                </button>
              </div>
            </div>

            <button className="auth-button primary" type="submit">
              Iniciar Sesión
            </button>
          </form>

          <div className="auth-divider">
            <span>¿No tienes cuenta?</span>
          </div>

          <IonButton 
            className="auth-button secondary" 
            fill="clear"
            routerLink="/register"
          >
            Crear cuenta nueva
          </IonButton>
        </div>
      </div>
    </IonPage>
  );
};

export default Login;