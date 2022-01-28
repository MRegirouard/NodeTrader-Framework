const log = require('./customLog.js')

log.info('')
log.info('Starting NodeTrader Framework')
log.info('')

log.debug('Parsing command line arguments...')

const { ArgumentParser } = require('argparse')

const commands = []

const parser = new ArgumentParser({ description: 'A Node.js cryptocurrency trading bot framework.' })
parser.add_argument('command', { choices: commands, help: 'Command to execute.' })

const args = parser.parse_args()

log.debug('Arguments parsed.')
log.debug('Arguments: ' + args)
log.verbose('Running command: ' + args.command)
