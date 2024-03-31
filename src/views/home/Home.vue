<script lang="ts" setup>
import RightMenu from "./../../components/RightMenu.vue"
import { ref,reactive,onMounted } from 'vue'
import { forbidselect } from './../../common/index.ts'
import { invoke } from "@tauri-apps/api/core"
import { mkdir,BaseDirectory   } from "@tauri-apps/plugin-fs"
import { systemStore } from "../../store";
import { exit } from '@tauri-apps/plugin-process';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import { getCurrent,LogicalSize } from "@tauri-apps/api/window"
const system = systemStore();
invoke("netspeed");
mkdir("image",{baseDir:BaseDirectory.AppData,recursive:true})
onMounted(()=>{
    getCurrent().setAlwaysOnTop(false)
    forbidselect('menus')
    document.getElementById("notes")?.addEventListener("contextmenu",(e)=>{
        e.preventDefault()
    })
    system.initWindow()
    window.addEventListener("storage",(e)=>{        
        if(e.key == "notes"){
            notes.length = 0
            notes.push(...JSON.parse(e.newValue as string))
        }
    })
})
const toolshow = ref<boolean>(false)
const color =ref(['#FFE66E','#A1EF9B','#FFAFDF','#D7AFFF','#9EDFFF','#E0E0E0','#767676','pink'])
const notes = reactive(JSON.parse(localStorage.getItem("notes")||'[]'))
const setindex = ref(0);
const colorshow = ref(false)
const setcolor = function(label:number,color:string){
    // 16进制color转10进制
    let {red,green,blue} = hexToRgba(color,1)
    notes.filter((item:any)=>{
        if(item.label == label){
            item.background = `${red},${green},${blue}`
            item.transparent = 100
        }
    })
    colorshow.value = false
    localStorage.setItem("notes",JSON.stringify(notes))
}

function hexToRgba(hex:string, opacity:number|string) {
    let RGBA = "rgba(" + parseInt("0x" + hex.slice(1, 3)) + "," + parseInt("0x" + hex.slice(3, 5)) + "," + parseInt( "0x" + hex.slice(5, 7)) + "," + opacity + ")";
    return {
        red: parseInt("0x" + hex.slice(1, 3)),
        green: parseInt("0x" + hex.slice(3, 5)),
        blue: parseInt("0x" + hex.slice(5, 7)),
        rgba: RGBA
    }
}

const uuid = function():string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    })+"-"+new Date().getTime();
}

const newnotewindow = function(){
    let label = 'note-'+uuid();
    notes.unshift({
        label:label,
        html:"",
        background:"223,225,225",
        transparent:100
    })
    shownotewindow(label);
    localStorage.setItem("notes",JSON.stringify(notes))
}

const shownotewindow = function(label:any){
    system.createWindow({
        label:label,
        title:"note",
        url:'/#/note',
        width:370,
        height:400,
        x:200,
        y:200,
        decorations:false,
        transparent:true,
        fileDropEnabled:true,
        contentProtected:true,
        parent:getCurrent()
    })
}

const getnetspeed = function(){
    system.createWindow({
        label:"netspeed",
        title:"netspeed",
        url:'/#/netspeed',
        width:100,
        height:50,
        x:200,
        y:200,
        shadow:false,
        decorations:false,
        transparent:true,
        minimizable:false,
        maximizable:false,
        skipTaskbar:true,
        contentProtected:true,
        parent:getCurrent()
    }) 
}

const getwallpaper = function(){
    system.createWindow({
        label:"wallpaper",
        title:"wallpaper",
        url:'/#/wallpaper',
        width:1000,
        height:600,
        x:200,
        y:200,
        decorations:false,
        transparent:true,
        minimizable:false,
        maximizable:false,
        // contentProtected:true
    })
}

const getweather = function(){
    system.createWindow({
        label:"weather",
        title:"weather",
        url:'/#/weather',
        width:200,
        height:200,
        x:200,
        y:200,
        decorations:false,
        transparent:true,
        minimizable:false,
        maximizable:false,
        shadow:false,
        contentProtected:true,
        parent:getCurrent()
    })
}

// close 
const windowclose = function(){
    exit();
}

// getColor

const getcolor =async function(){
    if (!window.EyeDropper) {
        return 
    }
    const eyeDropper = new window.EyeDropper();
    window.Clipboard
    let {sRGBHex} = await eyeDropper.open();
    console.log(sRGBHex)
    await writeText(sRGBHex);
}

const closenote = function(label:string){
    notes.filter((item:any,index:number)=>{
        if(item.label == label){
            notes.splice(index,1);
            invoke("closewindow",{label:label});
        }
    })
    localStorage.setItem("notes",JSON.stringify(notes))
}

const top = ref(false)
const settop = function(){
    top.value = !top.value
    getCurrent().setAlwaysOnTop(top.value)
}

const notesshow = ref(true)
const notestoggle = function(){
    notesshow.value = !notesshow.value
    if(notesshow.value){
        getCurrent().setSize(new LogicalSize(400,930))
        getCurrent().setShadow(false)
    }else{
        getCurrent().setSize(new LogicalSize(400,80))
        getCurrent().setShadow(true)
    }
}
</script>
 
