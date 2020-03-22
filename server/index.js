const express = require('express');
const cors = require('cors');
const monk = require('monk');
const rateLimit = require("express-rate-limit");

const app = express();
//create connection
const db = monk(process.env.MONGO_URI ||"localhost/blurbs");
//collection of info called blurbs
const blurbs = db.get("blurbs");

app.use(cors());
app.use(express.json());

app.get('/', (req, res) =>{
	res.json({
		message: "hello from the server index!"
	});
});

app.get('/blurbs', (req, res) => {
	blurbs
	.find()
	.then(blurbs => {
		res.json(blurbs);
	});
});

function isValidBlurb(blurb){
	return blurb.name && blurb.name.toString().trim() !== "" && blurb.name.toString().trim().length <= 30 &&
	blurb.content && blurb.content.toString().trim() !== "" && blurb.content.toString().trim().length <= 200;
}

//limits the creation of blurbs, page loading not included as requests
app.use(rateLimit({
	windowMs: 15 * 1000, //every 30 seconds
	max: 1 //limit of 1 request
}));

const createBlurb = (req, res) => {
	if(isValidBlurb(req.body)){
		const blurb = {
			name: req.body.name.toString().trim(),
			content: req.body.content.toString().trim(),
			created: new Date()
		};
		blurbs
			.insert(blurb)
			.then(createdBlurb => {
				res.json(createdBlurb);
			})
	} else{
		res.status(422);
		res.json({
			message: "needs a name and text."
		});
	}
};

app.post('/blurbs', createBlurb);

app.listen(5000, () => {
	console.log("listening on http://localhost:5000");
});


