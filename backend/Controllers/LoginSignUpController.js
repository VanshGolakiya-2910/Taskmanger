
app.post('/signup', (req, res) => {
    const { name, dob, phone, email, password } = req.body;

    console.log('Received data:', { name, dob, phone, email, password });

    if (!name || !dob || !phone || !email || !password) {
        console.error('Validation failed: Missing required fields.');
        return res.status(400).send('All fields are required.');
    }

    const u_id = `${name.slice(0, 3).toUpperCase()}${dob.slice(0, 4)}`;
    console.log('Generated User ID:', u_id);

    const query = `
        INSERT INTO user (User_ID, User_Name, Email, DOB, Phone_No, Password)
        VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(query, [u_id, name, email, dob, phone, password], (err) => {
        if (err) {
            console.error('Error inserting user:', err.message);
            return res.status(500).send('Error registering user.');
        }
        res.status(201).json({ message: 'User registered successfully!', userId: u_id });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM user WHERE Email = ? AND Password = ?';
    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Error checking login:', err.message);
            return res.status(500).send('Error logging in.');
        }
        if (results.length > 0) {
            res.status(200).send('Login successful!');
        } else {
            res.status(401).send('Invalid email or password.');
        }
    });
});
