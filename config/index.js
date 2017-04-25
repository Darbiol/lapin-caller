'use strict';

const env     = process.env;
const _       = require( 'lodash' );
const uuid    = require( 'node-uuid' );
const pkgjson = require( '../package.json' );

function getLogConfig () {
	let configLog = {
		'console' : {
			'enabled'   : [ 'development' ],
			'level'     : env.CONSOLE_LOG_LEVEL || 'info',
			'timestamp' : true
		},

		'logstash' : {
			'enabled' : [ 'production' ],
			'port'    : env.LOGSTASH_PORT || 9563,
			'host'    : 'logstash',
			'level'   : env.LOGSTASH_LOG_LEVEL || 'info'
		},

		'slack' : {
			'enabled' : [ 'production' ],
			'level'   : env.SLACK_LOG_LEVEL || 'error'
		},

		'additional' : {
			'service' : pkgjson.name
		}
	};

	if ( env.TEST_ENV ) {
		// do not include logstash and slack transports when we are just testing
		configLog = _.omit( configLog, [ 'logstash', 'slack' ] );
		// turn console logging on
		delete configLog.console.enabled;
	}

	return configLog;
}

let config = {
	'database' : {
		'host'     : 'postgres',
		'port'     : 5432,
		'database' : 'MicrocredentialService',
		'username' : env.POSTGRES_USERNAME || 'postgres',
		'password' : env.POSTGRES_PASSWORD || 'password'
	},

	'rabbitmq' : {
		'server' : 'rabbitmq',
		'port'   : 5672,
		'user'   : env.RABBITMQ_USERNAME || 'guest',
		'pass'   : env.RABBITMQ_PASSWORD || 'guest',

		'replyQueue' : {
			'autoDelete' : true,
			'subscribe'  : true,
			'expires'    : 120000,
			'name'       : [ 'response', 'microcredential-service', uuid.v4(), 'queue' ].join( '.' )
		}
	},

	'log' : getLogConfig()
};

module.exports = config;
