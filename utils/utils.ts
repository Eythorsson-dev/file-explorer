import { v4 as uuidv4 } from 'uuid';

/** @internal */
export function generateUId(): string {
    return uuidv4();
}