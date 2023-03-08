import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

interface SnackMessage {
  message: string;
  action: string;
  className: string;
  duration: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  messages: SnackMessage[] = [];
  timeout: NodeJS.Timeout | undefined;

  constructor(private readonly snackBar: MatSnackBar, private readonly _translateService: TranslateService) {}

  /**
   * Presents a toast displaying the message with a green background
   * @param message Message to display
   * @example
   * this.notificationService.success("confirm it's ok");
   */
  success(message: string) {
    this._prepareMessage(message).then((mess) => {
      this.showMessage(mess, '', 'success-snackbar');
    });
  }

  /**
   * Presents a toast displaying the message with a red background
   * @param message Message to display
   * @example
   * this.notificationService.error("confirm canceled");
   */
  error(message: string) {
    this._prepareMessage(message).then((mess) => {
      this.showMessage(mess, '', 'error-snackbar');
    });
  }

  private showMessage(message: string, action: string, className = '', duration = 3000) {
    this.messages.push({ message: message, action: action, className: className, duration: duration });
    this.showMessages();
  }

  private showMessages() {
    if (this.messages.length === 0 || this.timeout) {
      return;
    }

    const snack = this.messages.shift();
    if (snack) {
      this.openSnackBar(snack.message, snack.action, snack.className, snack.duration);

      this.timeout = setTimeout(() => {
        this.timeout = undefined;
        this.showMessages();
      }, snack.duration + 500);
    }
  }

  private _prepareMessage(mess: string, ...args: any[]): Promise<string> {
    return new Promise<string>((resolve) => {
      if (mess.match('.* [|] translate')) {
        const key = mess.replace(' | translate', '');
        this._translateService.get(key, args).subscribe((translated) => {
          resolve(translated);
        });
      } else {
        let output = mess;

        if (args && args.length > 0) {
          args.forEach((arg) => {
            output += ' - ' + JSON.stringify(arg);
          });
        }

        resolve(output);
      }
    });
  }

  /**
   * Displays a toast with provided message
   * @param message Message to display
   * @param action Action text, e.g. Close, Done, etc
   * @param className Optional extra css class to apply
   * @param duration Optional number of SECONDS to display the notification for
   */
  private openSnackBar(message: string, action: string, className = '', duration = 1000) {
    console.log(message);
    console.log(className);

    this.snackBar.open(message, action, {
      duration: duration,
      panelClass: [className],
    });
  }
}
