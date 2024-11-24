import * as Constant from "../constants/Constant"

export const ApiGetProfile = async (token) => {
    const response = await fetch(Constant.API_GET_MY_PROFILE, {
        headers: Constant.HTTP_HEADER_TOKEN(token),
    });
    return Constant.ResponseData(response);
}