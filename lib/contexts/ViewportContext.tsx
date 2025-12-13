"use client";

import React, { createContext, useContext, useState } from "react";

type CameraType = "perspective" | "orthographic";

type ViewportContextType = {
    // Camera
    cameraType: CameraType;
    setCameraType: (type: CameraType) => void;

    // Environment
    environmentImage: string;
    setEnvironmentImage: (image: string) => void;
    environmentIntensity: number;
    setEnvironmentIntensity: (intensity: number) => void;

    // Transform mode
    transformMode: "translate" | "rotate" | "scale" | null;
    setTransformMode: (mode: "translate" | "rotate" | "scale" | null) => void;

    // Selection
    selectedObject: string | null;
    setSelectedObject: (id: string | null) => void;

    // Sidebars
    leftSidebarOpen: boolean;
    setLeftSidebarOpen: (open: boolean) => void;
    rightSidebarOpen: boolean;
    setRightSidebarOpen: (open: boolean) => void;

    // Update trigger
    updateTrigger: number;
    triggerUpdate: () => void;
};

const ViewportContext = createContext<ViewportContextType | undefined>(
    undefined
);

export const ViewportProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [cameraType, setCameraType] = useState<CameraType>("perspective");
    const [environmentImage, setEnvironmentImage] = useState("venice_sunset");
    const [environmentIntensity, setEnvironmentIntensity] = useState(1);
    const [transformMode, setTransformMode] = useState<
        "translate" | "rotate" | "scale" | null
    >(null);
    const [selectedObject, setSelectedObject] = useState<string | null>(null);
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
    const [updateTrigger, setUpdateTrigger] = useState(0);

    const triggerUpdate = () => {
        setUpdateTrigger((prev) => prev + 1);
    };

    return (
        <ViewportContext.Provider
            value={{
                cameraType,
                setCameraType,
                environmentImage,
                setEnvironmentImage,
                environmentIntensity,
                setEnvironmentIntensity,
                transformMode,
                setTransformMode,
                selectedObject,
                setSelectedObject,
                leftSidebarOpen,
                setLeftSidebarOpen,
                rightSidebarOpen,
                setRightSidebarOpen,
                updateTrigger,
                triggerUpdate,
            }}
        >
            {children}
        </ViewportContext.Provider>
    );
};

export const useViewport = () => {
    const context = useContext(ViewportContext);
    if (context === undefined) {
        throw new Error("useViewport must be used within a ViewportProvider");
    }
    return context;
};
