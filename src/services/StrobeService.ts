import { Vibration } from 'react-native';

class StrobeService {
  private intervalId: any = null;
  private isActive = false;

  startStrobe(hz: number, onTick?: () => void) {
    if (this.isActive) return;
    this.isActive = true;

    const intervalMs = 1000 / hz;

    const tick = () => {
      if (!this.isActive) return;
      if (onTick) onTick();
      if (hz < 5) Vibration.vibrate(10);
    };

    tick();
    this.intervalId = setInterval(tick, intervalMs);
  }

  stopStrobe() {
    this.isActive = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  isRunning() {
    return this.isActive;
  }
}

export default new StrobeService();
