import React, {Component} from 'react'
import '../styles/SmartContractExplore.css';
import dTonAPI from "../api/dton";
import {BOC, Builder, Address, Coins} from "ton3-core";
import {ton_icon} from "../icons";
import {TonhubConnector} from "ton-x";
import QRCodeStyling from "qr-code-styling";

const parseAddressFromCs = bocBase64 => {
    try {
        const cell = BOC.fromStandard(Buffer.from(bocBase64, 'base64'))
        return cell.slice().loadAddress()
    } catch (e) {
        console.error(e)
        return null
    }

}

const fixBigAddress = (addr, cnt = 14) => {
    if (!addr || !addr.length) {
        return "addr_none"
    }

    if (addr.length > cnt) {
        const toCut = addr.length - cnt - 5
        const first_part = addr.substr(0, cnt / 2)
        const second_part = addr.substr(cnt / 2 + 4 + toCut, addr.length)

        if (cnt > 10) {
            return `${first_part}... ${second_part}`
        } else {
            return `${first_part} . ${second_part}`
        }

    } else {
        return addr
    }
}

const fixContractMode = (mode) => {
    if (mode === "0") {
        return "Uninited"
    } else if (mode === "1") {
        return "Inited"
    } else if (mode === "2") {
        return "Bought"
    } else if (mode === "3") {
        return "Canceled"
    }
}

export default class SmartContractExplore extends Component {
    constructor(props) {
        super(props);

        this.state = {
            address: props.address,
            loaded: false,
            nftContent: '',
            nftImage: '',
            nftName: 'Loading...',

            showTonHubPopup: false,
            showTonconnectPopup: false,
            showEditPopup: false,
            tonconnectSessionLink: '',
            tonHubSessionLink: '',
            tonHubAppPublicKey: '',
            tonHubSessionSeed: '',
            tonHubAppEndpoint: '',
        }

        this.dton = new dTonAPI()

        this.tonhubconnector = new TonhubConnector()
        this.qrGoesHere = new React.createRef()
    }

    onChange = (item) => {
        this.setState({[item.target.name]: item.target.value})
    }

    loginTonHub = () => {
        this.setState({
            showTonHubPopup: true, wallet: 'TonHub', isLoggedIn: false, ownerAddress: ''
        }, () => {
            const connector = new TonhubConnector({network: 'mainnet'});
            connector.createNewSession({
                name: 'Disintar', url: 'https://beta.disintar.io'
            }).then((session) => {
                this.setState({
                    session: session
                })

                const qrCode = new QRCodeStyling({
                    width: 350, height: 350, margin: 10, image: "", data: session.link, dotsOptions: {
                        color: "white", type: "rounded",
                    }, imageOptions: {
                        crossOrigin: "anonymous", margin: 10,
                    }, backgroundOptions: {
                        color: "#1F1F1F"
                    }, cornersSquareOptions: {
                        color: "white",
                    },
                })

                if (this.qrGoesHere.current) {
                    this.qrGoesHere.current.innerHTML = ''
                    qrCode.append(this.qrGoesHere.current)
                }

                connector.awaitSessionReady(session.id, 5 * 60 * 1000).then((sessionConfirmed) => {
                    if (sessionConfirmed.state === 'ready') {
                        this.setState({
                            ownerAddress: sessionConfirmed.wallet.address,
                            isLoggedIn: true,
                            tonHubAppPublicKey: sessionConfirmed.wallet.appPublicKey,
                            tonHubSessionSeed: session.seed,
                            tonHubAppEndpoint: sessionConfirmed.wallet.endpoint,
                            showTonHubPopup: false
                        })
                    } else {
                        throw new Error('Impossible');
                    }
                })
            })

        })
    }

    getTonHubLogin = () => {
        return <div className={"PopupItem"}>
            <div className={"PopupItemContent"}>
                <h3>Login with TonHub</h3>
                <div className={"QrCode"} ref={this.qrGoesHere}/>

                <a onClick={() => {
                    window.open(this.state.session.link, '_blank');
                }}>Open in app</a><br/><br/>
                <a onClick={() => this.setState({
                    showTonHubPopup: false
                })}>Close</a>
            </div>
        </div>
    }

