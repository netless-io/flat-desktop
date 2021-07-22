import { ComponentType } from "react";
import { RouteNameType } from "../route-config";

export type RoutePages = {
    readonly [key in RouteNameType]: {
        readonly title: string;
        readonly hasHeader?: true;
        readonly component: () => Promise<{ default: ComponentType<any> }>;
    };
};

/**
 * NOTE: If you see error from "loadable-component", the real error
 *       message may be hidden by `import()` below. You can change
 *       `import("../pages/SomePage")` to
 *       `Promise.resolve({ default: SomePage })` to see the real error.
 */
export const routePages: RoutePages = {
    [RouteNameType.LoginPage]: {
        title: "LoginPage",
        component: () => import("../pages/LoginPage"),
    },
    [RouteNameType.HomePage]: {
        title: "HomePage",
        hasHeader: true,
        component: () => import("../pages/HomePage"),
    },
    [RouteNameType.BigClassPage]: {
        title: "BigClassPage",
        component: () => import("../pages/BigClassPage"),
    },
    [RouteNameType.SmallClassPage]: {
        title: "SmallClassPage",
        component: () => import("../pages/SmallClassPage"),
    },
    [RouteNameType.OneToOnePage]: {
        title: "OneToOnePage",
        component: () => import("../pages/OneToOnePage"),
    },
    [RouteNameType.RoomDetailPage]: {
        title: "RoomDetailPage",
        hasHeader: true,
        component: () => import("../pages/RoomDetailPage"),
    },
    [RouteNameType.PeriodicRoomDetailPage]: {
        title: "PeriodicRoomDetailPage",
        hasHeader: true,
        component: () => import("../pages/PeriodicRoomDetailPage"),
    },
    [RouteNameType.UserScheduledPage]: {
        title: "UserScheduledPage",
        hasHeader: true,
        component: () => import("../pages/UserScheduledPage"),
    },
    [RouteNameType.ModifyOrdinaryRoomPage]: {
        title: "ModifyOrdinaryRoomPage",
        hasHeader: true,
        component: () => import("../pages/ModifyOrdinaryRoomPage"),
    },
    [RouteNameType.ModifyPeriodicRoomPage]: {
        title: "ModifyPeriodicRoomPage",
        hasHeader: true,
        component: () => import("../pages/ModifyPeriodicRoomPage"),
    },
    [RouteNameType.ReplayPage]: {
        title: "ReplayPage",
        component: () => import("../pages/ReplayPage"),
    },
    [RouteNameType.SystemCheckPage]: {
        title: "SystemCheckPage",
        hasHeader: true,
        component: () => Promise.resolve({ default: () => null }),
    },
    [RouteNameType.GeneralSettingPage]: {
        title: "GeneralSettingPage",
        hasHeader: true,
        component: () => import("../pages/UserSettingPage/GeneralSettingPage"),
    },
    [RouteNameType.HotKeySettingPage]: {
        title: "HotKeySettingPage",
        hasHeader: true,
        component: () => import("../pages/UserSettingPage/HotKeySettingPage"),
    },
    [RouteNameType.AboutPage]: {
        title: "AboutPage",
        hasHeader: true,
        component: () => import("../pages/UserSettingPage/AboutPage"),
    },
    [RouteNameType.CloudStoragePage]: {
        title: "CloudStoragePage",
        hasHeader: true,
        component: () => import("../pages/CloudStoragePage"),
    },
    [RouteNameType.JoinPage]: {
        title: "JoinPage",
        component: () => import("../pages/JoinPage"),
    },
    [RouteNameType.ResourcePreviewPage]: {
        title: "ResourcePreviewPage",
        component: () => import("../pages/ResourcePreviewPage"),
    },
};
