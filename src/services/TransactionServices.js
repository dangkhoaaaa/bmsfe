import * as Constant from "../constants/Constant"

export const ApiGetTransactions = async (status, search, isDesc, pageIndex, pageSize, token) => {
    const response = await fetch(`${Constant.API_GET_ALL_TRANSACTION}?status=${status}&search=${search}&isDesc=${isDesc}&pageIndex=${pageIndex}&pageSize=${pageSize}`, {
        headers: Constant.HEADER_TOKEN(token),
    });
    return Constant.ResponseData(response);
}

export const ApiGetTotalRevenues = async (month, year, status, token) => {
    const response = await fetch(`${Constant.API_GET_TOTAL_REVENUE}?month=${month}&year=${year}&status=${status}`, {
        headers: Constant.HEADER_TOKEN(token),
    });
    return Constant.ResponseData(response);
}

export const ApiGetTop5UserPurchase = async (month, year, size, token) => {
    const response = await fetch(`${Constant.API_GET_TOP_5_USER_PURCHARSE}?month=${month}&year=${year}&pageIndex=1&pageSize=${size}`, {
        headers: Constant.HEADER_TOKEN(token),
    });
    return Constant.ResponseData(response);
}