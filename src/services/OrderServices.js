import * as Constant from "../constants/Constant"

export const ApiGetOrderByShopId = async (shopId, status, search, isDesc, pageIndex, pageSize, token) => {
    const statusDefault = status ?? "ORDERED";
    const searchDefault = search ?? "";
    const response = await fetch(`${Constant.API_GET_ORDER_BY_SHOP_ID}?id=${shopId}&status=${statusDefault}&search=${encodeURIComponent(searchDefault)}&isDesc=${isDesc ?? true}&pageIndex=${pageIndex}&pageSize=${pageSize}`, {
        headers: Constant.HEADER_TOKEN(token),
    });
    return Constant.ResponseData(response);
}

export const ApiGetOrderById = async (orderId, token) => {
    const response = await fetch(`${Constant.API_GET_ORDER_BY_ID}${orderId}`, {
        headers: Constant.HEADER_TOKEN(token),
    });
    return Constant.ResponseData(response);
}

export const ApiUpdateOrderStatus = async (status, orderId, token) => {
    const response = await fetch(`${Constant.API_UPDATE_ORDER_STATUS}${orderId}?status=${status}`, {
        method: "PUT",
        headers: Constant.HEADER_TOKEN(token),
    });
    return Constant.ResponseData(response);
}

export const ApiGetTotalOrders = async (month, year, status, token) => {
    const response = await fetch(`${Constant.API_GET_TOTAL_ORDERS}?month=${month}&year=${year}&status=${status}`, {
        headers: Constant.HEADER_TOKEN(token),
    });
    return Constant.ResponseData(response);
}