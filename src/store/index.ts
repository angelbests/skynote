import { defineStore } from "pinia";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
interface windowType {
    label:string,
    title?:string,
    url:string,
    width:number,
    height:number,
    decorations?:boolean,
    transparent?:boolean,
    shadow?:boolean,
    fileDropEnabled?:boolean,
    center?:boolean,
    contentProtected?:boolean,
    x?:number,
    y?:number,
    minimizable?:boolean,
    maximizable?:boolean,
    alwaysOnTop?:boolean,
    skipTaskbar?:boolean,
    parent?:any
    
}
export const systemStore = defineStore("system",{
    state:()=>{
        return {
            windows:[] as windowType[]
        }
    },
    actions:{
        async createWindow(windowOption:windowType){
            this.windows = JSON.parse(localStorage.getItem("windows")||'[]');
            let boolarr = this.windows.filter(item=>{
                if(windowOption.label == item.label){
                    return true
                }else{
                    return false
                }
            })
            if(boolarr.length>0){
                return
            }
            
            const appWindow = new WebviewWindow(windowOption.label,{
                ...windowOption
            })
            this.windows.push(windowOption)
            localStorage.setItem("windows",JSON.stringify(this.windows))

            appWindow.listen("tauri://destroyed",()=>{
                this.windows = JSON.parse(localStorage.getItem("windows")||'[]');
                this.windows.filter((item,index)=>{
                    if(item.label == appWindow.label){
                        this.windows.splice(index,1)
                    }
                })
                localStorage.setItem("windows",JSON.stringify(this.windows))
            })
            
            appWindow.listen("tauri://move",async (e:any)=>{
                const factor =await appWindow.scaleFactor();
                this.windows = JSON.parse(localStorage.getItem("windows")||'[]');
                this.windows.filter(item=>{
                    if(item.label == appWindow.label){
                        item.x = Math.floor(e.payload.x/factor)
                        item.y = Math.floor(e.payload.y/factor)
                    }
                })
                localStorage.setItem("windows",JSON.stringify(this.windows))
            })
        },
        initWindow(){
            this.windows = JSON.parse(localStorage.getItem("windows")||'[]');
            if(this.windows.length<=0) return
            this.windows.filter(async (item)=>{
                const appWindow = new WebviewWindow(item.label,{
                    ...item
                })
                appWindow.listen("tauri://destroyed",()=>{
                    this.windows = JSON.parse(localStorage.getItem("windows")||'[]');
                    this.windows.filter((item,index)=>{
                        if(item.label == appWindow.label){
                            this.windows.splice(index,1)
                        }
                    })
                    localStorage.setItem("windows",JSON.stringify(this.windows))
                })
                
                appWindow.listen("tauri://move",async (e:any)=>{
                    const factor =await appWindow.scaleFactor();
                    console.log(e)
                    this.windows = JSON.parse(localStorage.getItem("windows")||'[]');
                    this.windows.filter(item=>{
                        if(item.label == appWindow.label){
                            item.x = Math.floor(e.payload.x/factor)
                            item.y = Math.floor(e.payload.y/factor)
                        }
                    })
                    localStorage.setItem("windows",JSON.stringify(this.windows))
                })
            })
        }
    },
    getters:{

    }
})

export const notes = defineStore("notes",{
    state:()=>{
        return {
            notes:[] as {
                color:string,
                html:string,
                background:string,
                transparent:number,
            }[]
        }
    },
    actions:{

    },
    getters:{

    }
})


