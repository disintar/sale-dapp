import React, {Component} from 'react'
import '../styles/Transaction.css';


export default class Transaction extends Component {
    constructor(props) {
        super(props);

        this.state = {
            stateInit: props.stateInit,
            payload: props.payload,
            address: props.address,
            title: props.title,
            description: props.description
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.stateInit !== state.stateInit ||
            props.payload !== state.payload ||
            props.title !== state.title ||
            props.address !== state.address ||
            props.description !== state.description) {
            return {
                stateInit: props.stateInit,
                payload: props.payload,
                description: props.description,
                title: props.title,
                address: props.address
            };
        }
        return null;
    }

    sendTransaction = () => {

    }


    render() {

        return <div className="Transaction">
            <h3>{this.props.title}</h3>
            <p>{this.props.description}</p>
            <a onClick={this.sendTransaction}>Send transaction</a>
        </div>
    }
}