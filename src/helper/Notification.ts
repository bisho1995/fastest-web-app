/*global globalThis*/

export default class Notification {
	private _registration: undefined | ServiceWorkerRegistration;
	private _navigator: Navigator|undefined;
	private _requestingPermission: undefined | boolean;
	private _permissionGranted: undefined|boolean

	constructor(private icon: string, private badge?: string) {
		this._navigator = globalThis.navigator
		window.navigator

		this.requestPermission();

	}

	public requestPermission(): Promise<any> {
		return new Promise((resolve, reject)=>{
			if(!this.isNotificationAvailable()) return reject(new Error("Notification API is not available in browser/device"))

			this._requestingPermission = true;
			globalThis.Notification.requestPermission()
				.then((permission: NotificationPermission) => {
					if(permission !== "granted") {
						return reject(new Error(`Notification Permission was denied by user, exiting`))
					}

					this._permissionGranted = true

				this._navigator?.serviceWorker.getRegistration().then((r)=>{
					this._registration=r
					resolve()
				}).catch((err=>{
					return reject(`Could not get service worker registration, unable to proceed ${err.reason}`)
				}))
				})
				.catch((err) => {
					console.error(
						`[Notification:constructor] failed to request permission`,
						err
					);
				})
				.finally(() => {
					this._requestingPermission = false;
				});
		})

	}

	public isNotificationAvailable(): boolean {
		return !!globalThis.Notification;
	}

	public showNotification(): void {}
}
