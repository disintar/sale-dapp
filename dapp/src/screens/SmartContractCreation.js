import React, {Component} from 'react'
import '../styles/SmartContractCreation.css';


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

            marketplaceFeeNumerator: null,
            marketplaceFeeDenominator: null,

            royaltyFeeNumerator: null,
            royaltyFeeDenominator: null,

            royaltyAddress: null,
            isTon: null,
            price: null,
            limitAddress: null,
            limitedTime: null,
            jettonAddress: null
        }

        this.provider = {};
    }

    componentDidMount() {
        setTimeout(() => {
            this.provider = window.ton

            if (this.provider.isTonWallet) {
                this.provider.send('ton_requestAccounts').then(x => {
                    this.setState({
                        ownerAddress: x[0]
                    })
                })

            }
            this.forceUpdate()
        }, 1000)
    }

    onChange = (item) => {
        this.setState({[item.target.name]: item.target.value})
    }

    render() {
        return <div>
            <div className={"TonExtensionStatus"}>
                {this.provider.isTonWallet ?
                    <>
                        <span className={"greenDot"}/>
                        <p>TON Extension initialized</p>
                    </> :
                    <>
                        <span className={"yellowDot"}/>
                        <p>TON Extension was not founded</p>
                    </>}
            </div>

            <div className="SmartContractCreation">
                <div className={"SmartContractCreationSettings"}>
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

                    <div className={`SmartContractCreationSettingsRow ${this.state.displayMode === 'simple' ? 'hidden' : ''}`}>
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


                    <div className={`SmartContractCreationSettingsRow ${this.state.displayMode === 'simple' ? 'hidden' : ''}`}>
                        <div className={"SmartContractCreationSettingsRowTitle"}>
                            <h4>Address of NFT buyer who bought NFT <span>*</span></h4>
                        </div>

                        <div className={"SmartContractCreationSettingsRowInput"}>
                            <input name={'buyerAddress'} value={this.state.buyerAddress} onChange={this.onChange}
                                   placeholder={"NFT buyer address goes here"} type={'text'}/>
                        </div>
                    </div>


                </div>

                <div className={"SmartContractCreationDisplay"}>
                    <h3>Your data cell</h3>

                </div>
            </div>
        </div>
    }
}