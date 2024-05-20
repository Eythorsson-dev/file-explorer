import { linkedList } from "@eythorsson-dev/common-utils";
import { FileExplorerItemElement } from "../items/fileExplorerItem";
import { FolderData } from "../items/folder";

export function getNextFileExplorerItem(item: FileExplorerItemElement<any>): FileExplorerItemElement<any> | undefined {
    if (item.isFolder && (item.data as FolderData).isCollapsed == false && item.firstChildItem) return item.firstChildItem;
    return linkedList.getNextItem(item, { ignoreChildren: true });
}