import log from './customLog'

log.info('')
log.info('Starting NodeTrader Framework')
log.info('')

log.debug('Parsing command line arguments...')

import { ArgumentParser } from 'argparse'

interface commandObject
{
	name: string
	help: string
	subparser: ArgumentParser
}

const commands: commandObject[] = []

log.debug(`List of ${commands.length} commands created.`)

const parser = new ArgumentParser({ description: 'A Node.js cryptocurrency trading bot framework.' })
parser.add_argument('-l', '--logging', { choices: JSON.stringify(log.levels), default: 'warn',
	help: 'Set the console logging level. Defaults to warn.' })

const subParsers = parser.add_subparsers({ dest: 'command', help: 'Command to execute.' })

for (const command of commands)
	command.subparser = subParsers.add_parser(command.name, { help: command.help, description: command.help })

const helpSubParser = subParsers.add_parser('help', { help: 'Show help or get info on a specific command.' })
helpSubParser.add_argument('Help Command',
	{ choices: commands.map((c) => c.name), help: 'Command to show help for', nargs: '?' })

const args = parser.parse_args()

log.debug('Arguments parsed.')
log.debug(`Arguments: ${JSON.stringify(args)}`)

if (args.logging != null && typeof args.logging == 'string')
{
	log.debug(`Setting console logging level to ${args.logging as string}`)
	log.transports[1].level = args.logging
}

log.verbose(`Running command: ${args.command as string}`)

switch (args.command)
{
	case 'help':
	default:
		log.debug('Checking if getting help for a specific command...')
		if (args['Help Command'] == null)
		{
			log.verbose('Printing general help text...')
			parser.print_help()
			log.debug('Printed command help text. Exiting program with code 0.', () => process.exit(0))
		}
		else
		{
			log.verbose(`Showing help for command: ${args['Help Command'] as string}`)
			const command = commands.find((c) => c.name === args['Help Command'])

			if (command)
			{
				log.debug(`Command ${command.name} found, printing help...`)
				console.log(command.subparser.format_help())
				log.silly(`Help printed for command ${command.name}, exiting with code 0.`, () => process.exit(0))
			}
			else
			{
				log.error(`Command not found: ${args['Help Command'] as string}`)
				log.error('Argparse should catch improper commands.')
				log.error('Exiting with code 1.', () => process.exit(1))
			}
		}
		break
}
