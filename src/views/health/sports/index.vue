<template>
    <div class="main">
        <div class="mainHeader">
            <el-input
                placeholder="搜索"
                class="searchInput"
                v-model="searchValue"
            ></el-input>
            <el-button class="searchButton" @click="searchSport"
                >搜索</el-button
            >
            <el-button
                class="resetSearch"
                icon="Refresh"
                circle
                @click="refreshSearch"
            ></el-button>
            <el-button class="addSport" @click="openAddSport"
                >新增运动</el-button
            >
        </div>
        <div class="mainContent">
            <el-table
                :data="tableData"
                stripe
                height="545"
                @filter-change="filterHandler"
            >
                <el-table-column
                    label="分类"
                    prop="type"
                    column-key="type"
                    :filters="sportType"
                    :filter-multiple="false"
                ></el-table-column>
                <el-table-column>
                    <template #default="scope">
                        <img
                            :src="scope.row.picture"
                            style="width: 5vh; height: 5vh"
                        />
                    </template>
                </el-table-column>
                <el-table-column label="运动" prop="name"></el-table-column>
                <el-table-column
                    label="运动消耗(60分钟)/千卡"
                    prop="name"
                ></el-table-column>
                <el-table-column label="管理" fixed="right" align="center">
                    <template #default="scope">
                        <el-button
                            link
                            size="small"
                            type="primary"
                            @click="openUpdateSport(scope.row)"
                            >编辑</el-button
                        >
                        <el-button
                            link
                            size="small"
                            type="danger"
                            @click="deleteSport(scope.row)"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="mainFooter">
            <el-pagination
                :page-size="pageSize"
                @current-change="handleCurrentPage"
                :total="datalength"
                v-model:current-page="page"
                layout="pre,pager,next"
            ></el-pagination>
        </div>
        <el-dialog
            align-center
            class="addSportDialog"
            v-model="dialogVisible"
            :title="dialogTitle"
            width="400"
        >
            <el-form
                class="addSportForm"
                :model="sportInfo"
                label-position="right"
                label-width="auto"
                :rules="sportRules"
                ref="sportForm"
            >
                <el-form-item label="运动名称" prop="name"
                    ><el-input
                        v-model="sportInfo.name"
                        placeholder="请输入运动名称"
                    ></el-input
                ></el-form-item>
                <el-form-item label="运动类型" prop="type">
                    <el-input
                        v-model="sportInfo.type"
                        placeholder="请输入运动类别"
                    ></el-input>
                </el-form-item>
                <el-form-item label="运动消耗" prop="consumption">
                    <el-input
                        v-model="sportInfo.consumption"
                        placeholder="请输入运动消耗 （60分钟）/千卡"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="运动图片"
                    prop="picture"
                    class="picture-item"
                >
                    <el-upload
                        action="/api/common/upload"
                        list-type="picture-card"
                        :file-list="sportFileLists"
                        :on-success="(file) => handleSuccess(file)"
                        :headers="headers"
                    >
                        <el-icon class="food-uploader-icon"><Plus /></el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item
                    ><el-button
                        style="
                            margin: 0 auto;
                            width: 80%;
                            background-color: #f0f2fd;
                            color: #70708c;
                            font-weight: bold;
                        "
                        @click="submitAddForm"
                        v-if="submitType === 'add'"
                        >添 加 运 动</el-button
                    >
                    <el-button
                        style="
                            margin: 0 auto;
                            width: 80%;
                            background-color: #f0f2fd;
                            color: #70708c;
                            font-weight: bold;
                        "
                        @click="submitAddForm"
                        v-if="submitType === 'edit'"
                        >编 辑 运 动</el-button
                    ></el-form-item
                >
            </el-form>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
    getSportsInfo,
    addSportsInfo,
    updateSportsInfo,
    deleteSportsInfo,
    getSportsType,
} from "../../../api/health";
import { getToken } from "../../../util/auth";

const token = getToken();
const headers = {
    token: token,
};

const tableData = ref([]);
const pageSize = ref(8);
const page = ref(1);
const datalength = ref();
const searchValue = ref("");
const dialogVisible = ref(false);
const dialogTitle = ref("");
const sportForm = ref();
const sportInfo = ref({
    name: "",
    type: "",
    picture: "",
    consumption: "",
});

