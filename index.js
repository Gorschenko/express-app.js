const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const cardRoutes = require('./routes/card')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const User = require('./models/user')

const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
})

app.engine('hbs', hbs.engine) // регестрируем hbs
app.set('view engine', 'hbs') // используем hbs
app.set('views', 'views')

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('')
        req.user = user
        next()
    } catch(e) {
        console.log(e)
    }
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)

const PORT = process.env.PORT || 3000

const start = async () => {
    try {
        const url = 'mongodb+srv://Gorschenko:uf7tBtVud0ef30Gk@cluster0.ynpkt15.mongodb.net/shop'
        await mongoose.connect(url, {useNewUrlParser: true})

        const candidate = await User.findOne()
        if (!candidate) {
            const user = new User({
                email: 'test@yandex.ru',
                name: 'Test',
                cart: {
                    items: []
                }
            })
            await user.save()
        }

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()