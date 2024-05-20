import { FileExplorerItemElement } from "../items/fileExplorerItem";
import { FolderData } from "../items/folder";

function isOpenFolder(item: FileExplorerItemElement<any>) {
    return item.isFolder && (item.data as FolderData).isCollapsed == false;
}

function nextOrFolderChild(item: FileExplorerItemElement<any>) {
    if (item.nextItem) return nextOrFolderChild(item.nextItem);
    if (isOpenFolder(item) && item.firstChildItem) return item.firstChildItem;
    return item
}

export function getPreviousFileExplorerItem(item: FileExplorerItemElement<any>): FileExplorerItemElement<any> | undefined {
    if (item.previousItem) {
        if (isOpenFolder(item.previousItem) && item.previousItem.firstChildItem)
            return nextOrFolderChild(item.previousItem.firstChildItem)
        else
            return item.previousItem;
    }
    return item.parentItem
}