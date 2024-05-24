import { Plugin, PluginProps } from "./plugin";


export class KeyboardShortcutPlugin extends Plugin {
    constructor(props: PluginProps) {
        super(props);

        props.context.services.eventService.On("keydown", event => {
            if (event.key == "Enter") {
                if (event.target.isEditing == false)
                    event.target.edit();
                else 
                    event.target.saveEdit();
            }

            else if (event.target.isEditing && event.key == "Escape")
                event.target.cancelEdit()
        })
    }
}