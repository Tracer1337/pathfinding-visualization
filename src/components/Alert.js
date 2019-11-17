import React from "react"

import Snackbar from "@material-ui/core/Snackbar"
import SnackbarContent from "@material-ui/core/SnackbarContent"
import IconButton from "@material-ui/core/IconButton"

import CloseIcon from "../assets/icons/close-24px.svg"
import ErrorIcon from "../assets/icons/error_outline-24px.svg"

export default class Alert extends React.Component{
    static defaultState = {
        open: false,
        variant: "",
        message: ""
    }

    state = Alert.defaultState

    error = message => {
        this.setState({
            open: true,
            variant: "error",
            message
        })
    }

    handleClose = () => {
        this.setState(Alert.defaultState)
    }

    render(){
        return(
            <Snackbar
                open={this.state.open}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                onClose={this.handleClose}
                autoHideDuration={3000}
            >
                <SnackbarContent
                    className={"alert "+this.state.variant}
                    message={
                        <span className="message">
                            <img className="icon" src={ErrorIcon} alt="Error"/>
                            {this.state.message}
                        </span>
                    }
                    action={
                        <IconButton onClick={this.handleClose}>
                            <img className="close" src={CloseIcon} alt="Close"/>
                        </IconButton>
                    }
                    onClose={this.handleClose}
                />
            </Snackbar>
        )
    }
}
