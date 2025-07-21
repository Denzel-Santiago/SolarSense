// INA219
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WsIna219Service implements OnDestroy {
  private socket!: WebSocket;
  private messageSubject = new Subject<any>();
  private readonly url = 'ws://54.82.202.19:8004/ws/voltaje';

  constructor() {
    this.connect();
  }

  private connect(): void {
    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        console.log('[WebSocket INA219] Conexión establecida');
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.messageSubject.next(data);
        } catch (error) {
          console.error('[WebSocket INA219] Error al parsear el mensaje:', error);
        }
      };

      this.socket.onerror = (event) => {
        console.error('[WebSocket INA219] Error de conexión:', event);
      };

      this.socket.onclose = (event) => {
        console.warn('[WebSocket INA219] Conexión cerrada', event);
      };
    } catch (error) {
      console.error('[WebSocket INA219] Error al iniciar la conexión:', error);
    }
  }

  getMessages(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
