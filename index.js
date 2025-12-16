const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true
    })
);


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({message: err.message});
    return;
});


app.listen(port, () => {
    console.log(`Server launched on port ${port}`)
});


app.use(express.static("public"));

