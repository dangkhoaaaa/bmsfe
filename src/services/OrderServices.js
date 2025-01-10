import * as Constant from "../constants/Constant"

export const ApiGetOrderByShopId = async (shopId, status, search, isDesc, pageIndex, pageSize, token) => {
    const searchDefault = search ?? "";
    const statusString = (status === "All" || status === null) ? "" : `&status=${status}`
    const response = await fetch(`${Constant.API_GET_ORDER_BY_SHOP_ID}?id=${shopId}${statusString}&search=${encodeURIComponent(searchDefault)}&isDesc=${isDesc ?? true}&pageIndex=${pageIndex}&pageSize=${pageSize}`, {
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

export const ApiGetOrdersInTimeForShop = async (shopId, status, dateFrom, dateTo, isDesc, pageIndex, pageSize, token) => {
    const params = new URLSearchParams({status, dateFrom, dateTo, isDesc, pageIndex, pageSize});
    const response = await fetch(`${Constant.API_GET_ORDERS_IN_TIME_FOR_SHOP}${shopId}?${params.toString()}`, {
        headers: Constant.HEADER_TOKEN(token),
    });
    return Constant.ResponseData(response);
}

export const ApiGetListOrders = async (status, search, isDesc, pageIndex, pageSize, token) => {
    const searchDefault = search ?? "";
    const statusString = (status === "All" || status === null) ? "" : `status=${status}&`
    const response = await fetch(`${Constant.API_GET_LIST_ORDERS}?${statusString}search=${encodeURIComponent(searchDefault)}&isDesc=${isDesc ?? true}&pageIndex=${pageIndex}&pageSize=${pageSize}`, {
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

export const ApiChangeOrderStatus = async (status, orderId, token, reasonOfCancel = null) => {
    const formData = new FormData();
    formData.append("id", orderId);
    formData.append("status", status);
    if (reasonOfCancel && reasonOfCancel.trim() != '') {
        formData.append("reasonOfCancel", reasonOfCancel);
    }
    const response = await fetch(`${Constant.API_CHANGE_ORDER_STATUS}`, {
        method: "POST",
        headers: Constant.HEADER_TOKEN(token),
        body: formData
    });
    return Constant.ResponseData(response);
}

export const ApiCancelListOrders = async (orderIds, token) => {
    const response = await fetch(`${Constant.API_CANCEL_LIST_ORDERS}`, {
        method: "PUT",
        headers: Constant.HTTP_HEADER_TOKEN(token),
        body: JSON.stringify(orderIds)
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