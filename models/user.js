'use-strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
    class User extends Model { }
    // Initialize model
    User.init({
        firstName: {
            type: DataTypes.STRING,
            // Do not allow a null value
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'First name is required'
                },
                // Do not allow empty string
                notEmpty: {
                    msg: 'Please provide a first name'
                }
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Last name is required'
                },
                notEmpty: {
                    msg: 'Please provide a last name'
                }
            }
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            // Check to see if the email the user enters already exists in DB
            unique: {
                msg: 'The email you entered already exists'
            },
            validate: {
                notNull: {
                    msg: 'An email is required'
                },
                // Check to make sure email is a valid format
                isEmail: {
                    msg: 'Please provide a valid email address'
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A password is required'
                },
                notEmpty: {
                    msg: 'Please provide a password'
                },
                // Require a length between 6 and 20 characters
                len: {
                    args: [6, 20],
                    msg: 'The password should be between 6 and 20 characters in length'
                }
            }
        }
    }, { sequelize });
    // Hash password before it is persisted in DB
    User.addHook(
        "beforeCreate",
        user => (user.password = bcrypt.hashSync(user.password, 10))
    );

    User.associate = (models) => {
        // One to many model association. One user has created many courses
        User.hasMany(models.Course, { foreignKey: 'userId' });
    }

    return User;
};