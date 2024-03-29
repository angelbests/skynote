import { createRouter,createWebHashHistory,Router,RouteRecordRaw } from "vue-router";

const routes:RouteRecordRaw[] = [
    {
        path:"/",
        redirect:"/home"
    },
    {
        path:"/home",
        name:"home",
        component:()=>import("./../views/home/Home.vue")
    },
    {
        path:"/note",
        name:"note",
        component:()=>import("./../views/note/Note.vue")
    },
    {
        path:"/netspeed",
        name:"netspeed",
        component:()=>import("./../views/netspeed/NetSpeed.vue")
    },
    {
        path:"/wallpaper",
        name:"wallpaper",
        component:()=>import("./../views/wallpaper/Wallpaper.vue")
    },
]

const router:Router = createRouter({
    routes,
    history:createWebHashHistory()
})

export default router