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
// 获取食物所有类型
export function getFoodType() {
    return request({
        method: "get",
        url: "/food/list/all_type",
        headers: {
            token: token,
        },
    });
}
// 通过用户食物申请
export function pass1(id) {
    return request({
        method: "post",
        url: `/admin/list/food/pass1/${id}`,
        headers: {
            token: token,
        },
    });
}
// 拒绝用户食物申请
export function pass0(id) {
    return request({
        method: "post",
        url: `/admin/list/food/pass0/${id}`,
        headers: {
            token: token,
        },
    });
}
// 查询所有待审核食物
export function getPassFood(data) {
    return request({
        method: "get",
        url: "/admin/food/waitPass",
        headers: {
            token: token,
        },
        params: {
            page: data.page,
            pageSize: data.pageSize,
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
// 获取文章所有类型
export function getArticlesType() {
    return request({
        method: "get",
        url: "/article/list/allType",
        headers: {
            token: token,
        },
    });
}
// -----------------------------------------
// 运动管理---------------------------------
// 分页查询运动
export function getSportsInfo(data) {
    return request({
        method: "get",
        url: "/admin/sport/detail/pageQuery",
        headers: {
            token: token,
        },
        params: {
            name: data.name,
            type: data.type,
            pass: data.pass,
            page: data.page,
            pageSize: data.pageSize,
        },
    });
}
// 新增运动
export function addSportsInfo(data) {
    return request({
        method: "post",
        url: "/sport/detail/save",
        headers: {
            token: token,
        },
        data: {
            name: data.name,
            type: data.type,
            picture: data.picture,
            consumption: data.consumption,
        },
    });
}
// 修改运动信息
export function updateSportsInfo(data) {
    return request({
        method: "put",
        url: "/sport/detail/update",
        headers: {
            token: token,
        },
        data: {
            id: data.id,
            name: data.name,
            type: data.type,
            picture: data.picture,
            consumption: data.consumption,
        },
    });
}
// 删除运动
export function deleteSportsInfo(data) {
    return request({
        method: "delete",
        url: `/sport/detail/delete/${data}`,
        headers: {
            token: token,
        },
    });
}
// 获取所有运动类型
export function getSportsType() {
    return request({
        method: "get",
        url: "/list/sport/detail/type",
        headers: {
            token: token,
        },
    });
}
// 通过用户运动申请
export function passSport1(id) {
    return request({
        method: "post",
        url: `/admin/sport/detail/pass1/${id}`,
        headers: {
            token: token,
        },
    });
}
// 删除用户运动申请
export function passSport0(id) {
    return request({
        method: "post",
        url: `/admin/sport/detail/pass0/${id}`,
        headers: {
            token: token,
        },
    });
}
// 查询所有待审核运动
export function getPassSport(data) {
    return request({
        method: "get",
        url: "/admin/sport/detail/waitPass",
        headers: {
            token: token,
        },
        params: {
            page: data.page,
            pageSize: data.pageSize,
        },
    });
}
// -----------------------------------------
