/* eslint "no-param-reassign": 0 */

// eslint-disable-next-line no-undef
interface NotificationProps extends NotificationOptions{
  title: string
}

interface IProps {
  icon?: string
  badge?: string
}

export default class Notification {
  private _registration: undefined | ServiceWorkerRegistration;

  private _navigator: Navigator|undefined;

  private _requestingPermission: undefined | boolean;

  private _permissionGranted: boolean

  private _icon: string|undefined;

  private _badge: string|undefined;

  private _requestedPermission:boolean

  constructor({ icon, badge }: IProps) {
    this._navigator = globalThis.navigator;
    this._icon = icon;
    this._badge = badge;
    this._requestedPermission = false;
    this._permissionGranted = Notification.isPermissionGranted();
    this._getServiceWorkerRegistration().then((r) => this._registration = r);
  }

  public requestPermission(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!Notification.isNotificationAvailable()) {
        this._requestedPermission = true;
        return reject(new Error('Notification API is not available in browser/device'));
      }

      this._requestingPermission = true;
      globalThis.Notification.requestPermission()
        .then((permission: NotificationPermission) => {
          if (permission !== 'granted') {
            return reject(new Error('Notification Permission was denied by user, exiting'));
          }

          this._permissionGranted = true;

          this._getServiceWorkerRegistration().then((r) => {
            this._registration = r;
            resolve();
          }).catch((err) => reject(new Error(`Could not get service worker registration, unable to proceed ${err.reason}`)));
        })
        .catch((err) => {
          console.error(
            '[Notification:constructor] failed to request permission',
            err,
          );
        })
        .finally(() => {
          this._requestingPermission = false;
        });
    });
  }

  private _getServiceWorkerRegistration():Promise<ServiceWorkerRegistration> {
    return new Promise((resolve, reject) => {
      this._navigator?.serviceWorker.getRegistration().then(resolve).catch(reject);
    });
  }

  public static isNotificationAvailable(): boolean {
    return !!globalThis.Notification;
  }

  public static isPermissionGranted() {
    return globalThis?.Notification.permission === 'granted';
  }

  public showNotification({ title, ...options }: NotificationProps): void {
    if (!Notification.isPermissionGranted() || !this._requestedPermission) {
      this.requestPermission().then(() => {
        if (!this._registration) {
          this._getServiceWorkerRegistration().then((r) => {
            this._registration = r;

            if (!options.icon) options.icon = this._icon;
            if (!options.badge) options.badge = this._badge;

            this._registration.showNotification(title, options);
          });
        }
      });
    }
  }
}
