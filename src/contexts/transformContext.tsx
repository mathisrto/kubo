"use client";

import { TRANSFORM_MODES } from "@/src/types";
import React, { createContext, useContext, useState } from "react";
import { Entity } from "../core/ecs/components/indexComponent";

type TransformContextType = {
    transformMode: TRANSFORM_MODES | null;
    setTransformMode: (mode: TRANSFORM_MODES | null) => void;
    selectedObject: Entity | null;
    setSelectedObject: (obj: Entity | null) => void;
};

// Créer le contexte
const TransformContext = createContext<TransformContextType | undefined>(
    undefined
);

// Provider
export const TransformProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [transformMode, setTransformMode] = useState<TRANSFORM_MODES | null>(
        null
    );
    const [selectedObject, setSelectedObject] = useState<Entity | null>(null);

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
