import { SceneType } from "@/lib/class/Scene";
import { gql } from "@apollo/client";
import { apolloClient } from "../client";

export class UserRepository {
    async createAndResetScene() {
        const mutation = gql`
            mutation CreateOrResetScene {
                createOrResetScene {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
        });
        return (
            result.data as { createOrResetScene: { acknowledged: boolean } }
        ).createOrResetScene.acknowledged;
    }

    async getScene() {
        const query = gql`
            query GetScene {
                getScene {
                    ambientLight {
                        color {
                            r
                            g
                            b
                            a
                        }
                        intensity
                        colorMultiplier
                    }
                    camera {
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
                    createdAt
                    lights {
                        id
                        name
                        position {
                            x
                            y
                            z
                        }
                        color {
                            r
                            g
                            b
                            a
                        }
                        intensity
                        range
                        type
                        colorMultiplier
                    }
                    materials {
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
                    objects {
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
                    updatedAt
                }
            }
        `;
        const res = await apolloClient.query({ query });
        return (res.data as { getScene: SceneType }).getScene;
    }

    async hasScene(): Promise<boolean> {
        const query = gql`
            query HasScene {
                hasScene
            }
        `;
        const res = await apolloClient.query({ query });
        return (res.data as { hasScene: boolean }).hasScene;
    }
}
