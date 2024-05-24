import { FileExplorer } from "../fileExplorer";

export interface PluginProps<
    TConfig extends object | undefined = undefined,
> {
    config: TConfig | undefined;
    context: FileExplorer
}

export abstract class Plugin<
    TConfig extends object | undefined = undefined,
> {
    #config: TConfig | undefined;
    protected get config() { return this.#config }

    #context: FileExplorer;
    protected get context() { return this.#context }

    constructor(props: PluginProps<TConfig>) {
        this.#config = props.config
        this.#context = props.context;
    }
}

export type CustomPlugin<
    Config extends object | undefined,
> = typeof Plugin<Config> & (new (props: PluginProps<Config>) => Plugin<Config>);

function createPluginInstance<
    T extends Plugin<Config>,
    Config extends object | undefined
>(
    constructor: new (props: PluginProps<Config>) => T,
    props: PluginProps<Config>
): T {
    return new constructor(props);
}

export function initPlugin<
    Config extends object | undefined
>(
    constructor: new (props: PluginProps<Config>) => Plugin<Config>,
    props: PluginProps<Config>,
): Plugin<Config> {
    return createPluginInstance(constructor, props);
}

