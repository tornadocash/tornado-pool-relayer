# Relayer for Tornado Cash [![Build Status](https://github.com/tornadocash/relayer/workflows/build/badge.svg)](https://github.com/tornadocash/relayer/actions) [![Docker Image Version (latest semver)](https://img.shields.io/docker/v/tornadocash/relayer?logo=docker&logoColor=%23FFFFFF&sort=semver)](https://hub.docker.com/repository/docker/tornadocash/relayer)

## Getting listed on nova.tornado.cash

If you would like to be listed in nova.tornado.cash UI relayer's dropdown option, please do the following:

1. Setup tornado.cash relayer node(see below for docker-compose.yml example)
2. Setup ENS subdomain(`nova.xxx.eth`) with TEXT record and URL key that points to your DNS or IP address.
3. Test your relayer setup at https://nova.tornado.cash by choosing custom relayer's option on withdraw/transfer tab. Enter your ens name or url and initiate an operation.
4. Open new Github issue in https://github.com/tornadocash/tornado-pool-relayer/issues and specify the following:

- your mainnet ens url
- your telegram handle
- withdrawal tx on mainnet and xdai
- transfer tx on xdai

Please choose your testnet relayer's fee wisely.

Disclaimer: Please consult with legal and tax advisors regarding the compliance of running a relayer service in your jurisdiction. The authors of this project bear no responsibility.

USE AT YOUR OWN RISK.

## Deploy with docker-compose

docker-compose.yml contains a stack that will automatically provision SSL certificates for your domain name and will add a https redirect to port 80.

1. Download [docker-compose.yml](/docker-compose.yml) and [.env.example](/.env.example)

```
wget https://raw.githubusercontent.com/tornadocash/tornado-relayer/master/docker-compose.yml
wget https://raw.githubusercontent.com/tornadocash/tornado-relayer/master/.env.example -O .env
```

2. Setup environment variables
    - set `CHAIN_ID` (100 for xdai, 1 for mainnet)
    - set `PRIVATE_KEY` for your relayer address (without 0x prefix)
    - set `VIRTUAL_HOST` and `LETSENCRYPT_HOST` to your domain and add DNS record pointing to your relayer ip address
    - set `REWARD_ADDRESS` - eth address that is used to collect fees
    - set `RPC_URL` rpc url for your node
    - set `ORACLE_RPC_URL` - rpc url for mainnet node for fetching prices(always have to be on mainnet)
    - set `WITHDRAWAL_SERVICE_FEE` - fee in % that is used for tornado withdrawals
    - set `TRANSFER_SERVICE_FEE` - fee is a fixed value in ether for transfer
    - set `CONFIRMATIONS` if needed - how many block confirmations to wait before processing an event. Not recommended to set less than 3
    - set `MAX_GAS_PRICE` if needed - maximum value of gwei value for relayer's transaction

      If you want to use more than 1 eth address for relaying transactions, please add as many `workers` as you want. For example, you can comment out `worker2` in docker-compose.yml file, but please use a different `PRIVATE_KEY` for each worker.

3. Run `docker-compose up -d`

## Run locally

1. `npm i`
2. `cp .env.example .env`
3. Modify `.env` as needed
4. `yarn start:dev`
5. Go to `http://127.0.0.1:8000`
6. In order to execute withdraw/transfer request, you can run following command

```bash
curl -X POST -H 'content-type:application/json' --data '<input data>' http://127.0.0.1:8000/transaction
```

Relayer should return a transaction hash

In that case you will need to add https termination yourself because browsers with default settings will prevent https
tornado.cash UI from submitting your request over http connection

## Architecture

- Abi: Json ABI for working with contracts
- Artifacts: The generated file contains typed contract instances
- Config:
    1. `bull.config.ts` bull service settings
    2. `configuration.ts` global application configuration
    2. `txManager.config.ts` txManager service settings
- Constants:
    1. `contracts.ts` addresses of contracts and rps
    2. `variables.ts` various variables to make things easier
- Modules:
    1. `controller.ts` Controller file that will contain all the application routes
    2. `module.ts` The module file essentially bundles all the controllers and providers of your application together.
    3. `service.ts` The service will include methods that will perform a certain operation.
    4. `main.ts` The entry file of the application will take in your module bundle and create an app instance using the NestFactory provided by Nest.
- Services:
    1. `gas-price.ts` update gas prices
    2. `offchain-price.ts` update the exchange rate
    3. `provider.ts` add-on for working with ethers js
- Types: types for the application
- Utilities: helpers functions

Disclaimer:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
