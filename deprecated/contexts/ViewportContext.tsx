"use client";

import React, { createContext, useContext, useState } from "react";

type ViewportContextType = {
    leftSidebarOpen: boolean;
    setLeftSidebarOpen: (open: boolean) => void;
    rightSidebarOpen: boolean;
    setRightSidebarOpen: (open: boolean) => void;
};

const ViewportContext = createContext<ViewportContextType | undefined>(
    undefined
);

export const ViewportProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(true);
    const [rightSidebarOpen, setRightSidebarOpen] = useState<boolean>(true);

    return (
        <ViewportContext.Provider
            value={{
                leftSidebarOpen,
                setLeftSidebarOpen,
                rightSidebarOpen,
                setRightSidebarOpen,
            }}
        >
            {children}
        </ViewportContext.Provider>
    );
};

export const useViewport = (): ViewportContextType => {
    const context = useContext(ViewportContext);
    if (!context) {
        throw new Error("useViewport must be used within a ViewportProvider");
    }
    return context;
};
