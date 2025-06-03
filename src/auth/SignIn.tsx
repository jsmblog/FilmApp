import { IonButton, IonPage, useIonRouter } from '@ionic/react'
import React, { useState } from 'react'
import { connectionToBackend } from '../connection/connectionToBackend'
import '../styles/login_and_signin.css'

const SignIn: React.FC = () => {
  const [dataRegister, setDataRegister] = useState({
    user: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useIonRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDataRegister(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await connectionToBackend.post('/register', dataRegister)
       const {users,token} = data ;
      const user = {
        id:users?.id,
        token,
      }
      sessionStorage.setItem('user',JSON.stringify(user));
      navigate.push('/home', 'forward', 'push')
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <IonPage>
      <form className="form-container" onSubmit={handleSubmit}>
        <label className="form-label">
          Nombre
          <input
            className="form-input"
            placeholder="Ingrese su nombre"
            type="text"
            name="user"
            value={dataRegister.user}
            onChange={handleChange}
          />
        </label>
        <label className="form-label">
          Email
          <input
            className="form-input"
            placeholder="Email aquí"
            type="email"
            name="email"
            value={dataRegister.email}
            onChange={handleChange}
          />
        </label>
        <label className="form-label">
          Contraseña
          <input
            className="form-input"
            placeholder="********"
            type="password"
            name="password"
            value={dataRegister.password}
            onChange={handleChange}
          />
        </label>
        <button className="form-button" type="submit">
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
      </form>

      <IonButton className="link-button" routerLink="/login">
        Ya tengo una cuenta registrada, ingresar.
      </IonButton>
    </IonPage>
  )
}

export default SignIn
