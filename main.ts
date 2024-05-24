import { FileExplorer } from "./src/fileExplorer";
import { FolderData } from "./src/items/folder";

const target = document.getElementById("app")!;

const fileExplorer = new FileExplorer({ target });


fileExplorer.value = [
    { id: "item0", parentId: undefined, previousId: undefined, type: "folder", data: <FolderData>{ name: "node_modules" } },
    { id: "item01", parentId: "item0", previousId: undefined, type: "file", data: <FolderData>{ name: "node_modules" } },
    { id: "item02", parentId: "item0", previousId: "item01", type: "folder", data: <FolderData>{ name: "node_modules" } },
    { id: "item03", parentId: "item02", previousId: undefined, type: "file", data: <FolderData>{ name: "node_modules" } },
    { id: "item1", parentId: undefined, previousId: "item0", type: "folder", data: <FolderData>{ name: "src", isCollapsed: true } },
]

// fileExplorer.services.itemService.createNew("item02", "folder", { name: "" })

