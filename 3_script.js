class PasswordStrengthChecker {
    constructor() {
        this.passwordInput = document.getElementById('password');
        this.toggleButton = document.getElementById('togglePassword');
        this.strengthBar = document.getElementById('strengthBar');
        this.strengthText = document.getElementById('strengthText');
        this.criteria = {
            length: document.getElementById('lengthCriteria'),
            lowercase: document.getElementById('lowercaseCriteria'),
            uppercase: document.getElementById('uppercaseCriteria'),
            number: document.getElementById('numberCriteria'),
            special: document.getElementById('specialCriteria'),
            sequence: document.getElementById('sequenceCriteria')
        };

        this.commonSequences = [
            '123', '234', '345', '456', '567', '678', '789', '890',
            'abc', 'bcd', 'cde', 'def', 'efg', 'fgh', 'ghi', 'hij',
            'qwe', 'wer', 'ert', 'rty', 'tyu', 'yui', 'uio', 'iop',
            'asd', 'sdf', 'dfg', 'fgh', 'ghj', 'hjk', 'jkl',
            'zxc', 'xcv', 'cvb', 'vbn', 'bnm',
            'password', 'pass', '1234', '12345', '123456', 'qwerty'
        ];

        this.init();
    }

    init() {
        this.passwordInput.addEventListener('input', () => this.checkPassword());
        this.toggleButton.addEventListener('click', () => this.togglePasswordVisibility());
        this.checkPassword(); // Initial check
    }

    togglePasswordVisibility() {
        const type = this.passwordInput.type === 'password' ? 'text' : 'password';
        this.passwordInput.type = type;
        this.toggleButton.textContent = type === 'password' ? '👁️' : '🙈';
    }

    checkPassword() {
        const password = this.passwordInput.value;
        const strength = this.calculateStrength(password);
        this.updateUI(strength, password);
    }

    calculateStrength(password) {
        let score = 0;
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
            sequence: !this.hasCommonSequence(password.toLowerCase())
        };

        // Update criteria display
        Object.keys(checks).forEach(key => {
            this.updateCriteria(key, checks[key]);
            if (checks[key]) score++;
        });

        // Additional scoring for length
        if (password.length >= 12) score += 0.5;
        if (password.length >= 16) score += 0.5;

        // Bonus for variety
        const uniqueChars = new Set(password).size;
        if (uniqueChars >= password.length * 0.7) score += 0.5;

        return {
            score: Math.min(score, 6),
            checks,
            length: password.length
        };
    }

    hasCommonSequence(password) {
        return this.commonSequences.some(seq => password.includes(seq));
    }

    updateCriteria(criterion, met) {
        const element = this.criteria[criterion];
        if (met) {
            element.classList.add('criteria-met');
            element.classList.remove('criteria-not-met');
        } else {
            element.classList.remove('criteria-met');
            element.classList.add('criteria-not-met');
        }
    }

    updateUI(strength, password) {
        if (password.length === 0) {
            this.strengthBar.style.width = '0%';
            this.strengthText.textContent = 'Enter a password to check its strength';
            this.strengthText.className = 'strength-text';
            return;
        }

        const { score } = strength;
        const percentage = (score / 6) * 100;
        
        this.strengthBar.style.width = `${percentage}%`;

        // Remove previous classes
        this.strengthBar.className = 'strength-bar';
        this.strengthText.className = 'strength-text';

        let strengthLevel, strengthClass, message;

        if (score < 1) {
            strengthLevel = 'Very Weak';
            strengthClass = 'very-weak';
            message = 'Very weak - easily guessed';
        } else if (score < 2) {
            strengthLevel = 'Weak';
            strengthClass = 'weak';
            message = 'Weak - add more complexity';
        } else if (score < 3) {
            strengthLevel = 'Fair';
            strengthClass = 'fair';
            message = 'Fair - could be stronger';
        } else if (score < 4) {
            strengthLevel = 'Good';
            strengthClass = 'good';
            message = 'Good - decent protection';
        } else if (score < 5) {
            strengthLevel = 'Strong';
            strengthClass = 'strong';
            message = 'Strong - well protected';
        } else {
            strengthLevel = 'Very Strong';
            strengthClass = 'very-strong';
            message = 'Very strong - excellent protection';
        }

        this.strengthBar.classList.add(strengthClass);
        this.strengthText.classList.add(strengthClass);
        this.strengthText.textContent = `${strengthLevel} - ${message}`;

        // Add shake animation for very weak passwords
        if (score < 1 && password.length > 0) {
            this.passwordInput.classList.add('shake');
            setTimeout(() => this.passwordInput.classList.remove('shake'), 500);
        }
    }
}

// Initialize the password strength checker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PasswordStrengthChecker();
});