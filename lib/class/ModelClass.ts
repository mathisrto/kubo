/**
 * Abstract base class for models, providing serialization and persistence methods.
 *
 * @remarks
 * Classes extending `ModelClass` must implement the `serialize` and `save` methods.
 *
 * @method serialize Serializes the model instance into a format suitable for storage or transmission.
 * @returns An unknown type representing the serialized data.
 *
 * @method save Persists the model instance asynchronously.
 * @returns A promise that resolves when the save operation is complete.
 */
export abstract class ModelClass {
    private _dirtyFields: Set<string> = new Set();

    constructor() {}

    get dirtyFields(): Set<string> {
        return this._dirtyFields;
    }

    countDirtyFields(): number {
        return this._dirtyFields.size;
    }

    markFieldDirty(fieldName: string): void {
        this._dirtyFields.add(fieldName);
    }

    clearDirtyFields(): void {
        this._dirtyFields.clear();
    }

    abstract serialize(): unknown;
    abstract save(): Promise<void>;
}
