import express from 'express';
import morgan from 'morgan';
import { engine } from 'express-handlebars';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import * as path from "path";
import { create } from 'express-handlebars';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(morgan('dev'));
app.use(express.urlencoded({
    extended: true
}));

app.engine('hbs', engine({
    defaultLayout: 'bs4.hbs',
    partialsDir: 'views/partials/',
    extname: '.hbs'
}));

app.use('/public', express.static('public'));



app.set('view engine', 'hbs');
app.set('views', './views');

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    res.render('ProductView/detail');
});

app.get('/profile', function (req, res) {
    res.render('account/profile.hbs');
});

const port = 3000;
app.listen(port, function () {
    console.log(`Example app listening at http://localhost:${port}`);
});