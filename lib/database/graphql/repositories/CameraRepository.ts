import { gql } from "@apollo/client";
import { Vector3Type } from "../../../class/Vector3";
import { apolloClient } from "../client";

export class CameraRepository {
    public async getCameraPosition(): Promise<Vector3Type> {
        const query = gql`
            query getCameraPosition {
                getCameraPosition {
                    x
                    y
                    z
                }
            }
        `;
        const result = await apolloClient.query({
            query,
        });
        return (
            result.data as {
                getCameraPosition: Vector3Type;
            }
        ).getCameraPosition;
    }

    public async getCameraRotation(): Promise<Vector3Type> {
        const query = gql`
            query getCameraRotation {
                getCameraRotation {
                    x
                    y
                    z
                }
            }
        `;
        const result = await apolloClient.query({
            query,
        });
        return (
            result.data as {
                getCameraRotation: Vector3Type;
            }
        ).getCameraRotation;
    }

    public async getCameraTarget(): Promise<Vector3Type> {
        const query = gql`
            query getCameraTarget {
                getCameraTarget {
                    x
                    y
                    z
                }
            }
        `;
        const result = await apolloClient.query({
            query,
        });
        return (
            result.data as {
                getCameraTarget: Vector3Type;
            }
        ).getCameraTarget;
    }

    public async getCameraFOV(): Promise<number> {
        const query = gql`
            query getCameraFOV {
                getCameraFOV
            }
        `;
        const result = await apolloClient.query({
            query,
        });
        return (
            result.data as {
                getCameraFOV: number;
            }
        ).getCameraFOV;
    }

    public async getCameraNear(): Promise<number> {
        const query = gql`
            query getCameraNear {
                getCameraNear
            }
        `;
        const result = await apolloClient.query({
            query,
        });
        return (
            result.data as {
                getCameraNear: number;
            }
        ).getCameraNear;
    }

    public async getCameraFar(): Promise<number> {
        const query = gql`
            query getCameraFar {
                getCameraFar
            }
        `;
        const result = await apolloClient.query({
            query,
        });
        return (
            result.data as {
                getCameraFar: number;
            }
        ).getCameraFar;
    }

    public async getCameraType(): Promise<string> {
        const query = gql`
            query getCameraType {
                getCameraType
            }
        `;
        const result = await apolloClient.query({
            query,
        });
        return (
            result.data as {
                getCameraType: string;
            }
        ).getCameraType;
    }

    public async updateCameraPosition(position: Vector3Type): Promise<boolean> {
        const mutation = gql`
            mutation updateCameraPosition($position: Vector3Input!) {
                updateCameraPosition(position: $position) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { position },
        });
        return (
            result.data as {
                updateCameraPosition: { acknowledged: boolean };
            }
        ).updateCameraPosition.acknowledged;
    }

    public async updateCameraRotation(rotation: Vector3Type): Promise<boolean> {
        const mutation = gql`
            mutation updateCameraRotation($rotation: Vector3Input!) {
                updateCameraRotation(rotation: $rotation) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { rotation },
        });
        return (
            result.data as {
                updateCameraRotation: { acknowledged: boolean };
            }
        ).updateCameraRotation.acknowledged;
    }

    public async updateCameraTarget(target: Vector3Type): Promise<boolean> {
        const mutation = gql`
            mutation updateCameraTarget($target: Vector3Input!) {
                updateCameraTarget(target: $target) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { target },
        });
        return (
            result.data as {
                updateCameraTarget: { acknowledged: boolean };
            }
        ).updateCameraTarget.acknowledged;
    }

    public async updateCameraFOV(fov: number): Promise<boolean> {
        const mutation = gql`
            mutation updateCameraFOV($fov: Float!) {
                updateCameraFOV(fov: $fov) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { fov },
        });
        return (
            result.data as {
                updateCameraFOV: { acknowledged: boolean };
            }
        ).updateCameraFOV.acknowledged;
    }

    public async updateCameraNear(near: number): Promise<boolean> {
        const mutation = gql`
            mutation updateCameraNear($near: Float!) {
                updateCameraNear(near: $near) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { near },
        });
        return (
            result.data as {
                updateCameraNear: { acknowledged: boolean };
            }
        ).updateCameraNear.acknowledged;
    }

    public async updateCameraFar(far: number): Promise<boolean> {
        const mutation = gql`
            mutation updateCameraFar($far: Float!) {
                updateCameraFar(far: $far) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { far },
        });
        return (
            result.data as {
                updateCameraFar: { acknowledged: boolean };
            }
        ).updateCameraFar.acknowledged;
    }

    public async updateCameraType(type: string): Promise<boolean> {
        const mutation = gql`
            mutation updateCameraType($type: String!) {
                updateCameraType(type: $type) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { type },
        });
        return (
            result.data as {
                updateCameraType: { acknowledged: boolean };
            }
        ).updateCameraType.acknowledged;
    }
}
