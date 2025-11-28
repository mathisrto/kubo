import { SceneObjectType } from "@/lib/class/SceneObject";
import { Vector3Type } from "@/lib/class/Vector3";
import { gql } from "@apollo/client";
import { apolloClient } from "../client";

export class SceneObjectRepository {
    async getSceneObjectById(id: string): Promise<SceneObjectType | null> {
        const query = gql`
            query getSceneObjectById($id: String!) {
                getSceneObjectById(id: $id) {
                    id
                    name
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
            (result.data as { getSceneObjectById: SceneObjectType | null })
                .getSceneObjectById || null
        );
    }

    async getSceneObjectName(id: string): Promise<string | null> {
        const query = gql`
            query getSceneObjectName($id: String!) {
                getSceneObjectName(id: $id)
            }
        `;
        const result = await apolloClient.query({
            query,
            variables: { id },
        });
        return (
            (result.data as { getSceneObjectName: string | null })
                .getSceneObjectName || null
        );
    }

    async getSceneObjectPosition(id: string): Promise<Vector3Type | null> {
        const query = gql`
            query getSceneObjectPosition($id: String!) {
                getSceneObjectPosition(id: $id) {
                    x
                    y
                    z
                }
            }
        `;
        const result = await apolloClient.query({
            query,
            variables: { id },
        });
        return (
            (result.data as { getSceneObjectPosition: Vector3Type | null })
                .getSceneObjectPosition || null
        );
    }

    async getSceneObjectRotation(id: string): Promise<Vector3Type | null> {
        const query = gql`
            query getSceneObjectRotation($id: String!) {
                getSceneObjectRotation(id: $id) {
                    x
                    y
                    z
                }
            }
        `;
        const result = await apolloClient.query({
            query,
            variables: { id },
        });
        return (
            (result.data as { getSceneObjectRotation: Vector3Type | null })
                .getSceneObjectRotation || null
        );
    }

    async getSceneObjectScale(id: string): Promise<Vector3Type | null> {
        const query = gql`
            query getSceneObjectScale($id: String!) {
                getSceneObjectScale(id: $id) {
                    x
                    y
                    z
                }
            }
        `;
        const result = await apolloClient.query({
            query,
            variables: { id },
        });
        return (
            (result.data as { getSceneObjectScale: Vector3Type | null })
                .getSceneObjectScale || null
        );
    }

    async getSceneObjectMaterialId(id: string): Promise<string | null> {
        const query = gql`
            query getSceneObjectMaterialId($id: String!) {
                getSceneObjectMaterialId(id: $id)
            }
        `;
        const result = await apolloClient.query({
            query,
            variables: { id },
        });
        return (
            (result.data as { getSceneObjectMaterialId: string | null })
                .getSceneObjectMaterialId || null
        );
    }

    async updateSceneObjectName(id: string, name: string): Promise<boolean> {
        const mutation = gql`
            mutation updateSceneObjectName($id: String!, $name: String!) {
                updateSceneObjectName(id: $id, name: $name) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { id, name },
        });
        return (
            result.data as {
                updateSceneObjectName: { acknowledged: boolean };
            }
        ).updateSceneObjectName.acknowledged;
    }

    async updateSceneObjectPosition(
        id: string,
        position: Vector3Type
    ): Promise<boolean> {
        const mutation = gql`
            mutation updateSceneObjectPosition(
                $id: String!
                $position: Vector3Input!
            ) {
                updateSceneObjectPosition(id: $id, position: $position) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { id, position },
        });
        return (
            result.data as {
                updateSceneObjectPosition: { acknowledged: boolean };
            }
        ).updateSceneObjectPosition.acknowledged;
    }

    async updateSceneObjectRotation(
        id: string,
        rotation: Vector3Type
    ): Promise<boolean> {
        const mutation = gql`
            mutation updateSceneObjectRotation(
                $id: String!
                $rotation: Vector3Input!
            ) {
                updateSceneObjectRotation(id: $id, rotation: $rotation) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { id, rotation },
        });
        return (
            result.data as {
                updateSceneObjectRotation: { acknowledged: boolean };
            }
        ).updateSceneObjectRotation.acknowledged;
    }

    async updateSceneObjectScale(
        id: string,
        scale: Vector3Type
    ): Promise<boolean> {
        const mutation = gql`
            mutation updateSceneObjectScale(
                $id: String!
                $scale: Vector3Input!
            ) {
                updateSceneObjectScale(id: $id, scale: $scale) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { id, scale },
        });
        return (
            result.data as { updateSceneObjectScale: { acknowledged: boolean } }
        ).updateSceneObjectScale.acknowledged;
    }

    async updateSceneObjectMaterial(
        id: string,
        materialId: string
    ): Promise<boolean> {
        const mutation = gql`
            mutation updateSceneObjectMaterial(
                $id: String!
                $materialId: String!
            ) {
                updateSceneObjectMaterial(id: $id, materialId: $materialId) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { id, materialId },
        });
        return (
            result.data as {
                updateSceneObjectMaterial: { acknowledged: boolean };
            }
        ).updateSceneObjectMaterial.acknowledged;
    }
}
