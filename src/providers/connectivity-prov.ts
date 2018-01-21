import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';

@Injectable()
export class ConnectivityProvider {

    constructor(private network: Network) {
    }

    isOnline(): boolean {
        return this.network.type !== 'none';
    }

    isOffline(): boolean {
        return !this.isOffline();
    }

    // Waits for internet availability before returning a promise. If the timeout is over, the function rejects.
    waitForOnline(timeoutVal_ms) {
        var ref = this;
        var p = new Promise(function (resolve, reject) {
            if (ref.isOnline()) {
                // If we are already online, we resolve the promise directly
                resolve('Already Online');
            } else {
                // We attach to the onOnline event to receive the trigger as soon as we get internet
                let connectSubscription = this.network.onConnect().subscribe(() => {
                    // We should always be online here, but we can never be so sure.
                    if (ref.isOnline()) {
                        clearTimeout(timeoutID);
                        // Small delay to make sure the connection is well established
                        setTimeout(function () {
                            resolve('Online Event');
                        }, 1000);
                    }
                });

                // If we are not online, we wait up to the timeout
                let timeoutID = setTimeout(function () {
                    // stop connect watch
                    connectSubscription.unsubscribe();
                    // If the timeout is over, we declare that we are not online and reject the promise
                    reject('Timeout Over');
                }, timeoutVal_ms);
            }
        });
        return p;
    }
}