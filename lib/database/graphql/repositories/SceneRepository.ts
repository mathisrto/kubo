import { AmbientLightType } from "@/lib/class/AmbientLight";
import { CameraType } from "@/lib/class/Camera";
import { Light } from "@/lib/class/Light";
import { Material } from "@/lib/class/Material";
import { SceneObject } from "@/lib/class/SceneObject";
import { gql } from "@apollo/client";
import { apolloClient } from "../client";

export class SceneRepository {
    /* --------- OBJECTS --------- */
    async getSceneObjects(): Promise<SceneObject[]> {
        const query = gql`
            query getSceneObjects {
                getSceneObjects {
                    id
                    name
                    vertices
                    indices
                    position
                    rotation
                    scale
                    materialId
                }
            }
        `;
        const res = await apolloClient.query({ query });
        return (res.data as { getSceneObjects: SceneObject[] }).getSceneObjects;
    }

    async createSceneObject(obj: SceneObject) {
        const mutation = gql`
            mutation createSceneObject($input: SceneObjectInput!) {
                createSceneObject(input: $input) {
                    id
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { input: obj.serialize() },
        });
        return (result.data as { createSceneObject: { id: string } })
            .createSceneObject.id;
    }

    async removeSceneObject(id: string) {
        const mutation = gql`
            mutation removeSceneObject($id: ID!) {
                removeSceneObject(id: $id) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { id },
        });
        return (result.data as { removeSceneObject: { acknowledged: boolean } })
            .removeSceneObject.acknowledged;
    }

    /* --------- LIGHTS --------- */
    async getLights(): Promise<Light[]> {
        const query = gql`
            query getLights {
                getLights {
                    id
                    name
                    color
                    intensity
                    range
                    type
                    colorMultiplier
                }
            }
        `;
        const res = await apolloClient.query({ query });
        return (res.data as { getLights: Light[] }).getLights;
    }

    async createLight(light: Light) {
        const mutation = gql`
            mutation createLight($input: LightInput!) {
                createLight(input: $input) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { input: light.serialize() },
        });
        return (result.data as { createLight: { id: string } }).createLight.id;
    }

    async removeLight(id: string) {
        const mutation = gql`
            mutation removeLight($id: ID!) {
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
                    albedo
                    metallic
                    roughness
                    ao
                    emissive
                }
            }
        `;
        const res = await apolloClient.query({ query });
        return (res.data as { getMaterials: Material[] }).getMaterials;
    }

    async createMaterial(material: Material) {
        const mutation = gql`
            mutation createMaterial($input: MaterialInput!) {
                createMaterial(input: $input) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { input: material.serialize() },
        });
        return (result.data as { createMaterial: { id: string } })
            .createMaterial.id;
    }

    async removeMaterial(id: string) {
        const mutation = gql`
            mutation removeMaterial($id: ID!) {
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
                    position
                    rotation
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
                    color
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
