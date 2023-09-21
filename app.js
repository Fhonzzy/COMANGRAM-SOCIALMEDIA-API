require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const connectDb = require("./db/connect");
const morgan = require("morgan");
const helmet = require("helmet");
const userRouter = require('./Routes/user')
const authRouter = require('./Routes/auth')
const postRouter = require('./Routes/post')
const delectAcctRouter = require('./Routes/deleteAcct')
const authMiddleware = require("./Middleware/authentication")
const xss = require('xss-clean')
const cors = require('cors')

//Middleware
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))
app.use(xss())
app.use(cors())

//Routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user/deleteacct', authMiddleware, delectAcctRouter)
app.use('/api/v1/user', authMiddleware, userRouter)
app.use('/api/v1/post', authMiddleware, postRouter)

// Synced The Database-Connect with the Server
const startServer = async () => {
	try {
		await connectDb(process.env.MONGO_URI);
		app.listen(port, () => {
			console.log(`Server is listening on port ${port}...`);
		});
	} catch (error) {
		console.log(error.message);
	}
};

startServer();
