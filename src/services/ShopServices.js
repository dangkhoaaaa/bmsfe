import * as Constant from "../constants/Constant"

export const ApiCreateShop = async (email, name, phone, address, description, image) => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("address", address);
    formData.append("phone", phone);
    formData.append("name", name);
    formData.append("description", description);
    if (image) {
        formData.append('image', image);
    }
    const response = await fetch(Constant.AIP_CREATE_SHOP, {
        method: "POST",
        body: formData,
    });
    return Constant.ResponseData(response);
}

export const ApiUpdateShop = async (shopId, image, name, phone, address, description, token) => {
    const formData = new FormData();
    formData.append("address", address);
    formData.append("phone", phone);
    formData.append("name", name);
    formData.append("description", description);
    formData.append('image', image);
    const response = await fetch(Constant.AIP_UPDATE_SHOP + shopId, {
        method: "PUT",
        headers: Constant.HEADER_TOKEN(token),
        body: formData,
    });
    return Constant.ResponseData(response);
}

export const ApiGetShopById = async (shopId, token) => {
    const response = await fetch(Constant.API_GET_SHOP_BY_ID + shopId, {
        headers: Constant.HEADER_TOKEN(token),
    });
    return Constant.ResponseData(response);
}