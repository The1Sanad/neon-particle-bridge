
type WindowInfo = {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
};

class WindowManager {
  private static instance: WindowManager;
  private windows: Map<string, WindowInfo>;
  private id: string;
  private channel: BroadcastChannel;

  private constructor() {
    this.windows = new Map();
    this.id = crypto.randomUUID();
    this.channel = new BroadcastChannel('window-manager');
    
    this.setupListeners();
    this.announceWindow();
  }

  static getInstance(): WindowManager {
    if (!WindowManager.instance) {
      WindowManager.instance = new WindowManager();
    }
    return WindowManager.instance;
  }

  private setupListeners() {
    this.channel.onmessage = (event) => {
      const { type, data } = event.data;
      
      switch (type) {
        case 'WINDOW_REGISTERED':
          if (data.id !== this.id) {
            this.windows.set(data.id, data);
          }
          break;
        case 'WINDOW_UNREGISTERED':
          this.windows.delete(data.id);
          break;
        case 'REQUEST_SYNC':
          if (data.requesterId !== this.id) {
            this.announceWindow();
          }
          break;
      }
    };

    window.addEventListener('beforeunload', () => {
      this.channel.postMessage({
        type: 'WINDOW_UNREGISTERED',
        data: { id: this.id }
      });
    });
  }

  private announceWindow() {
    const windowInfo: WindowInfo = {
      id: this.id,
      position: { x: window.screenX, y: window.screenY },
      size: { width: window.innerWidth, height: window.innerHeight }
    };

    this.channel.postMessage({
      type: 'WINDOW_REGISTERED',
      data: windowInfo
    });
  }

  public getWindowInfo(): WindowInfo[] {
    return Array.from(this.windows.values());
  }

  public getCurrentWindowInfo(): WindowInfo {
    return {
      id: this.id,
      position: { x: window.screenX, y: window.screenY },
      size: { width: window.innerWidth, height: window.innerHeight }
    };
  }

  public syncWindows() {
    this.channel.postMessage({
      type: 'REQUEST_SYNC',
      data: { requesterId: this.id }
    });
  }
}

export default WindowManager;
