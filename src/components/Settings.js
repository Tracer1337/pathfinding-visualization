import React from "react"
import SettingsProvider from "../utils/SettingsProvider.js"

export default class Settings extends React.Component{
    render(){
        return (
            <div className="settings">
                {
                    Object.keys(SettingsProvider.settings).map(key => {
                        const setting = SettingsProvider.settings[key]
                        switch(setting.type){
                            case "select":
                                return(
                                    <select key={key} onChange={e => SettingsProvider.set(key, e.target.value)}>
                                        {setting.options.map(option => (
                                            <option value={option.value} key={option.label}>{option.label}</option>
                                        ))}
                                    </select>
                                )
                            case "action":
                                return <button key={key} onClick={() => SettingsProvider.invoke(key)}>{setting.label}</button>
                        }
                    })
                }
            </div>
        )
    }
}
