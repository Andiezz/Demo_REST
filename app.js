const path = require("path")

const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const multer = require("multer")

const feedRoutes = require("./routes/feed")
const authRoutes = require("./routes/auth")

const app = express()

const { v4: uuidv4 } = require("uuid")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "images")
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4())
    },
})

const allowedMimeTypes = ["image/png", "image/jpg", "image/jpeg"]
const fileFilter = (req, file, cb) => {
    const allowedFile = allowedMimeTypes.includes(file.mimetype)
    cb(null, allowedFile)
}

//? app.use(bodyParser.urlencoded()) // x-www-form-urlencoded <form></form>
app.use(bodyParser.json()) //application/json
app.use(multer({ storage: storage, fileFilter: fileFilter }).single("image"))
app.use("/images", express.static(path.join(__dirname, "images")))

//? CORS error
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"),
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, PATCH, DELETE"
        )
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
    next()
})

app.use("/feed", feedRoutes)
app.use("/auth", authRoutes)

app.use((error, req, res, next) => {
    console.log(error)
    const status = error.statusCode || 500
    const message = error.errorMessage
    const data = error.data
    res.status(status).json({ message: message, data: data })
})

mongoose
    .connect(
        "mongodb+srv://AndiexPie6:JnoRVDRbvQXk4kPl@nodejs-learning.odff7nk.mongodb.net/feed?authSource=admin"
    )
    .then(app.listen(8080))
    .catch((err) => {
        console.log(err)
    })
