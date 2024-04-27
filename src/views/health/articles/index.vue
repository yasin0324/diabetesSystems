<template>
    <div class="main">
        <div class="mainHeader">
            <el-radio-group
                v-model="isLike"
                style="margin-right: 2vh"
                @change="handleCurrentPage"
            >
                <el-radio value="2">按发布时间排序</el-radio>
                <el-radio value="1">按点赞收藏量排序</el-radio>
            </el-radio-group>
            <el-input
                placeholder="根据标题搜索"
                class="searchInput"
                v-model="searchTitleValue"
            ></el-input>
            <el-input
                placeholder="根据作者搜索"
                class="searchInput"
                v-model="searchAuthorValue"
            ></el-input>
            <el-button
                class="searchButton"
                @click="searchArticles"
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
                class="addArticles"
                @click="openAddArticles"
                plain
                color="#736ffe"
                >新增文章</el-button
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
                    fixed="left"
                    :filters="articlesType"
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
                    label="标题"
                    prop="title"
                    width="200"
                    fixed="left"
                ></el-table-column>
                <el-table-column
                    label="作者"
                    prop="author"
                    width="100"
                ></el-table-column>
                <el-table-column
                    label="预览"
                    prop="preview"
                    width="200"
                ></el-table-column>
                <el-table-column
                    label="链接"
                    prop="link"
                    width="200"
                ></el-table-column>
                <el-table-column
                    label="点赞量"
                    prop="likeNum"
                    width="100"
                ></el-table-column>
                <el-table-column
                    label="收藏量"
                    prop="collect"
                    width="100"
                ></el-table-column>
                <el-table-column label="管理" fixed="right" width="110">
                    <template #default="scope">
                        <el-button
                            link
                            size="small"
                            type="primary"
                            @click="openUpdateArticle(scope.row)"
                            >编辑</el-button
                        >
                        <el-popconfirm
                            title="确定删除吗？"
                            @confirm="deleteArticle(scope.row)"
                            confirm-button-text="确认"
                            cancel-button-text="取消"
                            ><template #reference>
                                <el-button link size="small" type="danger"
                                    >删除</el-button
                                ></template
                            ></el-popconfirm
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
            class="addArticlesDialog"
            align-center
            v-model="dialogVisible"
            :title="dialogTitle"
            width="400"
        >
            <el-form
                class="addArticlesForm"
                :model="articlesInfo"
                label-position="right"
                label-width="auto"
                :rules="articlesRules"
                ref="articlesForm"
            >
                <el-form-item label="文章标题" prop="title">
                    <el-input
                        v-model="articlesInfo.title"
                        placeholder="请输入文章标题"
                    ></el-input>
                </el-form-item>
                <el-form-item label="文章作者" prop="author">
                    <el-input
                        v-model="articlesInfo.author"
                        placeholder="请输入文章作者"
                    ></el-input>
                </el-form-item>
                <el-form-item label="文章分类" prop="type">
                    <el-input
                        v-model="articlesInfo.type"
                        placeholder="请输入文章类别"
                    ></el-input>
                </el-form-item>
                <el-form-item label="文章链接" prop="link">
                    <el-input
                        v-model="articlesInfo.link"
                        placeholder="请填写文章链接"
                    ></el-input>
                </el-form-item>
                <el-form-item label="文章预览" prop="preview">
                    <el-input
                        v-model="articlesInfo.preview"
                        placeholder="请输入文章预览信息"
                        type="textarea"
                        :autosize="{ minRows: 3, maxRows: 3 }"
                        show-word-limit
                        maxlength="500"
                        resize="none"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="文章图片"
                    prop="picture"
                    class="picture-item"
                >
                    <el-upload
                        action="/api/common/upload"
                        list-type="picture-card"
                        :file-list="articlesFileLists"
                        :on-success="(file) => handleSuccess(file)"
                        :headers="headers"
                    >
                        <el-icon class="articles-uploader-icon"
                            ><Plus
                        /></el-icon>
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
                        >添 加 文 章</el-button
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
                        >修 改 文 章</el-button
                    >
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
    getArticlesInfo,
    addArticlesInfo,
    updateArticlesInfo,
    deleteArticlesInfo,
    getArticlesType,
} from "../../../api/health";
import { getToken } from "../../../util/auth";
import { ElMessage } from "element-plus";

const token = getToken();
const headers = {
    token: token,
};

const isLike = ref("2");
const tableData = ref([]);
const pageSize = ref(8);
const page = ref(1);
const datalength = ref();
const searchTitleValue = ref("");
const searchAuthorValue = ref("");
const submitType = ref("");
const dialogVisible = ref(false);
const dialogTitle = ref("");
const imgUrl = ref("");
const articlesFileLists = ref([]);
const articlesForm = ref();
const articlesInfo = ref({
    title: "",
    preview: "",
    link: "",
    author: "",
    picture: "",
    type: "",
});

