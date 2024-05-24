import { IconElement, getIcon } from "@eythorsson-dev/common-utils";
import { FileExplorerItemData, FileExplorerItem, FileExplorerItemElement, FileExplorerItemOptions } from "./fileExplorerItem";



export interface FileData extends FileExplorerItemData {
}

export interface File extends FileExplorerItem<FileData> {
}

export class FileElement
    extends FileExplorerItemElement<FileData>
    implements File {

    constructor(options: FileExplorerItemOptions<FileData>) {
        super(options);
    }

    protected getIcon(): IconElement {
        return getIcon("file-document");
    }

    get data(): FileData {
        return {
            name: this.name
        }
    }
}
