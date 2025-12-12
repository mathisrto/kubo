import { gql } from "@apollo/client";
import { Model3DType, MODEL_FILE_FORMAT } from "../../../class/Model3D";
import { Vector3Type } from "../../../class/Vector3";
import { apolloClient } from "../client";

export class Model3DRepository {
    async getModel3DById(id: string): Promise<Model3DType | null> {
        const query = gql`
            query getModel3DById($id: String!) {
                getModel3DById(id: $id) {
                    id
                    name
                    fileId
                    format
                    position {
                        x
                        y
                        z
                    }
                    rotation {
                        x
                        y
                        z
                    }
                    scale {
                        x
                        y
                        z
                    }
                    materialId
                }
            }
        `;
        const result = await apolloClient.query({
            query,
            variables: { id },
        });
        return (
            (result.data as { getModel3DById: Model3DType | null })
                .getModel3DById || null
        );
    }

    async updateModel3DName(id: string, name: string): Promise<boolean> {
        const mutation = gql`
            mutation updateModel3DName($id: String!, $name: String!) {
                updateModel3DName(id: $id, name: $name) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { id, name },
        });
        return (
            (
                result.data as {
                    updateModel3DName: { acknowledged: boolean };
                }
            ).updateModel3DName?.acknowledged || false
        );
    }

    async updateModel3DFileId(id: string, fileId: string): Promise<boolean> {
        const mutation = gql`
            mutation updateModel3DFileId($id: String!, $fileId: String!) {
                updateModel3DFileId(id: $id, fileId: $fileId) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { id, fileId },
        });
        return (
            (
                result.data as {
                    updateModel3DFileId: { acknowledged: boolean };
                }
            ).updateModel3DFileId?.acknowledged || false
        );
    }

    async updateModel3DFormat(
        id: string,
        format: MODEL_FILE_FORMAT
    ): Promise<boolean> {
        const mutation = gql`
            mutation updateModel3DFormat(
                $id: String!
                $format: ModelFileFormat!
            ) {
                updateModel3DFormat(id: $id, format: $format) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { id, format },
        });
        return (
            (
                result.data as {
                    updateModel3DFormat: { acknowledged: boolean };
                }
            ).updateModel3DFormat?.acknowledged || false
        );
    }

    async updateModel3DPosition(
        id: string,
        position: Vector3Type
    ): Promise<boolean> {
        const mutation = gql`
            mutation updateModel3DPosition(
                $id: String!
                $position: Vector3Input!
            ) {
                updateModel3DPosition(id: $id, position: $position) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { id, position },
        });
        return (
            (
                result.data as {
                    updateModel3DPosition: { acknowledged: boolean };
                }
            ).updateModel3DPosition?.acknowledged || false
        );
    }

    async updateModel3DRotation(
        id: string,
        rotation: Vector3Type
    ): Promise<boolean> {
        const mutation = gql`
            mutation updateModel3DRotation(
                $id: String!
                $rotation: Vector3Input!
            ) {
                updateModel3DRotation(id: $id, rotation: $rotation) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { id, rotation },
        });
        return (
            (
                result.data as {
                    updateModel3DRotation: { acknowledged: boolean };
                }
            ).updateModel3DRotation?.acknowledged || false
        );
    }

    async updateModel3DScale(id: string, scale: Vector3Type): Promise<boolean> {
        const mutation = gql`
            mutation updateModel3DScale($id: String!, $scale: Vector3Input!) {
                updateModel3DScale(id: $id, scale: $scale) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { id, scale },
        });
        return (
            (
                result.data as {
                    updateModel3DScale: { acknowledged: boolean };
                }
            ).updateModel3DScale?.acknowledged || false
        );
    }

    async updateModel3DMaterialId(
        id: string,
        materialId: string
    ): Promise<boolean> {
        const mutation = gql`
            mutation updateModel3DMaterialId(
                $id: String!
                $materialId: String!
            ) {
                updateModel3DMaterialId(id: $id, materialId: $materialId) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { id, materialId },
        });
        return (
            (
                result.data as {
                    updateModel3DMaterialId: { acknowledged: boolean };
                }
            ).updateModel3DMaterialId?.acknowledged || false
        );
    }

    async createModel3D(
        name: string,
        fileId: string,
        format: MODEL_FILE_FORMAT
    ): Promise<string | null> {
        const mutation = gql`
            mutation createModel3D(
                $name: String!
                $fileId: String!
                $format: ModelFileFormat!
            ) {
                createModel3D(name: $name, fileId: $fileId, format: $format)
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { name, fileId, format },
        });
        return (result.data as { createModel3D: string }).createModel3D || null;
    }

    async removeModel3D(modelId: string): Promise<boolean> {
        const mutation = gql`
            mutation removeModel3D($modelId: String!) {
                removeModel3D(modelId: $modelId) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { modelId },
        });
        return (
            (
                result.data as {
                    removeModel3D: { acknowledged: boolean };
                }
            ).removeModel3D?.acknowledged || false
        );
    }
}
