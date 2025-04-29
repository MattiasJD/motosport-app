import { useEffect, useState } from 'react';
import api from '../api/api';

function HomePage() {
    const [events, setEvents] = useState([]);
    const [registeredEventIds, setRegisteredEventIds] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchEvents();
        fetchMyRegistrations();
    }, []);

    const fetchEvents = () => {
        api.get('/events')
            .then(response => setEvents(response.data))
            .catch(error => console.error('Chyba při načítání závodů:', error));
    };

    const fetchMyRegistrations = () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        api.get('/registrations/myevents', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(response => {
                const ids = response.data.map(event => event.id);
                setRegisteredEventIds(ids);
            })
            .catch(err => console.error('Chyba při načítání registrací:', err));
    };

    const handleRegister = async (eventId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('Musíš být přihlášen, abys mohl přihlásit na závod.');
            return;
        }

        try {
            await api.post('/registrations', { eventId }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage('Úspěšně přihlášen na závod!');
            setRegisteredEventIds(prev => [...prev, eventId]);

            // Přidání username do registrací lokálně:
            const payload = JSON.parse(atob(token.split('.')[1]));
            const username = payload.username;

            setEvents(prevEvents =>
                prevEvents.map(event =>
                    event.id === eventId
                        ? { ...event, registrations: [...event.registrations, { username }] }
                        : event
                )
            );

        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || 'Chyba při přihlašování');
        }
    };


    const handleUnregister = async (eventId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('Musíš být přihlášen, abys mohl zrušit přihlášku.');
            return;
        }

        try {
            await api.delete(`/registrations/${eventId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage('Přihláška zrušena.');
            setRegisteredEventIds(prev => prev.filter(id => id !== eventId));
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || 'Chyba při rušení přihlášky');
        }
    };

    return (
        <div>
            <h1>Seznam závodů</h1>
            {message && <div className="alert alert-info">{message}</div>}
            <div className="row">
                {events.map(event => (
                    <div className="col-md-4" key={event.id}>
                        <div className="card mb-3">
                            <div className="card-body">
                                <h5 className="card-title">{event.name}</h5>
                                <p className="card-text">{event.location}</p>
                                {event.info && (
                                    <p className="card-text"><em>{event.info}</em></p>
                                )}
                                <p className="card-text"><small className="text-muted">{event.date}</small></p>

                                {registeredEventIds.includes(event.id) ? (
                                    <>
                                        <span className="badge bg-success me-2">✅ Přihlášen</span>
                                        <button className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleUnregister(event.id)}>
                                            Zrušit
                                        </button>
                                    </>
                                ) : (
                                    <button className="btn btn-primary" onClick={() => handleRegister(event.id)}>
                                        Přihlásit se
                                    </button>
                                )}


                                {/* Seznam přihlášených uživatelů */}
                                {event.registrations && event.registrations.length > 0 && (
                                    <div className="mt-3">
                                        <strong>Přihlášení účastníci:</strong>
                                        <ul className="mb-0">
                                            {event.registrations.map((r, index) => (
                                                <li key={index}>{r.username}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HomePage;
