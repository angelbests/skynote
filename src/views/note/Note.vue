<script lang="ts" setup>
import RightMenu from "./../../components/RightMenu.vue"
import '@wangeditor/editor/dist/css/style.css' 
import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar,IEditorConfig,IToolbarConfig } from '@wangeditor/editor-for-vue'
import { getCurrent } from "@tauri-apps/api/window"
import { webviewWindow } from "@tauri-apps/api"
const appWindow = getCurrent();
appWindow.setAlwaysOnTop(true)
const editorRef = shallowRef()
const valueHtml = ref('')
const mode = ref<string>('default');
const ToolbarHeight = ref()
const toolbarConfig:Partial<IToolbarConfig> = {}
toolbarConfig.toolbarKeys = [
'todo','numberedList','codeBlock','bold','italic','underline','through','upimage','color',
]
const editorConfig:Partial<IEditorConfig> = { 
    MENU_CONF: {},
    placeholder: '' ,
    hoverbarKeys:{
        'text':{
            menuKeys:["insertLink","through",'bold','clearStyle']
        },
        "image":{
            menuKeys:['imageWidth30', 'imageWidth50', 'imageWidth100', 'editImage', 'deleteImage']
        },
        "link":{
            menuKeys:['editLink', 'unLink']
        },
        "pre":{
            menuKeys:['enter', 'codeBlock']
        },
        "divider":{
            menuKeys:['enter']
        },
        "video":{
            menuKeys:[]
        },
        "table":{
            menuKeys:[]
        }
    }
}
const handleCreated = (editor:any) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}

onMounted(() => {
    setTimeout(() => {  
        valueHtml.value = ''
        ToolbarHeight.value = document.getElementById("Toolbar")?.clientHeight
    },1) 
    
    window.onresize = function(){ 
        ToolbarHeight.value = document.getElementById("Toolbar")?.clientHeight
    }
})


onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy() 
})    
const windowclose = function(){
    // appWindow.close()
    new WebviewWindow("123123",{
        url:"http://www.baidu.com"
    })
}

</script>

<template>
    <div class="home"> 
        <div class="note-container">
            <Toolbar
                id="Toolbar"
                style="width: 100%;"
                :editor="editorRef"
                :defaultConfig="toolbarConfig" 
                :mode="mode"
            />
            <Editor
                ref="refEditor"
                class="editor"
                :style="{width: '100%',height:`calc(100% - ${ToolbarHeight}px)`}"
                v-model="valueHtml"
                :defaultConfig="editorConfig"
                :mode="mode"
                @onCreated="handleCreated"
            />
        </div>
        <right-menu>
            <div style="width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;" data-tauri-drag-region>
                <div>
                    <img @click="windowclose" :src="'./icon/close.png'" style="width: 25px;height: 25px;">
                </div>
            </div>
        </right-menu>
    </div>
</template>

<style>
.home{
    width: 100%;
    height: 100%;
    transition: all 0.1s linear;
}
.note-container{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.editor{
    overflow: hidden;
}
</style>