// 切换分页
const handleCurrentPage = () => {
    let data = {
        name: searchValue.value,
        page: page.value,
        pageSize: pageSize.value,
    };
    getSportsInfo(data)
        .then((res) => {
            tableData.value = res.data.sportDetails;
            datalength.value = res.data.total;
        })
        .catch((err) => {
            console.log(err);
        });
    getAllSportType();
};
// 搜索运动
const searchSport = () => {
    page.value = 1;
    handleCurrentPage();
};
// 重置搜索
const refreshSearch = () => {
    searchValue.value = "";
    page.value = 1;
    handleCurrentPage();
};
const submitType = ref("");
// 打开新增运动对话框
const openAddSport = () => {
    dialogTitle.value = "新增运动";
    sportInfo.value = {
        name: "",
        type: "",
        picture: "",
        consumption: "",
    };
    imgUrl.value = "";
    sportFileLists.value = [];
    submitType.value = "add";
    dialogVisible.value = true;
};
// 表单校验规则
const sportRules = {
    name: [{ required: true, message: "请输入运动名称", trigger: "blur" }],
    type: [{ required: true, message: "请输入运动类别", trigger: "blur" }],
    picture: [{ required: true, message: "请上传运动图片", trigger: "blur" }],
    consumption: [
        {
            required: true,
            message: "请填写运动消耗",
            trigger: "blur",
        },
    ],
};
// 运动图片上传
const sportFileLists = ref([]);
const imgUrl = ref("");
const handleSuccess = (file) => {
    imgUrl.value = file.data;
    sportInfo.value.picture = file.data;
};
// 提交运动表单
const submitAddForm = () => {
    sportForm.value.validate((valid) => {
        if (valid) {
            if (submitType.value === "add") {
                addNewSport();
            } else if (submitType.value === "edit") {
                editSport();
            }
            dialogVisible.value = false;
        } else {
            return false;
        }
    });
};
// 新增运动
const addNewSport = () => {
    let data = {
        name: sportInfo.value.name,
        picture: sportInfo.value.picture,
        type: sportInfo.value.type,
        consumption: sportInfo.value.consumption,
    };
    addSportsInfo(data)
        .then((res) => {
            handleCurrentPage();
        })
        .catch((err) => {
            console.log(er);
        });
};
// 打开编辑对话框
const editedId = ref(0);
const openUpdateSport = (sport) => {
    dialogTitle.value = "编辑运动";
    sportInfo.value = sport;
    imgUrl.value = sport.picture;
    submitType.value = "edit";
    editedId.value = sport.id;
    dialogVisible.value = true;
};
// 编辑运动
const editSport = () => {
    let data = {
        id: editedId.value,
        name: sportInfo.value.name,
        picture: sportInfo.value.picture,
        type: sportInfo.value.type,
        consumption: sportInfo.value.consumption,
    };
    updateSportsInfo(data)
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        });
};
// 删除运动
const deleteSport = (sport) => {
    deleteSportsInfo(sport.id)
        .then((res) => {
            handleCurrentPage();
        })
        .catch((err) => {
            console.log(er);
        });
};
// 获取所有运动类别
const sportType = ref([]);
const getAllSportType = () => {
    getSportsType()
        .then((res) => {
            sportType.value = res.data.map((item) => {
                return { text: item, value: item };
            });
        })
        .catch((err) => {
            console.log(err);
        });
};
// 根据运动类别进行筛选
const filterHandler = (value) => {
    tableData.value = [];
    datalength.value = 0;
    let types = value["type"];
    if (types.length === 0) {
        handleCurrentPage();
    }
    types.forEach((type) => {
        let data = {
            type: type,
            page: page.value,
            pageSize: pageSize.value,
        };
        getSportsInfo(data)
            .then((res) => {
                tableData.value = res.data.sportDetails;
                datalength.value = res.data.total;
            })
            .catch((err) => {
                console.log(err);
            });
    });
};

// 获取所有运动数据
onMounted(() => {
    handleCurrentPage();
});
</script>

<style lang="less" scoped>
.main {
    position: relative;
    height: 100%;
    .mainHeader {
        display: flex;
        flex-direction: row;
        position: relative;
        .searchInput {
            width: 20vh;
        }
        .searchButton {
            margin-left: 1vh;
        }
        .addSport {
            position: absolute;
            right: 3vh;
        }
    }
    .mainFooter {
        position: absolute;
        right: 3vh;
        bottom: 0vh;
    }
}
:deep(.el-input) {
    .el-input__wrapper {
        border-radius: 2vh;
    }
}
:deep(.el-button) {
    border-radius: 2vh;
}
.picture-item {
    height: 19vh;
    overflow: hidden;
}
</style>
