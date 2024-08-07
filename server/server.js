

const express = require('express');
const app = express();
app.use(express.json()); //to take request body from frontenf
require('dotenv').config(); // needed to use dotenv variables in server
const dbConfig = require('./config/dbConfig');
const port = process.env.PORT || 5000; // port number other than 3000 as that is where site is shown

const usersRoute = require('./routes/usersRoute');
const productsRoute = require('./routes/productsRoute');
const bidsRoute = require('./routes/bidsRoute');
const notificationsRoute = require('./routes/notificationsRoute');

//for the users route the endpoint api 
app.use('/api/users', usersRoute);
app.use('/api/products',productsRoute);
app.use('/api/bids', bidsRoute);
app.use('/api/notifications', notificationsRoute);

app.listen(port, () => console.log(`Node Express Server started on port ${port}`));
