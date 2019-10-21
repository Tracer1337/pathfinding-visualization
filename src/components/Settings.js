import React from "react"
import SettingsProvider from "../utils/SettingsProvider.js"

export default class Settings extends React.Component{
    state = {}

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
                {
                    Object.keys(SettingsProvider.settings).map(key => {
                        const setting = SettingsProvider.settings[key]
                        switch(setting.type){
                            case "select":
                                return(
                                    <select
                                        key={key}
                                        value={this.state[key]}
                                        onChange={e => this.handleChange(e, key)}
                                    >
                                        {setting.options.map(option => (
                                            <option value={option.value} key={option.label}>{option.label}</option>
                                        ))}
                                    </select>
                                )
                            case "action":
                                return <button key={key} onClick={() => SettingsProvider.invoke(key)}>{setting.label}</button>
                            case "number":
                                return (
                                        <span className="number" key={key}>
                                            <label>{setting.label}</label>
                                            <input
                                                type="number"
                                                value={this.state[key]}
                                                onChange={e => this.handleChange(e, key)}
                                            />
                                        </span>)
                            default:
                                throw new Error("Unsupported setting type: "+setting.type)
                        }
                    })
                }
            </div>
        )
    }
}
