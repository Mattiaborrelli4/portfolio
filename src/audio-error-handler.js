/**
 * Robust Audio Error Handler
 *
 * Features:
 * - Graceful degradation when audio fails
 * - Retry logic for failed loads
 * - User-friendly feedback
 * - Loading indicators
 * - Never crashes the site
 */

class AudioErrorHandler {
  constructor() {
    // Configuration
    this.config = {
      maxRetries: 3,
      retryDelay: 1000, // ms
      loadingTimeout: 10000, // 10 seconds
      enableLogging: true
    };

    // State tracking
    this.state = {
      audioSupported: true,
      resourcesLoaded: false,
      loadingFailed: false,
      loadAttempts: 0,
      loadedResources: new Set(),
      failedResources: new Set()
    };

    // UI Elements
    this.ui = {
      loadingIndicator: null,
      errorMessage: null,
      melodyBtn: null
    };

    // Initialize
    this.init();
  }

  /**
   * Initialize the error handler
   */
  init() {
    try {
      this.checkAudioSupport();
      this.createUIElements();
      this.log('Audio error handler initialized', 'info');
    } catch (error) {
      this.handleError('Initialization error', error);
    }
  }

  /**
   * Check if Web Audio API is supported
   */
  checkAudioSupport() {
    try {
      const audioContext = window.AudioContext || window.webkitAudioContext;
      const youtubeAPI = window.YT;

      if (!audioContext && !youtubeAPI) {
        this.state.audioSupported = false;
        this.log('Web Audio API and YouTube API not supported', 'warning');
        this.disableAudioFeatures();
        return false;
      }

      return true;
    } catch (error) {
      this.handleError('Audio support check failed', error);
      this.state.audioSupported = false;
      this.disableAudioFeatures();
      return false;
    }
  }

  /**
   * Disable audio-related features gracefully
   */
  disableAudioFeatures() {
    try {
      // Disable melody button
      const melodyBtn = document.getElementById('melodyBtn');
      if (melodyBtn) {
        melodyBtn.disabled = true;
        melodyBtn.classList.add('audio-disabled');
        melodyBtn.innerHTML = `
          <span class="melody-btn-icon">🔇</span>
          Audio not available
        `;
        melodyBtn.style.opacity = '0.5';
        melodyBtn.style.cursor = 'not-allowed';
      }

      // Update skill buttons
      const skillButtons = document.querySelectorAll('.skill-note');
      skillButtons.forEach(btn => {
        btn.classList.add('audio-disabled');
        btn.setAttribute('title', 'Audio not available in this browser');
      });

      // Show user-friendly message
      this.showUserMessage(
        'Audio features are not available in your browser. The site will work normally without audio.',
        'info'
      );

      this.log('Audio features disabled gracefully', 'info');
    } catch (error) {
      this.handleError('Failed to disable audio features', error);
    }
  }

  /**
   * Create UI elements for loading/error feedback
   */
  createUIElements() {
    // Create loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'audio-loading-indicator';
    loadingIndicator.innerHTML = `
      <div class="loading-spinner"></div>
      <span class="loading-text">Loading audio...</span>
    `;
    loadingIndicator.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--color-primary, #2C5F7F);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      display: none;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    document.body.appendChild(loadingIndicator);
    this.ui.loadingIndicator = loadingIndicator;

    // Create error message container
    const errorMessage = document.createElement('div');
    errorMessage.className = 'audio-error-message';
    errorMessage.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #f44336;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      display: none;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      max-width: 400px;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    document.body.appendChild(errorMessage);
    this.ui.errorMessage = errorMessage;
  }

