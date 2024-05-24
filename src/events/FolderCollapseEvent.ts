import { BaseEvent } from "@eythorsson-dev/common-utils";
import { Folder } from "../items/folder";


export interface FolderCollapseEvent extends BaseEvent {
    target: Folder;
}
