import * as Constant from "../constants/Constant"

export const ApiGetTotalNewUser = async (month, year, status, token) => {
    const response = await fetch(`${Constant.API_GET_TOTAL_NEW_USER}?month=${month}&year=${year}&status=${status}`, {
        headers: Constant.HEADER_TOKEN(token),
    });
    return Constant.ResponseData(response);
}