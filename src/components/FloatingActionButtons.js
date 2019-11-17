import React from "react"
import {Fab} from "@material-ui/core"

import SettingsProvider from "../utils/SettingsProvider.js"

export default class FloatingActionButtons extends React.Component{
    render(){
        return(
            <>
                {Object.entries(SettingsProvider.settings)
                    .filter((entry) => entry[1].type === "action" && entry[1].fabAvailable && entry[1].icon)
                    .map((entry, index) => {
                        const [key, setting] = entry
                        const iconSource = require("../assets/icons/"+setting.icon)
                        return (
                            <Fab
                                size="medium"
                                className={"fab fab-index-"+index}
                                color={setting.color}
                                key={index}
                                onClick={() => SettingsProvider.invoke(key)}
                            >
                                <img src={iconSource}/>
                            </Fab>
                        )
                    })
                }
            </>
        )
    }
}
