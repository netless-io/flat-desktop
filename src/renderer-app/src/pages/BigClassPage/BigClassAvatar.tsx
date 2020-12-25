import React from "react";
import classNames from "classnames";
import {
    VideoAvatar,
    VideoAvatarProps,
    VideoAvatarState,
    VideoType,
} from "../../components/VideoAvatar";

import noCamera from "../../assets/image/no-camera.svg";
import camera from "../../assets/image/camera.svg";
import cameraDisabled from "../../assets/image/camera-disabled.svg";
import microphone from "../../assets/image/microphone.svg";
import microphoneDisabled from "../../assets/image/microphone-disabled.svg";
import videoExpand from "../../assets/image/video-expand.svg";

import "./BigClassAvatar.less";

export { VideoType } from "../../components/VideoAvatar";

export interface BigClassAvatarProps extends VideoAvatarProps {
    small?: boolean;
    onExpand?: () => void;
}

export type BigClassAvatarState = VideoAvatarState;

export class BigClassAvatar extends VideoAvatar<BigClassAvatarProps, BigClassAvatarState> {
    state: BigClassAvatarState = {
        isVideoOn: this.props.type === VideoType.remote,
        isAudioOn: true,
    };

    render(): React.ReactNode {
        const { uid, small, onExpand, type } = this.props;
        const { isVideoOn, isAudioOn } = this.state;
        return (
            <section className={classNames("video-avatar-wrap", { "is-small": small })}>
                <div className="video-avatar" ref={this.setupVideo}></div>
                {!isVideoOn && (
                    <div className="video-avatar-background">
                        <img src={noCamera} alt="no camera" />
                    </div>
                )}
                <div
                    className={classNames("video-avatar-ctrl-layer", {
                        "with-video": isVideoOn,
                    })}
                >
                    {small ? (
                        <button className="video-avatar-expand" onClick={onExpand}>
                            <img src={videoExpand} alt="expand" />
                        </button>
                    ) : (
                        <>
                            <h1 className="video-avatar-title">{uid}</h1>
                            {type === VideoType.local && (
                                <div className="video-avatar-btns">
                                    <button onClick={this.toggleVideo}>
                                        <img
                                            src={isVideoOn ? camera : cameraDisabled}
                                            alt="camera"
                                        />
                                    </button>
                                    <button onClick={this.toggleAudio}>
                                        <img
                                            src={isAudioOn ? microphone : microphoneDisabled}
                                            alt="microphone"
                                        />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        );
    }
}

export default BigClassAvatar;