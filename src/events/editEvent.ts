import { BaseEvent } from "@eythorsson-dev/common-utils";
import { FileExplorerItemElement } from "../items/fileExplorerItem";


export interface EditEvent extends BaseEvent {
    target: FileExplorerItemElement<any>;
}
