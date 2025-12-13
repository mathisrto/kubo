import { AmbientLightType } from "@/lib/class/AmbientLight";
import { CameraType } from "@/lib/class/Camera";
import { Light } from "@/lib/class/Light";
import { Material } from "@/lib/class/Material";
import { Model3D } from "@/lib/class/Model3D";
import { gql } from "@apollo/client";
import { apolloClient } from "../client";

export class SceneRepository {
    /* --------- MODEL3D --------- */
    async getModel3Ds(): Promise<Model3D[]> {
        const query = gql`
            query getModel3Ds {
                getModel3Ds {
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
        // Force network request to avoid stale cache
        const res = await apolloClient.query({
            query,
            fetchPolicy: "network-only",
        });
        const data = (res.data as { getModel3Ds: any[] }).getModel3Ds;
        return data.map((model) => new Model3D(model));
    }

    async createModel3D(model: Model3D) {
        const mutation = gql`
            mutation createModel3D(
                $name: String!
                $fileId: String!
                $format: ModelFileFormat!
                $position: Vector3Input
                $rotation: Vector3Input
                $scale: Vector3Input
                $materialId: String
                $metadata: JSON
            ) {
                createModel3D(
                    name: $name
                    fileId: $fileId
                    format: $format
                    position: $position
                    rotation: $rotation
                    scale: $scale
                    materialId: $materialId
                    metadata: $metadata
                )
            }
        `;

        const result = await apolloClient.mutate({
            mutation,
            variables: {
                name: model.name,
                fileId: model.fileId,
                format: model.format,
                position: model.positionVector.serialize(),
                rotation: model.rotationVector.serialize(),
                scale: model.scaleVector.serialize(),
                materialId: model.materialId,
                metadata: model.metadata,
            },
        });
        return (result.data as { createModel3D: string }).createModel3D;
    }

    async removeModel3D(modelId: string) {
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
        return (result.data as { removeModel3D: { acknowledged: boolean } })
            .removeModel3D.acknowledged;
    }

    /* --------- LIGHTS --------- */
    async getLights(): Promise<Light[]> {
        const query = gql`
            query getLights {
                getLights {
                    id
                    name
                    color {
                        r
                        g
                        b
                        a
                    }
                    position {
                        x
                        y
                        z
                    }
                    intensity
                    range
                    type
                    colorMultiplier
                }
            }
        `;
        // Force network request to avoid stale cache
        const res = await apolloClient.query({
            query,
            fetchPolicy: "network-only",
        });
        const data = (res.data as { getLights: any[] }).getLights;
        return data.map((light) => new Light(light));
    }

    async createLight(light: Light) {
        const mutation = gql`
            mutation createLight($light: LightInput!) {
                createLight(light: $light)
            }
        `;
        // Deep clone to ensure no class instances remain
        const cleanData = JSON.parse(JSON.stringify(light.serialize()));
        const result = await apolloClient.mutate({
            mutation,
            variables: { light: cleanData },
        });
        return (result.data as { createLight: string }).createLight;
    }

    async removeLight(id: string) {
        const mutation = gql`
            mutation removeLight($id: String!) {
                removeLight(id: $id) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { id },
        });
        return (result.data as { removeLight: { acknowledged: boolean } })
            .removeLight.acknowledged;
    }

    /* --------- MATERIALS --------- */
    async getMaterials(): Promise<Material[]> {
        const query = gql`
            query getMaterials {
                getMaterials {
                    id
                    name
                    albedo {
                        r
                        g
                        b
                        a
                    }
                    metallic
                    roughness
                    ao
                    emissive {
                        r
                        g
                        b
                        a
                    }
                }
            }
        `;
        // Force network request to avoid stale cache
        const res = await apolloClient.query({
            query,
            fetchPolicy: "network-only",
        });
        const data = (res.data as { getMaterials: any[] }).getMaterials;
        return data.map((material) => new Material(material));
    }

    async createMaterial(material: Material) {
        const mutation = gql`
            mutation createMaterial($material: MaterialInput!) {
                createMaterial(material: $material)
            }
        `;
        // Deep clone to ensure no class instances remain
        const cleanData = JSON.parse(JSON.stringify(material.serialize()));
        const result = await apolloClient.mutate({
            mutation,
            variables: { material: cleanData },
        });
        return (result.data as { createMaterial: string }).createMaterial;
    }

    async removeMaterial(id: string) {
        const mutation = gql`
            mutation removeMaterial($id: String!) {
                removeMaterial(id: $id) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { id },
        });
        return (result.data as { removeMaterial: { acknowledged: boolean } })
            .removeMaterial.acknowledged;
    }

    async getCamera() {
        const query = gql`
            query getCamera {
                getCamera {
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
                    fov
                    near
                    far
                    type
                }
            }
        `;
        const res = await apolloClient.query({ query });
        return (res.data as { getCamera: CameraType }).getCamera;
    }

    async getAmbientLight() {
        const query = gql`
            query getAmbientLight {
                getAmbientLight {
                    color {
                        r
                        g
                        b
                        a
                    }
                    intensity
                    colorMultiplier
                }
            }
        `;
        const res = await apolloClient.query({ query });
        return (res.data as { getAmbientLight: AmbientLightType })
            .getAmbientLight;
    }
}
