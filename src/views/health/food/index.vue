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
                plain
                color="#736ffe"
                @click="searchFood"
                >搜索</el-button
            >
            <el-button
                class="resetSearch"
                icon="Refresh"
                plain
                color="#736ffe"
                circle
                @click="refreshSearch"
            ></el-button>
            <el-button
                class="passFood"
                @click="openPassFood"
                plain
                color="#736ffe"
            >
                自定义食物审核
            </el-button>
            <el-button
                class="addFood"
                @click="openAddFood"
                plain
                color="#736ffe"
                >新增食物</el-button
            >
        </div>
        <div class="mainContent">
            <el-table
                :data="tableData"
                stripe
                @filter-change="filterHandler"
                height="545"
            >
                <el-table-column
                    label="分类"
                    prop="type"
                    fixed="left"
                    :filters="foodType"
                    :filter-multiple="false"
                    column-key="type"
                ></el-table-column>
                <el-table-column fixed="left" label="图片">
                    <template #default="scope">
                        <img
                            :src="scope.row.picture"
                            style="width: 5vh; height: 5vh"
                        />
                    </template>
                </el-table-column>
                <el-table-column
                    label="名称"
                    prop="name"
                    width="120"
                    fixed="left"
                ></el-table-column>
                <el-table-column
                    label="热量 kcal/100g"
                    prop="heat"
                    width="150"
                ></el-table-column>
                <el-table-column
                    label="含糖量 g/100g"
                    prop="glucose"
                    width="150"
                ></el-table-column>
                <el-table-column
                    label="升糖指数(GI)"
                    prop="gi"
                    width="150"
                ></el-table-column>
                <el-table-column
                    label="升糖负荷(GL)"
                    prop="gl"
                    width="150"
                ></el-table-column>
                <el-table-column
                    label="碳水化合物 g/100g"
                    prop="carbohydrate"
                    width="150"
                ></el-table-column>
                <el-table-column
                    label="蛋白质 g/100g"
                    prop="protein"
                    width="150"
                ></el-table-column>
                <el-table-column
                    label="脂肪 g/100g"
                    prop="fat"
                    width="150"
                ></el-table-column>
                <el-table-column label="管理" fixed="right" width="110">
                    <template #default="scope">
                        <el-button
                            link
                            size="small"
                            type="primary"
                            @click="openUpdateFood(scope.row)"
                            >编辑</el-button
                        >
                        <el-popconfirm
                            title="确定删除吗？"
                            @confirm="deleteFood(scope.row)"
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
            class="addFoodDialog"
            v-model="dialogVisible"
            :title="dialogTitle"
            width="400"
        >
            <el-form
                class="addFoodForm"
                :model="foodInfo"
                label-position="right"
                label-width="auto"
                :rules="foodRules"
                ref="foodForm"
            >
                <el-form-item label="食物名称" prop="name">
                    <el-input
                        v-model="foodInfo.name"
                        placeholder="请输入食物名称"
                    ></el-input>
                </el-form-item>
                <el-form-item label="食物类别" prop="type">
                    <el-input
                        v-model="foodInfo.type"
                        placeholder="请输入食物类别"
                    ></el-input>
                </el-form-item>
                <el-form-item label="含糖量" prop="glucose">
                    <el-input
                        v-model="foodInfo.glucose"
                        placeholder="请输入含糖量（g/100g）"
                    ></el-input>
                </el-form-item>
                <el-form-item label="升糖指数" prop="GI">
                    <el-input
                        v-model="foodInfo.GI"
                        placeholder="请输入食物的升糖指数"
                    ></el-input>
                </el-form-item>
                <el-form-item label="升糖负荷" prop="GL">
                    <el-input
                        v-model="foodInfo.GL"
                        placeholder="请输入食物的升糖负荷"
                    ></el-input>
                </el-form-item>
                <el-form-item label="热量" prop="heat">
                    <el-input
                        v-model="foodInfo.heat"
                        placeholder="请输入食物热量（kacl/100g）"
                    ></el-input>
                </el-form-item>
                <el-form-item label="蛋白质" prop="protein">
                    <el-input
                        v-model="foodInfo.protein"
                        placeholder="请输入食物蛋白质含量（g/100g）"
                    ></el-input>
                </el-form-item>
                <el-form-item label="脂肪" prop="fat">
                    <el-input
                        v-model="foodInfo.fat"
                        placeholder="请输入食物脂肪含量（g/100g）"
                    ></el-input>
                </el-form-item>
                <el-form-item label="碳水化合物" prop="carbohydrate">
                    <el-input
                        v-model="foodInfo.carbohydrate"
                        placeholder="请输入食物碳水化合物含量（g/100g）"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="食物图片"
                    prop="picture"
                    class="picture-item"
                >
                    <el-upload
                        action="/api/common/upload"
                        list-type="picture-card"
                        :file-list="foodFileLists"
                        :on-success="(file) => handleSuccess(file)"
                        :headers="headers"
                        :on-preview="handlePictureCardPreview"
                    >
                        <el-icon class="food-uploader-icon"><Plus /></el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button
                        style="
                            margin: 0 auto;
                            width: 80%;
                            background-color: #f0f2fd;
                            color: #70708c;
                            font-weight: bold;
                        "
                        @click="submitAddForm"
                        v-if="submitType === 'add'"
                        >添 加 食 物</el-button
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
                        >编 辑 食 物</el-button
                    >
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog
            align-center
            class="passFoodDialog"
            v-model="passVisible"
            title="用户自定义食物审核"
            width="1000"
        >
            <div class="mainContent" style="margin-bottom: 2vh">
                <el-table :data="tableData2" stripe height="530">
                    <el-table-column
                        label="分类"
                        prop="type"
                        fixed="left"
                    ></el-table-column
                    ><el-table-column fixed="left" label="图片">
                        <template #default="scope">
                            <img
                                :src="scope.row.picture"
                                style="width: 5vh; height: 5vh"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="名称"
                        prop="name"
                        width="120"
                        fixed="left"
                    ></el-table-column>
                    <el-table-column
                        label="热量 kcal/100g"
                        prop="heat"
                        width="150"
                    ></el-table-column>
                    <el-table-column
                        label="含糖量 g/100g"
                        prop="glucose"
                        width="150"
                    ></el-table-column>
                    <el-table-column
                        label="升糖指数(GI)"
                        prop="gi"
                        width="150"
                    ></el-table-column>
                    <el-table-column
                        label="升糖负荷(GL)"
                        prop="gl"
                        width="150"
                    ></el-table-column>
                    <el-table-column
                        label="碳水化合物 g/100g"
                        prop="carbohydrate"
                        width="150"
                    ></el-table-column>
                    <el-table-column
                        label="蛋白质 g/100g"
                        prop="protein"
                        width="150"
                    ></el-table-column>
                    <el-table-column
                        label="脂肪 g/100g"
                        prop="fat"
                        width="150"
                    ></el-table-column>
                    <el-table-column label="管理" fixed="right" width="110">
                        <template #default="scope">
                            <el-button
                                link
                                size="small"
                                type="primary"
                                @click="passFood1(scope.row)"
                                >通过</el-button
                            >
                            <el-button
                                link
                                size="small"
                                type="danger"
                                @click="passFood2(scope.row)"
                                >拒绝</el-button
                            >
                        </template>
                    </el-table-column></el-table
                >
            </div>
            <div class="mainFooter">
                <el-pagination
                    :page-size="passPageSize"
                    @current-change="getPassFoodList"
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
    addFoodInfo,
    deleteFoodInfo,
    getFoodType,
    getFoodInfo,
    updateFoodInfo,
    pass1,
    pass0,
    getPassFood,
} from "../../../api/health/index";
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
const foodForm = ref();
const foodInfo = ref({
    name: "",
    picture: "",
    type: "",
    GI: "",
    GL: "",
    glucose: "",
    heat: "",
    protein: "",
    fat: "",
    carbohydrate: "",
});

