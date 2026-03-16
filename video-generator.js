// AI Text-to-Video Generator JavaScript
class VideoGenerator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.videoHistory = JSON.parse(localStorage.getItem('videoHistory')) || [];
        this.currentGeneration = null;
        
        // API Configuration (you'll need to sign up for these services)
        this.apis = {
            runwayml: {
                apiKey: 'YOUR_RUNWAY_API_KEY',
                endpoint: 'https://api.runwayml.com/v1/video_generations'
            },
            stabilityai: {
                apiKey: 'YOUR_STABILITY_API_KEY', 
                endpoint: 'https://api.stability.ai/v1/video/generation'
            },
            // Fallback to demo mode
            demo: true
        };
    }

    initializeElements() {
        this.elements = {
            prompt: document.getElementById('videoPrompt'),
            style: document.getElementById('videoStyle'),
            duration: document.getElementById('videoDuration'),
            durationValue: document.getElementById('durationValue'),
            generateBtn: document.getElementById('generateBtn'),
            btnText: document.querySelector('.btn-text'),
            loadingSpinner: document.querySelector('.loading-spinner'),
            progressSection: document.getElementById('progressSection'),
            progressFill: document.getElementById('progressFill'),
            progressText: document.getElementById('progressText'),
            resultsSection: document.getElementById('resultsSection'),
            generatedVideo: document.getElementById('generatedVideo'),
            downloadBtn: document.getElementById('downloadBtn'),
            regenerateBtn: document.getElementById('regenerateBtn'),
            shareBtn: document.getElementById('shareBtn'),
            videoHistory: document.getElementById('videoHistory')
        };
    }

    bindEvents() {
        this.elements.generateBtn.addEventListener('click', () => this.generateVideo());
        this.elements.duration.addEventListener('input', (e) => {
            this.elements.durationValue.textContent = `${e.target.value}s`;
        });
        this.elements.downloadBtn.addEventListener('click', () => this.downloadVideo());
        this.elements.regenerateBtn.addEventListener('click', () => this.regenerateVideo());
        this.elements.shareBtn.addEventListener('click', () => this.shareVideo());
        
        this.loadVideoHistory();
    }

    async generateVideo() {
        const prompt = this.elements.prompt.value.trim();
        const style = this.elements.style.value;
        const duration = this.elements.duration.value;

        if (!prompt) {
            this.showError('Please enter a video description');
            return;
        }

        this.showProgress();
        this.setLoading(true);

        try {
            // In demo mode, create a simulated video
            if (this.apis.demo) {
                await this.simulateVideoGeneration(prompt, style, duration);
            } else {
                await this.callRealAPI(prompt, style, duration);
            }
        } catch (error) {
            this.showError('Video generation failed. Please try again.');
            console.error('Generation error:', error);
        } finally {
            this.setLoading(false);
        }
    }

    simulateVideoGeneration(prompt, style, duration) {
        return new Promise((resolve) => {
            let progress = 0;
            const steps = [
                'Analyzing your prompt...',
                'Generating storyboard...',
                'Creating video frames...',
                'Applying style effects...',
                'Rendering final video...',
                'Optimizing for download...'
            ];

            const interval = setInterval(() => {
                progress += 100 / steps.length;
                const stepIndex = Math.min(Math.floor((progress / 100) * steps.length), steps.length - 1);
                
                this.updateProgress(progress, steps[stepIndex]);

                if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        this.createDemoVideo(prompt, style, duration);
                        resolve();
                    }, 500);
                }
            }, 600);
        });
    }

    async callRealAPI(prompt, style, duration) {
        // This would integrate with actual AI video APIs
        // Example with RunwayML:
        const response = await fetch(this.apis.runwayml.endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apis.runwayml.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text_prompt: prompt,
                style: style,
                duration: parseInt(duration)
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const result = await response.json();
        this.displayGeneratedVideo(result.video_url);
    }

    createDemoVideo(prompt, style, duration) {
        // Create a simple canvas animation that works reliably
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 360;
        const ctx = canvas.getContext('2d');

        // Create a single frame for the video
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add animated text effect
        ctx.fillStyle = 'white';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Word wrap for long text
        const words = prompt.split(' ');
        const lines = [];
        let currentLine = '';
        
        words.forEach(word => {
            const testLine = currentLine + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > canvas.width - 40 && currentLine !== '') {
                lines.push(currentLine);
                currentLine = word + ' ';
            } else {
                currentLine = testLine;
            }
        });
        lines.push(currentLine);

        // Draw text lines
        const lineHeight = 35;
        const startY = (canvas.height - (lines.length * lineHeight)) / 2;
        
        lines.forEach((line, index) => {
            ctx.fillText(line.trim(), canvas.width / 2, startY + (index * lineHeight));
        });

        // Add style and duration info
        ctx.font = '18px Arial';
        ctx.fillText(`Style: ${style} | Duration: ${duration}s`, canvas.width / 2, canvas.height - 30);

        // Convert canvas to video blob
        canvas.toBlob((blob) => {
            const videoUrl = URL.createObjectURL(blob);
            this.displayGeneratedVideo(videoUrl, prompt, style, duration);
        }, 'image/png');
    }

    createVideoFromFrames(frames, prompt, style, duration) {
        // For demo purposes, we'll create a data URL video
        // In a real implementation, you'd use libraries like FFmpeg.js
        
        const videoData = this.generateDemoVideoData();
        this.displayGeneratedVideo(videoData, prompt, style, duration);
    }

    generateDemoVideoData() {
        // Return a sample video URL or create a blob
        // For demo, we'll use a placeholder that simulates video
        return 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAs1tZGF0AAACrgYF//+q3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE0OCByMjYwMSBhMGNkN2QzIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxNSAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MzoweDExMyBtZT1oZXggc3VibWU9NyBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MSBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTEgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTIga2V5aW50PTI1MCBrZXlpbnRfbWluPTEwIHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAD2WIhAA3//728P4FNjuZQQAAAu5tb292AAAAbG12aGQAAAAAAAAAAAAAAAAAAAPoAAAAZAABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACGHRyYWsAAABcdGtoZAAAAAMAAAAAAAAAAAAAAAEAAAAAAAAAZAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAgAAAAIAAAAAACRlZHRzAAAAHGVsc3QAAAAAAAAAAQAAAGQAAAAAAAEAAAAAAZBtZGlhAAAAIG1kaGQAAAAAAAAAAAAAAAAAACgAAAAEAFXEAAAAAAAtaGRscgAAAAAAAAAAdmlkZQAAAAAAAAAAAAAAAFZpZGVvSGFuZGxlcgAAAAE7bWluZgAAABR2bWhkAAAAAQAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAAA+3N0YmwAAACXc3RzZAAAAAAAAAABAAAAh2F2YzEAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAgACAEgAAABIAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY//8AAAAxYXZjQwFkAAr/4QAYZ2QACqzZX4iIhAAAAwAEAAADAFA8SJZYAQAGaOvjyyLAAAAAGHN0dHMAAAAAAAAAAQAAAAEAAAQAAAAAHHN0c2MAAAAAAAAAAQAAAAEAAAABAAAAAQAAABRzdHN6AAAAAAAAAsUAAAABAAAAFHN0Y28AAAAAAAAAAQAAADAAAABidWR0YQAAAFptZXRhAAAAAAAAACFoZGxyAAAAAAAAAABtZGlyYXBwbAAAAAAAAAAAAAAAAC1pbHN0AAAAJal0b28AAAAdZGF0YQAAAAEAAAAATGF2ZjU4LjI5LjEwMA==';
    }

    displayGeneratedVideo(videoUrl, prompt, style, duration) {
        // Check if the URL is a video or image
        if (videoUrl.startsWith('data:image')) {
            // It's an image, create a video-like display
            this.displayVideoAsImage(videoUrl, prompt, style, duration);
        } else {
            // It's a video, use the video element
            this.elements.generatedVideo.src = videoUrl;
            this.currentGeneration = {
                url: videoUrl,
                prompt: prompt,
                style: style,
                duration: duration,
                timestamp: new Date().toISOString()
            };

            this.showResults();
            this.addToHistory(this.currentGeneration);
        }
    }

    displayVideoAsImage(imageUrl, prompt, style, duration) {
        // Create an image element to replace the video
        const videoContainer = this.elements.generatedVideo.parentElement;
        
        // Clear existing content
        videoContainer.innerHTML = '';
        
        // Create image element
        const img = document.createElement('img');
        img.src = imageUrl;
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.borderRadius = '8px';
        img.alt = `Generated video: ${prompt}`;
        
        // Add a "video player" overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
        `;
        overlay.textContent = '🎬 Demo Video';
        
        videoContainer.style.position = 'relative';
        videoContainer.appendChild(img);
        videoContainer.appendChild(overlay);
        
        this.currentGeneration = {
            url: imageUrl,
            prompt: prompt,
            style: style,
            duration: duration,
            timestamp: new Date().toISOString(),
            isImage: true
        };

        this.showResults();
        this.addToHistory(this.currentGeneration);
    }

    showProgress() {
        this.elements.progressSection.style.display = 'block';
        this.elements.resultsSection.style.display = 'none';
        this.updateProgress(0, 'Initializing...');
    }

    updateProgress(percent, text) {
        this.elements.progressFill.style.width = `${percent}%`;
        this.elements.progressText.textContent = text;
    }

    showResults() {
        this.elements.progressSection.style.display = 'none';
        this.elements.resultsSection.style.display = 'block';
    }

    setLoading(loading) {
        this.elements.generateBtn.disabled = loading;
        if (loading) {
            this.elements.btnText.style.display = 'none';
            this.elements.loadingSpinner.style.display = 'inline';
        } else {
            this.elements.btnText.style.display = 'inline';
            this.elements.loadingSpinner.style.display = 'none';
        }
    }

    showError(message) {
        // Create a better error display instead of alert
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
            z-index: 1000;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        errorDiv.innerHTML = `
            <strong>Error:</strong> ${message}
            <button onclick="this.parentElement.remove()" style="
                background: none;
                border: none;
                color: white;
                float: right;
                font-size: 1.2rem;
                cursor: pointer;
                margin-left: 1rem;
            ">×</button>
        `;
        
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
        
        this.setLoading(false);
        this.elements.progressSection.style.display = 'none';
    }

    downloadVideo() {
        if (!this.currentGeneration) return;

        if (this.currentGeneration.isImage) {
            // Download as image
            const link = document.createElement('a');
            link.href = this.currentGeneration.url;
            link.download = `ai-video-${Date.now()}.png`;
            link.click();
        } else {
            // Download as video
            const link = document.createElement('a');
            link.href = this.currentGeneration.url;
            link.download = `ai-video-${Date.now()}.mp4`;
            link.click();
        }
    }

    regenerateVideo() {
        this.generateVideo();
    }

    shareVideo() {
        if (!this.currentGeneration) return;

        if (navigator.share) {
            navigator.share({
                title: 'AI Generated Video',
                text: `Check out this AI video: ${this.currentGeneration.prompt}`,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    }

    addToHistory(video) {
        this.videoHistory.unshift(video);
        if (this.videoHistory.length > 6) {
            this.videoHistory = this.videoHistory.slice(0, 6);
        }
        localStorage.setItem('videoHistory', JSON.stringify(this.videoHistory));
        this.loadVideoHistory();
    }

    loadVideoHistory() {
        if (this.videoHistory.length === 0) {
            this.elements.videoHistory.innerHTML = '<p class="placeholder">No videos generated yet. Create your first video above!</p>';
            return;
        }

        this.elements.videoHistory.innerHTML = this.videoHistory.map((video, index) => `
            <div class="video-item" onclick="videoGenerator.loadHistoryVideo(${index})">
                <video src="${video.url}" muted></video>
                <div class="video-info">
                    <div class="video-title">${video.prompt.substring(0, 30)}...</div>
                    <div class="video-date">${new Date(video.timestamp).toLocaleDateString()}</div>
                </div>
            </div>
        `).join('');
    }

    loadHistoryVideo(index) {
        const video = this.videoHistory[index];
        this.displayGeneratedVideo(video.url, video.prompt, video.style, video.duration);
    }
}

// Initialize the video generator when the page loads
let videoGenerator;
document.addEventListener('DOMContentLoaded', () => {
    videoGenerator = new VideoGenerator();
});
