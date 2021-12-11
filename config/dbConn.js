const mongoose = require('mongoose');

const URI = process.env.ATLAS_URI;

module.exports = async () => {
	try {
		await mongoose.connect(URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			autoIndex: process.env.NODE_ENV !== 'production'
		});
		console.log('Connected to MongoDB!');
	} catch (err) {
		console.log(err);
	}
};