<template> 
    <div class="home"> 
        <div id="menus" class="menus" data-tauri-drag-region>
            <img :src="'./icon/add.png'" class="menu" @click="newnotewindow" draggable="false" />
            <img :src="'./icon/Picture.png'" class="menu" @click="getwallpaper" draggable="false" />
            <img :src="'./icon/getcolor.png'" class="menu" @click="getcolor" draggable="false" />
            <img :src="'./icon/netspeed.png'" class="menu" @click="getnetspeed" draggable="false" />
            <img :src="'./icon/weather.png'" class="menu" @click="getweather" draggable="false" />
            <right-menu v-model="toolshow" border-radius="10px">
                <div class="rightmenudiv" data-tauri-drag-region>
                    <div>
                        <img @click="notestoggle" :src="notesshow?'icon/pre.png':'icon/next.png'" class="rightmenuimg" style="transform: rotate(90deg);" draggable="false" />
                    </div>
                    <div >
                        <img :src="top?'icon/wintop.png':'icon/windown.png'" class="rightmenuimg" @click="settop" draggable="false" />
                    </div>
                    <div>
                        <img @click="windowclose" :src="'./icon/close.png'" class="rightmenuimg" draggable="false">
                    </div>
                </div>
            </right-menu>
        </div>
        <div id="notes" class="notes" v-show="notesshow">
            <div v-for="(itemnote,indexnote) in notes"  :style="{background:`rgba(${itemnote.background},${itemnote.transparent/100})`}" id="note" class="note">
                <div class="title"  >
                    <div class="titlebtn" @click="shownotewindow(itemnote.label)">
                        <img :src="'./icon/edit.png'" style="width: 20px;height: 20px;" :draggable="false">
                    </div>
                    <div class="titlebtn" @click="colorshow = true,setindex = indexnote">
                        <img :src="'./icon/changecolor.png'" style="width: 20px;height: 20px;" :draggable="false">
                    </div>
                    <div class="titlebtn" @click="closenote(itemnote.label)">
                        <img :src="'./icon/close.png'" style="width: 20px;height: 20px;" :draggable="false">
                    </div>
                </div>
                
                <div class="html" >
                    <div v-html="itemnote.html">

                    </div>
                </div>
                <div class="setcolor" :style="{top:(colorshow&&indexnote==setindex)?'0px':'-40px'}">
                    <div v-for="itemcolor in color" :style="{background:itemcolor,height:'40px',width:'12.5%'}" @click="setcolor(itemnote.label,itemcolor)"></div>
                </div>
                <right-menu border-radius="10px"></right-menu>
            </div>
        </div>
    </div>
</template>

<style lang="less">

::-webkit-scrollbar{
    display: none;
}
.home{
    position: relative;
    width: 100%;
    height: 100%;
    transition: all 0.1s linear;
    box-sizing: border-box;
    .notes{
        margin-top: 10px;
        width: 100%;
        height: calc(100% - 90px);
        background: pink;
        border-radius: 10px;
        overflow: hidden;
        overflow-y: scroll;
        box-sizing: border-box;
        padding: 10px;
        transition: all 0.2s linear;
        .note{
            transition: all 0.2s linear;
            width: 100%;
            height: 400px;
            border-radius: 10px;
            box-sizing: border-box;
            filter: drop-shadow(0px 0px 5px black);
            display: flex;
            flex-direction: column;
            margin-bottom: 20px;
            padding: 10px;
            position: relative;
            overflow: hidden;
            overflow-y: scroll;
            .html{
                width: 100%;
                height: 100%;
                overflow: hidden;
                overflow-y: scroll;
            }
            .title{
                width: 100%;
                height: 30px;
                display: flex;
                flex-direction: row;
                justify-content: right;
                .titlebtn{
                    width: 30px;
                    height: 30px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 50%;
                    margin-right: 10px;
                    background: rgba(224,223,233,0.5);
                }
                .titlebtn:hover{
                    filter: drop-shadow(0px 0px 10px black);
                    background: rgba(125,124,125,0.2);
                }
            }
            .setcolor{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 40px;
                background: white;
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
                display: flex;
                flex-direction: row;
                transition: all 0.2s linear;
            }
        }
    }
    .menus{
        position: relative;
        width: 100%;
        height: 80px;
        background: pink;
        border-radius: 10px;
        display: flex;
        justify-content:space-evenly;
        align-items: center; 
        .menu{
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: transparent;
            transition: all 0.2s linear;
            display: flex;
            justify-content:space-evenly;
            align-items: center; 
        }
        .rightmenudiv{
            width: 100%;height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            .rightmenuimg {
                width: 25px;
                height: 25px;
                // border-radius: 50%;
                margin-right: 10px;
            }
        }
        .menu:hover{
            width: 60px;
            height: 60px;
            filter: drop-shadow(0px 0px 10px black);
            
        }
    }
}

</style>

