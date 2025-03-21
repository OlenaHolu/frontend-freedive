import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { useAuth } from "../context/AuthContext";
import GoogleLoginButton from '../components/GoogleLoginButton';

export default function Register() {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // 🔁 Redirección automática si ya está autenticado
    useEffect(() => {
        if (!loading && user) {
            navigate("/dashboard", { replace: true });
        }
    }, [user, loading, navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            await register(email, password, name);

        } catch (err) {
            console.error('❌ Registration error:', err);
            setError(err.message || 'Registration failed');

            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: err.message || "Something went wrong during registration!",
            });

        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="h-screen flex flex-col justify-center items-center bg-cover bg-center px-6"
            style={{ backgroundImage: "url('/background.png')" }}
        >
            <h1 className="text-3xl font-bold text-white mb-6">Register</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form
                onSubmit={handleRegister}
                className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
            >
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-3 border rounded mb-3"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-3 border rounded mb-3"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-3 border rounded mb-3"
                />
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-500 text-white py-3 rounded font-bold"
                >
                    {submitting ? "Registering..." : "Register"}
                </button>
            </form>

            <GoogleLoginButton />
            <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a></p>
        </div>
    );
};

