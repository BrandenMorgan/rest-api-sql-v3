'use-strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
    class User extends Model { }
    User.init({
        firstName: {
            type: DataTypes.STRING
        },
        lastName: {
            type: DataTypes.STRING
        },
        emailAddress: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            set(val) {
                const hashedPassword = bcrypt.hashSync(val, 10);
                this.setDataValue('password', hashedPassword);
            }
        }
    }, { sequelize });

    User.associate = (models) => {
        User.hasMany(models.Course);
    }

    return User;
};