  /**
   * Load audio resources with retry logic
   */
  async loadAudioResources(resources) {
    if (!this.state.audioSupported) {
      this.log('Audio not supported, skipping resource loading', 'warning');
      return { success: [], failed: resources };
    }

    this.showLoading(true);
    this.state.loadAttempts++;

    try {
      // Use Promise.allSettled to load all resources in parallel
      const results = await Promise.allSettled(
        resources.map(resource => this.loadResourceWithRetry(resource))
      );

      // Process results
      const successful = [];
      const failed = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successful.push(resources[index]);
          this.state.loadedResources.add(resources[index].id);
        } else {
          failed.push(resources[index]);
          this.state.failedResources.add(resources[index].id);
          this.log(
            `Failed to load resource: ${resources[index].id}`,
            'error',
            result.reason
          );
        }
      });

      // Update state
      this.state.resourcesLoaded = successful.length > 0;
      this.state.loadingFailed = failed.length === resources.length;

      // Show appropriate message
      if (this.state.loadingFailed) {
        this.showUserMessage(
          'Audio could not be loaded. The site will work normally without audio.',
          'error'
        );
      } else if (failed.length > 0) {
        this.showUserMessage(
          `${successful.length} of ${resources.length} audio resources loaded.`,
          'warning'
        );
      } else {
        this.log('All audio resources loaded successfully', 'success');
      }

      this.showLoading(false);

      return { success: successful, failed };
    } catch (error) {
      this.handleError('Audio resource loading failed', error);
      this.showLoading(false);
      return { success: [], failed: resources };
    }
  }

  /**
   * Load a single resource with retry logic
   */
  async loadResourceWithRetry(resource, attempt = 1) {
    const { id, loader } = resource;

    try {
      this.log(`Loading resource: ${id} (attempt ${attempt})`, 'info');
      const result = await loader();

      if (attempt > 1) {
        this.log(`Resource ${id} loaded successfully after ${attempt} attempts`, 'success');
      }

      return result;
    } catch (error) {
      this.log(
        `Attempt ${attempt} failed for resource ${id}`,
        'warning',
        error
      );

      // Retry if we haven't exceeded max retries
      if (attempt < this.config.maxRetries) {
        await this.delay(this.config.retryDelay * attempt); // Exponential backoff
        return this.loadResourceWithRetry(resource, attempt + 1);
      }

      // Max retries exceeded
      throw new Error(
        `Failed to load resource ${id} after ${this.config.maxRetries} attempts: ${error.message}`
      );
    }
  }

  /**
   * Load YouTube API with error handling
   */
  async loadYouTubeAPI() {
    return new Promise((resolve, reject) => {
      try {
        // Check if already loaded
        if (window.YT && window.YT.Player) {
          this.log('YouTube API already loaded', 'info');
          resolve(window.YT);
          return;
        }

        // Set up timeout
        const timeout = setTimeout(() => {
          reject(new Error('YouTube API loading timeout'));
        }, this.config.loadingTimeout);

        // Wait for API to be ready
        window.onYouTubeIframeAPIReady = () => {
          clearTimeout(timeout);
          if (window.YT && window.YT.Player) {
            this.log('YouTube API loaded successfully', 'success');
            resolve(window.YT);
          } else {
            reject(new Error('YouTube API loaded but Player not available'));
          }
        };

        // Load API script
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('Failed to load YouTube API script'));
        };
        document.body.appendChild(tag);

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Initialize Web Audio Context with error handling
   */
  async initAudioContext() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;

      if (!AudioContext) {
        throw new Error('Web Audio API not supported');
      }

      const context = new AudioContext();

      // Try to resume context (required for some browsers)
      if (context.state === 'suspended') {
        await context.resume();
      }

      this.log('AudioContext initialized successfully', 'success');
      return context;
    } catch (error) {
      throw new Error(`Failed to initialize AudioContext: ${error.message}`);
    }
  }

  /**
   * Show/hide loading indicator
   */
  showLoading(show) {
    if (this.ui.loadingIndicator) {
      this.ui.loadingIndicator.style.display = show ? 'flex' : 'none';
    }
  }

  /**
   * Show user-friendly message
   */
  showUserMessage(message, type = 'info') {
    // Log to console
    this.log(message, type);

    // Show in UI temporarily
    if (this.ui.errorMessage) {
      this.ui.errorMessage.textContent = message;
      this.ui.errorMessage.style.background =
        type === 'error' ? '#f44336' :
        type === 'warning' ? '#ff9800' :
        type === 'success' ? '#4caf50' :
        '#2196f3';

      this.ui.errorMessage.style.display = 'flex';

      // Auto-hide after 5 seconds
      setTimeout(() => {
        if (this.ui.errorMessage) {
          this.ui.errorMessage.style.display = 'none';
        }
      }, 5000);
    }
  }

  /**
   * Handle errors gracefully
   */
  handleError(context, error) {
    const errorMessage = error?.message || String(error);

    this.log(`${context}: ${errorMessage}`, 'error');

    // Never throw - always handle gracefully
    // The site must continue to work even if audio fails completely

    return {
      handled: true,
      context,
      error: errorMessage
    };
  }

  /**
   * Logging utility
   */
  log(message, level = 'info', data = null) {
    if (!this.config.enableLogging) return;

    const timestamp = new Date().toISOString();
    const prefix = `[AudioErrorHandler ${timestamp}]`;

    const styles = {
      info: 'color: #2196f3',
      success: 'color: #4caf50',
      warning: 'color: #ff9800',
      error: 'color: #f44336'
    };

    const style = styles[level] || styles.info;

    if (data) {
      console.log(`${prefix} %c${message}`, style, data);
    } else {
      console.log(`${prefix} %c${message}`, style);
    }
  }

  /**
   * Utility: Delay function
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get current state
   */
  getState() {
    return {
      ...this.state,
      loadedCount: this.state.loadedResources.size,
      failedCount: this.state.failedResources.size
    };
  }

  /**
   * Cleanup
   */
  destroy() {
    try {
      // Remove UI elements
      if (this.ui.loadingIndicator) {
        this.ui.loadingIndicator.remove();
      }
      if (this.ui.errorMessage) {
        this.ui.errorMessage.remove();
      }

      this.log('Audio error handler destroyed', 'info');
    } catch (error) {
      this.handleError('Cleanup error', error);
    }
  }
}

// Export singleton instance
export const audioErrorHandler = new AudioErrorHandler();

// Export class for testing/custom instances
export default AudioErrorHandler;
