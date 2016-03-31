
"use strict"




const utils = { }




utils.partition = (pred, data) => {

	const groups = {
		matched:   [ ],
		unmatched: [ ]
	}

	for (var ith = 0; ith < data.length; ++ith) {
		groups[ pred(data[ith]) ? 'matched' : 'unmatched' ].push(data[ith])
	}

	return groups

}





module.exports = utils
