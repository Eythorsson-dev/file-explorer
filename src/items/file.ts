import { IconElement, getIcon } from "@eythorsson-dev/common-utils";
import { FileExplorerItemData, FileExplorerItem, FileExplorerItemElement, FileExplorerItemOptions } from "./fileExplorerItem";



export interface FileData extends FileExplorerItemData {
    get isCollapsed(): boolean;
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
        throw new Error("Method not implemented.");
    }

    update(data: FileData): void {
        // const wrapper = this.render(data);
        // if (this.wrapper && this.target.contains(this.wrapper)) {
        //     this.wrapper.replaceWith(wrapper);
        // }
        // else {
        //     this.target.prepend(wrapper)
        // }
    }
}
