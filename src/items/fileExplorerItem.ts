import { IconElement, linkedList } from "@eythorsson-dev/common-utils";
import { getPreviousFileExplorerItem } from "../core/getPreviousFileExplorerItem";
import { getNextFileExplorerItem } from "../core/getNextFileExplorerItem";

interface EditableText {
    target: HTMLElement,

    get text(): string,
    set text(value: string),

    get edit(): boolean,
    set edit(value: boolean),

    cancel(): void
}

function editableText(text: string, edit: boolean): EditableText {
    const target = document.createElement("div");
    const input = document.createElement("input");
    input.type = "text";

    const response = {
        target,
        get text(): string { return text },
        set text(value: string) {
            text = value;
            input.value = value;
        },

        get edit(): boolean { return edit },
        set edit(value: boolean) {
            if (value) {
                input.value = text;
                target.replaceChildren(input);
            }
            else {
                response.text = input.value;
                target.replaceChildren(text);
            }
        },
        cancel(): void {
            response.edit = false;
        },
    }

    response.edit = edit;
    response.text = text;

    return response;
}




export interface FileExplorerItemData {
    get name(): string;
}

export interface FileExplorerItem<T> extends linkedList.Item<FileExplorerItem<T>, T> {
    get isFolder(): boolean;
}

export interface FileExplorerItemOptions<T> {
    get id(): string;
    get type(): string;
    get data(): T;
}

export abstract class FileExplorerItemElement<T extends FileExplorerItemData>
    extends linkedList.ItemElement<T, FileExplorerItemElement<T>>
    implements FileExplorerItem<T> {

    constructor(options: FileExplorerItemOptions<T>) {
        super(options.id, options.data);

        this.target.classList.add("file-explorer-item", options.type);

        this.target.addEventListener("keydown", (event) => this.#onKeydown(event));
    }

    get isFolder(): boolean { return false; }

    get name(): string { return this.nameElm?.text ?? "" }

    protected nameElm: EditableText | undefined
    protected abstract getIcon(): IconElement;

    update(data: T) {
        this.nameElm!.text = data.name;
    }

    render(data: T) {
        const container = document.createElement("div");

        const wrapper = document.createElement("div");
        wrapper.className = `container`;
        wrapper.tabIndex = 0

        const iconWrapper = document.createElement("div");
        iconWrapper.classList.add("icon");
        iconWrapper.append(this.getIcon());

        if (this.nameElm == undefined) this.nameElm = editableText(data.name, false);
        this.nameElm.text = data.name;
        this.nameElm.edit = false;

        wrapper.append(iconWrapper, this.nameElm.target);
        container.append(wrapper);

        return container;
    }

    focus(): void {
        if (this.target.firstElementChild)
            (this.target.firstElementChild as HTMLElement).focus();
    }

    #onKeydown(event: KeyboardEvent) {
        if (event.code == "ArrowDown") {
            event.stopPropagation();
            event.preventDefault();


            getNextFileExplorerItem(this)
                ?.focus();
            // linkedList
            //     .getNextItem<FileExplorerItemElement<any>>(this, undefined)
            //     ?.focus()
        }
        else if (event.code == "ArrowUp") {
            event.stopPropagation();
            event.preventDefault();

            getPreviousFileExplorerItem(this)?.focus();
        }
        else if (event.code == "ArrowLeft") {
            event.stopPropagation();
            event.preventDefault();

            (this.parentItem)?.focus();
        }
    }
}


export type CustomFileExplorerItem<Data extends FileExplorerItemData> = (
    typeof FileExplorerItemElement<Data> & (new (props: FileExplorerItemOptions<Data>) => FileExplorerItemElement<Data>));
function createFileExplorerItemInstance<
    T extends FileExplorerItem<Data>,
    Data
>(
    constructor: new (props: FileExplorerItemOptions<Data>) => T,
    props: FileExplorerItemOptions<Data>
): T {
    return new constructor(props);
}

export function initFileExplorerItem<
    Data extends FileExplorerItemData
>(
    constructor: new (props: FileExplorerItemOptions<Data>) => FileExplorerItemElement<Data>,
    props: FileExplorerItemOptions<Data>
): FileExplorerItemElement<Data> {
    return createFileExplorerItemInstance(constructor, props);
}
