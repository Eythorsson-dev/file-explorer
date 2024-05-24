import { BaseEvent } from "@eythorsson-dev/common-utils";
import { FileExplorerItemElement } from "../items/fileExplorerItem";


export interface ClickEvent extends BaseEvent {
    target: FileExplorerItemElement<any>;

    meta: boolean;
    ctrl: boolean;
    shift: boolean;
    alt: boolean
}
