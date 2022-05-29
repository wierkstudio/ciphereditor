
import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('electronContext', {
  platform: process.platform
})
