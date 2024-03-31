<script lang="ts" setup>
import RightMenu from "./../../components/RightMenu.vue"
import '@wangeditor/editor/dist/css/style.css' 
import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from "@wangeditor/editor-for-vue"
import { IToolbarConfig,Boot,IButtonMenu, IDomEditor,IEditorConfig } from '@wangeditor/editor'
import { getCurrent } from "@tauri-apps/api/window"
import { convertFileSrc } from "@tauri-apps/api/core"
import { basename,appDataDir,extname } from "@tauri-apps/api/path"
import { copyFile,BaseDirectory } from "@tauri-apps/plugin-fs"
import { open } from "@tauri-apps/plugin-dialog"
const appWindow = getCurrent();
const editorRef = shallowRef()
const mode = ref<string>('default');
const ToolbarHeight = ref()
const toolbarConfig:Partial<IToolbarConfig> = {}
// 工具栏配置
toolbarConfig.toolbarKeys = [
'todo','numberedList','codeBlock','bold','italic','underline','through','upimage','color'
]
// 编辑器配置
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

// 记录 editor 实例，重要！
const handleCreated = (editor:any) => {
    editorRef.value = editor 
}

const handleChange = function(){   // TS 语法
    let notes = JSON.parse(localStorage.getItem("notes")||'[]') as any[];
    notes.filter((item:any)=>{
        if(item.label == appWindow.label){
            item.html = valueHtml.value
        }
    })
    localStorage.setItem("notes",JSON.stringify(notes));
}
const top = ref(false);
const settop = function(){
    top.value = !top.value
    appWindow.setAlwaysOnTop(top.value)
    let windows = JSON.parse(localStorage.getItem("windows")||'[]');
    windows.filter((item:any)=>{
        if(item.label == appWindow.label){
            item.alwaysOnTop = top.value
        }
    })
    localStorage.setItem("windows",JSON.stringify(windows))
}
// 初始值
let html = ""
let notes = JSON.parse(localStorage.getItem("notes") as string);
notes.filter((item:any)=>{
    if(item.label == appWindow.label){
        html = item.html
    }
})
const valueHtml = ref(html)
const toolshow = ref(true)
onMounted(() => {
    // 赋初始值
    setTimeout(() => {  
        ToolbarHeight.value = document.getElementById("Toolbar")?.clientHeight
    },1) 
    
    // 重置大小
    window.onresize = function(){ 
        ToolbarHeight.value = document.getElementById("Toolbar")?.clientHeight
    }

    setTimeout(() => {
        let notes = JSON.parse(localStorage.getItem("notes") as string);
        notes.filter((item:any)=>{
            if(item.label == appWindow.label){
                valueHtml.value = item.html
                let tool:any = document.getElementsByClassName('w-e-toolbar')[0];
                tool.style.background = `rgba(${item.background},${item.transparent/100})`
                let text:any = document.getElementById('w-e-textarea-1');
                text.style.background = `rgba(${item.background},${item.transparent/100})`
                let con:any = document.getElementsByClassName('w-e-text-container')[0]
                con.style.background = 'transparent'
            }
        })

        let windows = JSON.parse(localStorage.getItem("windows")||'[]');
        windows.filter((item:any)=>{
            if(item.label == appWindow.label){
                top.value = item.alwaysOnTop
            }
        })
    }, 2);

    window.addEventListener("storage",(e)=>{
        if(e.key == "notes"){
            let notes = JSON.parse(localStorage.getItem("notes") as string);
            notes.filter((item:any)=>{
                if(item.label == appWindow.label){
                    let tool:any = document.getElementsByClassName('w-e-toolbar')[0];
                    tool.style.background = `rgba(${item.background},${item.transparent/100})`
                    let text:any = document.getElementById('w-e-textarea-1');
                    text.style.background = `rgba(${item.background},${item.transparent/100})`
                    let con:any = document.getElementsByClassName('w-e-text-container')[0]
                    con.style.background = 'transparent'
                }
            })
        }
    })

    appWindow.listen("tauri://blur",(e)=>{
        console.log(e)
        toolshow.value = false
    })

    appWindow.listen("tauri://focus",(e)=>{
        console.log(e)
        toolshow.value = true
    })

    filedrop();
})


// 卸载
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy() 
})    

// 关闭
const windowclose = function(){
    appWindow.close()
}

