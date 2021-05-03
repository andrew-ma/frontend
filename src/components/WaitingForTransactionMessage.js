import React from "react";

export function WaitingForTransactionMessage(props) {
    return (
        <div className="alert alert-info" role="alert">
            Waiting for transaction <strong>{this.props.txHash}</strong> to be mined
        </div>
    );
}
