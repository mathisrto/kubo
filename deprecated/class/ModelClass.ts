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
    // map fieldName -> set of listeners for that field; use '*' for any-field listeners
    private _listeners: Map<string, Set<(field: string) => void>> = new Map();
    private _parent: ModelClass | null = null;

    constructor() {}

    get dirtyFields(): Set<string> {
        return this._dirtyFields;
    }

    countDirtyFields(): number {
        return this._dirtyFields.size;
    }

    markFieldDirty(fieldName: string): void {
        this._dirtyFields.add(fieldName);
        this.emitFieldChanged(fieldName);
        // Propager le changement au parent
        if (this._parent) {
            this._parent.markFieldDirty(fieldName);
        }
    }

    /**
     * Définit l'objet parent pour la propagation des changements
     */
    setParent(parent: ModelClass | null): void {
        this._parent = parent;
    }

    /**
     * Configure un objet enfant pour qu'il notifie ce parent lors de ses changements
     */
    protected registerChild(child: ModelClass): void {
        child.setParent(this);
    }

    /**
     * Configure plusieurs objets enfants
     */
    protected registerChildren(children: ModelClass[]): void {
        children.forEach((child) => this.registerChild(child));
    }

    abstract updateFromState(state: unknown): void;

    clearDirtyFields(): void {
        this._dirtyFields.clear();
        // Ne pas émettre d'événement pour éviter une boucle infinie avec scheduleAutoSave
    }

    /**
     * Subscribe to any field change. Callback receives the field name that changed.
     * Returns an unsubscribe function.
     */
    onFieldChanged(cb: (field: string) => void): () => void {
        return this.onFieldChange("*", cb);
    }

    /**
     * Subscribe to changes for a specific field. Use '*' to subscribe to all fields.
     * Returns an unsubscribe function.
     */
    onFieldChange(fieldName: string, cb: (field: string) => void): () => void {
        const key = fieldName || "*";
        if (!this._listeners.has(key)) this._listeners.set(key, new Set());
        const set = this._listeners.get(key)!;
        set.add(cb);
        return () => set.delete(cb);
    }

    protected emitFieldChanged(field: string) {
        // listeners for the specific field
        const specific = this._listeners.get(field);
        if (specific) {
            for (const cb of Array.from(specific)) cb(field);
        }
        // wildcard listeners
        const any = this._listeners.get("*");
        if (any) {
            for (const cb of Array.from(any)) cb(field);
        }
    }

    abstract serialize(): unknown;
    abstract save(): Promise<void>;
}
