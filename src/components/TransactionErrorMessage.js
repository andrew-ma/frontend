import React from "react";

export function TransactionErrorMessage(props) {
    return (
        <div className="alert alert-danger" role="alert">
            Error sending transaction: {props.message.substring(0, 100)}
            <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={props.dismiss}>
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    );
}
