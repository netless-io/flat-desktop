export enum RouteNameType {
    LoginPage = "LoginPage",
    HomePage = "HomePage",
    BigClassPage = "BigClassPage",
    SmallClassPage = "SmallClassPage",
    OneToOnePage = "OneToOnePage",
    UserScheduledPage = "UserScheduledPage",
    RoomDetailPage = "RoomDetailPage",
    PeriodicRoomDetailPage = "PeriodicRoomDetailPage",
    ReplayPage = "ReplayPage",
    ModifyOrdinaryRoomPage = "ModifyOrdinaryRoomPage",
    ModifyPeriodicRoomPage = "ModifyPeriodicRoomPage",
    SystemCheckPage = "SystemCheckPage",
    GeneralSettingPage = "GeneralSettingPage",
    HotKeySettingPage = "HotKeySettingPage",
    AboutPage = "AboutPage",
    CloudStoragePage = "CloudStoragePage",
    JoinPage = "JoinPage",
    ResourcePreviewPage = "ResourcePreviewPage",
}

export const routeConfig = {
    [RouteNameType.LoginPage]: {
        path: "/login",
    },
    [RouteNameType.HomePage]: {
        path: "/",
    },
    [RouteNameType.SmallClassPage]: {
        path: "/classroom/SmallClass/:roomUUID/:ownerUUID/",
    },
    [RouteNameType.OneToOnePage]: {
        path: "/classroom/OneToOne/:roomUUID/:ownerUUID/",
    },
    [RouteNameType.BigClassPage]: {
        path: "/classroom/BigClass/:roomUUID/:ownerUUID/",
    },
    [RouteNameType.UserScheduledPage]: {
        path: "/user/scheduled/",
    },
    [RouteNameType.RoomDetailPage]: {
        path: "/user/room/:roomUUID/:periodicUUID?/",
    },
    [RouteNameType.PeriodicRoomDetailPage]: {
        path: "/user/periodic/info/:periodicUUID",
    },
    [RouteNameType.ReplayPage]: {
        path: "/replay/:roomType/:roomUUID/:ownerUUID/",
    },
    [RouteNameType.ModifyOrdinaryRoomPage]: {
        path: "/modify/:roomUUID/:periodicUUID?/",
    },
    [RouteNameType.ModifyPeriodicRoomPage]: {
        path: "/modify/periodic/room/:periodicUUID/",
    },
    [RouteNameType.SystemCheckPage]: {
        path: "/device/system/",
    },
    [RouteNameType.GeneralSettingPage]: {
        path: "/general-settings/",
    },
    [RouteNameType.HotKeySettingPage]: {
        path: "/hotkey/",
    },
    [RouteNameType.AboutPage]: {
        path: "/about/",
    },
    [RouteNameType.CloudStoragePage]: {
        path: "/pan/",
    },
    [RouteNameType.BigClassPage]: {
        path: "/classroom/BigClass/:roomUUID/:ownerUUID/",
    },
    [RouteNameType.SmallClassPage]: {
        path: "/classroom/SmallClass/:roomUUID/:ownerUUID/",
    },
    [RouteNameType.OneToOnePage]: {
        path: "/classroom/OneToOne/:roomUUID/:ownerUUID/",
    },
    [RouteNameType.ReplayPage]: {
        path: "/replay/:roomType/:roomUUID/:ownerUUID/",
    },
    [RouteNameType.JoinPage]: {
        path: "/join/:roomUUID/",
    },
    [RouteNameType.ResourcePreviewPage]: {
        path: "/preview/:fileURL/:taskToken?/:taskUUID?/",
    },
} as const;

export type ExtraRouteConfig = {};

type CheckRouteConfig<
    T extends {
        [name in RouteNameType]: {
            path: string;
        };
    },
> = T;

export type RouteConfig = CheckRouteConfig<typeof routeConfig>;
