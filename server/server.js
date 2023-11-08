const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));
app.use(express.json());
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(express.urlencoded({
    extended: true
}));

require('./config/mongoose.config');
require('./routes/pharma.routes')(app);


app.listen(8000, () => {
    console.log("Listening at Port 8000")
})