    getEditPopup = () => {
        return <div className={"PopupItem"}>
            <div style={{width: "900px"}} className={"PopupItemContent"}>
                <h3>Edit sale</h3>

                <div
                    className={`SmartContractCreationSettingsRow`}>
                    <div className={"SmartContractCreationSettingsRowTitle"}>
                        <h4>Sell type</h4>
                    </div>

                    <div className={"SmartContractCreationSettingsRowInput"}>
                        <ul>
                            <li className={this.state.isTon ? 'active' : null}
                                onClick={() => this.setState({isTon: true})}>{ton_icon} TON
                            </li>
                            <li className={!this.state.isTon ? 'active' : null}
                                onClick={() => this.setState({isTon: false})}>Jetton
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={"SmartContractCreationSettingsRow"}>
                    <div className={"SmartContractCreationSettingsRowTitle"}>
                        <h4>Price</h4>
                    </div>

                    <div className={"SmartContractCreationSettingsRowInput"}>
                        <input name={'price'} value={this.state.price} onChange={this.onChange}
                               placeholder={"NFT price"} type={'number'} min={0}/>
                    </div>
                </div>

                {!this.state.isTon ? <div className={"SmartContractCreationSettingsRow"}>
                    <div className={"SmartContractCreationSettingsRowTitle"}>
                        <h4>Jetton Collection Address</h4>
                    </div>

                    <div className={"SmartContractCreationSettingsRowInput"}>
                        <input name={'jettonCollectionAddress'} onChange={this.onChange}
                               value={this.state.jettonCollectionAddress}
                               placeholder={"Jetton address goes here"}
                               type={'text'}/>
                    </div>
                </div> : null}

                <div
                    className={`SmartContractCreationSettingsRow ${this.state.displayMode === 'simple' ? 'hidden' : ''}`}>
                    <div className={"SmartContractCreationSettingsRowTitle"}>
                        <h4>Time limit</h4>
                    </div>

                    <div className={"SmartContractCreationSettingsRowInput"}>
                        <input name={'limitedTime'} onChange={this.onChange}
                               value={this.state.limitedTime}
                               placeholder={"UNIX Time limit"}
                               type={'number'}/>

                        <ul style={{marginTop: "2rem"}}>
                            <li onClick={() => this.setState({limitedTime: ((Date.now() / 1000) + (5 * 60)) * 1000})}>5
                                minutes
                            </li>
                            <li onClick={() => this.setState({limitedTime: ((Date.now() / 1000) + (15 * 60)) * 1000})}>15
                                minutes
                            </li>
                            <li onClick={() => this.setState({limitedTime: ((Date.now() / 1000) + (60 * 60)) * 1000})}>1
                                hour
                            </li>
                            <li onClick={() => this.setState({limitedTime: ((Date.now() / 1000) + (60 * 60 * 24)) * 1000})}>1
                                day
                            </li>
                        </ul>
                    </div>
                </div>


                <br/><br/>
                <a style={{marginRight: "1rem"}} onClick={() => this.setState({
                    showEditPopup: false
                }, this.editSale)}>Save </a>

                <a onClick={() => this.setState({
                    showEditPopup: false
                })}> Close</a>
            </div>
        </div>
    }

