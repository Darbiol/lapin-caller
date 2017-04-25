'use strict';

const lapinConfig = require( '@sinet/lapin-config' );

const config = require( process.cwd() + '/config' );
const lapin  = require( 'lapin' );

lapinConfig( {
  'connection' : config.rabbitmq
} )
.on( 'connected', function ( rabbit ) {
  lapin.CON = lapin( { rabbit } );

lapin.CON.request( <String(messageType)>, {}, ( err, data ) => {
	console.log( err )
	console.log( data )
} )

} )
.on( 'error', function ( err ) {
  console.log( err );
} );