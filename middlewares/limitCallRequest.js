module.exports = (req, res, next) => {
	// supported requests for api calls
	const allowedRequests = [ 'POST', 'GET', 'PUT', 'DELETE' ];
	const { method } = req;

	// check if request is allowed, return error 405 if not
	return (allowedRequests.includes(method)) ? 
		next() : 
		res.sendStatus(405);
	
};