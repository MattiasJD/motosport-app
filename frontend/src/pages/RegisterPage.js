import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post('/auth/register', { username, password });

            // po registraci rovnou přihlásíme
            const response = await api.post('/auth/login', { username, password });
            const token = response.data.token;

            localStorage.setItem('token', token);

            navigate('/');
        } catch (err) {
            console.error('Chyba při registraci:', err);
            setError('Registrace se nezdařila. Uživatelské jméno je možná již obsazené.');
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-6">
                <h2>Registrace</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Uživatelské jméno</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Heslo</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Registrovat se
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;
