module.exports = (sequelize, DataTypes) => {
    const Todos = sequelize.define("Todos", {
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
    })
    return Todos
}