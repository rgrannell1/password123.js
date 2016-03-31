
"use strict"




const fs             = require('fs')
const constants      = require('../commons/constants')
const readFileStream = require('../fs/read-file-stream')

const readline       = require('readline')
const crypto         = require('crypto')





const writePasswordHashes = ( ) => {

	readFileStream(constants.paths.commonPasswords, (err, passwordStream) => {
		// search the hashes and stream to a file at the same time.

		if (err) {
			throw err
		} else {

			var hashes = [ ]

			readline.createInterface({
				input: passwordStream
			})
			.on('line', password => {
				hashes = hashes.concat(writePasswordHashes.calculateHashes(password))
			})
			.on('close', ( ) => {

				hashes.sort((val0, val1) => {

					var signal

					if (val0.hash.value === val1.hash.value) {
						signal = 0
					} else if (val0.hash.value > val1.hash.value) {
						signal = +1
					} else {
						signal = -1
					}

					return signal

				})

				fs.writeFile(
					constants.paths.commonPasswordsHashes,
					hashes.map(JSON.stringify).join('\n'),
					writeErr => {
						if (writeErr) {
							throw writeErr
						}
					}
				)

			})

		}

	})

}




{

	let hashDigestIndex = 0
	let passwordIndex   = 0

	writePasswordHashes.calculateHashes = password => {

		const hashes = [ ]

		hashes.push({
			hash: {
				password,
				value:  password,
				digest: '',
				hash:   ''
			},
			hashDigestIndex,
			passwordIndex
		})

		++hashDigestIndex

		crypto.getHashes( ).forEach(hash => {
			constants.availableDigests.forEach(digest => {

				hashes.push({
					hash: {
						password,
						value: crypto.createHash(hash).update(password).digest(digest),
						digest,
						hash
					},
					hashDigestIndex,
					passwordIndex
				})

				++hashDigestIndex

			})

		})

		++passwordIndex

		return hashes

	}

}





module.exports = writePasswordHashes
