// Extend existing AuxeiraApp with backend integration
AuxeiraApp.api = {
    BASE_URL: 'https://6qfa3ssb10.execute-api.us-east-1.amazonaws.com/prod',
    
    async request(endpoint, options = {}) {
        const url = this.BASE_URL + endpoint;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        try {
            const response = await fetch(url, { ...defaultOptions, ...options });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Backend API request failed:', error);
            throw error;
        }
    },

    async getHealth() {
        return this.request('/health');
    },

    async getStatus() {
        return this.request('/api/status');
    },

    async testSolana() {
        return this.request('/api/solana/test');
    },

    // Method to submit form data from your existing forms
    async submitUserData(userData) {
        return this.request('/api/users', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }
};

// Extend existing AuxeiraApp initialization
AuxeiraApp.originalInit = AuxeiraApp.init;
AuxeiraApp.init = function() {
    // Call original initialization
    this.originalInit();
    
    // Add backend integration
    this.initBackendIntegration();
};

// Add backend integration method
AuxeiraApp.initBackendIntegration = async function() {
    console.log('Initializing Auxeira backend integration...');
    
    try {
        const health = await this.api.getHealth();
        console.log('Backend connected:', health.message);
        
        const solana = await this.api.testSolana();
        console.log('Solana integration:', solana.message);
        
        this.backendConnected = true;
        this.updateBackendStatus(true);
    } catch (error) {
        console.log('Backend connection failed:', error.message);
        this.backendConnected = false;
        this.updateBackendStatus(false, error.message);
    }
};

// Add method to update backend status in UI
AuxeiraApp.updateBackendStatus = function(connected, error = null) {
    const indicators = document.querySelectorAll('.backend-status');
    indicators.forEach(indicator => {
        if (connected) {
            indicator.innerHTML = '<span style="color: #28a745; font-size: 12px;">● API Connected</span>';
            indicator.title = 'Backend services operational';
        } else {
            indicator.innerHTML = '<span style="color: #dc3545; font-size: 12px;">● API Offline</span>';
            indicator.title = error || 'Backend connection failed';
        }
    });
};

// Extend form submission to include backend integration
AuxeiraApp.originalSubmitForm = AuxeiraApp.submitForm || function() {};
AuxeiraApp.submitForm = async function(formData, callback) {
    try {
        // If backend is connected, submit to backend
        if (this.backendConnected) {
            console.log('Submitting form data to backend...');
            const response = await this.api.submitUserData(formData);
            console.log('Backend submission successful:', response);
        }
        
        // Call original form submission logic
        this.originalSubmitForm(formData, callback);
        
        if (callback) callback(null, { success: true, backend: this.backendConnected });
    } catch (error) {
        console.error('Form submission error:', error);
        if (callback) callback(error, null);
    }
};