//#region  创建注册image上传按钮
// 创建组件类
class upButtonMenu implements IButtonMenu {   // TS 语法
    title:string
    tag:string
    iconSvg:string
    image:string
    constructor() {
        this.title = '图片' // 自定义菜单标题
        this.iconSvg = '<svg viewBox="0 0 1024 1024"><path d="M828.708571 585.045333a48.761905 48.761905 0 0 0-48.737523 48.761905v18.529524l-72.143238-72.167619a135.972571 135.972571 0 0 0-191.585524 0l-34.133334 34.133333-120.880762-120.953905a138.898286 138.898286 0 0 0-191.585523 0l-72.167619 72.167619V292.400762a48.786286 48.786286 0 0 1 48.761904-48.761905h341.23581a48.737524 48.737524 0 0 0 34.474667-83.285333 48.737524 48.737524 0 0 0-34.474667-14.287238H146.236952A146.212571 146.212571 0 0 0 0 292.400762v585.289143A146.358857 146.358857 0 0 0 146.236952 1024h584.996572a146.212571 146.212571 0 0 0 146.236952-146.310095V633.807238a48.786286 48.786286 0 0 0-48.761905-48.761905zM146.261333 926.45181a48.737524 48.737524 0 0 1-48.761904-48.761905v-174.128762l141.409523-141.458286a38.497524 38.497524 0 0 1 53.126096 0l154.526476 154.624 209.627428 209.724953H146.236952z m633.734096-48.761905c-0.073143 9.337905-3.145143 18.383238-8.777143 25.843809l-219.843048-220.94019 34.133333-34.133334a37.546667 37.546667 0 0 1 53.613715 0l140.873143 141.897143V877.714286zM1009.615238 160.231619L863.329524 13.897143a48.737524 48.737524 0 0 0-16.091429-10.24c-11.849143-4.87619-25.161143-4.87619-37.059047 0a48.761905 48.761905 0 0 0-16.067048 10.24l-146.236952 146.334476a49.005714 49.005714 0 0 0 69.217523 69.241905l62.902858-63.390476v272.627809a48.761905 48.761905 0 1 0 97.475047 0V166.083048l62.902857 63.390476a48.737524 48.737524 0 0 0 69.217524 0 48.761905 48.761905 0 0 0 0-69.241905z"></path></svg>'
        this.tag = 'button',
        this.image = ""
    }

    // 获取菜单执行时的 value ，用不到则返回空 字符串或 false // 插入的内容
    getValue(_editor: IDomEditor): string | boolean {   // TS 语法
        // 如果是拖拽的图片则存入imgsrc，则不用open打开，否则使用open打开
        return false;
        
    }

    // 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false
    isActive(_editor: IDomEditor): boolean {  // TS 语法
        return false
    }

    // 菜单是否需要禁用（如选中 H1 ，“引用”菜单被禁用），用不到则返回 false
    isDisabled(_editor: IDomEditor): boolean {   // TS 语法
        return false
    } 

    // 点击菜单时触发的函数
    async exec(editor: IDomEditor, _value: string | boolean) {   // TS 语法
        if (this.isDisabled(editor)) return
        let res =await open({
            'title':'选择图片',
            "multiple":true,
            'filters':[{
                name:"Image",
                extensions:['png','jpg','jpeg','gif','bmp','svg','apng','webp']
            }]
        })
        console.log(res)
        res?.filter(async (item)=>{
            let name =await basename(item.path);
            await copyFile(item.path,"image/"+name,{toPathBaseDir:BaseDirectory.AppData})
            let src = await appDataDir() + '\\image\\'+name
            let imgsrc = convertFileSrc(src);
            let img = {
                type: 'image',
                src:imgsrc,
                children: [{ text: '' }],
                style:{
                    width:'50%',
                    height:'auto'
                }
            }
            editor.insertNode(img)
        })
        
    }
}
const upimage = {
  key: 'upimage', // 定义 menu key ：要保证唯一、不重复（重要）
  factory() {
    return new upButtonMenu() // 把 `YourMenuClass` 替换为你菜单的 class
  },
}
Boot.registerMenu(upimage)
//#endregion


//#region 监听图片文件的拖拽
const filedrop = async function(){
    await appWindow.listen<string>("tauri://file-drop",async (e:any) => {
        if(e.payload.paths&&e.payload.paths.length>0){
            let res = e.payload.paths as string[]
            res?.filter(async (item)=>{
            let ext = await extname(item)
            if(['png','jpg','jpeg','gif','bmp','svg','apng','webp'].indexOf(ext)<0){
                return
            }
            console.log(ext);
            let name =await basename(item);
            await copyFile(item,"image/"+name,{toPathBaseDir:BaseDirectory.AppData})
            let src = await appDataDir() + '\\image\\'+name
            let imgsrc = convertFileSrc(src);
            let img = {
                type: 'image',
                src:imgsrc,
                children: [{ text: '' }],
                style:{
                    width:'50%',
                    height:'auto'
                }
            }
            editorRef.value.insertNode(img)
        })
        }
    });
}
//#endregion



