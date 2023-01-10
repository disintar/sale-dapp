# React NFT sale dApp

## DO NOT USE IN PRODUCTION

## Why this is important?

[Read description of how it's work and why it's important](https://sale.dapp.dton.io/?mode=wtf&stage=choose)

## Features

| Feature                                                                                                       | Status |
|---------------------------------------------------------------------------------------------------------------|--------|
| Serverless dApp (dton api only for search NFT & royalty & jetton address calculation, can be used without it) | ✅      |
| No special roles or SETCODE in smart contract                                                                 | ✅      |
| Frontend is only on client                                                                                    | ✅      |
| 100% OpenSource code                                                                                          | 🫡     |
| Less fee for configuration & new idea of sale contracts                                                       | ✅      |
| Jetton Sale                                                                                                   |        |
| Indexing by main marketplaces and explorers                                                                   |        |
| Toncli 100% functional unit tests                                                                             |        |
| Auto test and deploy thru Github Actions                                                                      | ✅      |
| Access thru Github Sites                                                                                      | ✅      |
| Can be used by other developers as template for dApp                                                          | ✅      |
| Merkle proofs on data from DTON                                                                               | TBD    |

## Toncli devs

This is Disintar new sale contract & the example of how dApps on Toncli can be done. Feel free to use this repository as
template for your dApps.

### How dApp on toncli works?

Toncli create `.json` file of build info for each smart contract since ` v0.0.5` version.
It can be founded [here](https://github.com/disintar/sale-dapp/blob/master/build/nft_sale.json)

We can use this file to grab info about smart contract and create JS application that will deploy it or read info about
this contract.

### How toncli tests works in CI&CD workflow?

Each commit to mater [trigger](https://github.com/disintar/sale-dapp/actions) Docker actions.
It's use `action.yml` & `.github/workflow/main.yml` to do it.

In docker file we define to
run [tests](https://github.com/disintar/sale-dapp/blob/c5f1e8ba36ddcff716d5666a07c38f5bead1a79a/Dockerfile#L7).
If for some reason it'll be failed - the action will also fail, and bad version of your contract willn't be in dApp.

<img src="https://github.com/disintar/sale-dapp/blob/master/dapp/public/screens/screen1.png" alt="tests"/>

### How to convert my toncli project to dApp?

1. Copy `action.yml` / `Dockerfile` / `entrypoint.sh` / `.github` / `dapp` folders to your project
2. Create soft link of your smart contract `.json` into public folder of `dapp` (now you can download it in JS code)
3. Create [GitHub PAT token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
and pass it to [action secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) as `GH_TOKEN`
4. Enable GitHub pages to `gh-pages` branch
5. Enjoy

Each commit will trigger action to run docker, that will push builded JS code to `gh-pages` branch

### Smart Contract License

Copyright (c) 2022-2023 Disintar LLP Licensed under the Business Source License 1.1
