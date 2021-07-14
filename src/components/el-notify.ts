import {ElNotification} from 'element-plus'
import {INotificationOptions} from "element-plus/packages/notification/src/notification.type";

function handler(opt: INotificationOptions | string, type: string) {
	let option: any = {}
	if (typeof opt === "string") {
		option.message = opt
	} else {
		option = {...opt, type}
	}
	ElNotification(option)
}

export default {
	default: (options: INotificationOptions) => {
		ElNotification(options)
	},
	success: (options: INotificationOptions | string) => {
		handler(options, 'success')
	},
	info: (options: INotificationOptions | string) => {
		handler(options, 'info')
	},
	warning: (options: INotificationOptions | string) => {
		handler(options, 'warning')
	},
	error: (options: INotificationOptions | string) => {
		handler(options, 'error')
	}
}
