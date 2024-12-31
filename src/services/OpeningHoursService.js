import * as Constant from "../constants/Constant"

export const ApiGetOperationHoursForShop = async (shopId, token) => {
    const params = new URLSearchParams({shopId});
    const response = await fetch(`${Constant.API_GET_OPERATION_HOURS_FOR_SHOP}?${params.toString()}`, {
        headers: Constant.HEADER_TOKEN(token),
    });
    return Constant.ResponseData(response);
}

export const ApiUpdateOperationHours = async (shopId, listOpeningHours, token) => {
    const jsonRequest = {
        shopId,
        listOpeningHours,
    }
    const response = await fetch(`${Constant.API_UPDATE_OPERATION_HOURS_FOR_SHOP}`, {
        method: "PUT",
        headers: Constant.HTTP_HEADER_TOKEN(token),
        body: JSON.stringify(jsonRequest)
    });
    return Constant.ResponseData(response);
}

