/**
 * @vitest-environment jsdom
 */

import { describe, expect, test } from "vitest";
import { FileExplorer } from "../../fileExplorer";
import { FolderData } from "../../items/folder";
import { getNextFileExplorerItem } from "../getNextFileExplorerItem";
import { FileExplorerItemElement } from "../../items/fileExplorerItem";
import { FileData } from "../../items/file";


describe("Next is sibling of nested child parent", () => {

    test("Folder without child (2 -> 3)", () => {
        // 0
        //  1
        //   2
        // 3

        const target = document.createElement("div");
        const fileExplorer = new FileExplorer({ target });

        fileExplorer.value = [
            { id: "item0", parentId: undefined, previousId: undefined, type: "folder", data: <FolderData>{ name: "folder0" } },
            { id: "item1", parentId: "item0", previousId: undefined, type: "file", data: <FileData>{ name: "folder1" } },
            { id: "item2", parentId: "item1", previousId: undefined, type: "folder", data: <FolderData>{ name: "folder2" } },
            { id: "item3", parentId: undefined, previousId: "item0", type: "folder", data: <FolderData>{ name: "folder3" } },
        ]

        const item = fileExplorer.getItemById("item2")! as FileExplorerItemElement<any>;
        const next = getNextFileExplorerItem(item)!;
        expect(next.id).toBe("item3")
    })

    test("File (2 -> 3)", () => {
        // 0
        //  1
        //   2
        // 3

        const target = document.createElement("div");
        const fileExplorer = new FileExplorer({ target });

        fileExplorer.value = [
            { id: "item0", parentId: undefined, previousId: undefined, type: "folder", data: <FolderData>{ name: "folder0" } },
            { id: "item1", parentId: "item0", previousId: undefined, type: "file", data: <FileData>{ name: "folder1" } },
            { id: "item2", parentId: "item1", previousId: undefined, type: "folder", data: <FolderData>{ name: "folder2" } },
            { id: "item3", parentId: undefined, previousId: "item0", type: "file", data: <FileData>{ name: "folder3" } },
        ]

        const item = fileExplorer.getItemById("item2")! as FileExplorerItemElement<any>;
        const next = getNextFileExplorerItem(item)!;
        expect(next.id).toBe("item3")
    })

    test("Is collapsed folder (1 -> 3)", () => {
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
            { id: "item3", parentId: undefined, previousId: "item0", type: "file", data: <FileData>{ name: "folder3" } },
        ]

        const item = fileExplorer.getItemById("item1")! as FileExplorerItemElement<any>;
        const next = getNextFileExplorerItem(item)!;
        expect(next.id).toBe("item3")
    })
})



test("Next is first child (0 -> 1)", () => {
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
        { id: "item3", parentId: undefined, previousId: "item0", type: "file", data: <FileData>{ name: "folder3" } },
    ]

    const item = fileExplorer.getItemById("item0")! as FileExplorerItemElement<any>;
    const next = getNextFileExplorerItem(item)!;
    expect(next.id).toBe("item1")
})

test("Next is sibling (1 -> 2)", () => {
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

    const item = fileExplorer.getItemById("item0")! as FileExplorerItemElement<any>;
    const next = getNextFileExplorerItem(item)!;
    expect(next.id).toBe("item1")
})