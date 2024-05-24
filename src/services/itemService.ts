import { generateUId } from "@eythorsson-dev/common-utils";
import { FileExplorerItemData } from "../items/fileExplorerItem";
import { Service } from "./service";


export class ItemService extends Service {


    createNew<T extends FileExplorerItemData>(parentId: string, type: string, data: T): void {

        const itemId = generateUId()
        const item = this.context.createItem(type, itemId, data);
        item.edit = true;

        const siblings = this.context.getItemsByParentId(parentId)
        const next = siblings.find(x => x.isFolder == item.isFolder) ?? siblings[0]

        next.before(item);

        this.services.eventService.Once("edit-cancel", () => item.remove(), event => event.target.id == item.id)


        // const previous = this.context.getItemById(itemId)!;

        // const saveData: SaveOptions<ItemData<FileExplorerItemData>> = {}

        // this.services.saveService.Save({
        //     Data: { items: [
        //         { Action: }
        //     ] },
        //     UndoData: { items: [] }
        // });
    }
}