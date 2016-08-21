
"use strict"





const fs              = require('fs')
const path            = require('path')
const events          = require('events')
const readline        = require('readline')
const targz           = require('tar.gz')

const constants       = require('../commons/constants')
const readFileStream  = require('../fs/read-file-stream')





const displayPassword = (hash, isMatch) => {
	displayPassword[isMatch ? 'isMatch' : 'notMatch'](hash)
}

displayPassword.isMatch = hash => {

	var message = `${hash.hash.password}    matched`

	if (hash.hash.hash) {
		message += `    ${hash.hash.hash}`
	}

	if (hash.hash.digest) {
		message += `    ${hash.hash.digest}`
	}

	console.log(message)

}

displayPassword.notMatch = hash => {

	var message = `${hash.hash.password}    unmatched`

	console.log(message)

}





const emitPasswordHashes = hashesPath => {

	var emitter = new events.EventEmitter( )

	readFileStream(hashesPath, (err, hashesStream) => {

		if (err) {
			throw err
		}

		readline.createInterface({
			input: hashesStream
		})
		.on('line', hashString => {
			emitter.emit(constants.events.hash, JSON.parse(hashString))
		})
		.on('close', ( ) => {
			emitter.emit(constants.events.close)
		})

	})

	return emitter

}





const emitMatches = (unused, hashEmitter) => {

	const matchEmitter = new events.EventEmitter( )

	hashEmitter
	.on(constants.events.hash, hash => {

		unused.forEach(password => {

			if (hash.hash.value === password) {

				matchEmitter.emit(constants.events.passwordMatch, hash)

				unused = unused.filter(otherPassword => {
					return otherPassword !== password
				})

			}

		})

	})
	.on(constants.events.error, err => {
		process.stderr.write(`${err.message}\n`)
	})
	.on(constants.events.close, ( ) => {
		unused.forEach(password => {

			matchEmitter.emit(constants.events.passwordNoMatch, {
				hash: {
					password,
					value:  password,
					digest: '',
					hash:   ''
				},
				hashDigestIndex: null,
				passwordIndex:   null
			})

		})
	})

	return matchEmitter

}





const password123 = rawArgs => {

	const args = password123.preprocess(rawArgs)

	const foo = path.join(constants.paths.snapCommon, 'common-passwords.jsonl')

	targz( )
		.createReadStream(
			path.join(constants.paths.commonPasswordsHashesCompressed))
		.pipe(
			fs.createWriteStream(foo))

	emitMatches(
		args.passwords,
		emitPasswordHashes(
			path.join(constants.paths.snapCommon, 'common-passwords.jsonl'))
	)
	.on(constants.events.passwordMatch, hash => {
		displayPassword(hash, true)
	})
	.on(constants.events.passwordNoMatch, password => {
		displayPassword(password, false)
	})

}

password123.preprocess = rawArgs => {

	return {
		passwords:    rawArgs['<password>'],
		readSecurely: rawArgs['--secure'],
		hash:         rawArgs['--hash']
	}

}





module.exports = password123
