import { CustomSingleWindow } from "./WindowManager";
import { ipc } from "flat-types";
import { app, ipcMain, powerSaveBlocker } from "electron";
import runtime from "./Runtime";
import { updateService } from "./UpdateService";

const windowActionAsync = (customWindow: CustomSingleWindow): ipc.WindowActionAsync => {
    const { window, options } = customWindow;

    return {
        "set-win-size": args => {
            // cannot use isMaximized, because after testing, under mac, the return value of this method is always false
            const isExitMaximized = window.isMaximizable() && !args.maximizable;

            // unmaximize call must precede resizable and maximizable, otherwise it will not take effect
            if (isExitMaximized) {
                window.unmaximize();
                // after exiting the maximization, it must be centered, otherwise the window will be offset to the upper left corner
                args.autoCenter = true;
            }

            window.resizable = !!args.resizable;
            window.maximizable = !!args.maximizable;

            switch (typeof args.setMinimumSize) {
                case "undefined": {
                    window.setMinimumSize(1, 1);
                    break;
                }
                case "boolean": {
                    window.setMinimumSize(args.width, args.height);
                    break;
                }
                case "object": {
                    window.setMinimumSize(
                        args.setMinimumSize.minWidth,
                        args.setMinimumSize.minHeight,
                    );
                    break;
                }
                default: {
                    break;
                }
            }

            window.setSize(args.width, args.height);

            if (args.autoCenter) {
                window.center();
            }
        },
        "disable-window": args => {
            options.disableClose = args.disable;
        },
        "set-title": args => {
            window.setTitle(args.title);
        },
        "set-prevent-sleep": args =>
            (() => {
                let powerSaveBlockerId = 0;
                return () => {
                    if (args.enable) {
                        if (!powerSaveBlocker.isStarted(powerSaveBlockerId)) {
                            powerSaveBlockerId = powerSaveBlocker.start("prevent-display-sleep");
                        }
                    } else {
                        if (powerSaveBlocker.isStarted(powerSaveBlockerId)) {
                            powerSaveBlocker.stop(powerSaveBlockerId);
                        }
                    }
                };
            })(),
        "start-update": args => {
            updateService.update(args.prereleaseTag);
        },
        "cancel-update": () => {
            updateService.cancel();
        },
    };
};

export const appActionAsync: ipc.AppActionAsync = {
    "set-open-at-login": args => {
        app.setLoginItemSettings({
            openAtLogin: args.isOpenAtLogin,
            openAsHidden: false,
        });
    },
};

export const appActionSync: ipc.AppActionSync = {
    "get-runtime": () => {
        return runtime;
    },
    "get-open-at-login": () => {
        return app.getLoginItemSettings().openAtLogin;
    },
    "get-update-info": (_event, args) => {
        return updateService.check(args.prereleaseTag).catch((err: Error) => {
            console.error(err.message);
            return {
                hasNewVersion: false,
            };
        }) as any;
    },
};

export const injectionWindowIPCAction = (customWindow: CustomSingleWindow) => {
    ipcMain.on(
        customWindow.options.name,
        (
            _event,
            args: {
                actions: keyof ipc.WindowActionAsync;
                args: any;
            },
        ) => {
            windowActionAsync(customWindow)[args.actions](args.args);
        },
    );
};
