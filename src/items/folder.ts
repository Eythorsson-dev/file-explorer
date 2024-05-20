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

        this.isCollapsed = options.data.isCollapsed;

        this.target.addEventListener("click", (event) => {
            this.isCollapsed = !this.isCollapsed;
            event.preventDefault();
            event.stopPropagation();
        });

        (this.target.firstElementChild as HTMLElement | null)
            ?.addEventListener("keydown", (event) => this.#onKeydown(event));
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

    get isCollapsed(): boolean {
        return this.target.classList.contains("collapsed");
    }
    set isCollapsed(value: boolean) {
        if (value == true) this.target.classList.add("collapsed");
        else this.target.classList.remove("collapsed");
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
