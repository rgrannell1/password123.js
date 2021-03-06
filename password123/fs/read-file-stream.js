
"use strict"




const fs        = require('fs')
const constants = require('../commons/constants')





const readFileStream = (fpath, callback) => {

	const isReadableFlag = fs.R_OK
	const handledMessage = {
		[constants.errCodes.noEntry]:  ( ) => {
			return `ERROR: could not read from "${fpath}"; does the file exist?\n`
		},
		[constants.errCodes.noAccess]: ( ) => {
			return `ERROR: could not read from "${fpath}", as it isn't read-accessible.\n`
		}
	}

	fs.access(fpath, isReadableFlag, err => {

		var data = null

		if (err) {

			err.message = handledMessage.hasOwnProperty(err.code)
				? handledMessage[err.code]( )
				: err.message


		} else {
			data = fs.createReadStream(fpath)
		}

		return callback(err, data)

	})

}





module.exports = readFileStream
