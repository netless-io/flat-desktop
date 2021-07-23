import "./style.less";
import cnSVG from "./icons/cn.svg";
import inSVG from "./icons/in.svg";
import gbSVG from "./icons/gb.svg";
import usSVG from "./icons/us.svg";
import sgSVG from "./icons/sg.svg";

import { Button, Checkbox, Dropdown, Form, Input, Menu, Modal } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { addWeeks, endOfDay, getDay } from "date-fns";
import React, { useMemo, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PeriodicEndType, RoomType, Week } from "../../../types/room";
import { renderBeginTimePicker } from "./renderBeginTimePicker";
import { renderEndTimePicker } from "./renderEndTimePicker";
import { renderPeriodicForm } from "./renderPeriodicForm";
import { ClassPicker } from "../../HomePage/ClassPicker";

export enum Region {
    CN_HZ = "cn-hz",
    US_SV = "us-sv",
    SG = "sg",
    IN_MUM = "in-mum",
    GB_LON = "gb-lon",
}

export const regions: Region[] = [
    Region.CN_HZ,
    Region.IN_MUM,
    Region.GB_LON,
    Region.US_SV,
    Region.SG,
];

export const RegionSVG: Record<Region, string> = {
    [Region.CN_HZ]: cnSVG,
    [Region.IN_MUM]: inSVG,
    [Region.GB_LON]: gbSVG,
    [Region.US_SV]: usSVG,
    [Region.SG]: sgSVG,
};

export interface EditRoomFormValues {
    title: string;
    type: RoomType;
    isPeriodic: boolean;
    beginTime: Date;
    endTime: Date;
    region: Region;
    periodic: {
        endType: PeriodicEndType;
        weeks: Week[];
        rate: number;
        endTime: Date;
    };
}

export type EditRoomFormInitialValues =
    | ({ isPeriodic: true } & Omit<EditRoomFormValues, "isPeriodic">)
    | ({ isPeriodic: false } & Omit<EditRoomFormValues, "periodic" | "isPeriodic">);

export type EditRoomType = "schedule" | "ordinary" | "periodic" | "periodicSub";

export interface EditRoomBodyProps {
    type: EditRoomType;
    initialValues: EditRoomFormInitialValues;
    loading: boolean;
    onSubmit: (value: EditRoomFormValues) => void;
    previousPeriodicRoomBeginTime?: number | null;
    nextPeriodicRoomEndTime?: number | null;
}

