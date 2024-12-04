import * as Constant from "../constants/Constant"
export const ApiGetNotiForShop = async (shopId, pageIndex, pageSize, status, token) => {
    const params = new URLSearchParams({
        shopId,
        pageIndex,
        pageSize,
        ...(status && { status }) 
    });
    const response = await fetch(`${Constant.API_GET_NOTI_FOR_SHOP}?${params.toString()}`, {
        headers: Constant.HEADER_TOKEN(token),
    });
    return Constant.ResponseData(response);
}
export const ApiCountUnreadForShop = async (shopId, token) => {
    const params = new URLSearchParams({shopId});
    const response = await fetch(`${Constant.API_COUNT_UNREAD_FOR_SHO}?${params.toString()}`, {
        headers: Constant.HEADER_TOKEN(token),
    });
    return Constant.ResponseData(response);
}
export const ApiReadAllNotiForShop = async (shopId, token) => {
    const params = new URLSearchParams({shopId});
    const response = await fetch(`${Constant.API_READ_ALL_NOTI_FOR_SHOP}?${params.toString()}`, {
        method: 'PUT',
        headers: Constant.HEADER_TOKEN(token),
    });
    return Constant.ResponseData(response);
}