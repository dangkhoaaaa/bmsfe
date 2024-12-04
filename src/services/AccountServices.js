import * as Constant from "../constants/Constant"

export const ApiGetProfile = async (token) => {
    const response = await fetch(Constant.API_GET_MY_PROFILE, {
        headers: Constant.HTTP_HEADER_TOKEN(token),
    });
    return Constant.ResponseData(response);
}
export const ApiUpdateAccount = async (firstName, lastName, phone, token) => {
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('phone', phone);
    const response = await fetch(Constant.API_UPDATE_ACCOUNT, {
        method: 'PUT',
        headers: Constant.HEADER_TOKEN(token),
        body: formData,
    });
    return Constant.ResponseData(response);
}
export const ApiUpdateAvatar = async (selectedFile, token) => {
    const formData = new FormData();
    if (selectedFile) {
        formData.append('request', selectedFile);
    }
    const response = await fetch(Constant.API_UPDATE_AVATAR, {
        method: 'PUT',
        headers: Constant.HEADER_TOKEN(token),
        body: formData,
    });
    return Constant.ResponseData(response);
}