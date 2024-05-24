import { FileExplorer, ServiceContext } from "../fileExplorer";

export interface ServiceProps {
    context: FileExplorer;
}


export abstract class Service {
    #context: FileExplorer
    protected get context(): FileExplorer { return this.#context }
    protected get services(): ServiceContext { return this.#context.services }

    constructor(props: ServiceProps) {
        this.#context = props.context;
    }
}
