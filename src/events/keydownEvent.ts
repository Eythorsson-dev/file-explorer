import { BaseEvent } from "@eythorsson-dev/common-utils";
import { FileExplorerItemElement } from "../items/fileExplorerItem";

export interface KeydownEvent extends BaseEvent {
    target: FileExplorerItemElement<any>,

    key: string;
    meta: boolean;
    ctrl: boolean;
    shift: boolean;
    alt: boolean
}


