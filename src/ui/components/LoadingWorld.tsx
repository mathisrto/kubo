import { Loader } from "lucide-react";
import React from "react";

interface LoadingWorldProps {
    hasError?: boolean;
}

const LoadingWorld: React.FC<LoadingWorldProps> = ({ hasError = false }) => {
    return (
        <div className="flex h-screen w-full justify-center items-center bg-background overflow-hidden">
            {hasError ? (
                <div className="flex flex-col justify-center items-center">
                    <p className="text-red-500 font-bold text-xl mb-2">
                        Impossible de charger le monde
                    </p>
                    <p className="text-gray-500">
                        Veuillez vérifier la connexion à la base de données
                    </p>
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center gap-4">
                    <p className="text-gray-700 text-xl">
                        Chargement du monde...
                    </p>
                    <Loader className="animate-spin text-gray-500" />
                </div>
            )}
        </div>
    );
};

export default LoadingWorld;
