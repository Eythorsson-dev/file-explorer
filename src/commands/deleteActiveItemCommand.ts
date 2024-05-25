import { linkedList } from "@eythorsson-dev/common-utils";
import { FileExplorer } from "../fileExplorer";

export class DeleteActiveItemCommand extends linkedList.Command<FileExplorer> {

    get id(): string { return "delete-active-item-command" }

    get active(): boolean { return this.context.activeItem != undefined }

    execute(): void {
        const activeId = this.context.activeItem!.id;

        this.context.services.itemService.deleteById(activeId);
    }
}