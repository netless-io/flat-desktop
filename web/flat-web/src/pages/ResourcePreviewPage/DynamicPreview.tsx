import { observer } from "mobx-react-lite";
import React, { useEffect, useRef } from "react";
import { ConversionResponse, previewPPT } from "white-web-sdk";
import { queryConvertingTaskStatus } from "../../apiMiddleware/courseware-converting";
import { useSafePromise } from "../../utils/hooks/lifecycle";

export interface DynamicPreviewProps {
    taskUUID: string;
    taskToken: string;
}

export const DynamicPreview = observer<DynamicPreviewProps>(function PPTPreview({
    taskUUID,
    taskToken,
}) {
    const DynamicPreviewRef = useRef<HTMLDivElement>(null);
    const sp = useSafePromise();

    useEffect(() => {
        try {
            getDynamicResource();
        } catch (err) {
            console.log(err);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div ref={DynamicPreviewRef} className="dynamic-preview-container" />;

    async function getDynamicResource(): Promise<void> {
        const convertState = await sp(
            queryConvertingTaskStatus({
                taskUUID,
                taskToken,
                dynamic: true,
            }),
        );

        if (DynamicPreviewRef.current) {
            previewPPT(convertState as ConversionResponse, DynamicPreviewRef.current, {});
        }
    }
});