export const EditRoomBody: React.FC<EditRoomBodyProps> = ({
    type,
    initialValues,
    loading,
    onSubmit,
    previousPeriodicRoomBeginTime,
    nextPeriodicRoomEndTime,
}) => {
    const history = useHistory();

    const [isFormVetted, setIsFormVetted] = useState(true);
    const [isShowEditSubmitConfirm, showEditSubmitConfirm] = useState(false);
    const [region, setRegion] = useState<Region>(initialValues.region);
    const { t, i18n } = useTranslation<string>();

    const hasInputAutoSelectedRef = useRef(false);

    const [form] = Form.useForm<EditRoomFormValues>();

    const defaultValues = useMemo<EditRoomFormValues>(() => {
        return {
            periodic: {
                endType: "rate",
                weeks: [getDay(initialValues.beginTime)],
                rate: 7,
                endTime: addWeeks(initialValues.beginTime, 6),
            },
            ...initialValues,
        };
    }, [initialValues]);

    const regionMenu = (
        <Menu
            className="edit-room-body-menu-item"
            style={{ width: "auto" }}
            onClick={e => setRegion(e.key as Region)}
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
            <div className="edit-room-body fancy-scrollbar">
                <div className="edit-room-mid">
                    <Form
                        form={form}
                        layout="vertical"
                        name="createRoom"
                        initialValues={defaultValues}
                        className="edit-room-form"
                        onFieldsChange={formValidateStatus}
                    >
                        <Form.Item
                            label={t("theme")}
                            name="title"
                            required={false}
                            rules={[
                                { required: true, message: t("enter-room-theme") },
                                { max: 50, message: t("theme-can-be-up-to-50-characters") },
                            ]}
                        >
                            <Input
                                placeholder={t("enter-room-theme")}
                                disabled={type === "periodicSub"}
                                ref={input => {
                                    if (!input) {
                                        return;
                                    }
                                    // select text on next cycle so that
                                    // dom is always ready
                                    setTimeout(() => {
                                        if (hasInputAutoSelectedRef.current) {
                                            return;
                                        }
                                        if (input) {
                                            input.focus();
                                            input.select();
                                            hasInputAutoSelectedRef.current = true;
                                        }
                                    }, 0);
                                }}
                                suffix={
                                    <Dropdown
                                        trigger={["click"]}
                                        overlay={regionMenu}
                                        placement="bottomRight"
                                    >
                                        <img
                                            src={RegionSVG[region]}
                                            alt={region}
                                            style={{ cursor: "pointer", width: 22 }}
                                        />
                                    </Dropdown>
                                }
                            />
                        </Form.Item>
                        <Form.Item label={t("type")} name="type">
                            <ClassPicker large={true} disabled={type === "periodicSub"} />
                        </Form.Item>
                        {renderBeginTimePicker(
                            t,
                            form,
                            previousPeriodicRoomBeginTime,
                            nextPeriodicRoomEndTime,
                        )}
                        {renderEndTimePicker(t, form, nextPeriodicRoomEndTime)}
                        {type === "schedule" ? (
                            <Form.Item name="isPeriodic" valuePropName="checked">
                                <Checkbox onChange={onToggleIsPeriodic}>
                                    <span className="edit-room-cycle">{t("periodic-room")}</span>
                                </Checkbox>
                            </Form.Item>
                        ) : (
                            type === "periodic" && (
                                <div className="ant-form-item-label edit-room-form-label">
                                    {t("periodic-room")}
                                </div>
                            )
                        )}
                        <Form.Item
                            noStyle
                            shouldUpdate={(prev: EditRoomFormValues, curr: EditRoomFormValues) =>
                                prev.isPeriodic !== curr.isPeriodic
                            }
                        >
                            {renderPeriodicForm(t, i18n.language)}
                        </Form.Item>
                    </Form>
                    <div className="edit-room-under">
                        <Button className="edit-room-cancel" onClick={onCancelForm}>
                            {t("cancel")}
                        </Button>
                        <Button
                            className="edit-room-ok"
                            onClick={async () => {
                                if (!form.isFieldsTouched() && type !== "schedule") {
                                    history.goBack();
                                } else {
                                    await form.validateFields();
                                    if (!loading && isFormVetted) {
                                        if (type === "schedule") {
                                            onSubmitForm();
                                        } else {
                                            showEditSubmitConfirm(true);
                                        }
                                    }
                                }
                            }}
                            loading={loading}
                            disabled={!loading && !isFormVetted}
                        >
                            {type === "schedule" ? t("schedule") : t("modify")}
                        </Button>
                    </div>
                </div>
            </div>
            {type !== "schedule" && (
                <Modal
                    visible={isShowEditSubmitConfirm}
                    title={renderModalTitle(type)}
                    onCancel={hideEditSubmitConfirm}
                    onOk={onSubmitForm}
                    footer={[
                        <Button key="Cancel" onClick={hideEditSubmitConfirm}>
                            {t("cancel")}
                        </Button>,
                        <Button
                            key="Ok"
                            type="primary"
                            loading={loading}
                            disabled={!loading && !isFormVetted}
                            onClick={onSubmitForm}
                        >
                            {t("confirm")}
                        </Button>,
                    ]}
                >
                    {renderModalContent(type)}
                </Modal>
            )}
        </>
    );

    function renderModalTitle(editRoomType: EditRoomType): string {
        switch (editRoomType) {
            case "ordinary": {
                return t("modify-room");
            }
            case "periodicSub": {
                return t("modify-this-room");
            }
            case "periodic": {
                return t("modify-periodic-rooms");
            }
            default: {
                return t("modify-room");
            }
        }
    }

    function renderModalContent(editRoomType: EditRoomType): string {
        switch (editRoomType) {
            case "ordinary": {
                return t("make-sure-to-modify-room");
            }
            case "periodicSub": {
                return t("make-sure-to-modify-this-room");
            }
            case "periodic": {
                return t("make-sure-to-modify-the-series-of-periodic-rooms");
            }
            default: {
                return t("make-sure-to-modify-room");
            }
        }
    }

    function onToggleIsPeriodic(e: CheckboxChangeEvent): void {
        if (e.target.checked) {
            const today: EditRoomFormValues["beginTime"] = form.getFieldValue("beginTime");
            form.setFieldsValue({
                periodic: {
                    weeks: [getDay(today)],
                    rate: 7,
                    endTime: endOfDay(addWeeks(today, 6)),
                },
            });
        }
    }

    function onSubmitForm(): void {
        if (!loading && isFormVetted) {
            onSubmit({ ...form.getFieldsValue(true), region });
        }
    }

    function onCancelForm(): void {
        if (form.isFieldsTouched()) {
            Modal.confirm({
                content: t("back-tips"),
                onOk() {
                    history.goBack();
                },
            });
        } else {
            history.goBack();
        }
    }

    function hideEditSubmitConfirm(): void {
        showEditSubmitConfirm(false);
    }

    function formValidateStatus(): void {
        setIsFormVetted(form.getFieldsError().every(field => field.errors.length <= 0));
    }
};
