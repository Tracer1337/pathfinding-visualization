import React from "react"
import {FormControl, InputLabel, Select, MenuItem, Button, TextField} from "@material-ui/core"

import SettingsProvider from "../utils/SettingsProvider.js"

export default class Settings extends React.Component{
    state = {}

    getDOMElement = key => {
        const setting = SettingsProvider.settings[key]

        switch(setting.type){
            case "select":
                return(
                    <>
                        <InputLabel>{SettingsProvider.settings[key].label}</InputLabel>
                        <Select
                            value={this.state[key]}
                            onChange={e => this.handleChange(e, key)}
                            className="input"
                        >
                            {setting.options.map(option => (
                                <MenuItem value={option.value} key={option.label}>{option.label}</MenuItem>
                            ))}
                        </Select>
                    </>
                )

            case "action":
                return (
                    <Button
                        className="input"
                        variant={setting.variant}
                        color={setting.color}
                        onClick={() => SettingsProvider.invoke(key)}
                    >{setting.label}</Button>
                )

            case "number":
                return (
                    <TextField
                        type="number"
                        label={setting.label}
                        value={this.state[key]}
                        onChange={e => this.handleChange(e, key)}
                    />
                )

            default:
                throw new Error("Unsupported setting type: "+setting.type)
        }
    }

    handleChange = (e, key) => {
        SettingsProvider.set(key, e.target.value)
        this.setState({[key]: e.target.value})
    }

    componentDidMount(){
        let newState = {}
        Object.entries(SettingsProvider.settings).forEach(([key, setting]) => {
            if(setting.type === "select" || setting.type === "number"){
                newState[key] = setting.value
            }
        })
        this.setState(newState)
    }

    render(){
        return (
            <div className="settings">
                {Object.keys(this.state).length && Object.keys(SettingsProvider.settings).map(key => (
                    <div className="input-wrapper" key={key}>
                        <FormControl className="input">
                            {this.getDOMElement(key)}
                        </FormControl>
                    </div>
                ))}
            </div>
        )
    }
}
