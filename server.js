const express = require('express');
const app = express();
const router = require('./routes/routes');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(router);

app.listen(process.env.PORT || 4000, () => {
    console.log('Litening on port 4000');
});

module.exports = app;