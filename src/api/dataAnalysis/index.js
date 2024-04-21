import request from "../../util/request";
import { getToken } from "../../util/auth";
import qs from "qs";

const token = getToken();

// 血糖分析---------------------------------
// 获取所有用户不同时段的血糖平均值
export function getChartData1(data) {
    return request({
        method: "get",
        url: "/admin/averageGlucoseLevel/list",
        headers: {
            token: token,
        },
        params: {
            periodLabels: data,
        },
        paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: "repeat" });
        },
    });
}
// 获取单个时段标签所有用户血糖值的最大，最小，1/4，3/4的血糖值
export function getChartData2(data) {
    return request({
        method: "get",
        url: "/admin/specialGlucoseLevel/list",
        headers: {
            token: token,
        },
        params: {
            periodLabel: data,
        },
    });
}
// ----------------------------------------
