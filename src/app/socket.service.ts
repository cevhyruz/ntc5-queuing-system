import { ApplicationRef, inject, Injectable } from '@angular/core';
import { first, Observable, Subject } from 'rxjs';
import { QueueInterface } from './queue.interface';

import { Socket, io } from 'socket.io-client';




@Injectabl({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000', { autoConnect: false });

    inject(ApplicationRef).isStable.pipe(first((isStable) => isStable))
    .subscribe(() => {
      this.socket.connect()
    });
  }


  on(event: string): Observable<QueueInterface[]> {
    return new Observable((observer) => {
      this.socket.on(event, (data: QueueInterface[]) => {
        observer.next(data);
      });
      return () => {
        this.socket.off(event);
      };
    });
  }


  emit(event: string, arg: any) {
    this.socket.emit('howdy', arg);
  }
}
