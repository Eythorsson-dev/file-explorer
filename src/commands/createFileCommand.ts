import { linkedList } from "@eythorsson-dev/common-utils";
import { FileExplorer } from "../fileExplorer";
import { FileData } from "../items/file";

export class CreateFileCommand extends linkedList.Command<FileExplorer> {

    get id(): string { return "create-file-command" }

    get active(): boolean { return this.context.activeItem != undefined }

    execute(): void {

        const parentId = this.context.activeItem!.parentItem?.id;

        this.context.services.itemService.createNew<FileData>(
            parentId,
            "file",
            { name: "123" }
        )
    }
}