import "./StaticPreview.less";

import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { queryConvertingTaskStatus } from "../../apiMiddleware/courseware-converting";
import { useSafePromise } from "../../utils/hooks/lifecycle";

export interface StaticPreviewProps {
    taskUUID: string;
    taskToken: string;
}

type ConvertedFileList =
    | {
          width: number;
          height: number;
          conversionFileUrl: string;
          preview?: string | undefined;
      }[]
    | undefined;

export const StaticPreview = observer<StaticPreviewProps>(function DocumentPreview({
    taskUUID,
    taskToken,
}) {
    const [convertList, setConvertList] = useState<ConvertedFileList>([]);
    const sp = useSafePromise();

    useEffect(() => {
        try {
            getStaticResource();
        } catch (err) {
            console.log(err);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="static-preview-container fancy-scrollbar">
            <div className="static-preview-list">
                {convertList?.map(file => {
                    return (
                        <img
                            className="static-preview-item"
                            src={file.conversionFileUrl}
                            key={file.conversionFileUrl}
                        ></img>
                    );
                })}
            </div>
        </div>
    );

    async function getStaticResource(): Promise<void> {
        const convertResult = await sp(
            queryConvertingTaskStatus({
                taskUUID,
                taskToken,
                dynamic: false,
            }),
        );

        setConvertList(convertResult.progress?.convertedFileList);
    }
});
