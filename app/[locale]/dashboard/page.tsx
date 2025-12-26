"use client";

import { CreateObjectsSection } from "@/lib/components/CreateObjectsSection";
import { DashboardNavbar } from "@/lib/components/DashboardNavbar";
import { HierarchySection } from "@/lib/components/HierarchySection";
import { TextureSection } from "@/lib/components/TextureSection";
import ThreeScene from "@/lib/components/ThreeRenderer";
import { TransformToolsSection } from "@/lib/components/TransformToolsSection";
import { useTransform } from "@/lib/contexts/TransformContext";
import { useTranslations } from "next-intl";

import { PropertiesSection } from "@/lib/components/PropertiesSection";
import { OBJECT_TYPES } from "@/lib/constants";
import { Separator } from "@radix-ui/react-separator";

const DashboardPage = () => {
    const t = useTranslations("Dashboard");
    const { selectedObject } = useTransform();

    return (
        <div className="flex h-screen w-full flex-col bg-background overflow-hidden">
            <DashboardNavbar />

            {/* Container principal avec flex horizontal */}
            <div className="flex-1 flex overflow-hidden mt-16">
                {/* Left Sidebar */}
                <aside className="flex flex-col min-w-80">
                    <div>
                        <h2 className="pt-4 text-lg font-semibold text-center">
                            Hiérarchie
                        </h2>
                    </div>
                    <div className="flex-1 overflow-auto p-2">
                        <HierarchySection />
                        <Separator className="my-4" />
                        {selectedObject?.type === OBJECT_TYPES.MODEL && (
                            <TextureSection />
                        )}
                    </div>
                </aside>

                {/* Center Canvas */}
                <div className="flex-1 h-full flex flex-col">
                    <div className="flex-1 w-full">
                        <ThreeScene />
                    </div>
                </div>

                {/* Right Sidebar */}
                <aside className="flex flex-col min-w-80">
                    <div>
                        <h2 className="pt-4 text-lg font-semibold text-center">
                            Outils
                        </h2>
                    </div>
                    <div className="flex-1 overflow-auto p-2">
                        <TransformToolsSection />
                        <Separator className="my-4" />
                        <CreateObjectsSection />
                        <Separator className="my-4" />
                        {selectedObject && <PropertiesSection />}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default DashboardPage;
