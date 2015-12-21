//basic setup

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');
var geocoder = require('geocoder');
var async = require('async');
var geolib = require('geolib');

//configure app
app.use(morgan('dev'));

// configure body parser
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/test');
var Store = require('./models/stores_model');

var routes = express.Router();


routes.route('/isStoreLocation')
	.get(function(req,res){
		if(undefined == req.query.storeLat || undefined == req.query.storeLon)
		{
			errStr = "Undefined latitude/long";
			res.status(400);
			res.json({error: errStr});
			return;
		}

		geocoder.reverseGeocode( req.query.storeLat, req.query.storeLon, function ( err, data ) 		{
		  	for(var i in data){
    				console.log(data[i].formatted_address);
			}
		});
			
		Store.find(function(err,stores)
		{
		    for(var i in stores){

				var start = {
					lat: req.query.storeLat || undefined,
					lng: req.query.storeLon || undefined
				};

				var end = {
					lat: stores[i].latitude || undefined,
					lng: stores[i].longitude || undefined
				};
				
    				if(geolib.getDistance(start, end) < 200)
				{
					var inStore = stores[i];
					res.json(inStore);
					return;
				}
			}	
		    res.json({message: 'No Store closeby'});
		});
	});

routes.route('/saveStoreLocation')
	.post(function(req,res){
		var store = new Store();
		store.name = req.body.storeName;
		store.state = req.body.storeState;
		store.latitude = req.body.storeLat;
		store.longitude = req.body.storeLon;
		store.save(function(err)
		{
			if(err)
				res.send(err);
			res.json({message: 'Store created!'});
		});
	});

app.use('/api',routes);

app.listen(port)