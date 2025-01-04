import * as Constant from "../constants/Constant"
export const ApiGetStudentListConfirm = async (search, isDesc, pageIndex, pageSize, token) => {
    const params = new URLSearchParams({search, isDesc, pageIndex, pageSize});
    const response = await fetch(`${Constant.API_GET_STUDENT_CONFIRM_LIST}?${params.toString()}`, {
        headers: Constant.HEADER_TOKEN(token),
    });
    return Constant.ResponseData(response);
}

export const ApiChangeStatusStudent = async (id, statusStudent, message, token) => {
    const response = await fetch(`${Constant.API_CHANGE_STATUS_STUDENT}${id}`, {
        method: 'PUT',
        headers: Constant.HTTP_HEADER_TOKEN(token),
        body: JSON.stringify({
            id,
            statusStudent,
            message,
        })
    });
    return Constant.ResponseData(response);
}