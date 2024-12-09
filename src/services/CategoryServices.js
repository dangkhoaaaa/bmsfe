import * as Constant from "../constants/Constant"
export const ApiGetAllCategory = async (search, isDesc, pageIndex, pageSize, token) => {
    const params = new URLSearchParams({search, isDesc, pageIndex, pageSize});
    const response = await fetch(`${Constant.API_GET_CATEGORIES}?${params.toString()}`, {
        headers: Constant.HEADER_TOKEN(token),
    });
    return Constant.ResponseData(response);
}
export const ApiGetCategoriesByProductId = async (productId, search, isDesc, pageIndex, pageSize, token) => {
    const params = new URLSearchParams({productId, search, isDesc, pageIndex, pageSize});
    const response = await fetch(`${Constant.API_GET_CATEGORIES_BY_PRODUCT_ID}?${params.toString()}`, {
        headers: Constant.HEADER_TOKEN(token),
    });
    return Constant.ResponseData(response);
}
export const ApiRegisterProductToCategory = async (productId, categoryId, token) => {
    const response = await fetch(`${Constant.API_REGISTER_PRODUCT_TO_CATEGORY}`, {
        method: 'POST',
        headers: Constant.HTTP_HEADER_TOKEN(token),
        body: JSON.stringify({productId, categoryId})
    });
    return Constant.ResponseData(response);
}
export const ApiRemoveProductToCategory = async (productId, categoryId, token) => {
    const params = new URLSearchParams({productId, categoryId});
    const response = await fetch(`${Constant.API_REMOVE_PRODUCT_FROM_CATEGORY}`, {
        method: 'DELETE',
        headers: Constant.HTTP_HEADER_TOKEN(token),
        body: JSON.stringify({productId, categoryId})
    });
    return Constant.ResponseData(response);
}