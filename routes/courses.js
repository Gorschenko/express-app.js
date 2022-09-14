const {Router, response} = require('express')
const Course = require('../models/courses')
const router = Router()

router.get('/', async (req, res) => {
    const courses = await Course.find()
    res.render('courses', {
        title: 'Курсы',
        isCourses: true,
        courses,
    })
})

router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }
    const course = await Course.findById(req.params.id)
    res.render('course-edit', {
        course,
    })
})

router.post('/edit', async (req, res) => {
    const {id} = req.body
    delete req.body.id
    await Course.findByIdAndUpdate(id, req.body)
    res.redirect('/courses')
})

router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id)
    res.render('course', {
        course,
        layout: 'empty',
    })
})

module.exports = router