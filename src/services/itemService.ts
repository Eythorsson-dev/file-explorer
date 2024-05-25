import { SaveData, generateUId } from "@eythorsson-dev/common-utils";
import { FileExplorerItemData } from "../items/fileExplorerItem";
import { Service } from "./service";
import { ItemData } from "../fileExplorer";


export class ItemService extends Service {
    createNew<T extends FileExplorerItemData>(parentId: string | undefined, type: string, data: T): void {

        // TODO: ENSURE THAT ALL PARENTS ARE EXPANDED

        const itemId = generateUId()
        const item = this.context.createItem(type, itemId, data, true);

        const parent = parentId && this.context.getItemById(parentId);
        const siblings = this.context.getItemsByParentId(parentId);

        if (siblings.length == 0 && parent)
            parent.append(item)
        else if (item.isFolder) {
            const next = siblings.find(x => x.isFolder == item.isFolder)
                ?? siblings[0];

            next.before(item);
        }
        else {
            const previous = siblings.find(x => x.isFolder == item.isFolder)
                ?? siblings[siblings.length - 1];

            previous.after(item);
        }

        item.focus();
    }

    deleteById(id: string): void {
        const item = this.context.getItemById(id)!;

        const details = item.getDetails();
        const nextDetails = item.nextItem?.getDetails();

        this.context.services.saveService.Save({
            Data: {
                items: <SaveData<ItemData<any>>[]>[
                    { Action: "delete", Data: { ...details, data: details.data } },
                    nextDetails && { Action: "update", Data: { ...nextDetails, previousId: details.previousId } }
                ].filter(x => x)
            },
            UndoData: {
                items: <SaveData<ItemData<any>>[]>[
                    { Action: "insert", Data: details },
                    nextDetails && { Action: "update", Data: nextDetails }
                ].filter(x => x)
            }
        })
    }
}