Cram-Sesh
=========
### Turning on the Databases in the node-box <br>
#### In the Vagrant Virutal Machine please type the following commands:
Turn on MongoDB <br>
> mkdir -p $HOME/mongodb/data
> $HOME/mongodb/bin/mongod --dbpath=$HOME/mongodb/data

Turn on Redis <br>
> $HOME/redis/src/redis-server

#### Command Line:
> git clone https://github.com/noe-alejandro/CramSesh <br>

Navigate to the CramSesh root folder.

> npm install

> node server.js

Open Mozilla Firefox or Google Chrome and navigate to: <br>
http://localhost:3000/
