# NodeTrader-Framework
A Node.js cryptocurrency trading bot framework.

## ⚠️ Disclaimer ⚠️
Any information contained in this repository or documentation is not financial advice. The developer(s) takes no responsibility for the use and misuse of this software and documentation. Users of this code do so at their own risk. Please inspect and monitor code and algorithms carefully, and test before deploying. Trade responsibly.

## Project Overview
NodeTrader Framework is a framework for creating, managing, running, testing, and evaluating trading algorithms on KuCoin. Using this software, traders can easily write their own algorithms for trading, without having to worry about API calls and boilerplate code. Traders can test and track the performance of their algorithms and tune them using the automatic parameter tuning feature. NodeTrader's verbose logging and databases make for a robust trading environment that allows users to focus on what matters most: the money.

## Goals
- Creation and deletion of algorithms
- Testing in KuCoin sandbox or on past price data
- Automatic parameter tuning
- Discord integration for starting, stopping, and monitoring algorithms
- Database of trades, variable and parameter changes, and prices
- Graphs with algorithm performance analysis
- Allow users to just write algorithms

## File Structure
The main file structure of the project is as follows:
```bash
logs/  # Log files, separated by date

src/  # Source code
  index.ts  # Entry script
  customLog.js  # Custom Winston logger for this project
  AlgoVar.ts # Algorithm variable class, to track variable changes for the algorithm
  AlgoParam.ts # Algorithm parameter class, to customize and train algorithms
  Order.ts # Order class, to track orders made by the algorithms
  Algorithm.ts # Algorithm base class
  DataManager.ts # Data manager class, for fetching price data
  
algorithms/  # User-generated trading algorithm
  Algo1/  # The algorithm "Algo1"
    logs/  # User and system logs specific to this algorithm
    algorithm.ts  # The algorithm code
    config.json  # The algorithm configuration
    data.db  # Algorithm database
    
# Other files
```

## Commands
NodeTrader can be started with the following commands a possible first argument. Note: With the exception of `help`, these commands are tentative and have not been written yet.

```
help    # Show help or get info on a specific command.
new     # Create a new trading algorithm
show    # Show existing trading algorithms and information
run     # Run specified trading algorithms
sim     # Test specified trading algorithms in a simulated environment
test    # Test specified trading algorithms on KuCoin sandbox
server  # Start NodeTrader in server mode
```

## Contributing
This is no small project, and I welcome your contributions and ideas. Please feel free to [open a pull request](https://github.com/MRegirouard/NodeTrader-Framework/compare) or [start a discussion](https://github.com/MRegirouard/NodeTrader-Framework/discussions/new).
