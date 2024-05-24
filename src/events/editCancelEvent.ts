import { BaseEvent } from "@eythorsson-dev/common-utils";
import { FileExplorerItemElement } from "../items/fileExplorerItem";



export interface EditCancelEvent extends BaseEvent {
    target: FileExplorerItemElement<any>;
}
