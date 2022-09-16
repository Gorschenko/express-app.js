const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session) // подключение сессий к базе данных
const homeRoutes = require('./routes/home')
const ordersRoutes = require('./routes/orders')
const cardRoutes = require('./routes/card')
const addRoutes = require('./routes/add')
const authRoutes = require('./routes/auth')
const coursesRoutes = require('./routes/courses')
const User = require('./models/user')
const varMiddleware = require('./middleware/variables')

const MONGODB_URI = 'mongodb+srv://Gorschenko:uf7tBtVud0ef30Gk@cluster0.ynpkt15.mongodb.net/shop'
const app = express()
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
})
const store = new MongoStore({ // подключение сессий к базе данных
    collection: 'sessions',
    uri: MONGODB_URI,
})

app.engine('hbs', hbs.engine) // регестрируем hbs
app.set('view engine', 'hbs') // используем hbs
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(session({ // подключение сессий
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store,
}))
app.use(varMiddleware)

app.use('/', homeRoutes)
app.use('/orders', ordersRoutes)
app.use('/add', addRoutes)
app.use('/auth', authRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)

const PORT = process.env.PORT || 3000

const start = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {useNewUrlParser: true})

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()