
"use strict"





const path = require('path')





var constants = {
	errCodes: {
		noEntry:  'ENOENT',
		noAccess: 'EACCES'
	},
	availableDigests: ['hex', 'binary', 'base64'],
	paths: {
		commonPasswords:       path.resolve(path.join(__dirname, '../..', 'data/common-passwords.txt' )),
		commonPasswordsHashes: path.resolve(path.join(__dirname, '../..', 'data/common-passwords.jsonl' ))
	},
	events: {
		error:           'error',
		hash:            'hash',
		passwordMatch:   'password-match',
		passwordNoMatch: 'password-no-match',
		close:           'close'
	}
}





module.exports = constants