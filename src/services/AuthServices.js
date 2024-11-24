import * as Constant from "../constants/Constant"

export const ApiRegisterAccount = async (data, role) => {
    const response = await fetch(`${Constant.API_REGISTER_ACCOUNT}?role=${role}`, {
        method: "POST",
        headers: Constant.HTTP_HEADER_JSON,
        body: JSON.stringify(data)
    });
    return Constant.ResponseData(response);
}

export const ApiLoginByAccount = async (data) => {
    const response = await fetch(Constant.API_LOGIN_ACCOUNT, {
        method: "POST",
        headers: Constant.HTTP_HEADER_JSON,
        body: JSON.stringify(data),
    });
    return Constant.ResponseData(response);
}
export const ApiConfirmDigitCode = async (email, digitCode) => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("oTP", digitCode);
    const response = await fetch(Constant.API_CONFIRM_DIGIT_CODE, {
        method: "POST",
        body: formData,
    });
    return Constant.ResponseData(response);
}

export const ApiSendOTP = async (email) => {
    const formData = new FormData();
    formData.append("email", email);
    const response = await fetch(Constant.API_SEND_DIGIT_CODE, {
        method: "POST",
        body: formData,
    });
    return Constant.ResponseData(response);
}

export const ApiChangePassword = async (email, newPassword) => {
    if (Constant.ENABLE_DEBUG_CHANGE_PASSWORD) {
        return {
            ok: true,
            message: "Data transaction success",
        };
    } else {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("newPassword", newPassword);
        const response = await fetch(Constant.API_CHANGE_PASSWORD, {
            method: "PUT",
            body: formData,
        });
        return Constant.ResponseData(response);
    }
}

export const ApiResetPassword = async (email, newPassword) => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("newPassword", newPassword);
    formData.append("confirmPassword", newPassword);
    const response = await fetch(Constant.API_RESET_PASSWORD, {
        method: "PUT",
        body: formData,
    });
    return Constant.ResponseData(response);
}