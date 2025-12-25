export class ErrorHandler {
    static show(message, type = 'error') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // Add styles if not already present
        if (!document.querySelector('#toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                .toast {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 12px 20px;
                    border-radius: 8px;
                    color: white;
                    font-weight: 500;
                    z-index: 1000;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                    max-width: 300px;
                }
                .toast-error {
                    background-color: #dc2626;
                }
                .toast-warning {
                    background-color: #f59e0b;
                }
                .toast-info {
                    background-color: #3b82f6;
                }
                .toast.show {
                    transform: translateX(0);
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    static handleAudioError(error) {
        console.error('Audio error:', error);
        this.show('Audio system error. Please check your browser settings.', 'error');
    }

    static handleImageError(chordName) {
        console.warn(`Chord image not found: ${chordName}`);
        // Don't show toast for missing chord images as it's expected behavior
    }

    static validateInput(value, min, max, fieldName) {
        const num = parseInt(value);
        if (isNaN(num) || num < min || num > max) {
            this.show(`${fieldName} must be between ${min} and ${max}`, 'warning');
            return false;
        }
        return true;
    }
}
