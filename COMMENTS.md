# Comments

These are instructions for building and using this tool. This tool calculates the second lowest cost silver plan for a group of zip codes.

## Building

0. This package is built using Node and NPM. Please make sure that these tools are available and installed on your system.
1. Install the required dependencies with NPM. `$ npm install`
2. Fin! See the Usage section for usage instructions.

## Usage

```$ npm run```

This command reads the files `plans.csv` and `zips.csv` in the current directory. It sends output to `STDOUT` so that it can be easily redirected in to a file for later use.

Ex: ```$ npm run > slcsp.csv```
