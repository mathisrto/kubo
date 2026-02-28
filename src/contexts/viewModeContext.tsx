"use client";

import { ViewMode } from "@/src/types";
import React, { createContext, useContext, useState } from "react";

type ViewModeContextType = {
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
};

const ViewModeContext = createContext<ViewModeContextType | undefined>(
    undefined,
);

export const ViewModeProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.RENDERED);

    return (
        <ViewModeContext.Provider value={{ viewMode, setViewMode }}>
            {children}
        </ViewModeContext.Provider>
    );
};

export const useViewMode = (): ViewModeContextType => {
    const context = useContext(ViewModeContext);
    if (!context) {
        throw new Error("useViewMode must be used within a ViewModeProvider");
    }
    return context;
};
