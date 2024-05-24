import { BaseEvent } from "@eythorsson-dev/common-utils";
import { Folder } from "../items/folder";

export interface FolderExpandEvent extends BaseEvent {
    target: Folder
}