const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json());
app.use(cors());

const db = require('./models')

const todoRouter = require("./routes/Todos")
app.use("/todos", todoRouter);

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Server running on port 3001")
    });
});
