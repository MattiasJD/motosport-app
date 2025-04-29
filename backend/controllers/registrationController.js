const db = require('../db');

exports.registerForEvent = async (req, res) => {
    const userId = req.user.id;
    const { eventId} = req.body;

    try{
        const [rows] = await db.query(
            'SELECT * FROM registrations WHERE user_id = ? AND event_id = ?',
            [userId, eventId]
        );

        if(rows.length > 0) {
            return res.status(400).json({message: 'User already registered for this event'});
        }

        await db.query(
            'INSERT INTO registrations (user_id, event_id) VALUES (?, ?)',
            [userId, eventId]
        )
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Error registering for event'});
    }

}

exports.unregisterFromEvent = async (req, res) => {
    const userId = req.user.id;
    const eventId = req.params.eventId;

    try {
        const [result] = await db.query(
            'DELETE FROM registrations WHERE user_id = ? AND event_id = ?',
            [userId, eventId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Nepřihlášen na tento závod' });
        }

        res.json({ message: 'Úspěšně odhlášen ze závodu' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Chyba při odhlašování ze závodu' });
    }
};

exports.getMyEvents = async(req, res) => {
    const userId = req.user.id;

    try{
        const [events] = await db.query(
            'SELECT e.id, e.name, e.location, e.date, e.info FROM events e JOIN registrations r ON e.id = r.event_id WHERE r.user_id = ?',
            [userId]);

        res.json(events);
    } catch(error) {
        console.error(error);
        return res.status(500).json({message: 'Error fetching events'});
    }
}