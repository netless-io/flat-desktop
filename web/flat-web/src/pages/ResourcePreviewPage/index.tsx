import React from "react";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router";
import { RouteNameType, RouteParams } from "../../utils/routes";
import { DynamicPreview } from "./DynamicPreview";
import { MediaPreview } from "./MediaPreview";
import { StaticPreview } from "./StaticPreview";
import { ErrorPage } from "flat-components";

export interface ResourcePreviewPagePageProps {}

export const ResourcePreviewPage = observer<ResourcePreviewPagePageProps>(
    function ResourcePreviewPage() {
        const { fileURL, taskToken, taskUUID } =
            useParams<RouteParams<RouteNameType.ResourcePreviewPage>>();

        const decodeFileName = decodeURIComponent(fileURL);

        return <div className="cloud-storage-preview-container">{renderPreviewComponent()}</div>;

        function renderPreviewComponent(): React.ReactElement {
            const fileSuffix = (/\.[a-z1-9]+$/i.exec(decodeFileName) || [""])[0].toLowerCase();

            switch (fileSuffix) {
                case ".pptx": {
                    if (taskUUID && taskToken) {
                        return <DynamicPreview taskUUID={taskUUID} taskToken={taskToken} />;
                    }
                    return <ErrorPage />;
                }
                case ".ppt":
                case ".pdf":
                case ".doc":
                case ".docx": {
                    if (taskUUID && taskToken) {
                        return <StaticPreview taskUUID={taskUUID} taskToken={taskToken} />;
                    }
                    return <ErrorPage />;
                }

                default: {
                    return <MediaPreview fileURL={fileURL} />;
                }
            }
        }
    },
);

export default ResourcePreviewPage;
