import { linkedList } from "@eythorsson-dev/common-utils";
import { generateUId } from "../utils/utils";
import { FolderElement } from "./items/folder";
import { CustomFileExplorerItem, FileExplorerItemElement, initFileExplorerItem, FileExplorerItem } from "./items/fileExplorerItem";

import "./style.css"
import { FileElement } from "./items/file";

interface ItemData<T> extends linkedList.ItemData<T> {
    get type(): string
}

interface FileExplorerOptions {
    target: HTMLElement,
    itemTypes?: { [key: string]: CustomFileExplorerItem<any> }
}

export class FileExplorer {
    #target: HTMLElement;
    #rootItem: FileExplorerItemElement<any> | undefined;

    #itemByType: { [key: string]: CustomFileExplorerItem<any> }

    constructor(options: FileExplorerOptions) {
        this.#target = options.target;

        this.#itemByType = {
            "folder": FolderElement,
            "file": FileElement,
            ...options.itemTypes
        }
    }

    get value(): ItemData<any>[] {
        return linkedList.getChildAndNextSiblingData(this.#rootItem!);
    }

    set value(items: ItemData<any>[]) {
        linkedList.validateList(items);

        const sortedList = linkedList.sortList(items);
        if (sortedList.length != items.length)
            throw new Error("Cannot set value, invalid linked list");

        const oldRoot = this.#rootItem;
        items.forEach((item, index) => {
            this.upsert(item);

            if (index == 0) {
                this.#target.replaceChildren(this.#rootItem!.target);
                oldRoot?.remove();
            }
        })
    }

    createItem<T>(type: string, id: string = generateUId(), data: T | undefined = undefined) {
        var itemConfig = this.#itemByType?.[type];
        if (itemConfig == undefined) {
            throw new Error("Item type missing. Please make sure the block ('" + <string>type + "') is registered correctly");
        }

        return initFileExplorerItem(
            itemConfig,
            {
                id: id,
                data: data,
                type: type
            }
        );
    }

    getItemById(id: string): FileExplorerItem<any> | undefined {
        return linkedList.getNextOrChildById(this.#rootItem!, id);
    }

    upsert<T extends ItemData<any>>(data: T): void {
        this.#rootItem = linkedList.upsertAndReturnRoot(data, this.#rootItem, () => this.createItem(data.type, data.id, data.data))
    }
}