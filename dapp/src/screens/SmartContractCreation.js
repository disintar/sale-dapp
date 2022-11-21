import React, {Component} from 'react'
import '../styles/SmartContractCreation.css';
import {ton_icon} from "../icons";
import {Address, Builder, Coins} from 'ton3-core'
import QRCodeStyling from "qr-code-styling";
import {TonhubConnector} from 'ton-x';

export default class SmartContractCreation extends Component {
    constructor(props) {
        super(props);

        // c4 cell data
        this.state = {
            displayMode: 'simple',

            initMode: 0,

            nftAddress: '',
            mintNewNft: false,

            ownerAddress: '',
            buyerAddress: '',

            marketplaceFeeNumerator: 5,
            marketplaceFeeDenominator: 100,

            royaltyFeeNumerator: 0,
            royaltyFeeDenominator: 100,

            royaltyAddress: '',
            isTon: true,
            price: 1,
            limitAddress: '',
            limitedTime: 0,
            jettonCollectionAddress: '',
            jettonCollectionMintNew: false,

            wallet: 'Wallet',
            isLoggedIn: false,

            loadTime: Date.now(),


            showTonHubPopup: false,
            showTonKeeperPopup: false,
            tonHubSessionLink: ''
        }

        this.provider = {};
        this.tonhubconnector = new TonhubConnector();

        this.qrGoesHere = new React.createRef();
    }

    componentDidMount() {
        setTimeout(() => {
            this.loadTonWallet()
        }, 1000)

    }

    loadTonWallet = () => {
        this.provider = window.ton

        if (this.provider.isTonWallet) {
            this.provider.send('ton_requestAccounts').then(x => {
                this.setState({
                    ownerAddress: x[0],
                    wallet: 'TON Extension',
                    isLoggedIn: true
                })
            })

        }

        this.forceUpdate()
    }

    onChange = (item) => {
        this.setState({[item.target.name]: item.target.value})
    }

    buildCell = () => {
        try {

            const cell = new Builder()
            // sell mode
            cell.storeUint(this.state.initMode, 8)

            // if uninited - save time for unique address
            if (this.state.initMode === 0) {
                cell.storeUint(Math.round(this.state.loadTime / 1000), 32)
            }

            // NFT address we want to sell
            if (this.state.nftAddress !== '') {
                cell.storeAddress(new Address(this.state.nftAddress))
            } else {
                cell.storeUint(0, 2)
            }

            // NFT owner
            if (this.state.ownerAddress !== '') {
                cell.storeAddress(new Address(this.state.ownerAddress))
            } else {
                cell.storeUint(0, 2)
            }

            // NFT buyer
            if (this.state.buyerAddress !== '') {
                cell.storeAddress(new Address(this.state.buyerAddress))
            } else {
                cell.storeUint(0, 2)
            }

            const sellConfig = new Builder()

            sellConfig.storeUint(this.state.marketplaceFeeNumerator, 16)
            sellConfig.storeUint(this.state.marketplaceFeeDenominator, 16)

            sellConfig.storeUint(this.state.royaltyFeeNumerator, 16)
            sellConfig.storeUint(this.state.royaltyFeeDenominator, 16)

            if (this.state.royaltyAddress !== '') {
                sellConfig.storeAddress(new Address(this.state.royaltyAddress))
            } else {
                sellConfig.storeUint(0, 2)
            }

            cell.storeRef(sellConfig.cell())
            cell.storeRef(sellConfig.cell())

            const priceConfig = new Builder()

            priceConfig.storeUint(this.state.isTon ? 1 : 0, 1)
            priceConfig.storeCoins(new Coins(this.state.price))

            if (this.state.limitAddress !== '') {
                priceConfig.storeAddress(this.state.limitAddress)
            } else {
                priceConfig.storeUint(0, 2)
            }

            priceConfig.storeUint(Math.round(this.state.limitedTime / 1000), 32)

            // we always store address for jetton wallet of this smart contract as addr_none
            // to make address of smart contract predictable
            // we will provide real address of jetton wallet on deploy or configuration
            priceConfig.storeUint(0, 2)

            cell.storeRef(priceConfig.cell())

            return cell.cell()
        } catch (e) {
            console.log(e)
            return (new Builder()).cell()
        }

    }

