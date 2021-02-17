'use-strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Course extends Model { }
    // Initialize model
    Course.init({
        title: {
            type: DataTypes.STRING,
            // Do not allow null values
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Title is required'
                },
                // Empty string value not allowed
                notEmpty: {
                    msg: 'Please provide a title'
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Description is required'
                },
                notEmpty: {
                    msg: 'Please provide a description'
                }
            }
        },
        estimatedTime: {
            type: DataTypes.STRING
        },
        materialsNeeded: {
            type: DataTypes.STRING
        }
    }, { sequelize });
    Course.associate = (models) => {
        // One to one model association. One course belongs to one user(creator of course)
        Course.belongsTo(models.User, { foreignKey: 'userId' });
    }
    return Course;
};