export interface NetworkPacket {
  timestamp: number;
  sourceIP: string;
  destinationIP: string;
  protocol: string;
  bytesTransferred: number;
  packetsPerSecond: number;
}

export interface DetectionResult {
  timestamp: number;
  threat: number;
  details: string;
}