    displayCell = (cell) => {
        return <div className={"SmartContractCreationCellDisplay"}>
            <p>Hash: {cell.hash()}</p>
            {cell.print()}
        </div>
    }

    displaySteps = () => {
        let steps = [];

        if (this.state.mintNewNft) {
            steps.push('Mint NFT')
        }

        if (this.state.jettonCollectionMintNew) {
            steps.push('Mint Jetton')
        }

        steps.push('Mint contract')

        if (this.state.initMode === 0) {
            steps.push('Transfer NFT')
        }

        return <div className={"SmartContractCreationSteps"}>
            <h3>{steps.length} steps to do:</h3>

            <ul>
                {steps.map((x, i) => {
                    return <li>{i}. {x}</li>
                })}
            </ul>
        </div>
    }

    loginTonHub = () => {
        this.setState({
            showTonHubPopup: true,
            wallet: 'TonHub',
            isLoggedIn: false,
            ownerAddress: ''
        }, () => {
            const connector = new TonhubConnector({network: 'mainnet'});
            connector.createNewSession({
                name: 'Disintar',
                url: 'https://beta.disintar.io'
            }).then((session) => {
                this.setState({
                    session: session
                })

                const qrCode = new QRCodeStyling({
                    width: 250,
                    height: 250,
                    margin: 10,
                    image: "",
                    data: session.link,
                    dotsOptions: {
                        color: "white",
                        type: "rounded",
                    },
                    imageOptions: {
                        crossOrigin: "anonymous",
                        margin: 10,
                    },
                    backgroundOptions: {
                        color: "#242424"
                    },
                    cornersSquareOptions: {
                        color: "white",
                    },
                })

                if (this.qrGoesHere.current) {
                    this.qrGoesHere.current.innerHTML = ''
                    qrCode.append(this.qrGoesHere.current)
                }

                connector.awaitSessionReady(session.id, 5 * 60 * 1000).then((sessionConfirmed) => {
                    if (sessionConfirmed.state === 'ready') {
                        console.log(sessionConfirmed);
                        // const correctConfig = TonhubConnector.verifyWalletConfig(session.id, sessionConfirmed.wallet);
                        // console.log(correctConfig);

                    } else {
                        throw new Error('Impossible');
                    }
                })
            })

        })
    }

    getTonHubLogin = () => {
        return <div className={"PopupItem"}>
            <h3>Login with TonHub</h3>
            <div className={"QrCode"} ref={this.qrGoesHere}/>
        </div>
    }

