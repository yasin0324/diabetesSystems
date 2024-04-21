import request from "../../util/request";
import { getToken } from "../../util/auth";

const token = getToken();

// 食物管理---------------------------------
// 查询所有食物
export function getAllFood() {
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
// 分页查询食物
export function getFoodInfo(data) {
    return request({
        method: "get",
        url: "/admin/food/pageQuery",
        headers: {
            token: token,
        },
        params: {
            type: data.type,
            name: data.name,
            pass: data.pass,
            page: data.page,
            pageSize: data.pageSize,
        },
    });
}
// 添加食物表数据
export function addFoodInfo(data) {
    return request({
        method: "post",
        url: "/food/save",
        headers: {
            token: token,
        },
        data: {
            name: data.name,
            picture: data.picture,
            type: data.type,
            GI: data.GI,
            GL: data.GL,
            glucose: data.glucose,
            heat: data.heat,
            protein: data.protein,
            fat: data.fat,
            carbohydrate: data.carbohydrate,
        },
    });
}
// 修改食物信息
export function updateFoodInfo(data) {
    return request({
        method: "put",
        url: "/food/update",
        headers: {
            token: token,
        },
        data: {
            id: data.id,
            name: data.name,
            picture: data.picture,
            type: data.type,
            GI: data.GI,
            GL: data.GL,
            glucose: data.glucose,
            heat: data.heat,
            protein: data.protein,
            fat: data.fat,
            carbohydrate: data.carbohydrate,
        },
    });
}
// 删除食物信息
export function deleteFoodInfo(data) {
    return request({
        method: "delete",
        url: `/admin/food/delete/${data}`,
        headers: {
            token: token,
        },
    });
}
// 获取所有食物类型
export function getFoodType() {
    return request({
        method: "get",
        url: "/food/list/all_type",
        headers: {
            token: token,
        },
    });
}
// -----------------------------------------
// 文章管理---------------------------------
// 分页查询文章
export function getArticlesInfo(data) {
    return request({
        method: "get",
        url: "/admin/article/pageQuery",
        headers: {
            token: token,
        },
        params: {
            type: data.type,
            title: data.title,
            author: data.author,
            page: data.page,
            pageSize: data.pageSize,
            isLike: data.isLike,
        },
    });
}
// 新增文章
export function addArticlesInfo(data) {
    return request({
        method: "post",
        url: "/admin/article/save",
        headers: {
            token: token,
        },
        data: {
            title: data.title,
            preview: data.preview,
            link: data.link,
            author: data.author,
            picture: data.picture,
            type: data.type,
        },
    });
}
// 修改文章信息
export function updateArticlesInfo(data) {
    return request({
        method: "put",
        url: "/admin/article/update",
        headers: {
            token: token,
        },
        data: {
            id: data.id,
            title: data.title,
            preview: data.preview,
            link: data.link,
            author: data.author,
            picture: data.picture,
            type: data.type,
        },
    });
}
// 删除文章
export function deleteArticlesInfo(data) {
    return request({
        method: "delete",
        url: `/admin/article/delete/${data}`,
        headers: {
            token: token,
        },
    });
}
// -----------------------------------------
