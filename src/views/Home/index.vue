<template>
    <div>
        <div class="common-layout">
            <el-container>
                <el-header>
                    <header-nav></header-nav>
                </el-header>
                <el-container>
                    <el-aside>
                        <aside-nav></aside-nav>
                    </el-aside>
                    <el-main>
                        <router-view></router-view>
                    </el-main>
                </el-container>
            </el-container>
        </div>
    </div>
</template>

<script setup></script>

<style lang="less" scoped>
.common-layout {
    .el-container {
        .el-header {
            --el-header-padding: 0;
            height: 10vh;
        }
        .el-container {
            .el-aside {
                width: 30vh;
            }
            .el-main {
                height: 85vh;
                background-color: #fff;
                border-radius: 5vh;
            }
        }
    }
}
:deep(.el-main) {
    overflow-x: hidden;
    overflow-y: hidden;
}
:deep(.el-dialog) {
    --el-dialog-border-radius: 3vh;
}
</style>
