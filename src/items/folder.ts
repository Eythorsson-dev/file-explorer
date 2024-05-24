import { IconElement, getIcon } from "@eythorsson-dev/common-utils";
import { FileExplorerItemData, FileExplorerItem, FileExplorerItemElement, FileExplorerItemOptions } from "./fileExplorerItem";



export interface FolderData extends FileExplorerItemData {
    get isCollapsed(): boolean;
}

export interface Folder extends FileExplorerItem<FolderData> {
}

export class FolderElement
    extends FileExplorerItemElement<FolderData>
    implements Folder {

    constructor(options: FileExplorerItemOptions<FolderData>) {
        super(options);

        this.#toggleCollapsed(options.data.isCollapsed, false);

        this.target.addEventListener("click", (event) => {
            this.isCollapsed = !this.isCollapsed;
            event.preventDefault();
            event.stopPropagation();
        });

        this.target.addEventListener("keydown", (event) => this.#onKeydown(event));
    }

    protected getIcon(): IconElement {
        return getIcon("arrow-chevron-down");
    }

    get data(): FolderData {
        return {
            isCollapsed: this.isCollapsed,
            name: this.name
        }
    }

    get isCollapsed(): boolean { return this.target.classList.contains("collapsed"); }
    set isCollapsed(value: boolean) { this.#toggleCollapsed(value, true); }
    #toggleCollapsed(value: boolean, emitEvent: boolean) {
        if (this.isCollapsed == value) return;

        if (value == true) {
            this.target.classList.add("collapsed");

            if (emitEvent)
                this.context.services.eventService.Emit("folder-collapsed", { target: this });
        }
        else {
            this.target.classList.remove("collapsed");

            if (emitEvent)
                this.context.services.eventService.Emit("folder-expanded", { target: this });
        }
    }

    override get isFolder(): boolean { return true; }

    update(data: FolderData): void {
        super.update(data)
        this.isCollapsed = data.isCollapsed;
    }


    #onKeydown(event: KeyboardEvent) {
        if (event.code == "ArrowLeft") {
            if (this.isCollapsed == false) {
                event.stopPropagation();
                event.preventDefault();

                this.isCollapsed = true;
            }
        }
        if (event.code == "ArrowRight") {
            event.stopPropagation();
            event.preventDefault();

            if (this.isCollapsed) {
                this.isCollapsed = false;
            }
            else {
                this.firstChildItem?.focus();
            }
        }
    }
}
