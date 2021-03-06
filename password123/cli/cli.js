#!/usr/bin/env node

"use strict"





const doc = `
Name:
	password123 - check if a supplied password is one of the 10,000 most common.

Usage:
	password123 <password>...   [-h | --hash]
	password123 (-s | --secure) [-h | --hash]
	password123 (-h | --help | --version)

Version:
	0.1.0

Description:

Arguments:
	<password>...    The password(s) to test.

Options:
	--s, --secure    should an interactive input be used to enter a password?
	--version        .
	-h, --hash       should input passwords be compared to hashed versions of the 10,000 most
	                 common passwords, in addition to a plain text check?
`





const docopt      = require('docopt').docopt
const password123 = require('../app/password123')
const args        = docopt(doc)





password123(args)
