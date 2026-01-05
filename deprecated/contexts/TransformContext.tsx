"use client";

import React, { createContext, useContext, useState } from "react";
import { OBJECT_TYPES, TRANSFORM_MODES } from "../constants";

type TransformContextType = {
    transformMode: TRANSFORM_MODES | null;
    setTransformMode: (mode: TRANSFORM_MODES | null) => void;
    selectedObject: SelectedObjectProps | null;
    setSelectedObject: (obj: SelectedObjectProps | null) => void;
};

// Créer le contexte
const TransformContext = createContext<TransformContextType | undefined>(
    undefined
);

interface SelectedObjectProps {
    id: string;
    type: OBJECT_TYPES;
}

// Provider
export const TransformProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [transformMode, setTransformMode] = useState<TRANSFORM_MODES | null>(
        null
    );
    const [selectedObject, setSelectedObject] =
        useState<SelectedObjectProps | null>(null);

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
