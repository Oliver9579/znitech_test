module.exports = (sequelize, DataTypes) => {
    const Todos = sequelize.define("Todos", {
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        order_num: {
            type: DataTypes.NUMERIC,
            allowNull: false,
            defaultValue: 0,
        },
    })
    return Todos
}