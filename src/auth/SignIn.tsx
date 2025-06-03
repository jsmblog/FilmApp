import { 
  IonButton, 
  IonPage, 
  useIonRouter,
  useIonAlert,
  useIonLoading,
  IonIcon 
} from '@ionic/react';
import React, { useState } from 'react';
import { person, mail, lockClosed, eye, eyeOff } from 'ionicons/icons';
import { connectionToBackend } from '../connection/connectionToBackend';
import '../styles/login_and_signin.css';

const SignIn: React.FC = () => {
  const [dataRegister, setDataRegister] = useState({
    user: '',
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();
  const navigate = useIonRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDataRegister(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await present({
      message: 'Creando cuenta...',
      spinner: 'circles'
    });

    try {
      const { data } = await connectionToBackend.post('/register', dataRegister);
      
      const { users, token } = data;
      const user = {
        id: users?.id,
        token,
      };
      sessionStorage.setItem('user', JSON.stringify(user));
      await dismiss();
      
      navigate.push('/home', 'forward', 'push');
    } catch (error: any) {
      await presentAlert({
        header: error?.response?.statusText || 'Error',
        message: error?.response?.data?.message || 'Ocurrió un error al crear la cuenta.',
        buttons: ['OK'],
      });
      console.log(error);
      await dismiss();
    }
  };

  return (
    <IonPage className="auth-page">
      <div className="auth-background">
        <div className="auth-container">
          <div className="auth-header">
            <h1 className="auth-title">Crear cuenta</h1>
            <p className="auth-subtitle">Únete y comienza tu experiencia</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="input-wrapper">
                <IonIcon icon={person} className="input-icon" />
                <input
                  className="auth-input"
                  placeholder="Nombre completo"
                  type="text"
                  name="user"
                  value={dataRegister.user}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="input-wrapper">
                <IonIcon icon={mail} className="input-icon" />
                <input
                  className="auth-input"
                  placeholder="Correo electrónico"
                  type="email"
                  name="email"
                  value={dataRegister.email}
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
                  value={dataRegister.password}
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
              Crear Cuenta
            </button>
          </form>

          <div className="auth-divider">
            <span>¿Ya tienes cuenta?</span>
          </div>

          <IonButton 
            className="auth-button secondary" 
            fill="clear"
            routerLink="/login"
          >
            Iniciar sesión
          </IonButton>
        </div>
      </div>
    </IonPage>
  );
};

export default SignIn;