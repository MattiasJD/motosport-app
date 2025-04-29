import { useState } from 'react';
import api from '../api/api';

function AdminPage() {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [info, setInfo] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('Přístup odepřen. Přihlas se jako admin.');
            return;
        }

        try {
            console.log('Odesílám požadavek na vytvoření závodu...');
            await api.post('/events', { name, location, date, info }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Požadavek odeslán!');

            setMessage('Závod úspěšně vytvořen.');
            setName('');
            setLocation('');
            setDate('');
            setInfo('');
        } catch (err) {
            console.error(err);
            setMessage('Chyba při vytváření závodu. Ujisti se, že máš roli admin.');
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-6">
                <h2>Vytvořit nový závod</h2>
                {message && <div className="alert alert-info">{message}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Název závodu</label>
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Lokalita</label>
                        <input
                            type="text"
                            className="form-control"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Datum</label>
                        <input
                            type="date"
                            className="form-control"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Info (volitelné)</label>
                        <textarea
                            className="form-control"
                            value={info}
                            onChange={(e) => setInfo(e.target.value)}
                            maxLength={255}
                        />
                    </div>

                    <button type="submit" className="btn btn-success">Vytvořit závod</button>
                </form>
            </div>
        </div>
    );
}

export default AdminPage;
