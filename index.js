const log = require('./customLog.js')

log.info('')
log.info('Starting NodeTrader Framework')
log.info('')

log.debug('Parsing command line arguments...')

const { ArgumentParser } = require('argparse')

const parser = new ArgumentParser({ description: 'A Node.js cryptocurrency trading bot framework.' })

const args = parser.parse_args()

log.debug('Arguments parsed.')
log.debug('Arguments:', args)