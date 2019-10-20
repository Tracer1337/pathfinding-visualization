import React from "react"
import SettingsHandler from "../utils/SettingsHandler.js"

export default class Settings extends React.Component{
    render(){
        return (
            <div className="settings">
                {
                    Object.keys(SettingsHandler.settings).map(key => {
                        const setting = SettingsHandler.settings[key]
                        switch(setting.type){
                            case "select":
                                return(
                                    <select key={key} onChange={e => SettingsHandler.set(key, e.target.value)}>
                                        {setting.options.map(option => (
                                            <option value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                )
                            case "action":
                                return <button key={key} onClick={() => SettingsHandler.invoke(key)}>{setting.label}</button>
                        }
                    })
                }
            </div>
        )
    }
}
