import { User as FirebaseUser } from "firebase/auth";
import { UserRepository } from "../database/graphql/repositories/UserRepository";
import { Scene } from "./Scene";

/**
 * Represents a user within the application.
 *
 * @property uid - The unique identifier for the user.
 * @property displayName - The display name of the user.
 * @property email - The user's email address.
 * @property photoURL - The URL to the user's profile photo.
 * @property scene - The current scene associated with the user.
 */
type UserType = {
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
    scene: Scene | null;
    apiKey?: string;
};

/**
 * Represents a user in the application, encapsulating authentication and profile information,
 * as well as the user's associated 3D scene.
 *
 * @remarks
 * The `User` class initializes user properties from a FirebaseUser object and sets up a default
 * 3D scene with a camera and ambient light. It provides getters and setters for user profile
 * fields and the scene, and includes a method to save the current scene (intended for backend integration).
 *
 * @example
 * ```typescript
 * const user = new User(firebaseUser);
 * user.displayName = "Alice";
 * await user.saveScene();
 * ```
 */
export class User {
    private _uid: UserType["uid"];
    private _displayName: UserType["displayName"];
    private _email: UserType["email"];
    private _photoURL: UserType["photoURL"];
    private _scene: UserType["scene"] = null;
    private _apiKey?: UserType["apiKey"];

    repository = new UserRepository();

    /**
     * Initializes a new instance of the User class using the provided FirebaseUser object.
     *
     * - Sets the user's UID, display name, email, and photo URL from the FirebaseUser.
     * - Initializes a default 3D camera and ambient light for the user's scene.
     * - Creates a new Scene instance with the camera and ambient light serialized, and no objects or additional lights.
     *
     * @param firebaseUser - The FirebaseUser object containing authentication and profile information.
     */
    constructor(firebaseUser: FirebaseUser) {
        this._uid = firebaseUser.uid;
        this._displayName = firebaseUser.displayName || "Utilisateur";
        this._email = firebaseUser.email || "Inconnu";
        this._photoURL = firebaseUser.photoURL || "";
    }

    /* Getters */

    /**
     * Gets the unique identifier (UID) of the user.
     *
     * @returns The user's UID as defined in the `UserType` interface.
     */
    get uid(): UserType["uid"] {
        return this._uid;
    }

    /**
     * Gets the display name of the user.
     *
     * @returns The user's display name as defined in the UserType interface.
     */
    get displayName(): UserType["displayName"] {
        return this._displayName;
    }

    /**
     * Gets the email address associated with the user.
     *
     * @returns The user's email address as defined in the UserType.
     */
    get email(): UserType["email"] {
        return this._email;
    }

    /**
     * Gets the URL of the user's photo.
     *
     * @returns The photo URL associated with the user, as defined in the UserType interface.
     */
    get photoURL(): UserType["photoURL"] {
        return this._photoURL;
    }

    /**
     * Gets the current scene associated with the user.
     *
     * @returns The user's current scene, as defined by the `scene` property in the `UserType` interface.
     */
    get scene(): UserType["scene"] {
        return this._scene;
    }

    /**
     * Gets the API key associated with the user, if available.
     *
     * @returns The user's API key as defined in the UserType interface, or undefined if not set.
     */
    get apiKey(): UserType["apiKey"] | undefined {
        return this._apiKey;
    }

    /* Setters */

    /**
     * Sets the display name for the user.
     * @param name - The new display name to assign to the user.
     */
    set displayName(name: UserType["displayName"]) {
        this._displayName = name;
    }

    /**
     * Sets the user's email address.
     * @param email - The new email address to assign to the user.
     */
    set email(email: UserType["email"]) {
        this._email = email;
    }

    /**
     * Sets the user's photo URL.
     *
     * @param url - The new photo URL to assign to the user.
     */
    set photoURL(url: UserType["photoURL"]) {
        this._photoURL = url;
    }

    /**
     * Sets the current scene for the user.
     *
     * @param scene - The new scene to assign, as defined by the `scene` property of `UserType`.
     */
    set scene(scene: UserType["scene"]) {
        this._scene = scene;
    }

    /**
     * Sets the API key for the user.
     * @param key - The new API key to assign to the user.
     */
    set apiKey(key: UserType["apiKey"] | undefined) {
        this._apiKey = key;
    }

    updateUserFromFirebase(firebaseUser: FirebaseUser) {
        this.displayName = firebaseUser.displayName || this.displayName;
        this.photoURL = firebaseUser.photoURL || this.photoURL;
    }

    /* Methods */

    /**
     * Saves the current scene associated with the user.
     *
     * If a scene exists, this method serializes the scene data and logs it,
     * along with the user's UID, to the console. Intended for integration
     * with a backend service such as Firebase Firestore or RealtimeDB.
     *
     * @returns {Promise<void>} A promise that resolves when the save operation is complete.
     */
    async saveScene(): Promise<void> {
        if (!this.scene) return;

        this.scene.save();
    }
}
