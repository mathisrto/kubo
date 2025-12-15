"use client";

import React, { createContext, useContext, useState } from "react";

// Définir les types possibles
export type TransformMode = null | "translate" | "rotate" | "scale";

type TransformContextType = {
    transformMode: TransformMode;
    setTransformMode: (mode: TransformMode) => void;
    selectedObject: string | null;
    setSelectedObject: (id: string | null) => void;
};

// Créer le contexte
const TransformContext = createContext<TransformContextType | undefined>(
    undefined
);

// Provider
export const TransformProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [transformMode, setTransformMode] = useState<TransformMode>(null);
    const [selectedObject, setSelectedObject] = useState<string | null>(null);

    return (
        <TransformContext.Provider
            value={{
                transformMode,
                setTransformMode,
                selectedObject,
                setSelectedObject,
            }}
        >
            {children}
        </TransformContext.Provider>
    );
};

// Hook pour utiliser le contexte facilement
export const useTransform = (): TransformContextType => {
    const context = useContext(TransformContext);
    if (!context) {
        throw new Error("useTransform must be used within a TransformProvider");
    }
    return context;
};