    render() {
        const dataCell = this.buildCell()

        return <div>

            {this.state.showTonHubPopup ? this.getTonHubLogin() : null}

            <div className={"TonExtensionStatus"}>
                {this.state.isLoggedIn ?
                    <>
                        <span className={"greenDot"}/>
                        <p>{this.state.wallet} loaded</p>
                    </> :
                    <>
                        <span className={"yellowDot"}/>
                        <p>{this.state.wallet} unloaded</p>
                    </>}
            </div>

            <div className="SmartContractCreation">
                <div className={"SmartContractCreationSettings"}>
                    <div className={"SmartContractCreationSettingsRowConfiguration"}>
                        <div className={"SmartContractCreationSettingsRowInput"}>
                            <ul>
                                <li className={this.state.wallet === 'TON Extension' ? 'active' : null}
                                    onClick={this.loadTonWallet}>TON Extension
                                </li>
                                <li className={this.state.wallet === 'TonKeeper' ? 'active' : null}
                                    onClick={() => this.setState({
                                        wallet: 'TonKeeper',
                                        isLoggedIn: false,
                                        ownerAddress: ''
                                    })}>TonKeeper
                                </li>
                                <li className={this.state.wallet === 'TonHub' ? 'active' : null}
                                    onClick={this.loginTonHub}>TonHub
                                </li>
                            </ul>
                        </div>
                    </div>


                    <h3>Data configuration</h3>

                    <div className={"SmartContractCreationSettingsRowConfiguration"}>
                        <div className={"SmartContractCreationSettingsRowInput"}>
                            <ul>
                                <li className={this.state.displayMode === 'simple' ? 'active' : null}
                                    onClick={() => this.setState({displayMode: 'simple'})}>Simple
                                </li>
                                <li className={this.state.displayMode === 'advanced' ? 'active' : null}
                                    onClick={() => this.setState({displayMode: 'advanced'})}>Advanced
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div
                        className={`SmartContractCreationSettingsRow ${this.state.displayMode === 'simple' ? 'hidden' : ''}`}>
                        <div className={"SmartContractCreationSettingsRowTitle"}>
                            <h4>Init mode <span>*</span></h4>
                        </div>

                        <div className={"SmartContractCreationSettingsRowInput"}>
                            <ul>
                                <li className={this.state.initMode === 0 ? 'active' : null}
                                    onClick={() => this.setState({initMode: 0})}>Dummy
                                </li>
                                <li className={this.state.initMode === 1 ? 'active' : null}
                                    onClick={() => this.setState({initMode: 1})}>Initialized
                                </li>
                                <li className={this.state.initMode === 2 ? 'active' : null}
                                    onClick={() => this.setState({initMode: 2})}>Sold
                                </li>
                                <li className={this.state.initMode === 3 ? 'active' : null}
                                    onClick={() => this.setState({initMode: 3})}>Canceled
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className={"SmartContractCreationSettingsRow"}>
                        <div className={"SmartContractCreationSettingsRowTitle"}>
                            <h4>Address of NFT you want to sell</h4>
                        </div>

                        <div className={"SmartContractCreationSettingsRowInput"}>
                            {!this.state.mintNewNft ? <input name={'nftAddress'} onChange={this.onChange}
                                                             value={this.state.nftAddress}
                                                             placeholder={"NFT address goes here"}
                                                             type={'text'}/> : null}

                            <ul>
                                <li className={!this.state.mintNewNft ? 'active' : null}
                                    onClick={() => this.setState({mintNewNft: false})}>Use existing
                                </li>
                                <li className={this.state.mintNewNft ? 'active' : null}
                                    onClick={() => this.setState({mintNewNft: true})}>Mint random new
                                </li>
                            </ul>
                        </div>
                    </div>


                    <div className={"SmartContractCreationSettingsRow"}>
                        <div className={"SmartContractCreationSettingsRowTitle"}>
                            <h4>Address of NFT owner who will receive money</h4>
                        </div>

                        <div className={"SmartContractCreationSettingsRowInput"}>
                            <input name={'ownerAddress'} value={this.state.ownerAddress} onChange={this.onChange}
                                   placeholder={"NFT owner address goes here"} type={'text'}/>
                        </div>
                    </div>


                    <div
                        className={`SmartContractCreationSettingsRow ${this.state.displayMode === 'simple' ? 'hidden' : ''}`}>
                        <div className={"SmartContractCreationSettingsRowTitle"}>
                            <h4>Address of NFT buyer who bought NFT <span>*</span></h4>
                        </div>

                        <div className={"SmartContractCreationSettingsRowInput"}>
                            <input name={'limitAddress'} value={this.state.limitAddress} onChange={this.onChange}
                                   placeholder={"NFT buyer address goes here"} type={'text'}/>
                        </div>
                    </div>

                    <div
                        className={`SmartContractCreationSettingsRow ${this.state.displayMode === 'simple' ? 'hidden' : ''}`}>
                        <div className={"SmartContractCreationSettingsRowTitle"}>
                            <h4>Marketplace fee <span>*</span></h4>
                        </div>

                        <div className={"SmartContractCreationSettingsRowInput"}>
                            <label htmlFor="marketplaceFeeNumerator">Fee Numerator</label>
                            <label htmlFor="marketplaceFeeDenominator">Fee Denominator</label>
                            <input id="marketplaceFeeNumerator" name={'marketplaceFeeNumerator'}
                                   value={this.state.marketplaceFeeNumerator} type={'number'}/>
                            <input id="marketplaceFeeDenominator" name={'marketplaceFeeDenominator'}
                                   value={this.state.marketplaceFeeDenominator} type={'number'}/>
                        </div>
                    </div>

                    <div
                        className={`SmartContractCreationSettingsRow ${this.state.displayMode === 'simple' ? 'hidden' : ''}`}>
                        <div className={"SmartContractCreationSettingsRowTitle"}>
                            <h4>Royalty fee <span>*</span></h4>
                        </div>

                        <div className={"SmartContractCreationSettingsRowInput"}>
                            <label htmlFor="royaltyFeeNumerator">Fee Numerator</label>
                            <label htmlFor="royaltyFeeDenominator">Fee Denominator</label>
                            <input id="royaltyFeeNumerator" name={'royaltyFeeNumerator'} onChange={this.onChange}
                                   value={this.state.royaltyFeeNumerator} type={'number'}/>
                            <input id="royaltyFeeDenominator" name={'royaltyFeeDenominator'} onChange={this.onChange}
                                   value={this.state.royaltyFeeDenominator} type={'number'}/>
                        </div>
                    </div>

                    <div
                        className={`SmartContractCreationSettingsRow ${this.state.displayMode === 'simple' ? 'hidden' : ''}`}>
                        <div className={"SmartContractCreationSettingsRowTitle"}>
                            <h4>Address of NFT royalty <span>*</span></h4>
                        </div>

                        <div className={"SmartContractCreationSettingsRowInput"}>
                            <input name={'royaltyAddress'} value={this.state.royaltyAddress} onChange={this.onChange}
                                   placeholder={"NFT royalty address goes here"} type={'text'}/>
                        </div>
                    </div>

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
                            {!this.state.jettonCollectionMintNew ?
                                <input name={'jettonCollectionAddress'} onChange={this.onChange}
                                       value={this.state.jettonCollectionAddress}
                                       placeholder={"Jetton address goes here"}
                                       type={'text'}/> : ''}

                            <ul>
                                <li className={this.state.jettonCollectionAddress === "EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE" ? 'active' : null}
                                    onClick={() => this.setState({
                                        jettonCollectionAddress: "EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE",
                                        jettonCollectionMintNew: false
                                    })}>Scale
                                </li>
                                <li className={this.state.jettonCollectionAddress === "EQD0vdSA_NedR9uvbgN9EikRX-suesDxGeFg69XQMavfLqIw" ? 'active' : null}
                                    onClick={() => this.setState({
                                        jettonCollectionAddress: "EQD0vdSA_NedR9uvbgN9EikRX-suesDxGeFg69XQMavfLqIw",
                                        jettonCollectionMintNew: false
                                    })}>Bolt
                                </li>
                                <li className={this.state.jettonCollectionMintNew ? 'active' : null}
                                    onClick={() => this.setState({
                                        jettonCollectionAddress: "",
                                        jettonCollectionMintNew: true
                                    })}>Mint random new
                                </li>
                            </ul>
                        </div>
                    </div> : null}


                    <div
                        className={`SmartContractCreationSettingsRow ${this.state.displayMode === 'simple' ? 'hidden' : ''}`}>
                        <div className={"SmartContractCreationSettingsRowTitle"}>
                            <h4>Buyer address for whom this deal <span>*</span></h4>
                        </div>

                        <div className={"SmartContractCreationSettingsRowInput"}>
                            <input name={'buyerAddress'} value={this.state.buyerAddress} onChange={this.onChange}
                                   placeholder={"Buyer address for whom this deal"} type={'text'}/>
                        </div>
                    </div>

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

                </div>

                <div className={"SmartContractCreationDisplay"}>
                    {this.displaySteps()}

                    <h3>Your data cell</h3>
                    {this.displayCell(dataCell)}

                    <a className={"button"}>Deploy smart contract</a>
                </div>
            </div>
        </div>
    }
}