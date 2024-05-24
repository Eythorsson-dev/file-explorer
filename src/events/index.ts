import { FolderCollapseEvent } from "./FolderCollapseEvent"
import { EditCancelEvent } from "./editCancelEvent"
import { EditEvent } from "./editEvent"
import { FolderExpandEvent } from "./folderExpandEvent"
import { KeydownEvent } from "./keydownEvent"

export type FileExplorerEventMap = {
    "keydown": KeydownEvent,
    "edit-cancel": EditCancelEvent,
    "edit": EditEvent,
    "folder-expanded": FolderExpandEvent,
    "folder-collapsed": FolderCollapseEvent
}