// 切换分页
const handleCurrentPage = () => {
    let data = {
        name: searchValue.value,
        type: type1.value,
        page: page.value,
        pageSize: pageSize.value,
    };
    getFoodInfo(data)
        .then((res) => {
            tableData.value = res.data.foodDetails;
            datalength.value = res.data.total;
        })
        .catch((err) => {
            console.log(err);
        });
    getAllFoodType();
};
// 搜索食物
const searchFood = () => {
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
// 打开新增食物对话框
const openAddFood = () => {
    dialogTitle.value = "新增食物";
    foodInfo.value = {
        name: "",
        picture: "",
        type: "",
        GI: "",
        GL: "",
        glucose: "",
        heat: "",
        protein: "",
        fat: "",
        carbohydrate: "",
    };
    imgUrl.value = "";
    foodFileLists.value = [];
    submitType.value = "add";
    dialogVisible.value = true;
};
// 表单校验规则
const foodRules = {
    name: [{ required: true, message: "请填写食物名称", trigger: "blur" }],
    type: [{ required: true, message: "请填写食物类别", trigger: "blur" }],
    glucose: [{ required: true, message: "请填写含糖量", trigger: "blur" }],
    GI: [{ required: true, message: "请填写升糖指数", trigger: "blur" }],
    GL: [{ required: true, message: "请填写升糖负荷", trigger: "blur" }],
    heat: [{ required: true, message: "请填写热量", trigger: "blur" }],
    protein: [{ required: true, message: "请填写蛋白质含量", trigger: "blur" }],
    fat: [{ required: true, message: "请填写脂肪含量", trigger: "blur" }],
    carbohydrate: [
        { required: true, message: "请填写碳水化合物含量", trigger: "blur" },
    ],
    picture: [{ required: true, message: "请上传食物图片", trigger: "blur" }],
};
// 食物图片上传
const foodFileLists = ref([]);
const imgUrl = ref("");
const handleSuccess = (file) => {
    imgUrl.value = file.data;
    foodInfo.value.picture = file.data;
};
// 提交食物表单
const submitAddForm = () => {
    foodForm.value.validate((valid) => {
        if (valid) {
            if (submitType.value === "add") {
                addNewFood();
            } else if (submitType.value === "edit") {
                editFood();
            }
            dialogVisible.value = false;
        } else {
            return false;
        }
    });
};
// 新增食物
const addNewFood = () => {
    let data = {
        name: foodInfo.value.name,
        picture: foodInfo.value.picture,
        type: foodInfo.value.type,
        GI: foodInfo.value.GI,
        GL: foodInfo.value.GL,
        glucose: foodInfo.value.glucose,
        heat: foodInfo.value.heat,
        protein: foodInfo.value.protein,
        fat: foodInfo.value.fat,
        carbohydrate: foodInfo.value.carbohydrate,
    };
    addFoodInfo(data)
        .then((res) => {
            ElMessage.success("新增成功");
            handleCurrentPage();
        })
        .catch((err) => {
            console.log(err);
        });
};
// 打开编辑对话框
const editedId = ref(0);
const openUpdateFood = (food) => {
    dialogTitle.value = "编辑食物";
    foodInfo.value = food;
    foodInfo.value.GI = food.gi;
    foodInfo.value.GL = food.gl;
    imgUrl.value = food.picture;
    foodFileLists.value = [
        {
            name: "food",
            url: food.picture,
        },
    ];
    submitType.value = "edit";
    editedId.value = food.id;
    dialogVisible.value = true;
};
// 编辑食物
const editFood = () => {
    let data = {
        id: editedId.value,
        name: foodInfo.value.name,
        picture: foodInfo.value.picture,
        type: foodInfo.value.type,
        GI: foodInfo.value.GI,
        GL: foodInfo.value.GL,
        glucose: foodInfo.value.glucose,
        heat: foodInfo.value.heat,
        protein: foodInfo.value.protein,
        fat: foodInfo.value.fat,
        carbohydrate: foodInfo.value.carbohydrate,
    };
    updateFoodInfo(data)
        .then((res) => {
            ElMessage.success("编辑成功");
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        });
};
// 删除食物
const deleteFood = (food) => {
    deleteFoodInfo(food.id)
        .then((res) => {
            ElMessage.success("删除成功");
            handleCurrentPage();
        })
        .catch((err) => {
            console.log(err);
        });
};
// 获取所有食物类别
const foodType = ref([]);
const getAllFoodType = () => {
    getFoodType()
        .then((res) => {
            foodType.value = res.data.map((item) => {
                return { text: item, value: item };
            });
        })
        .catch((err) => {
            console.log(err);
        });
};
// 根据食物类别进行筛选
const type1 = ref("");
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
        getFoodInfo(data)
            .then((res) => {
                tableData.value = res.data.foodDetails;
                datalength.value = res.data.total;
            })
            .catch((err) => {
                console.log(err);
            });
    });
};
const pictureDialogVisible = ref(false);
const dialogImageUrl = ref("");
const handlePictureCardPreview = async (file) => {
    dialogImageUrl.value = file.url;
    pictureDialogVisible.value = true;
};
// 打开审核食物对话框
const tableData2 = ref([]);
const passVisible = ref(false);
const passPage = ref(1);
const passPageSize = ref(10);
const passTotal = ref(0);
const openPassFood = () => {
    passVisible.value = true;
    getPassFoodList();
};
// 获得待审核食物列表
const getPassFoodList = () => {
    let data = {
        page: passPage.value,
        pageSize: passPageSize.value,
    };
    getPassFood(data)
        .then((res) => {
            tableData2.value = res.data.foodDetails;
            passTotal.value = res.data.total;
        })
        .catch((err) => {
            console.log(err);
        });
};
// 通过用户申请
const passFood1 = (item) => {
    pass1(item.id)
        .then((res) => {
            getPassFoodList();
            handleCurrentPage();
            ElMessage.success("通过成功");
        })
        .catch((err) => {
            console.log(err);
        });
};
// 拒绝用户申请
const passFood2 = (item) => {
    pass0(item.id)
        .then((res) => {
            getPassFoodList();
            ElMessage.error("拒绝成功");
        })
        .catch((err) => {
            console.log(err);
        });
};

// 获取所有食物数据
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
        .passFood {
            position: absolute;
            right: 15vh;
        }
        .addFood {
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
