import * as Constant from "../constants/Constant"

export const ApiGetAllUniversity = async (search, isDesc, pageIndex, pageSize, token) => {
    const params = new URLSearchParams({search, isDesc, pageIndex, pageSize});
    const response = await fetch(`${Constant.API_GET_ALL_UNIVERSITY}?${params.toString()}`, {
        headers: Constant.HEADER_TOKEN(token),
    });
    return Constant.ResponseData(response);
}