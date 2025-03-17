import * as tf from '@tensorflow/tfjs';

export class IntrusionDetectionModel {
  private model: tf.LayersModel | null = null;

  async initialize() {
    // Create a simple neural network
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [4], units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(0.01),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });
  }

  async predict(packet: number[]): Promise<number> {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    const input = tf.tensor2d([packet]);
    const prediction = await this.model.predict(input) as tf.Tensor;
    const result = await prediction.data();
    input.dispose();
    prediction.dispose();
    return result[0];
  }

  // Simulate anomaly detection based on basic thresholds
  detectAnomaly(bytesTransferred: number, packetsPerSecond: number): boolean {
    const byteThreshold = 1000000; // 1MB
    const packetThreshold = 1000; // 1000 packets per second
    
    return bytesTransferred > byteThreshold || packetsPerSecond > packetThreshold;
  }
}