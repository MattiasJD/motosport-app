const db = require('../db');
const {response} = require("express");

exports.getEvents = async (req, res) => {
    try {
        // Načteme všechny závody
        const [eventsRows] = await db.query('SELECT * FROM events');

        // Načteme všechny registrace s uživateli
        const [registrationsRows] = await db.query(`
      SELECT 
        r.event_id, u.username 
      FROM registrations r
      JOIN users u ON r.user_id = u.id
    `);

        // Sloučíme závody a registrace
        const events = eventsRows.map(event => {
            const registrations = registrationsRows
                .filter(r => r.event_id === event.id)
                .map(r => ({ username: r.username }));

            return {
                ...event,
                registrations
            };
        });

        res.json(events);
    } catch (error) {
        console.error('Chyba při načítání závodů:', error);
        res.status(500).json({ message: 'Chyba při načítání závodů' });
    }
};

exports.createEvent = async (req, res)  => {
    console.log('Zahájeno vytváření závodu');
    const { name, location, date, info } = req.body;

    try {
        await db.query(
            'INSERT INTO events (name, location, date, info) VALUES (?, ?, ?, ?)',
            [name, location, date, info]
        );
        console.log('Závod úspěšně vytvořen');
        res.status(201).json({ message: 'Závod vytvořen' });


    } catch (error) {
        console.error('Chyba při vytváření závodu:', error);
        res.status(500).json({ message: 'Chyba při vytváření závodu' });
    }
};