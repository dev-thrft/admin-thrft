if(process.env.NODE_ENV === 'development') 
	require('dotenv').config({path: './config/.env'});

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const limitCallRequest = require('./middlewares/limitCallRequest');
const dbConn = require('./config/dbConn');
const exceptionHandler = require('./middlewares/exceptionHandler');

const app = express();

// json parser
app.use(express.json());
// cookie parser
app.use(cookieParser());
// cors
app.use(cors({
	origin: 'http://localhost:5000',
	credentials: true
}));

// limit api calls
app.use(limitCallRequest);	

// routes
app.use('/auth', require('./routes/admin.route'));
app.use('/products', require('./routes/product.route'));
app.use('/categories', require('./routes/category.route'));

const PORT = process.env.PORT || 5000;

// connect to database
dbConn();

// run the server
const server = app.listen(PORT, () => 
	console.log(`Listening on port ${PORT}`)
);

// exception handler middleware
app.use(exceptionHandler);

// Handle unhandled rejections
process.on('unhandledRejection', (error) => {
	console.warn('Server timed out.');
	console.error(`ERROR LOG: ${error}`);
	/**Close the server if an error is unhandled. */
	server.close(()=> 
		process.exit(1)
	);		
});