import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    let username = null;

    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            username = payload.username;
        } catch (e) {
            console.error('Chyba při dekódování tokenu:', e);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand" to="/">Motorsport</Link>
                <div className="d-flex justify-content-between w-100">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Závody</Link>
                        </li>

                        {!token && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Přihlášení</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Registrace</Link>
                                </li>
                            </>
                        )}

                        {token && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/admin">Přidaní závodů</Link>
                                </li>
                            </>
                        )}
                    </ul>

                    {token && (
                        <div className="d-flex align-items-center">
                            <span className="me-3 text-muted">👤 {username}</span>
                            <button className="btn btn-sm btn-outline-secondary" onClick={handleLogout}>
                                Odhlásit se
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
