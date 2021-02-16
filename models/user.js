'use-strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
    class User extends Model { }
    User.init({
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'First name is required'
                },
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
            unique: {
                msg: 'The email you entered already exists'
            },
            validate: {
                notNull: {
                    msg: 'An email is required'
                },
                isEmail: {
                    msg: 'Please provide a valid email address'
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            // set(val) {
            //     const hashedPassword = bcrypt.hashSync(val, 10);
            //     this.setDataValue('password', hashedPassword);
            // },
            validate: {
                notNull: {
                    msg: 'A password is required'
                },
                notEmpty: {
                    msg: 'Please provide a password'
                },
                len: {
                    args: [2, 20],
                    msg: 'The password should be between 2 and 20 characters in length'
                }
            }
        }
    }, { sequelize });
    User.addHook(
        "beforeCreate",
        user => (user.password = bcrypt.hashSync(user.password, 10))
    );

    User.associate = (models) => {
        User.hasMany(models.Course, { foreignKey: 'userId' });
    }

    return User;
};