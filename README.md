# NodeTrader-Framework
A Node.js cryptocurrency trading bot framework.
<br><br>
[![Workflow Status](https://github.com/MRegirouard/NodeTrader-Framework/actions/workflows/build-and-test.yml/badge.svg?branch=main)](https://github.com/MRegirouard/NodeTrader-Framework/actions/workflows/build-and-test.yml?query=branch%3Amain)
[![Codecov Report](https://codecov.io/gh/MRegirouard/NodeTrader-Framework/branch/main/graph/badge.svg)](https://codecov.io/gh/MRegirouard/NodeTrader-Framework)

## ⚠️ Disclaimer ⚠️
Any information contained in this repository or documentation is not financial advice. The developer(s) takes no responsibility for the use and misuse of this software and documentation. Users of this code do so at their own risk. Please inspect and monitor code and algorithms carefully, and test before deploying. Trade responsibly.

## Project Overview
NodeTrader Framework is a framework for creating, managing, running, testing, and evaluating trading algorithms. Using this software, traders can easily write their own algorithms for trading, without having to worry about API calls and boilerplate code. Traders can test and track the performance of their algorithms and tune them using the automatic parameter tuning feature. NodeTrader's verbose logging and databases make for a robust trading environment that allows users to focus on what matters most: the money.

## Goals
- Creation and deletion of algorithms
- Support for back testing, forward testing, and live trading
- Automatic parameter tuning
- Discord integration for starting, stopping, and monitoring algorithms
- Database of trades, variable and parameter changes, and prices
- Graphs with algorithm performance analysis
- Allow users to just write algorithms
- Quantitative analysis functionality
- Live-trading visualization of algorithm and price data
- Full support for containerization and deploying on Kubernetes
- Inter-algorithm communication and operation
- Robustness appropriate for trading with real money
- 100% test coverage with Jest and Codecov

See our [GitHub Project](https://github.com/users/MRegirouard/projects/2) for more details.

## File Structure
The main file structure of the project is as follows:
```bash
logs/  # Log files, separated by date
src/   # TypeScript source code
test/  # Code tests
built/ # Compiled JavaScript
  
algorithms/  # User-defomed trading algorithms
  Algo1/  # The algorithm "Algo1"
    logs/  # User and system logs specific to this algorithm
    algorithm.ts  # The algorithm code
    config.json  # The algorithm configuration
```

## Usage
NodeTrader-Framework can be used in several ways:
### As a library
Run algorithms in your own environment for maximum flexibility. Install the npm package and use functions for managing algorithms and data.
### As a command line tool
Run commands by invoking `npm start`. NodeTrader-Framework handles the loading of algorithms and calling library functions for you.
### As a command line interface (CLI)
Rapidly run commands and view the results in a CLI. Great for analysing algorithm metrics and viewing data.
### In a container
Ensure reliability and security by isolating an algorithm inside of a container. Deployable on Kubernetes to ensure your algorithms keep running.
### As a server
Start a NodeTrader-Framework process in the background, and send commands to it. Makes starting and stopping algorithms easier.

## Commands
The following commands can be used to manage algorithms. As design continues these will be updated with syntax and specifics.
```
help      # Show help or get info on a specific command
new       # Create a new trading algorithm
delete    # Delete a trading algorithm and its associated data
list      # Show existing trading algorithms and information
detail    # Show details about an algorithm and its testing and trading results
stats     # Show statistics and collected data for an algorithm
run       # Run trading algorithms on live markets
backtest  # Test algorithms on historical data
livetest  # Test algorithms on live data
server    # Start NodeTrader in server mode
cli       # Start NodeTrader in CLI mode
```

## Contributing
This is no small project, and I welcome your contributions and ideas. Please feel free to [open a pull request](https://github.com/MRegirouard/NodeTrader-Framework/compare) or [start a discussion](https://github.com/MRegirouard/NodeTrader-Framework/discussions/new).
