# NFT Ultimate Sale contract
## DO NOT USE IN PRODUCTION


### Tests
To see awesome logging, install [toncli-local branch from Disintar repo](https://github.com/disintar/ton/tree/toncli-local) with latests [toncli](https://github.com/disintar/toncli) 

`git clone git@github.com:disintar/toncli.git && cd toncli && pip install -e .`

If you dont want ton install our branch - remove `impure` in `func/asm/dump-utils.func`, but check out how cool it is:

```
#DEBUG#: [👀] 🔢 Contract mode: 1
#DEBUG#: [🌊] Process buy request 💸
#DEBUG#: [🌊] Sale is limited, check 🔐
#DEBUG#: [🌊] Sale is limited, all good 🔓
#DEBUG#: [👀] Price full on start: 1000000000
#DEBUG#: [👀] Market fee calculated: 50000000
#DEBUG#: [👀] Royalty fee calculated: 47500000
#DEBUG#: [👀] Price final calculated: 902500000
#DEBUG#: [👀] Price full final: 1000000000
#DEBUG#: [🌊] Process buy request for TON 💎
#DEBUG#: [🌊] 💎 Funds is fine, process...
#DEBUG#: [👀] 💎 Send market fee to marketplace: 50000000
#DEBUG#: [👀] 💎 Send royalty fee to royalty_destanation: 47500000
#DEBUG#: [👀] 💎 Send rest of price to deployer: 902500000
#DEBUG#: [🌊] Item is bought 🥳 for 💎!
[ 3][t 0][2022-11-06 23:32:26.054121][vm.cpp:558]       steps: 2353 gas: used=84432, max=1000000000, limit=1000000000, credit=0
INFO: Test [__test_try_to_buy_limited_sale] status: [SUCCESS] Test result: [[ 67736 ]] Total gas used (including testing code): [84432]
Final status: [SUCCESS] - 9 cases
Final status: [FAILED] - 0 cases

```

### License

Copyright (c) 2022 Disintar LLP Licensed under the Business Source License 1.1
