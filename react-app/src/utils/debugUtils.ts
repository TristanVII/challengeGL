type TrafficEntry = {
  type: "HTTP" | "WebSocket";
  method?: string;
  url: string;
  request?: any;
  response?: any;
  statusCode?: number;
  timestamp: string;
};

export class DebugUtils {
  private trafficLog: TrafficEntry[] = [];

  interceptFetch() {
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const startTime = new Date().toISOString();
      try {
        const response = await originalFetch(input, init);

        // Clone response to read and log its body
        const clonedResponse = response.clone();
        const responseBody = await clonedResponse.text();

        const url = input instanceof URL ? input.toString() : input;

        this.trafficLog.push({
          type: "HTTP",
          method: init?.method || "GET",
          url: typeof url === "string" ? url : url.url,
          request: init?.body,
          response: responseBody,
          statusCode: response.status,
          timestamp: startTime,
        });

        return response;
      } catch (error) {
        console.error("Fetch error:", error);
        throw error;
      }
    };
  }

  // Stop and Save Traffic Log
  stopAndSaveTrafficLog = () => {
    const blob = new Blob([JSON.stringify(this.trafficLog, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    // Create a download link
    const a = document.createElement("a");
    a.href = url;
    a.download = "traffic-log.json";
    a.click();

    // Clean up memory
    URL.revokeObjectURL(url);
  };

  startScreenCapture = async (): Promise<MediaRecorder> => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      const mediaRecorder = new MediaRecorder(stream);
      const recordedChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);

        // Create a download link for the recorded video
        const a = document.createElement("a");
        a.href = url;
        a.download = "screen-debug.webm";
        a.click();

        // Clean up memory
        URL.revokeObjectURL(url);
      };

      // Start recording
      mediaRecorder.start();
      return mediaRecorder;
    } catch (error) {
      console.error("Error accessing screen capture:", error);
      throw error;
    }
  };
}

// Intercept fetch API
