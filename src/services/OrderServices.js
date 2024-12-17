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

export const ApiGetListOrders = async (status, search, isDesc, pageIndex, pageSize, token) => {
    const statusDefault = status ?? "ORDERED";
    const searchDefault = search ?? "";
    const response = await fetch(`${Constant.API_GET_LIST_ORDERS}?status=${statusDefault}&search=${encodeURIComponent(searchDefault)}&isDesc=${isDesc ?? true}&pageIndex=${pageIndex}&pageSize=${pageSize}`, {
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

export const ApiChangeOrderStatus = async (status, orderId, token) => {
    const formData = new FormData();
    formData.append("id", orderId);
    formData.append("status", status);
    const response = await fetch(`${Constant.API_CHANGE_ORDER_STATUS}`, {
        method: "POST",
        headers: Constant.HEADER_TOKEN(token),
        body: formData
    });
    return Constant.ResponseData(response);
}

export const ApiGetTotalOrders = async (month, year, status, token) => {
    const response = await fetch(`${Constant.API_GET_TOTAL_ORDERS}?month=${month}&year=${year}&status=${status}`, {
        headers: Constant.HEADER_TOKEN(token),
    });
    return Constant.ResponseData(response);
}

export const ApiGetTotalOrdersInShop = async (shopId, month, year, status, token) => {
    const response = await fetch(`${Constant.API_GET_TOTAL_ORDERS_IN_SHOP}${shopId}?month=${month}&year=${year}&status=${status}`, {
        headers: Constant.HEADER_TOKEN(token),
    });
    return Constant.ResponseData(response);
}