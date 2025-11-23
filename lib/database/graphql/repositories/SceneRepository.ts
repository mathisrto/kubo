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
                    vertices {
                        x
                        y
                        z
                    }
                    indices
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
        const res = await apolloClient.query({ query });
        const data = (res.data as { getSceneObjects: any[] }).getSceneObjects;
        console.log("[getSceneObjects] Raw data from server:", data);
        if (data && data.length > 0) {
            console.log("[getSceneObjects] First object:", data[0]);
        }
        return data.map((obj) => new SceneObject(obj));
    }

    async createSceneObject(obj: SceneObject) {
        const mutation = gql`
            mutation createSceneObject($object: SceneObjectInput!) {
                createSceneObject(object: $object)
            }
        `;

        const result = await apolloClient.mutate({
            mutation,
            variables: { object: obj.serialize() },
        });
        return (result.data as { createSceneObject: string }).createSceneObject;
    }

    async removeSceneObject(objectId: string) {
        const mutation = gql`
            mutation removeSceneObject($objectId: String!) {
                removeSceneObject(objectId: $objectId) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { objectId },
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
        const res = await apolloClient.query({ query });
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
        const res = await apolloClient.query({ query });
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