    componentDidMount() {
        this.updateContractInfo()

        setTimeout(() => {
            this.loadTonWallet()
        }, 1000)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.address !== this.state.address) {
            this.updateContractInfo()
        }
    }

    updateContractInfo = () => {
        this.dton.getContractInfo(this.state.address).then(data => {
            this.setState({
                loaded: true,
                transactionsCount: data.data.accountTransactionCount,
                codeVerified: data.data.transactions[0].account_state_state_init_code === this.props.code.code,
                grams: data.data.transactions[0].account_storage_balance_grams,
            })
        })

        this.dton.runGetMethod(this.state.address, "get_sale_data", []).then(data => {
            if (data.data.run_method.stack.length > 9) {
                try {
                    const marketplaceCs = parseAddressFromCs(data.data.run_method.stack[0].value)
                    const nftCs = parseAddressFromCs(data.data.run_method.stack[1].value)
                    const ownerAddr = parseAddressFromCs(data.data.run_method.stack[2].value)
                    const fullPrice = data.data.run_method.stack[3].value
                    const market_fee = data.data.run_method.stack[4].value
                    const royaltyCs = parseAddressFromCs(data.data.run_method.stack[5].value)
                    const royalty = data.data.run_method.stack[6].value
                    const isTon = data.data.run_method.stack[7].value
                    const my_jettonCs = parseAddressFromCs(data.data.run_method.stack[8].value)
                    const my_jettonMasterCs = parseAddressFromCs(data.data.run_method.stack[11].value)
                    const limitCs = parseAddressFromCs(data.data.run_method.stack[9].value)
                    const end_at = data.data.run_method.stack[10].value

                    this.dton.getNftContent(nftCs.toString('base64', {bounceable: true})).then(data => {
                        this.processNftContent(data.data.transactions[0]['parsed_nft_content_offchain_url'])
                    })

                    this.setState({
                        marketplace_address: marketplaceCs ? marketplaceCs.toString('base64', {bounceable: true}) : null,
                        nft_address: nftCs ? nftCs.toString('base64', {bounceable: true}) : null,
                        owner_address: ownerAddr ? ownerAddr.toString('base64', {bounceable: true}) : null,
                        full_price: parseInt(fullPrice),
                        market_fee: parseInt(market_fee),
                        royalty_address: royaltyCs ? royaltyCs.toString('base64', {bounceable: true}) : null,
                        royalty: parseInt(royalty),
                        is_ton: isTon === "1",
                        my_jetton_master_address: my_jettonMasterCs ? my_jettonMasterCs.toString('base64', {bounceable: true}) : null,
                        my_jetton_address: my_jettonCs ? my_jettonCs.toString('base64', {bounceable: true}) : null,
                        limit_address: limitCs ? limitCs.toString('base64', {bounceable: true}) : null,
                        end_at: end_at,

                        // for edit
                        isTon: isTon === "1",
                        price: (parseInt(fullPrice) - parseInt(market_fee) - parseInt(royalty)) / 10 ** 9,
                        jettonCollectionAddress: "",
                        limitedTime: parseInt(end_at),
                        limitAddress: limitCs ? limitCs.toString('base64', {bounceable: true}) : ''

                    })
                } catch (e) {
                    console.error(e)
                }
            }
        })

        this.dton.runGetMethod(this.state.address, "get_version", []).then(data => {
            this.setState({
                version: data.data.run_method.stack[0].value
            })
        })

        this.dton.runGetMethod(this.state.address, "get_is_closed", []).then(data => {
            this.setState({
                is_closed: data.data.run_method.stack[0].value
            })
        })

        this.dton.runGetMethod(this.state.address, "get_sell_info", []).then(data => {
            this.setState({
                mode: data.data.run_method.stack[0].value
            })
        })
    }

    loadTonWallet = () => {
        this.provider = window.ton

        if (this.provider.isTonWallet) {
            this.provider.send('ton_requestAccounts').then(x => {
                this.setState({
                    ownerAddress: x[0], wallet: 'TON Extension', isLoggedIn: true
                })
            })

        }

        this.forceUpdate()
    }

    processNftContent = (url) => {
        fetch(url).then(data => data.json()).then(data => this.setState({
            nftImage: data.image, nftName: data.name
        }))
    }

    static getDerivedStateFromProps(props, state) {
        if (props.address !== state.address) {
            return {
                address: props.address
            };
        }

        return null;
    }

    processBuy = () => {
        if (this.state.is_ton) {
            if (this.state.wallet === 'TonHub') {
                const request = {
                    seed: this.state.tonHubSessionSeed, // Session Seed
                    appPublicKey: this.state.tonHubAppPublicKey, // Wallet's app public key
                    to: this.state.address, // Destination
                    value: this.state.full_price + (0.06 * 10 ** 9), // Amount in nano-tons
                    timeout: 5 * 60 * 1000, // 5 minute timeout
                    // stateInit: stateInitBase64, // Optional serialized to base64 string state_init cell
                    // payload: payloadBase64
                }

                this.tonhubconnector.requestTransaction(request)
            } else if (this.state.wallet === 'TON Extension') {
                const provider = window.ton;

                provider.send('ton_sendTransaction', [{
                    to: this.state.address,
                    value: parseInt(this.state.full_price) + (0.06 * 10 ** 9), // stateInit: stateInitBase64,
                    // data: payloadBase64,
                    // dataType: "boc"
                }]);

            }
        } else {
            // transfer#0f8a7ea5 query_id:uint64 amount:(VarUInteger 16) destination:MsgAddress
            //      response_destination:MsgAddress custom_payload:(Maybe ^Cell)
            //      forward_ton_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell)
            //      = InternalMsgBody;

            this.dton.calculateJettonAddress(this.state.my_jetton_master_address, this.state.ownerAddress).then(dtonAnswer => {
                const jettonWalletAddress = dtonAnswer.data.getJettonWalletAddress

                const cell = new Builder()
                // cancel sale
                cell.storeUint(0x0f8a7ea5, 32)
                cell.storeUint(0, 64)
                cell.storeCoins(new Coins(this.state.price))
                cell.storeAddress(new Address(this.state.address))
                cell.storeAddress(new Address(this.state.ownerAddress))
                cell.storeUint(0, 1)
                cell.storeCoins(new Coins(0.36))
                cell.storeUint(0, 1)
                this.sendCell(cell, 0.4, jettonWalletAddress);
            })
        }
    }

    sendCell = (cell, price = 0.03, destination = null) => {
        let realDestination

        if (destination) {
            realDestination = destination
        } else {
            realDestination = this.state.address
        }

        const payloadBOC = BOC.toBytesStandard(cell.cell());
        const payloadBase64 = Buffer.from(payloadBOC).toString('base64')

        if (this.state.wallet === 'TonHub') {
            const request = {
                seed: this.state.tonHubSessionSeed, // Session Seed
                appPublicKey: this.state.tonHubAppPublicKey, // Wallet's app public key
                to: realDestination, // Destination
                value: price * 10 ** 9, // Amount in nano-tons
                timeout: 5 * 60 * 1000, // 5 minute timeout
                // stateInit: stateInitBase64, // Optional serialized to base64 string state_init cell
                payload: payloadBase64
            }

            this.tonhubconnector.requestTransaction(request)
        } else if (this.state.wallet === 'TON Extension') {
            const provider = window.ton;

            provider.send('ton_sendTransaction', [{
                to: realDestination,
                value: price * 10 ** 9, // stateInit: stateInitBase64,
                data: payloadBase64,
                dataType: "boc"
            }]);
        }
    }


    cancelSale = () => {
        const cell = new Builder()
        // cancel sale
        cell.storeUint(0x0000000b, 32)
        this.sendCell(cell);
    }


    sendNftOneMoreTime = () => {
        const cell = new Builder()
        // cancel sale
        cell.storeUint(0x000000a0, 32)
        this.sendCell(cell);
    }

    sendNFTToSeller = () => {
        const message = new Builder();
        message.storeUint(0x5fcc3d14, 32)
        message.storeUint(228, 64) // query id
        message.storeAddress(new Address(this.state.address))
        message.storeAddress(new Address(this.state.ownerAddress))
        message.storeUint(0, 1) // custom payload
        message.storeCoins(new Coins(0.01)) // forward amount
        message.storeUint(0, 32)


        const payloadBOC = BOC.toBytesStandard(message.cell())
        const payloadBase64 = Buffer.from(payloadBOC).toString('base64')

        const amount = 0.05 * 10 ** 9

        if (this.state.wallet === 'TonHub') {
            const request = {
                seed: this.state.tonHubSessionSeed, // Session Seed
                appPublicKey: this.state.tonHubAppPublicKey, // Wallet's app public key
                to: this.state.nft_address, // Destination
                value: amount, // Amount in nano-tons
                timeout: 5 * 60 * 1000, // 5 minute timeout
                payload: payloadBase64
            };
            const connector = new TonhubConnector({network: "mainnet"});
            connector.requestTransaction(request).then(response => {
                if (response.type !== 'success') {
                    this.setState({error: 'Problems with your tonhub session. Please try to relogin'})
                }
            })

        } else if (this.state.wallet === 'TON Extension') {
            const provider = window.ton;

            provider.send(
                'ton_sendTransaction',
                [{
                    to: this.state.nft_address,
                    value: amount.toString(),
                    data: payloadBase64,
                    dataType: "boc"
                }]
            );
        }
    }

    editSale = () => {
        const priceConfig = new Builder()

        if (this.state.jettonCollectionAddress !== "") {
            priceConfig.storeUint(0, 1)
        } else {
            priceConfig.storeUint(1, 1)
        }

        priceConfig.storeCoins(new Coins(this.state.price))

        if (this.state.limitAddress !== '') {
            priceConfig.storeAddress(new Address(this.state.limitAddress))
        } else {
            priceConfig.storeUint(0, 2)
        }

        priceConfig.storeUint(Math.round(this.state.limitedTime / 1000), 32)

        if (this.state.jettonCollectionAddress !== "") {
            const masterAddress = new Address(this.state.jettonCollectionAddress)

            this.dton.calculateJettonAddress(this.state.jettonCollectionAddress, this.state.address).then(dtonAnswer => {
                const jettonWalletAddress = new Address(dtonAnswer.data.getJettonWalletAddress)
                priceConfig.storeAddress(jettonWalletAddress)
                priceConfig.storeAddress(masterAddress)

                const editCommand = new Builder()
                editCommand.storeUint(0x0000000a, 32)
                editCommand.storeRef(priceConfig.cell())

                this.sendCell(editCommand, 0.01);
            })
        } else {
            priceConfig.storeUint(0, 2)

            const editCommand = new Builder()
            editCommand.storeUint(0x0000000a, 32)
            editCommand.storeRef(priceConfig.cell())

            this.sendCell(editCommand, 0.01);
        }

    }

    render() {
        return (<div>
            <br/>
            <div className={"SmartContractCreationSettingsRowConfiguration"}>
                <div className={"SmartContractCreationSettingsRowInput"}>
                    <ul>
                        <li className={this.state.wallet === 'TON Extension' ? 'active' : null}
                            onClick={this.loadTonWallet}>TON Extension
                        </li>
                        <li className={this.state.wallet === 'TonKeeper' ? 'active' : null}
                            onClick={this.loginTonConnect}>TonKeeper
                        </li>
                        <li className={this.state.wallet === 'TonHub' ? 'active' : null}
                            onClick={this.loginTonHub}>TonHub
                        </li>
                    </ul>
                </div>
            </div>

            <div className={"TonExtensionStatus"}>
                {this.state.isLoggedIn ? <>
                    <span className={"greenDot"}/>
                    <p>{this.state.wallet} loaded</p>
                </> : <>
                    <span className={"yellowDot"}/>
                    <p>{this.state.wallet} unloaded</p>
                </>}
            </div>

            {this.state.showTonHubPopup ? this.getTonHubLogin() : null}
            {this.state.showEditPopup ? this.getEditPopup() : null}

            <div className="SmartContractExploreHeader">
                <h2>Sale contract</h2>
                <h3>{this.state.address}</h3>
            </div>

            {this.state.loaded ? <>
                <div className="SmartContractExploreHeaderInfo">
                    <div className="SmartContractExploreHeaderInfoBlock">
                        <p>Toncli code:</p>
                        <p>{this.state.codeVerified ? 'verified ✅' : 'not-verified ❌'}</p>
                    </div>

                    <div className="SmartContractExploreHeaderInfoBlock">
                        <p>Transactions count:</p>
                        <p>{this.state.transactionsCount}</p>
                    </div>

                    <div className="SmartContractExploreHeaderInfoBlock">
                        <p>Grams:</p>
                        <p>{this.state.grams}</p>
                    </div>
                </div>

                <div className="SmartContractExploreSmcFullBlock">
                    <div className="SmartContractExploreSmcInfo">
                        <h3>Contract state</h3>

                        <div className="SmartContractExploreSmcInfoBlock">
                            <p>Version:</p>
                            <p>{this.state.version}</p>
                        </div>

                        <div className="SmartContractExploreSmcInfoBlockWithIcon">
                            <p>Price:</p>
                            <p>{this.state.full_price / 10 ** 9} {this.state.is_ton ? ton_icon : "Jetton"}</p>
                        </div>

                        <div className="SmartContractExploreSmcInfoBlock">
                            <p>Currency:</p>
                            <p>{this.state.is_ton ? ton_icon : "Jetton"}</p>
                        </div>

                        <div className="SmartContractExploreSmcInfoBlock">
                            <p>Contract mode:</p>
                            <p>{fixContractMode(this.state.mode)}</p>
                        </div>

                        <div className="SmartContractExploreSmcInfoBlock">
                            <p>Is closed:</p>
                            <p>{this.state.is_closed === "-1" ? "🔐" : "🔓"}</p>
                        </div>

                        <div className="SmartContractExploreSmcInfoBlock">
                            <p>Marketplace:</p>
                            <a href={`https://dton.io/a/${this.state.marketplace_address}`}>{fixBigAddress(this.state.marketplace_address)}</a>
                        </div>

                        <div className="SmartContractExploreSmcInfoBlock">
                            <p>NFT Address:</p>
                            <a href={`https://dton.io/a/${this.state.nft_address}`}>{fixBigAddress(this.state.nft_address)}</a>
                        </div>

                        <div className="SmartContractExploreSmcInfoBlock">
                            <p>Owner Address:</p>
                            <a href={`https://dton.io/a/${this.state.owner_address}`}>{fixBigAddress(this.state.owner_address)}</a>
                        </div>

                        <div className="SmartContractExploreSmcInfoBlockWithIcon">
                            <p>Marketplace fee:</p>
                            <p>{this.state.market_fee / 10 ** 9} {ton_icon}</p>
                        </div>

                        <div className="SmartContractExploreSmcInfoBlock">
                            <p>Royalty Address:</p>
                            <a href={`https://dton.io/a/${this.state.royalty_address}`}>{fixBigAddress(this.state.royalty_address)}</a>
                        </div>

                        <div className="SmartContractExploreSmcInfoBlockWithIcon">
                            <p>Royalty:</p>
                            <p>{this.state.royalty / 10 ** 9} {ton_icon}</p>
                        </div>

                        <div className="SmartContractExploreSmcInfoBlock">
                            <p>Sale Jetton Wallet Address:</p>
                            <a href={`https://dton.io/a/${this.state.my_jetton_address}`}>{fixBigAddress(this.state.my_jetton_address)}</a>
                        </div>

                        <div className="SmartContractExploreSmcInfoBlock">
                            <p>Sale Jetton Master Address:</p>
                            <a href={`https://dton.io/a/${this.state.my_jetton_master_address}`}>{fixBigAddress(this.state.my_jetton_master_address)}</a>
                        </div>

                        <div className="SmartContractExploreSmcInfoBlock">
                            <p>Limit sale address for:</p>
                            <a href={`https://dton.io/a/${this.state.limit_address}`}>{fixBigAddress(this.state.limit_address)}</a>
                        </div>

                        <div className="SmartContractExploreSmcInfoBlock">
                            <p>Limit time:</p>
                            <p>{this.state.end_at !== "0" ? this.state.end_at : "Not limited"}</p>
                        </div>
                    </div>

                    <div className="SmartContractExploreSmcShow">
                        <h3>Sale info</h3>

                        <div className="SmartContractExploreSmcShowNft">
                            <div className="SmartContractExploreSmcShowNftImage"
                                 style={{backgroundImage: `url(${this.state.nftImage})`}}/>
                            <h3>{this.state.nftName}</h3>
                        </div>

                        {this.state.mode === "1" ? <div className="SmartContractExploreSmcShowAction">
                            <a onClick={this.processBuy}>💸 Buy</a>
                        </div> : null}

                        {this.state.mode === "1" ? <div className="SmartContractExploreSmcShowAction">
                            <a onClick={this.cancelSale}>✋🏻 Cancel sale</a>
                        </div> : null}

                        {this.state.mode === "3" || this.state.mode === "2" ?
                            <div className="SmartContractExploreSmcShowAction">
                                <a onClick={this.sendNftOneMoreTime}>✈️ Send NFT</a>
                            </div> : null}

                        {this.state.mode === "0" ?
                            <div className="SmartContractExploreSmcShowAction">
                                <a onClick={this.sendNFTToSeller}>😎 Send NFT</a>
                            </div> : null}

                        <div className="SmartContractExploreSmcShowAction">
                            <a onClick={() => this.setState({showEditPopup: true})}>🛠 Edit</a>
                        </div>


                    </div>
                </div>
            </> : <div>
                <p>Loading...</p>
            </div>}

        </div>);
    }
}