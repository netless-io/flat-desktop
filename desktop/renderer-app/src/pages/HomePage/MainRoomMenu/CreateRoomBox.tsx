import createSVG from "../../../assets/image/creat.svg";
import "./CreateRoomBox.less";

import React, { useContext, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { Button, Input, Modal, Checkbox, Form, Menu, Dropdown } from "antd";
import { RoomType } from "../../../apiMiddleware/flatServer/constants";
import { ConfigStoreContext, GlobalStoreContext } from "../../../components/StoreProvider";
import { useSafePromise } from "../../../utils/hooks/lifecycle";
import { ClassPicker, Region, regions, RegionSVG } from "flat-components";
import { useTranslation } from "react-i18next";

interface CreateRoomFormValues {
    roomTitle: string;
    roomType: RoomType;
    autoCameraOn: boolean;
}

export interface CreateRoomBoxProps {
    onCreateRoom: (title: string, type: RoomType, region: Region) => Promise<void>;
}

export const CreateRoomBox = observer<CreateRoomBoxProps>(function CreateRoomBox({ onCreateRoom }) {
    const { t } = useTranslation();
    const sp = useSafePromise();
    const globalStore = useContext(GlobalStoreContext);
    const configStore = useContext(ConfigStoreContext);
    const [form] = Form.useForm<CreateRoomFormValues>();

    const [isLoading, setLoading] = useState(false);
    const [isShowModal, showModal] = useState(false);
    const [isFormValidated, setIsFormValidated] = useState(false);
    const [classType, setClassType] = useState<RoomType>(RoomType.BigClass);
    const [roomRegion, setRoomRegion] = useState<Region>(configStore.getRegion());
    const roomTitleInputRef = useRef<Input>(null);

    const defaultValues: CreateRoomFormValues = {
        roomTitle: globalStore.userInfo?.name
            ? t("create-room-default-title", { name: globalStore.userInfo.name })
            : "",
        roomType: RoomType.BigClass,
        autoCameraOn: configStore.autoCameraOn,
    };

    useEffect(() => {
        let ticket = NaN;
        if (isShowModal) {
            // wait a cycle till antd modal updated
            ticket = window.setTimeout(() => {
                if (roomTitleInputRef.current) {
                    roomTitleInputRef.current.focus();
                    roomTitleInputRef.current.select();
                }
            }, 0);
        }
        return () => {
            window.clearTimeout(ticket);
        };
    }, [isShowModal]);

    const regionMenu = (
        <Menu
            className="create-room-modal-menu-item"
            style={{ width: "auto" }}
            onClick={e => setRoomRegion(e.key as Region)}
        >
            <div style={{ padding: "4px 12px 0 14px", color: "gray" }}>{t("servers")}</div>
            {regions.map(region => (
                <Menu.Item key={region}>
                    <img src={RegionSVG[region]} alt={region} style={{ width: 22 }} />
                    <span style={{ paddingLeft: 8 }}>{t(`region-${region}`)}</span>
                </Menu.Item>
            ))}
        </Menu>
    );

    return (
        <>
            <Button
                onClick={() => {
                    form.setFieldsValue(defaultValues);
                    showModal(true);
                    formValidateStatus();
                }}
            >
                <img src={createSVG} alt="create room" />
                <span className="label">{t("home-page-hero-button-type.create")}</span>
            </Button>
            <Modal
                wrapClassName="create-room-box-container"
                title={t("home-page-hero-button-type.create")}
                width={400}
                visible={isShowModal}
                destroyOnClose
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        {t("cancel")}
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={isLoading}
                        onClick={handleOk}
                        disabled={!isFormValidated}
                    >
                        {t("create")}
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="createRoom"
                    className="main-room-menu-form"
                    initialValues={defaultValues}
                    onFieldsChange={formValidateStatus}
                >
                    <Form.Item
                        name="roomTitle"
                        label={t("theme")}
                        rules={[
                            { required: true, message: t("enter-room-theme") },
                            { max: 50, message: t("theme-can-be-up-to-50-characters") },
                        ]}
                    >
                        <Input
                            placeholder={t("enter-room-theme")}
                            ref={roomTitleInputRef}
                            suffix={
                                <Dropdown
                                    trigger={["click"]}
                                    overlay={regionMenu}
                                    placement="bottomRight"
                                >
                                    <img
                                        src={RegionSVG[roomRegion]}
                                        alt={roomRegion}
                                        style={{ cursor: "pointer", width: 22 }}
                                    />
                                </Dropdown>
                            }
                        />
                    </Form.Item>
                    <Form.Item name="roomType" label={t("type")} valuePropName="type">
                        <ClassPicker value={classType} onChange={e => setClassType(RoomType[e])} />
                    </Form.Item>
                    <Form.Item label={t("join-options")}>
                        <Form.Item name="autoCameraOn" noStyle valuePropName="checked">
                            <Checkbox>{t("turn-on-the-camera")}</Checkbox>
                        </Form.Item>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );

    async function handleOk(): Promise<void> {
        try {
            await sp(form.validateFields());
        } catch (e) {
            // errors are showed on form
            return;
        }

        setLoading(true);

        try {
            const values = form.getFieldsValue();
            configStore.updateAutoCameraOn(values.autoCameraOn);
            await sp(onCreateRoom(values.roomTitle, values.roomType, roomRegion));
            setLoading(false);
            showModal(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    }

    function handleCancel(): void {
        showModal(false);
    }

    function formValidateStatus(): void {
        setIsFormValidated(form.getFieldsError().every(field => field.errors.length <= 0));
    }
});

export default CreateRoomBox;
