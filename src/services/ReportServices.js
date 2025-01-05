import * as Constant from "../constants/Constant"

export const ApiGetReportsForShop = async (month, year, isDesc, shopId, pageIndex, pageSize, token) => {
    const params = new URLSearchParams({month, year, isDesc, shopId, pageIndex, pageSize});
    const response = await fetch(`${Constant.API_GET_REPORT_FOR_SHOP}?${params.toString()}`, {
        headers: Constant.HEADER_TOKEN(token),
    });
    return Constant.ResponseData(response);
}