// 颜色选择
const colorChange = function(){
    document.getElementById('colorBoard')?.click()
}

// 获取颜色
const colorInput = function(e:any){
    const { red,green,blue } = hexToRgba(e.srcElement.value,1);
    let notes = JSON.parse(localStorage.getItem("notes")||'[]')
    notes.filter((item:any)=>{
        if(appWindow.label == item.label){
            item.background = `${red},${green},${blue}`
            let tool:any = document.getElementsByClassName('w-e-toolbar')[0];
            tool.style.background = `rgba(${item.background},${item.transparent/100})`
            let text:any = document.getElementById('w-e-textarea-1');
            text.style.background = `rgba(${item.background},${item.transparent/100})`
            let con:any = document.getElementsByClassName('w-e-text-container')[0]
            con.style.background = 'transparent'
        }
    })
    localStorage.setItem("notes",JSON.stringify(notes))
}
// 16进制color转10进制
function hexToRgba(hex:string, opacity:number|string) {
    console.log(hex)
    let RGBA = "rgba(" + parseInt("0x" + hex.slice(1, 3)) + "," + parseInt("0x" + hex.slice(3, 5)) + "," + parseInt( "0x" + hex.slice(5, 7)) + "," + opacity + ")";
    return {
        red: parseInt("0x" + hex.slice(1, 3)),
        green: parseInt("0x" + hex.slice(3, 5)),
        blue: parseInt("0x" + hex.slice(5, 7)),
        rgba: RGBA
    }
}

// 透明度
const transparentbool = ref(false);
const rangeChange = function(e:any){
    let transparent = e.srcElement.value
    let notes = JSON.parse(localStorage.getItem("notes")||'[]')
    notes.filter((item:any)=>{
        if(item.label == appWindow.label){
            item.transparent = transparent
            let tool:any = document.getElementsByClassName('w-e-toolbar')[0];
            tool.style.background = `rgba(${item.background},${item.transparent/100})`
            let text:any = document.getElementById('w-e-textarea-1');
            text.style.background = `rgba(${item.background},${item.transparent/100})`
            let con:any = document.getElementsByClassName('w-e-text-container')[0]
            con.style.background = 'transparent'
        }
    })
    localStorage.setItem("notes",JSON.stringify(notes))
}
</script>

<template>
    <div class="note"> 
        <div class="note-container">
            <Toolbar
                id="Toolbar"
                v-show="toolshow"
                :style="{width:'100%',height:'40px'}"
                :editor="editorRef"
                :defaultConfig="toolbarConfig" 
                :mode="mode"
            />
            <Editor
                ref="refEditor"
                class="editor"
                :style="{width: '100%',height:toolshow?`calc(100% - ${ToolbarHeight}px)`:'100%',overflow:'hidden'}"
                v-model="valueHtml"
                :defaultConfig="editorConfig"
                :mode="mode"
                @onCreated="handleCreated"
                @onChange = "handleChange"
            />
        </div>
        <right-menu border-radius="10px" @rightclick="transparentbool=false">
            <div style="width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;" data-tauri-drag-region>
                <div>
                    <img :src="top?'icon/wintop.png':'icon/windown.png'" style="width: 25px;height: 25px;" @click="settop" />
                    <img :src="'icon/transparent.png'" style="width: 25px;height: 25px;" @click="transparentbool = !transparentbool">
                    <img :src="'icon/changecolor.png'" style="width: 25px;height: 25px;" @click="colorChange" >
                    <img @click="windowclose" :src="'./icon/close.png'" style="width: 25px;height: 25px;">
                </div>
            </div>
        </right-menu>
        <!-- 背景色选择 -->
        <input type="color" id="colorBoard" class="color-board" @input="colorInput">
        <!-- 透明度 -->
        <input type="range" v-show="transparentbool" @input="rangeChange" id="transparent" class="transparent" step="1" max="100" min="0">
    </div>
</template>

<style>
::-webkit-scrollbar{
    display: none;
}
.note{
    width: 100%;
    height: 100%;
    transition: all 0.1s linear;
}
.note-container{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 10px;
}
.editor{
    overflow: hidden;
}
/* 透明度 */
.transparent{
    position: absolute;
    z-index: 210;
    top: 10vh;
    width: 80vw;
    margin-left: 10vw;
}
/* 色板 */
.color-board{
    position: absolute;
    bottom: 0px;
    opacity: 0;
}
.w-e-text-container [data-slate-editor] p {
    margin: 0 0 !important; 
}
</style>

