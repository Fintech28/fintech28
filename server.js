const express = require('express');
const app = express();
const router = require('./routes/routes');
const bodyParser = require('body-parser');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://fintech-28.herokuapp.com');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE, OPTIONS');
    next();
});

app.use(express.json());
  
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(router);

app.listen(process.env.PORT || 4000, () => {
    console.log('Fintech28 server is running...');
});

module.exports = app;