// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_http::init())
        // .plugin(tauri_plugin_window_state::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            netspeed,
            setwallpaper,
            closewindow
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

use std::{thread, time};
use sysinfo::Networks;
use tauri::Manager;
#[tauri::command]
fn netspeed(app: tauri::AppHandle) {
    tauri::async_runtime::spawn(async move {
        let mut networks = Networks::new_with_refreshed_list();
        loop {
            networks.refresh();
            let mut received = 0;
            let mut transmitted = 0;
            for (_interface_name, network) in &networks {
                received = received + network.received();
                transmitted = transmitted + network.transmitted();
            }
            let _ = app.emit("netspeed", (received, transmitted));
            let ten_millis = time::Duration::from_millis(1000);
            thread::sleep(ten_millis);
        }
    });
}

#[tauri::command]
fn setwallpaper(src: String) {
    wallpaper::set_from_path(&src).unwrap();
}

#[tauri::command]
fn closewindow(app: tauri::AppHandle, label: String) {
    let windowlabel = app.get_webview_window(&label);
    match windowlabel {
        Some(w) => {
            let _ = w.close();
        }
        _ => {}
    }
}
