var mongoose = require('mongoose');

var StoreSchema = new mongoose.Schema({
	name: { type: String, trim: true,lowercase: true},
	state: { type: String,trim: true,lowercase: true},
	latitude:{type: Number},
	longitude:{type: Number}
	},
	{collection: 'stores'}
);

module.exports = mongoose.model('Store',StoreSchema);