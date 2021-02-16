'use-strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Course extends Model { }
    Course.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Title is required'
                },
                notEmpty: {
                    msg: 'Please provide a first name'
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
                    msg: 'Please provide a first name'
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
        Course.belongsTo(models.User, { foreignKey: 'userId' });
    }
    return Course;
};