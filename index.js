const log = require('./customLog.js')

log.info('')
log.info('Starting NodeTrader Framework')
log.info('')

log.debug('Parsing command line arguments...')

const { ArgumentParser } = require('argparse')

const commands = ['help']

const parser = new ArgumentParser({ description: 'A Node.js cryptocurrency trading bot framework.' })
parser.add_argument('command', { choices: commands, help: 'Command to execute.' })
parser.add_argument('-l', '--logging', { choices: log.levels, default: 'warn', help: 'Set the console logging level. Defaults to warn.' })

const args = parser.parse_args()

log.debug('Arguments parsed.')
log.debug('Arguments: ' + args)

if (args.logging)
{
	log.debug('Setting console logging level to ' + args.logging)
	log.transports[1].level = args.logging
	log.silly('Console log level is now ' + log.transports[1].level)
}

log.verbose('Running command: ' + args.command)

switch (args.command)
{
	case 'help':
	default:
		log.verbose('Printing command help text...')
		parser.print_help()
		log.debug('Printed command help text. Exiting program with code 0.', () => process.exit(0))
		break
}
