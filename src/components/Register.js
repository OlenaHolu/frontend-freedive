import React, { useState } from 'react';
import axios from 'axios';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {

    apiKey: "AIzaSyAJ8HGhjF8GsBmsXuU7cOd3oo1xJhskWyM",
  
    authDomain: "freedive-app-10426.firebaseapp.com",
  
    projectId: "freedive-app-10426",
  
    storageBucket: "freedive-app-10426.firebasestorage.app",
  
    messagingSenderId: "404518774710",
  
    appId: "1:404518774710:web:86066735bbe368a0cac317",
  
    measurementId: "G-01E2NMR51T"
  
  };
  

// 🔹 Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 🔹 Registrar usuario en Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 🔹 Obtener token de Firebase
            const token = await user.getIdToken();

            // 🔹 Enviar token al backend de Laravel
            const res = await axios.post('http://localhost/api/register', {
                name,
                email,
                firebase_token: token
            });

            console.log('✅ Registro exitoso:', res.data);
            alert('Registro exitoso');
        } catch (err) {
            console.error('❌ Error en el registro:', err);
            setError(err.message || 'Error registrando');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleRegister}>
                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </label>
                <br />
                <label>
                    Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                <br />
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
}

export default Register;