// 表单校验规则
const articlesRules = {
    title: [{ required: true, message: "请输入文章标题", trigger: "blur" }],
    author: [{ required: true, message: "请输入文章作者", trigger: "blur" }],
    type: [{ required: true, message: "请输入文章类别", trigger: "blur" }],
    link: [{ required: true, message: "请填写文章链接", trigger: "blur" }],
    preview: [
        { required: true, message: "请输入文章预览信息", trigger: "blur" },
    ],
    picture: [{ required: true, message: "请上传文章图片", trigger: "blur" }],
};
// 切换分页
const type1 = ref("");
const handleCurrentPage = () => {
    let data = {
        type: type1.value,
        title: searchTitleValue.value,
        author: searchAuthorValue.value,
        page: page.value,
        pageSize: pageSize.value,
        isLike: parseInt(isLike.value),
    };
    getArticlesInfo(data)
        .then((res) => {
            tableData.value = res.data.articles;
            datalength.value = res.data.total;
        })
        .catch((err) => {
            console.log(err);
        });
    getAllArticlesType();
};
// 搜索文章
const searchArticles = () => {
    page.value = 1;
    handleCurrentPage();
};
// 重置搜索
const refreshSearch = () => {
    searchTitleValue.value = "";
    searchAuthorValue.value = "";
    page.value = 1;
    handleCurrentPage();
};
// 打开新增文章对话框
const openAddArticles = () => {
    dialogTitle.value = "新增文章";
    articlesInfo.value = {
        title: "",
        preview: "",
        link: "",
        author: "",
        picture: "",
        type: "",
    };
    imgUrl.value = "";
    articlesFileLists.value = [];
    submitType.value = "add";
    dialogVisible.value = true;
};
// 文章图片上传
const handleSuccess = (file) => {
    imgUrl.value = file.data;
    articlesInfo.value.picture = file.data;
};
// 提交文章表单
const submitAddForm = () => {
    articlesForm.value.validate((valid) => {
        if (valid) {
            if (submitType.value === "add") {
                addNewArticle();
            } else if (submitType.value === "edit") {
                editArticle();
            }
            dialogVisible.value = false;
        } else {
            return false;
        }
    });
};
// 新增文章
const addNewArticle = () => {
    let data = {
        title: articlesInfo.value.title,
        author: articlesInfo.value.author,
        type: articlesInfo.value.type,
        link: articlesInfo.value.link,
        preview: articlesInfo.value.preview,
        picture: articlesInfo.value.picture,
    };
    addArticlesInfo(data)
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
const openUpdateArticle = (article) => {
    dialogTitle.value = "编辑文章";
    articlesInfo.value = article;
    imgUrl.value = article.picture;
    submitType.value = "edit";
    editedId.value = article.id;
    dialogVisible.value = true;
};
// 编辑文章
const editArticle = () => {
    let data = {
        id: editedId.value,
        title: articlesInfo.value.title,
        author: articlesInfo.value.author,
        type: articlesInfo.value.type,
        link: articlesInfo.value.link,
        preview: articlesInfo.value.preview,
        picture: articlesInfo.value.picture,
    };
    updateArticlesInfo(data)
        .then((res) => {
            ElMessage.success("编辑成功");
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        });
};
// 删除文章
const deleteArticle = (article) => {
    deleteArticlesInfo(article.id)
        .then((res) => {
            ElMessage.success("删除成功")
            handleCurrentPage();
        })
        .catch((err) => {
            console.log(err);
        });
};
// 获取所有文章类别
const articlesType = ref([]);
const getAllArticlesType = () => {
    getArticlesType()
        .then((res) => {
            articlesType.value = res.data.map((item) => {
                return { text: item, value: item };
            });
        })
        .catch((err) => {
            console.log(err);
        });
};
// 根据文章类别进行筛选
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
            isLike: parseInt(isLike.value),
        };
        getArticlesInfo(data)
            .then((res) => {
                tableData.value = res.data.articles;
                datalength.value = res.data.total;
            })
            .catch((err) => {
                console.log(err);
            });
    });
};

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
        .addArticles {
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
:deep(.el-textarea) {
    --el-input-border-radius: 2vh;
}
:deep(.el-button) {
    border-radius: 2vh;
}
.picture-item {
    height: 19vh;
    overflow: hidden;
}
:deep(.el-radio__input.is-checked + .el-radio__label) {
    color: #736ffe !important;
}
:deep(.el-radio__input.is-checked .el-radio__inner) {
    background: #736ffe !important;
    border-color: #736ffe !important;
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
</style>
