const express = require('express');
const router = express.Router();
const sequelize = require('./models/index').sequelize;
const Sequelize = require('sequelize');
const { Course, User } = require('./models');
const { authenticateUser } = require('./auth-user');

// Async helper function
function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next)
        } catch (error) {
            // Forward error to the global error handler
            next(error);
        }
    }
}

// setup a friendly greeting for the root route
router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the REST API project!',
    });
});

// /api/users GET route to return the currently authenticated user with 200 HTTP
router.get('/users', authenticateUser, async (req, res) => {
    // const users = await User.findAll();
    // res.json(users);
    const user = req.currentUser;
    res.json({
        emailAddress: user.emailAddress
    });
});

router.get('/allusers', async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

// /api/users POST route to create new user. Set Location header to '/'
// Return a 201 HTTP status no content
router.post('/users', async (req, res) => {
    await User.create(req.body);
    res.location('/');
    res.status(201).json({ "message": "Account successfully created!" });

});

// /api/courses GET route that returns a list of all course with user that owns them
// return a 200 status code
router.get('/courses', async (req, res) => {
    const courses = await Course.findAll({ include: User });
    // Refer to value from an associated model
    // const courses = await Course.findAll({
    //     include: {
    //         model: User,
    //         where: {
    //             id: Sequelize.col('course.id')
    //         }
    //     }
    // });
    res.json(courses);
    // Automatic?
    res.status(200);
});

// /api/courses/:id GET route that will return the corresponding course along
//  with the User that owns it and a 200 HTTP status code
router.get('/courses/:id', async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    res.json(course);

    // return 200?
});

// /api/courses POST route to create new course. Set Location header in URI
//  for newly created course, return a 201 HTTP status code and no content
router.post('/courses', authenticateUser, async (req, res) => {
    await Course.create(req.body);
    // res.location(`/courses/${req.params.id}`);
    res.status(201).json({ "message": "Course successfully created" });
});

// /api/courses/:id PUT route to update course. Return 204 HTTP no content

// /api/courses/:id DELETE route to delete course. Return 204 HTTP no content


module.exports = router;