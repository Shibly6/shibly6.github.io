/**
 * Calming Interactive Starfield
 * A soothing starfield background that responds to mouse movements
 */

class Starfield {
    constructor(options = {}) {
        this.options = {
            starCount: options.starCount || 200,
            starSize: options.starSize || { min: 0.5, max: 2.5 },
            starColor: options.starColor || '255, 255, 255',
            backgroundColor: options.backgroundColor || 'linear-gradient(to bottom, #0a0a1a 0%, #1a1a3a 50%, #0d1b2a 100%)',
            mouseSensitivity: options.mouseSensitivity || 0.05,
            twinkleSpeed: options.twinkleSpeed || 0.02,
            twinkleAmount: options.twinkleAmount || 0.5,
            depthLayers: options.depthLayers || 3,
            ...options
        };

        this.canvas = null;
        this.ctx = null;
        this.stars = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetMouseX = 0;
        this.targetMouseY = 0;
        this.animationId = null;
        this.isRunning = false;

        this.init();
    }

    init() {
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'starfield-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
        `;

        // Insert as first child of body
        document.body.insertBefore(this.canvas, document.body.firstChild);

        // Get context and setup
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.createStars();

        // Event listeners
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.addEventListener('touchmove', (e) => this.handleTouchMove(e));

        // Start animation
        this.isRunning = true;
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Recreate stars on resize to fill new area
        if (this.stars.length > 0) {
            this.createStars();
        }
    }

    createStars() {
        this.stars = [];
        
        for (let i = 0; i < this.options.starCount; i++) {
            const layer = Math.floor(Math.random() * this.options.depthLayers);
            const depthFactor = (layer + 1) / this.options.depthLayers;
            
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                z: depthFactor, // Depth factor for parallax (0.33 to 1)
                baseSize: this.options.starSize.min + 
                    Math.random() * (this.options.starSize.max - this.options.starSize.min),
                alpha: 0.3 + Math.random() * 0.7,
                twinkleOffset: Math.random() * Math.PI * 2,
                twinkleSpeed: this.options.twinkleSpeed * (0.5 + Math.random()),
                // Offset from mouse movement (for parallax)
                offsetX: 0,
                offsetY: 0
            });
        }

        // Sort by depth so smaller stars appear behind
        this.stars.sort((a, b) => a.z - b.z);
    }

    handleMouseMove(e) {
        // Calculate mouse position relative to center
        this.targetMouseX = (e.clientX - this.canvas.width / 2);
        this.targetMouseY = (e.clientY - this.canvas.height / 2);
    }

    handleTouchMove(e) {
        if (e.touches.length > 0) {
            this.targetMouseX = (e.touches[0].clientX - this.canvas.width / 2);
            this.targetMouseY = (e.touches[0].clientY - this.canvas.height / 2);
        }
    }

    drawBackground() {
        // Create gradient background
        const gradient = this.ctx.createLinearGradient(
            0, 0,
            0, this.canvas.height
        );
        
        if (typeof this.options.backgroundColor === 'string' && 
            this.options.backgroundColor.startsWith('linear-gradient')) {
            // Parse gradient colors
            const colorStops = this.options.backgroundColor
                .replace('linear-gradient(to bottom, ', '')
                .replace(')', '')
                .split(', ')
                .map(color => color.trim());
            
            colorStops.forEach((color, index) => {
                gradient.addColorStop(index / (colorStops.length - 1), color);
            });
        } else {
            gradient.addColorStop(0, '#0a0a1a');
            gradient.addColorStop(0.5, '#1a1a3a');
            gradient.addColorStop(1, '#0d1b2a');
        }
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawStar(star, time) {
        // Calculate twinkle effect
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        const alpha = star.alpha * (1 - this.options.twinkleAmount * 0.5) + 
            twinkle * star.alpha * this.options.twinkleAmount * 0.5;
        
        // Calculate parallax offset based on mouse position
        const parallaxX = this.mouseX * star.z * this.options.mouseSensitivity;
        const parallaxY = this.mouseY * star.z * this.options.mouseSensitivity;
        
        // Final position with parallax
        const x = star.x + parallaxX;
        const y = star.y + parallaxY;
        
        // Wrap around screen
        const wrappedX = ((x % this.canvas.width) + this.canvas.width) % this.canvas.width;
        const wrappedY = ((y % this.canvas.height) + this.canvas.height) % this.canvas.height;
        
        // Draw star with glow effect
        const size = star.baseSize * star.z;
        
        // Outer glow
        const glowGradient = this.ctx.createRadialGradient(
            wrappedX, wrappedY, 0,
            wrappedX, wrappedY, size * 3
        );
        glowGradient.addColorStop(0, `rgba(${this.options.starColor}, ${alpha * 0.3})`);
        glowGradient.addColorStop(0.5, `rgba(${this.options.starColor}, ${alpha * 0.1})`);
        glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        this.ctx.beginPath();
        this.ctx.arc(wrappedX, wrappedY, size * 3, 0, Math.PI * 2);
        this.ctx.fillStyle = glowGradient;
        this.ctx.fill();
        
        // Core star
        this.ctx.beginPath();
        this.ctx.arc(wrappedX, wrappedY, size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${this.options.starColor}, ${alpha})`;
        this.ctx.fill();
        
        // Bright center
        if (size > 1) {
            this.ctx.beginPath();
            this.ctx.arc(wrappedX, wrappedY, size * 0.3, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
            this.ctx.fill();
        }
    }

    animate() {
        if (!this.isRunning) return;

        // Smooth mouse following (lerp)
        this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
        this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

        // Clear and draw background
        this.drawBackground();

        // Draw all stars
        const time = Date.now() * 0.001;
        this.stars.forEach(star => this.drawStar(star, time));

        // Continue animation
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
        }
    }

    destroy() {
        this.stop();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        window.removeEventListener('resize', () => this.resize());
    }
}

// Initialize starfield when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Create the starfield with calming defaults
    window.starfield = new Starfield({
        starCount: 250,
        starColor: '200, 220, 255', // Cool blue-white stars
        mouseSensitivity: 0.03,
        twinkleSpeed: 0.015,
        twinkleAmount: 0.4,
        depthLayers: 4
    });
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    window.starfield = new Starfield({
        starCount: 250,
        starColor: '200, 220, 255',
        mouseSensitivity: 0.03,
        twinkleSpeed: 0.015,
        twinkleAmount: 0.4,
        depthLayers: 4
    });
}
