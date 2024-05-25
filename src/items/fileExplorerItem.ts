import { IconElement, SaveData, linkedList, onceClickOutside } from "@eythorsson-dev/common-utils";
import { getPreviousFileExplorerItem } from "../core/getPreviousFileExplorerItem";
import { getNextFileExplorerItem } from "../core/getNextFileExplorerItem";
import { FileExplorer, ItemData } from "../fileExplorer";

interface EditableText {
    target: HTMLElement,

    get text(): string,
    set text(value: string),

    get isEditing(): boolean,

    edit(): void
    save(): void
    cancel(): void
}

function editableText(text: string, isEditing: boolean, onSave?: (text: string) => void, onCancelled?: () => void, onEdit?: () => void): EditableText {
    const target = document.createElement("div");
    const input = document.createElement("input");
    input.type = "text";
    input.className = "input"

    input.addEventListener("keydown", event => {
        if (event.key.length == 1
            && event.shiftKey == false
            && event.ctrlKey == false
            && event.altKey == false
            && event.metaKey == false
        ) event.stopPropagation()
    })

    function renderInput(edit: boolean) {
        if (edit) {
            input.value = text;
            target.replaceChildren(input);
        }
        else {
            target.replaceChildren(text);
        }
    }

    const response = {
        target,
        get text(): string { return text },
        set text(value: string) {
            text = value;
            renderInput(isEditing);
        },

        get isEditing(): boolean { return isEditing },

        edit(): void {
            if (isEditing) return;

            onEdit?.();
            renderInput(true);

            input.select()
            isEditing = true;
        },

        save() {
            if (isEditing == false) return;

            onSave?.(input.value);
            text = input.value;

            renderInput(false);
            isEditing = false;
        },

        cancel(): void {
            if (isEditing == false) return

            renderInput(false);
            isEditing = false;

            onCancelled?.();
        },
    }

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
    get isNew(): boolean
    get context(): FileExplorer
}

export abstract class FileExplorerItemElement<T extends FileExplorerItemData>
    extends linkedList.ItemElement<T, FileExplorerItemElement<T>>
    implements FileExplorerItem<T> {

    protected context: FileExplorer;
    #isNew: boolean = false;

    constructor(options: FileExplorerItemOptions<T>) {
        super(options.id, options.type);

        this.context = options.context;
        this.#isNew = options.isNew;

        this.init(options.data);
        this.target.classList.add("file-explorer-item", options.type);

        this.target
            .addEventListener("keydown", (event) => {
                event.stopPropagation();

                if (this.isEditing == false) this.#onKeydown(event);

                this.context.services.eventService.Emit("keydown", {
                    target: this,
                    key: event.key,
                    ctrl: event.ctrlKey,
                    shift: event.shiftKey,
                    alt: event.altKey,
                    meta: event.metaKey,
                })
            });

        this.target.addEventListener("click", (event) => {
            event.stopPropagation()

            this.context.services.eventService.Emit("click", {
                target: this,
                ctrl: event.ctrlKey,
                shift: event.shiftKey,
                alt: event.altKey,
                meta: event.metaKey,
            })
        });

        this.context.services.eventService.On("edit", event => {
            if (this.isEditing && event.target.id != this.id) {
                this.#nameElm.cancel();
            }
        })
    }

    get isFolder(): boolean { return false; }

    get name(): string { return this.#nameElm?.text ?? "" }


    protected abstract getIcon(): IconElement;

    #nameElm: EditableText = editableText("", false,
        (text) => {
            const details = this.getDetails();
            if (this.#isNew) {
                const nextDetails = this.nextItem?.getDetails();
                this.context.services.saveService.Save({
                    Data: {
                        items: <SaveData<ItemData<any>>[]>[
                            { Action: "insert", Data: { ...details, data: { ...details.data, name: text } } },
                            nextDetails && { Action: "update", Data: { ...nextDetails, previousId: this.id } }
                        ].filter(x => x)
                    },
                    UndoData: {
                        items: <SaveData<ItemData<any>>[]>[
                            { Action: "delete", Data: details },
                            nextDetails && { Action: "update", Data: nextDetails }
                        ].filter(x => x)
                    }
                })
            }
            else {
                this.context.services.saveService.Save({
                    Data: {
                        items: [
                            { Action: "update", Data: { ...details, data: { ...details.data, name: text } } },
                        ]
                    },
                    UndoData: {
                        items: [
                            { Action: "update", Data: details },
                        ]
                    }
                })
            }

            this.focus()
        },
        () => {
            if (this.#isNew)
                this.remove();
            else
                this.focus()
        },
        () => {
            this.context.services.eventService.Emit("edit", { target: this });

            onceClickOutside(this.#nameElm.target, () => this.cancelEdit())
        }
    );

    get isEditing(): boolean { return this.#nameElm!.isEditing }

    cancelEdit() { this.#nameElm.cancel(); }
    saveEdit() { this.#nameElm.save(); }
    edit() { this.#nameElm.edit(); }

    update(data: T) {
        this.#nameElm!.text = data.name;
    }

    render(data: T) {
        const container = document.createElement("div");

        const wrapper = document.createElement("div");
        wrapper.className = `container`;
        wrapper.tabIndex = 0

        const iconWrapper = document.createElement("div");
        iconWrapper.classList.add("icon");
        iconWrapper.append(this.getIcon());

        this.#nameElm.text = data.name;
        if (this.#isNew) this.#nameElm.edit();
        else this.#nameElm.cancel();

        wrapper.append(iconWrapper, this.#nameElm.target);
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
