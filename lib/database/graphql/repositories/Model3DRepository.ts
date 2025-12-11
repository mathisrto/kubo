import { Collection, ObjectId } from "mongodb";
import { Model3DType } from "../../../class/Model3D";
import { getDb } from "../../client";

export class Model3DRepository {
    private static instance: Model3DRepository;
    private collectionName = "models3d";

    private constructor() {}

    static getInstance(): Model3DRepository {
        if (!Model3DRepository.instance) {
            Model3DRepository.instance = new Model3DRepository();
        }
        return Model3DRepository.instance;
    }

    private async getCollection(): Promise<Collection | null> {
        const db = await getDb();
        if (!db) return null;
        return db.collection(this.collectionName);
    }

    /**
     * Create a new 3D model document
     */
    async create(data: Omit<Model3DType, "id">): Promise<string | null> {
        try {
            const collection = await this.getCollection();
            if (!collection) return null;

            const doc = {
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = await collection.insertOne(doc);
            console.log(`✅ Model3D created: ${result.insertedId}`);
            return result.insertedId.toString();
        } catch (error) {
            console.error("❌ Failed to create Model3D:", error);
            return null;
        }
    }

    /**
     * Find a model by ID
     */
    async findById(id: string): Promise<Model3DType | null> {
        try {
            const collection = await this.getCollection();
            if (!collection) return null;

            const doc = await collection.findOne({ _id: new ObjectId(id) });
            if (!doc) return null;

            const { _id, ...rest } = doc;
            return {
                ...rest,
                id: _id.toString(),
            } as unknown as Model3DType;
        } catch (error) {
            console.error("❌ Failed to find Model3D:", error);
            return null;
        }
    }

    /**
     * Update a model
     */
    async update(
        id: string,
        data: Partial<Omit<Model3DType, "id">>
    ): Promise<boolean> {
        try {
            const collection = await this.getCollection();
            if (!collection) return false;

            const result = await collection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        ...data,
                        updatedAt: new Date(),
                    },
                }
            );

            if (result.modifiedCount > 0) {
                console.log(`✅ Model3D updated: ${id}`);
                return true;
            }
            return false;
        } catch (error) {
            console.error("❌ Failed to update Model3D:", error);
            return false;
        }
    }

    /**
     * Delete a model
     */
    async delete(id: string): Promise<boolean> {
        try {
            const collection = await this.getCollection();
            if (!collection) return false;

            const result = await collection.deleteOne({
                _id: new ObjectId(id),
            });

            if (result.deletedCount > 0) {
                console.log(`✅ Model3D deleted: ${id}`);
                return true;
            }
            return false;
        } catch (error) {
            console.error("❌ Failed to delete Model3D:", error);
            return false;
        }
    }

    /**
     * Find all models (optional filter)
     */
    async findAll(filter?: Record<string, any>): Promise<Model3DType[]> {
        try {
            const collection = await this.getCollection();
            if (!collection) return [];

            const docs = await collection.find(filter || {}).toArray();

            return docs.map((doc) => {
                const { _id, ...rest } = doc;
                return {
                    ...rest,
                    id: _id.toString(),
                } as unknown as Model3DType;
            });
        } catch (error) {
            console.error("❌ Failed to find Model3D list:", error);
            return [];
        }
    }
}
