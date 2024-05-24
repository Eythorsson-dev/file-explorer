import "./style.css"

import { EventHandlerAPI, EventManager, SaveAPI, SaveManager, generateUId, linkedList } from "@eythorsson-dev/common-utils";
import { FolderElement } from "./items/folder";
import { CustomFileExplorerItem, FileExplorerItemElement, initFileExplorerItem } from "./items/fileExplorerItem";
import { FileElement } from "./items/file";
import { FileExplorerEventMap } from "./events";
import { ItemService } from "./services/itemService";
import { KeyboardShortcutPlugin } from "./plugins/keyboardShortcutPlugin";
import { CustomPlugin, initPlugin } from "./plugins/plugin";

export interface EventService extends EventHandlerAPI<FileExplorerEventMap> { };

export interface SaveService extends SaveAPI<ItemData<any>> { }


export interface ServiceContext {
    saveService: SaveService,
    eventService: EventService,

    itemService: ItemService
}


export interface ItemData<T> extends linkedList.ItemData<T> {
    get type(): string
}

interface FileExplorerOptions {
    target: HTMLElement,
    itemTypes?: { [key: string]: CustomFileExplorerItem<any> }
    plugins?: { [key: string]: { plugin: CustomPlugin<any>, config?: any } }
}

export class FileExplorer {
    #target: HTMLElement;
    #rootItem: FileExplorerItemElement<any> | undefined;

    #itemByType: { [key: string]: CustomFileExplorerItem<any> }

    #services: ServiceContext;
    get services(): ServiceContext { return this.#services }

    constructor(options: FileExplorerOptions) {
        this.#target = options.target;

        this.#itemByType = {
            "folder": FolderElement,
            "file": FileElement,
            ...options.itemTypes
        }

        this.#services = {
            eventService: new EventManager(),
            saveService: this.#createSaveAPI(),
            itemService: new ItemService({ context: this })
        }

        this.#initializePlugins({
            "keyboardShortcuts": { plugin: KeyboardShortcutPlugin, config: undefined },
            ...options.plugins
        });

    }
    
    #initializePlugins(plugins: { [key: string]: { plugin: CustomPlugin<any>, config?: any } }) {
        Object.values(plugins)
            .forEach(plugin => {
                initPlugin(plugin.plugin, {
                    context: this,
                    config: plugin.config
                });
            });
    }

    #createSaveAPI(): SaveService {
        return new SaveManager<ItemData<any>>({
            OnChanged: () => {

            },
            Insert: (data) => {
                this.upsert(data);
            },
            Update: (data) => {
                this.upsert(data);
            },
            Delete: (data) => {
                this.getItemById(data.id)
                    ?.remove();
            },
        })
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

    createItem<T>(type: string, id: string = generateUId(), data: T | undefined = undefined, isNew: boolean = false) {
        var itemConfig = this.#itemByType?.[type];
        if (itemConfig == undefined) {
            throw new Error("Item type missing. Please make sure the block ('" + <string>type + "') is registered correctly");
        }

        return initFileExplorerItem(
            itemConfig,
            {
                id: id,
                data: data,
                type: type,
                isNew: isNew,
                context: this
            }
        );
    }

    getItemById(id: string): FileExplorerItemElement<any> | undefined {
        return linkedList.getNextOrChildById(this.#rootItem!, id);
    }

    getItemsByParentId(id: string | undefined): FileExplorerItemElement<any>[] {
        if (id == undefined)
            return [this.#rootItem!, ...linkedList.getNextSiblings(this.#rootItem!)]

        const parent = this.getItemById(id);
        if (parent!.firstChildItem == undefined) return [];

        return [parent!.firstChildItem!, ...linkedList.getNextSiblings(parent!.firstChildItem!)];
    }

    upsert<T extends ItemData<any>>(data: T): void {
        this.#rootItem = linkedList.upsertAndReturnRoot(data, this.#rootItem, () => this.createItem(data.type, data.id, data.data))
    }
}