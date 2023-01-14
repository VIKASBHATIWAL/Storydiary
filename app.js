const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const path = require('path')
const connectDB = require('./config/db')
const morgan = require('morgan')
const session = require('express-session')
const methodOverride = require('method-override')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const exhbs = require('express-handlebars')



const app = express();

app.use(express.urlencoded({extended: false}))
app.use(express.json())

//method override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method
      delete req.body._method
      return method
    }
  }))

//Logging
if(process.env.NODE_ENV ==='development'){
    app.use(morgan('dev'))
}
//Load config
dotenv.config({path: './config/config.env'})
connectDB()

//passport config
require('./config/passport')(passport)

//Handlebar helpers

const {formatDate, truncate, stripTags, editIcon, select} = require('./helpers/hbs')

//Handlebasr
app.engine('.hbs', exhbs.engine({helpers:{
    formatDate,
    truncate,
    stripTags,
    editIcon,
    select
}, defaultLayout: 'main',extname: '.hbs'}));
app.set('view engine', '.hbs');

//session

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
  }))

//passport middleware

app.use(passport.initialize())
app.use(passport.session())

//Set global variable
app.use( function(req, res, next){

    res.locals.user = req.user || null
    next()
})

//Static

app.use(express.static(path.join(__dirname, 'public')))

//Routes

app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))



const PORT = process.env.PORT||5000
app.listen(PORT, function(){
    console.log(`server running in ${process.env.NODE_ENV} at port ${PORT}`);
})