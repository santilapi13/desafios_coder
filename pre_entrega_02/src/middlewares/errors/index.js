export default (error, req, res, next) => {
	console.log(error.cause);
	if (error.code)
		res.status(400).send({ status: "error", error });
	else
		res.status(400).send({ status: "error", error: "Unhandled error" });
}