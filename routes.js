const express = require('express');
const router = express.Router();
const { Course, User } = require('./models');
// Middlware function to authenticate a user
const { authenticateUser } = require('./middleware/auth-user');
// Middleware function to handle asynchronous requests
const { asyncHandler } = require('./middleware/async-handler');


// setup a friendly greeting for the root route
router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the REST API project!',
    });
});

// /api/users GET route to return the currently authenticated user with 200 HTTP
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {

    // currentUser property set on req object with authenticateUser() function
    const user = req.currentUser;

    // Filter out sensitive user data
    res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress
    });
}));


// /api/users POST route to create new user. Set Location header to '/'
// Return a 201 HTTP status no content
router.post('/users', asyncHandler(async (req, res) => {
    try {
        await User.create(req.body);
        // Set Location header on res object. i.e. redirect to route "/"
        // after request
        res.location('/');
        // 201 success in the creation of a new resource
        res.status(201).end();
    } catch (error) {
        console.error("ERROR: ", error.name);
        // Handle any validation errors 
        if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
            const errors = error.errors.map(err => err.message);
            // 400 Bad Request
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

// /api/courses GET route that returns a list of all course with user that owns them
// return a 200 status code
router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        // Filter user?
        // Return all courses with their associated User
        include: User,
        // Filter results returning only certain columns
        attributes: ['title', 'description', 'estimatedTime', 'materialsNeeded']
    });
    // Refer to value from an associated model
    // const courses = await Course.findAll({
    //     include: {
    //         model: User,
    //         where: {
    //             id: Sequelize.col('course.id')
    //         }
    //     }
    // });
    // Automatic?
    res.status(200).json(courses);
}));

// /api/courses/:id GET route that will return the corresponding course along
//  with the User that owns it and a 200 HTTP status code
// Returns userId. Do I need all user data?
router.get('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
        // 200 success status
        res.status(200).json(course);
    } else {
        res.status(404).json({ "message": "Course not found" })
    }
}));

// /api/courses POST route to create new course. Set Location header in URI
//  for newly created course, return a 201 HTTP status code and no content
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const course = await Course.create(req.body);
        // Set location header
        res.location(`/courses/${course.id}`);
        // 201 new resource creation
        res.status(201).end();
        // catch any errors
    } catch (error) {
        console.error("ERROR: ", error.name);
        if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

// /api/courses/:id PUT route to update course. Return 204 HTTP no content
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        const currentUserId = req.currentUser.id;
        const courseOwnerId = course.userId;

        if (course) {
            // Only allow user to update a course if they own it
            if (currentUserId === courseOwnerId) {
                await course.update(req.body);
                // Validation firing?
                // console.log(typeof course.title);
                // 204 No Content success status
                res.status(204).end();
            } else {
                // If the user does not own the course they are trying to update
                // 403 Forbidden error status
                res.status(403).json({ "message": "Current user does not own this course." });
            }
        } else {
            res.status(404).json({ "message": "Course not found" });
        }

    } catch (error) {
        console.error("ERROR: ", error.name);
        if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

// /api/courses/:id DELETE route to delete course. Return 204 HTTP no content
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    const currentUserId = req.currentUser.id;
    const courseOwnerId = course.userId;

    if (course) {
        // Allow user to delete a course if they own it.
        if (currentUserId === courseOwnerId) {
            await course.destroy();
            // 204 No Content success status
            res.status(204).end();
        } else {
            // 403 Forbidden error status
            res.status(403).json({ "message": "Current user cannot delete this course" });
        }

    } else {
        res.status(404).json({ "message": "Course not found" })
    }
}));

module.exports = router;