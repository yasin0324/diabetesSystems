<template>
    <div class="main">
        <div class="mainHeader">
            <el-input
                placeholder="搜索"
                class="searchInput"
                v-model="searchValue"
            ></el-input>
            <el-button
                class="searchButton"
                @click="searchSport"
                plain
                color="#736ffe"
                >搜索</el-button
            >
            <el-button
                class="resetSearch"
                icon="Refresh"
                circle
                @click="refreshSearch"
                plain
                color="#736ffe"
            ></el-button>
            <el-button
                class="passSport"
                @click="openPassSport"
                plain
                color="#736ffe"
            >
                自定义运动审核
            </el-button>
            <el-button
                class="addSport"
                @click="openAddSport"
                plain
                color="#736ffe"
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
                <el-table-column label="图片">
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
                        <el-popconfirm
                            title="确定删除吗？"
                            @confirm="deleteSport(scope.row)"
                            confirm-button-text="确认"
                            cancel-button-text="取消"
                        >
                            <template #reference>
                                <el-button link size="small" type="danger"
                                    >删除</el-button
                                ></template
                            >
                        </el-popconfirm>
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
                        :on-preview="handlePictureCardPreview"
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
        <el-dialog
            align-center
            class="passSportDialog"
            v-model="passVisible"
            title="用户自定义运动审核"
            width="1000"
        >
            <div class="mainContent" style="margin-bottom: 2vh">
                <el-table :data="tableData2" stripe height="530">
                    <el-table-column label="分类" prop="type"></el-table-column>
                    <el-table-column label="图片">
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
                                @click="passSports1(scope.row)"
                                >通过</el-button
                            >
                            <el-button
                                link
                                size="small"
                                type="danger"
                                @click="passSports0(scope.row)"
                                >拒绝</el-button
                            >
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="mainFooter">
                <el-pagination
                    :page-size="passPageSize"
                    @current-change="getPassSportList"
                    :total="passTotal"
                    v-model:current-page="passPage"
                    layout="pre,pager,next"
                ></el-pagination>
            </div>
        </el-dialog>
    </div>
    <el-dialog
        style="display: flex; justify-content: center"
        v-model="pictureDialogVisible"
    >
        <img :src="dialogImageUrl" alt="" />
    </el-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
    getSportsInfo,
    addSportsInfo,
    updateSportsInfo,
    deleteSportsInfo,
    getSportsType,
    getPassSport,
    passSport0,
    passSport1,
} from "../../../api/health";
import { getToken } from "../../../util/auth";
import { ElMessage } from "element-plus";

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
const type1 = ref("");
const handleCurrentPage = () => {
    let data = {
        type: type1.value,
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
    type1.value = "";
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
            ElMessage.success("新增成功");
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
            ElMessage.success("编辑成功");
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
            ElMessage.success("删除成功");
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
        type1.value = "";
        handleCurrentPage();
    }
    types.forEach((type) => {
        type1.value = type;
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
// 打开运动审核
const tableData2 = ref([]);
const passVisible = ref(false);
const passPage = ref(1);
const passPageSize = ref(10);
const passTotal = ref(0);
const openPassSport = () => {
    passVisible.value = true;
    getPassSportList();
};
// 获得待审核食物列表
const getPassSportList = () => {
    let data = {
        page: passPage.value,
        pageSize: passPageSize.value,
    };
    getPassSport(data)
        .then((res) => {
            tableData2.value = res.data.sportDetails;
            passTotal.value = res.data.total;
        })
        .catch((err) => {
            console.log(err);
        });
};
// 审核通过
const passSports1 = (item) => {
    passSport1(item.id)
        .then((res) => {
            getPassSportList();
            handleCurrentPage();
            ElMessage.success("通过成功");
        })
        .catch((err) => {
            console.log(err);
        });
};
// 审核不通过
const passSports0 = (item) => {
    passSport0(item.id)
        .then((res) => {
            getPassSportList();
            ElMessage.error("拒绝成功");
        })
        .catch((err) => {
            console.log(err);
        });
};
const pictureDialogVisible = ref(false);
const dialogImageUrl = ref("");
const handlePictureCardPreview = async (file) => {
    dialogImageUrl.value = file.url;
    pictureDialogVisible.value = true;
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
        .passSport {
            position: absolute;
            right: 15vh;
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
:deep(.el-pagination) {
    li.is-active {
        background-color: #736ffe;
        // background-color: #84d21e;
        color: var(--el-color-white);
    }
    li:hover {
        background-color: #736ffe;
        color: var(--el-color-white);
    }
}
.picture-item {
    height: 19vh;
    overflow: hidden;
}
</style>
