"use client";

import { useTransform } from "@/src/contexts/transformContext";
import { CreateObjectsSection } from "@/src/ui/components/CreateObjectsSection";
import { DashboardNavbar } from "@/src/ui/components/DashboardNavbar";
import { HierarchySection } from "@/src/ui/components/HierarchySection";
import { TextureSection } from "@/src/ui/components/TextureSection";
import ThreeScene from "@/src/ui/components/ThreeRenderer";
import { TransformToolsSection } from "@/src/ui/components/TransformToolsSection";
import { useTranslations } from "next-intl";

import { useWorldValues } from "@/src/contexts/worldContext";
import { isModel3DEntity } from "@/src/core/ecs/queries/utilsQuery";
import { PropertiesSection } from "@/src/ui/components/PropertiesSection";
import { Separator } from "@radix-ui/react-separator";

const DashboardPage = () => {
    const t = useTranslations("Dashboard");
    const { snap } = useWorldValues();
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
                        {selectedObject &&
                            isModel3DEntity(snap, selectedObject) && (
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
