# Comments

These are instructions for building and using this tool. This tool calculates the second lowest cost silver plan for a group of zip codes.

## Building

This package requires Node and NPM. The Node ecosystem moves pretty fast and versions can get hard to manage. To make things easier, this app recommends using the included Dockerfile. If you'd prefer to use your local Node environment, it will work just as well.

0. Make sure you have Docker installed and set up.
1. Build the image:
  
    ```$ docker build -t slcsp:latest .```

2. Fin! See the Usage section for usage instructions.

## Usage

```$ docker run -it slcsp:latest npm run default```

This command reads the files `plans.csv` and `zips.csv` in the current directory. It sends output to `STDOUT` so that it can be easily redirected in to a file for later use.

Ex: ```$ docker run slcsp:latest > slcsp.csv```
