import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';

const app = express();

app.use(express.json());
const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            enteries: 0,
            joined: new Date()
        }, 
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            enteries: 0,
            joined: new Date()
        }
    ]
}
app.use(cors());
app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
            res.json('success');
        } else {
            res.status(400).json('error logging in');
        }
    res.json('signin');
})

app.post('/register', (req, res) => {
    const { email, password, name } = req.body;
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            console.log(hash);
        });
    });
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        enteries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length - 1]);
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true; 
            return res.json(user);
        }
    })
    if (!found) {
        res.status(404).json('no such user');
    }
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true; 
            user.enteries ++
            return res.json(user.enteries);
        }
    })
    if (!found) {
        res.status(404).json('no such user');
    }

})
// bcrypt.genSalt(saltRounds, function(err, salt) {
//     bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
//         // Store hash in your password DB.
//     });
// });

app.listen(3000, () => {
    console.log('app is running on port 3000');
})

