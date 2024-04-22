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

// 饮食分析---------------------------------
// 获取所有用户对每种食物类型的选择次数
export function getChartData21() {
    return request({
        method: "get",
        url: "/admin/customer/foodType/num",
        headers: {
            token: token,
        },
    });
}
// 获取每个用户每个时段获取的营养质量
export function getChartData22() {
    return request({
        method: "get",
        url: "/admin/customer/averageNutrition",
        headers: {
            token: token,
        },
    });
}
// 获取所有食物数据
export function getChartData23() {
    return request({
        method: "get",
        url: "/food/list/name",
        headers: {
            token: token,
        },
        params: {
            name: "",
        },
    });
}
// ----------------------------------------
// 运动分析---------------------------------
// 获取所有客户每天的平均运动时长和运动消耗
export function getChartData31() {
    return request({
        method: "get",
        url: "/admin/sport/record/list/average",
        headers: {
            token: token,
        },
    });
}
// ----------------------------------------
