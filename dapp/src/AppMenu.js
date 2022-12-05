import React, {Component} from 'react'
import './styles/AppMenu.css';
import SmartContractCreation from "./screens/SmartContractCreation";
import SmartContractExplore from "./screens/SmartContractExplore";

export default class AppMenu extends Component {
    constructor(props) {
        super(props);
        const params = (new URL(window.location)).searchParams;

        if (!params.get('stage')) {
            this.updateLocation('stage', 'choose');
        }

        this.state = {
            stage: params.get('stage') ? params.get('stage') : 'choose',
            address: params.get('address') ? params.get('address') : ''
        }
    }

    updateLocation = (key, new_value) => {
        const params = new URLSearchParams(window.location.search);
        const all_keys = Array.from(params.keys());

        if (!params.get(key)) {
            all_keys.push(key)
        }

        const final_string = all_keys.reduce((accumulator, currentValue) => {
                let item;
                if (currentValue === key) {
                    item = `${key}=${new_value}`
                } else {
                    item = `${currentValue}=${params.get(currentValue)}`
                }

                if (accumulator === '?') {
                    return `${accumulator}${item}`
                } else {
                    return `${accumulator}&${item}`
                }
            }
            , '?');

        window.location = `${window.location.origin}${window.location.pathname}${final_string}`
    }


    render() {
        if (this.state.stage === 'choose') {
            return <div className="AppMenu">
                <div className="AppMenuCards">
                    <div onClick={() => this.updateLocation('stage', 'create')} className="AppMenuCard">
                        <p className="AppMenuCardIcon">🛠</p>
                        <p className="AppMenuCardTitle">Publish new smart contract</p>
                    </div>
                    <div onClick={() => this.updateLocation('stage', 'existing')} className="AppMenuCard">
                        <p className="AppMenuCardIcon">🔍</p>
                        <p className="AppMenuCardTitle">Use existing smart contract</p>
                    </div>
                </div>
            </div>
        } else if (this.state.stage === 'create') {
            return <div className="AppMenu">
                <div className={"AppMenuBackButton"}>
                    <a onClick={() => this.updateLocation('stage', 'choose')}>Back</a>
                </div>

                <SmartContractCreation/>
            </div>
        } else if (this.state.stage === 'existing') {
            return <div className="AppMenu">
                <div className={"AppMenuBackButton"}>
                    <a onClick={() => this.updateLocation('stage', 'choose')}>Back</a>
                </div>

                <SmartContractExplore code={this.props.code} address={this.state.address}/>
            </div>
        }

    }
}