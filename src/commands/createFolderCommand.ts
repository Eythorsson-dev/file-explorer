import { linkedList } from "@eythorsson-dev/common-utils";
import { FileExplorer } from "../fileExplorer";
import { FileData } from "../items/file";

export class CreateFolderCommand extends linkedList.Command<FileExplorer> {

    get id(): string { return "create-folder-command" } 
    
    get active(): boolean { return true; }
    
    execute(): void {

        const parentId = this.context.activeItem!.parentItem?.id;

        this.context.services.itemService.createNew<FileData>(
            parentId,
            "folder",
            { name: "123" }
        );
    }
}
