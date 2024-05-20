/**
 * @vitest-environment jsdom
 */

import { describe, expect, test } from "vitest";
import { FileExplorer } from "../../fileExplorer";
import { FolderData } from "../../items/folder";
import { getPreviousFileExplorerItem } from "../getPreviousFileExplorerItem";
import { FileExplorerItemElement } from "../../items/fileExplorerItem";
import { FileData } from "../../items/file";


describe("Previous is sibling of nested child parent", () => {

    test("Folder without child (3 -> 2)", () => {
        // 0
        //  1
        //   2
        // 3

        const target = document.createElement("div");
        const fileExplorer = new FileExplorer({ target });

        fileExplorer.value = [
            { id: "item0", parentId: undefined, previousId: undefined, type: "folder", data: <FolderData>{ name: "folder0" } },
            { id: "item1", parentId: "item0", previousId: undefined, type: "folder", data: <FolderData>{ name: "folder1" } },
            { id: "item2", parentId: "item1", previousId: undefined, type: "folder", data: <FolderData>{ name: "folder2" } },
            { id: "item3", parentId: undefined, previousId: "item0", type: "folder", data: <FolderData>{ name: "folder3" } },
        ]

        const item = fileExplorer.getItemById("item3")! as FileExplorerItemElement<any>;
        const next = getPreviousFileExplorerItem(item)!;
        expect(next.id).toBe("item2")
    })

    test("File (2 -> 1)", () => {
        // 0
        //  1
        //   2
        // 3

        const target = document.createElement("div");
        const fileExplorer = new FileExplorer({ target });

        fileExplorer.value = [
            { id: "item0", parentId: undefined, previousId: undefined, type: "folder", data: <FolderData>{ name: "folder0" } },
            { id: "item1", parentId: "item0", previousId: undefined, type: "file", data: <FileData>{ name: "file1" } },
            { id: "item2", parentId: "item1", previousId: undefined, type: "folder", data: <FolderData>{ name: "folder2" } },
            { id: "item3", parentId: undefined, previousId: "item0", type: "file", data: <FileData>{ name: "file3" } },
        ]

        const item = fileExplorer.getItemById("item2")! as FileExplorerItemElement<any>;
        const next = getPreviousFileExplorerItem(item)!;
        expect(next.id).toBe("item1")
    })

    test("Is collapsed folder (3 -> 1)", () => {
        // 0
        //  1 (Collapsed)
        //   2 
        // 3

        const target = document.createElement("div");
        const fileExplorer = new FileExplorer({ target });

        fileExplorer.value = [
            { id: "item0", parentId: undefined, previousId: undefined, type: "folder", data: <FolderData>{ name: "folder0" } },
            { id: "item1", parentId: "item0", previousId: undefined, type: "folder", data: <FolderData>{ name: "folder1", isCollapsed: true } },
            { id: "item2", parentId: "item1", previousId: undefined, type: "folder", data: <FolderData>{ name: "folder2" } },
            { id: "item3", parentId: undefined, previousId: "item0", type: "file", data: <FileData>{ name: "file3" } },
        ]

        const item = fileExplorer.getItemById("item3")! as FileExplorerItemElement<any>;
        const next = getPreviousFileExplorerItem(item)!;
        expect(next.id).toBe("item1")
    })
})



test("Previous is parent (1 -> 0)", () => {
    // 0
    //  1
    //   2 
    // 3

    const target = document.createElement("div");
    const fileExplorer = new FileExplorer({ target });

    fileExplorer.value = [
        { id: "item0", parentId: undefined, previousId: undefined, type: "folder", data: <FolderData>{ name: "folder0" } },
        { id: "item1", parentId: "item0", previousId: undefined, type: "folder", data: <FolderData>{ name: "folder1" } },
        { id: "item2", parentId: "item1", previousId: undefined, type: "folder", data: <FolderData>{ name: "folder2" } },
        { id: "item3", parentId: undefined, previousId: "item0", type: "file", data: <FileData>{ name: "file3" } },
    ]

    const item = fileExplorer.getItemById("item1")! as FileExplorerItemElement<any>;
    const next = getPreviousFileExplorerItem(item)!;
    expect(next.id).toBe("item0")
})

test("Previous is sibling (2 -> 1)", () => {
    // 0
    //  1
    //  2 
    // 3

    const target = document.createElement("div");
    const fileExplorer = new FileExplorer({ target });

    fileExplorer.value = [
        { id: "item0", parentId: undefined, previousId: undefined, type: "folder", data: <FolderData>{ name: "folder0" } },
        { id: "item1", parentId: "item0", previousId: undefined, type: "file", data: <FileData>{ name: "file1" } },
        { id: "item2", parentId: "item0", previousId: "item1", type: "file", data: <FileData>{ name: "file2" } },
        { id: "item3", parentId: undefined, previousId: "item0", type: "file", data: <FileData>{ name: "file3" } },
    ]

    const item = fileExplorer.getItemById("item2")! as FileExplorerItemElement<any>;
    const next = getPreviousFileExplorerItem(item)!;
    expect(next.id).toBe("item1")
})