const {Router, response} = require('express')
const Course = require('../models/courses')
const router = Router()

router.get('/', async (req, res) => {
    const courses = await Course.getAll()
    res.render('courses', {
        title: 'Курсы',
        isCourses: true,
        courses,
    })
})

router.get('/:id', async (req, res) => {
    const course = await Course.getById(req.params.id)
    res.render(
        'course',
         {
            course,
            layout: 'empty',
         }
    )
})

module.exports = router