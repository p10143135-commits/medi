// Global variables
let medicines = [];
let currentUser = null;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check which page we're on
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1);
    
    // Initialize page-specific scripts
    if (page === '' || page === 'index.html' || page.endsWith('/')) {
        initLoginPage();
    } else if (page === 'dashboard.html') {
        initDashboardPage();
    } else if (page === 'configure.html') {
        initConfigurePage();
    }
    
    // Update date and time
    updateDateTime();
    setInterval(updateDateTime, 60000); // Update every minute
});

// Initialize Login Page
function initLoginPage() {
    const loginBtn = document.getElementById('loginBtn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
        
        // Add enter key support for login
        document.getElementById('password').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleLogin();
            }
        });
    }
}

// Handle Login
function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Demo credentials
    const demoCredentials = {
        username: 'demo_patient',
        password: 'demo123'
    };
    
    // Show loading animation on button
    const loginBtn = document.getElementById('loginBtn');
    const originalText = loginBtn.innerHTML;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    loginBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        if (username === demoCredentials.username && password === demoCredentials.password) {
            // Store user in localStorage
            localStorage.setItem('currentUser', JSON.stringify({
                name: 'Alex Johnson',
                username: username,
                loginTime: new Date().toISOString()
            }));
            
            // Show success animation
            loginBtn.innerHTML = '<i class="fas fa-check"></i> Login Successful!';
            loginBtn.style.background = 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)';
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            // Show error
            loginBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Invalid Credentials';
            loginBtn.style.background = 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)';
            
            // Reset button after 2 seconds
            setTimeout(() => {
                loginBtn.innerHTML = originalText;
                loginBtn.disabled = false;
                loginBtn.style.background = 'linear-gradient(135deg, #4a6fff 0%, #3b5bdb 100%)';
            }, 2000);
            
            // Shake animation for error
            document.querySelector('.login-card').style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                document.querySelector('.login-card').style.animation = '';
            }, 500);
        }
    }, 1500);
}

// Initialize Dashboard Page
function initDashboardPage() {
    // Check if user is logged in
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
        window.location.href = 'index.html';
        return;
    }
    
    currentUser = JSON.parse(userData);
    
    // Set patient name
    const patientNameElement = document.getElementById('patientName');
    if (patientNameElement) {
        patientNameElement.textContent = currentUser.name;
    }
    
    // Load medicines from localStorage or use demo data
    loadMedicines();
    
    // Set up event listeners
    setupDashboardEventListeners();
    
    // Update medicine count
    updateMedicineCount();
}

// Load Medicines
function loadMedicines() {
    // Try to load from localStorage
    const savedMedicines = localStorage.getItem('medicines');
    
    if (savedMedicines) {
        medicines = JSON.parse(savedMedicines);
    } else {
        // Create demo medicines
        medicines = [
            {
                id: 1,
                name: 'Paracetamol',
                dosage: '1 capsule',
                schedule: 'M T W T F S S',
                timings: ['Before Breakfast', 'After Dinner'],
                totalCapsules: 20,
                takenCapsules: 5,
                nextDose: 'Today, 8:00 AM'
            },
            {
                id: 2,
                name: 'Vitamin D',
                dosage: '1 tablet',
                schedule: 'M W F',
                timings: ['After Breakfast'],
                totalCapsules: 30,
                takenCapsules: 12,
                nextDose: 'Tomorrow, 9:00 AM'
            },
            {
                id: 3,
                name: 'Amoxicillin',
                dosage: '2 capsules',
                schedule: 'Every Day',
                timings: ['After Breakfast', 'After Dinner'],
                totalCapsules: 40,
                takenCapsules: 28,
                nextDose: 'Today, 7:00 PM'
            }
        ];
        
        // Save to localStorage
        localStorage.setItem('medicines', JSON.stringify(medicines));
    }
    
    // Render medicines
    renderMedicines();
}

// Render Medicines
function renderMedicines() {
    const container = document.getElementById('medicinesContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    medicines.forEach(med => {
        const progress = (med.takenCapsules / med.totalCapsules) * 100;
        const remainingCapsules = med.totalCapsules - med.takenCapsules;
        
        const medCard = document.createElement('div');
        medCard.className = 'medicine-card';
        medCard.dataset.id = med.id;
        
        medCard.innerHTML = `
            <div class="med-header">
                <div class="med-name">${med.name}</div>
                <div class="med-schedule">
                    <i class="fas fa-calendar-alt"></i>
                    <span>${med.schedule}</span>
                </div>
            </div>
            <div class="med-details">
                <div class="med-detail">
                    <i class="fas fa-capsules"></i>
                    <span><strong>Dosage:</strong> ${med.dosage} per intake</span>
                </div>
                <div class="med-detail">
                    <i class="fas fa-clock"></i>
                    <span><strong>Timings:</strong> ${med.timings.join(', ')}</span>
                </div>
                <div class="med-detail">
                    <i class="fas fa-bell"></i>
                    <span><strong>Next Dose:</strong> ${med.nextDose}</span>
                </div>
            </div>
            <div class="med-progress">
                <div class="progress-label">
                    <span>Capsules Taken: ${med.takenCapsules}/${med.totalCapsules}</span>
                    <span>${remainingCapsules} left</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
            </div>
            <div class="med-actions">
                <button class="med-action-btn edit-btn" data-id="${med.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="med-action-btn delete-btn" data-id="${med.id}">
                    <i class="fas fa-trash-alt"></i> Delete
                </button>
            </div>
        `;
        
        container.appendChild(medCard);
    });
    
    // Add event listeners to medicine cards
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const medId = parseInt(this.dataset.id);
            editMedicine(medId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const medId = parseInt(this.dataset.id);
            deleteMedicine(medId);
        });
    });
}

// Update Medicine Count
function updateMedicineCount() {
    const medCountElement = document.getElementById('medCount');
    const todayCountElement = document.getElementById('todayCount');
    
    if (medCountElement) {
        medCountElement.textContent = `(${medicines.length})`;
    }
    
    if (todayCountElement) {
        // Count medicines scheduled for today (demo logic)
        const today = new Date().getDay();
        const dayMap = {0: 'S', 1: 'M', 2: 'T', 3: 'W', 4: 'T', 5: 'F', 6: 'S'};
        const todayLetter = dayMap[today];
        
        const todayMeds = medicines.filter(med => {
            return med.schedule.includes('Every Day') || 
                   med.schedule.includes(todayLetter) ||
                   (today >= 1 && today <= 5 && med.schedule.includes('Weekdays')) ||
                   (today >= 6 && med.schedule.includes('Weekends'));
        });
        
        todayCountElement.textContent = todayMeds.length;
    }
}

// Setup Dashboard Event Listeners
function setupDashboardEventListeners() {
    // Add Medicine Button
    const addMedBtn = document.getElementById('addMedBtn');
    if (addMedBtn) {
        addMedBtn.addEventListener('click', function() {
            window.location.href = 'configure.html';
        });
    }
    
    // Action Buttons
    const addBtn = document.getElementById('addBtn');
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            window.location.href = 'configure.html';
        });
    }
    
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            showNotification('Data submitted successfully!', 'success');
            
            // Animate the button
            this.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        });
    }
    
    const modifyBtn = document.getElementById('modifyBtn');
    if (modifyBtn) {
        modifyBtn.addEventListener('click', function() {
            showNotification('Select a medicine to modify', 'info');
        });
    }
    
    // View All Button
    const viewAllBtn = document.getElementById('viewAllBtn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function() {
            // Expand medicine section
            const medSection = document.querySelector('.medicines-container');
            medSection.style.maxHeight = 'none';
            this.style.display = 'none';
        });
    }
    
    // Help Button
    const helpBtn = document.getElementById('helpBtn');
    const helpModal = document.getElementById('helpModal');
    const closeHelpModal = document.getElementById('closeHelpModal');
    const footerHelpBtn = document.getElementById('footerHelpBtn');
    
    if (helpBtn && helpModal) {
        helpBtn.addEventListener('click', () => {
            helpModal.classList.add('active');
        });
    }
    
    if (closeHelpModal && helpModal) {
        closeHelpModal.addEventListener('click', () => {
            helpModal.classList.remove('active');
        });
    }
    
    if (footerHelpBtn && helpModal) {
        footerHelpBtn.addEventListener('click', (e) => {
            e.preventDefault();
            helpModal.classList.add('active');
        });
    }
    
    // Close modal when clicking outside
    if (helpModal) {
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) {
                helpModal.classList.remove('active');
            }
        });
    }
    
    // Send Help Message
    const sendHelpBtn = document.querySelector('.send-help-btn');
    if (sendHelpBtn) {
        sendHelpBtn.addEventListener('click', function() {
            const textarea = document.querySelector('.help-message textarea');
            if (textarea.value.trim() === '') {
                showNotification('Please enter a message', 'warning');
                return;
            }
            
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            this.disabled = true;
            
            // Simulate sending
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-check"></i> Message Sent';
                textarea.value = '';
                
                setTimeout(() => {
                    this.innerHTML = 'Send Message';
                    this.disabled = false;
                    helpModal.classList.remove('active');
                    showNotification('Your message has been sent to customer care', 'success');
                }, 1500);
            }, 2000);
        });
    }
    
    // Logout Button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            }
        });
    }
}

// Initialize Configure Page
function initConfigurePage() {
    // Check if user is logged in
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize days selector
    initDaysSelector();
    
    // Initialize timing options
    initTimingOptions();
    
    // Set up event listeners
    setupConfigureEventListeners();
}

// Initialize Days Selector
function initDaysSelector() {
    const daysSelector = document.getElementById('daysSelector');
    if (!daysSelector) return;
    
    const days = [
        { letter: 'M', full: 'Monday' },
        { letter: 'T', full: 'Tuesday' },
        { letter: 'W', full: 'Wednesday' },
        { letter: 'T', full: 'Thursday' },
        { letter: 'F', full: 'Friday' },
        { letter: 'S', full: 'Saturday' },
        { letter: 'S', full: 'Sunday' }
    ];
    
    daysSelector.innerHTML = '';
    
    days.forEach((day, index) => {
        const dayElement = document.createElement('div');
        dayElement.className = 'day-option';
        dayElement.dataset.day = day.letter;
        dayElement.dataset.index = index;
        dayElement.title = day.full;
        dayElement.textContent = day.letter;
        
        dayElement.addEventListener('click', function() {
            this.classList.toggle('selected');
            updateEveryDayOption();
        });
        
        daysSelector.appendChild(dayElement);
    });
}

// Initialize Timing Options
function initTimingOptions() {
    const timingOptions = document.getElementById('timingOptions');
    if (!timingOptions) return;
    
    const timings = [
        { id: 'beforeBreakfast', name: 'Before Breakfast', time: '7:00 - 8:00 AM', icon: 'coffee' },
        { id: 'afterBreakfast', name: 'After Breakfast', time: '9:00 - 10:00 AM', icon: 'coffee' },
        { id: 'beforeLunch', name: 'Before Lunch', time: '12:00 - 1:00 PM', icon: 'utensils' },
        { id: 'afterLunch', name: 'After Lunch', time: '2:00 - 3:00 PM', icon: 'utensils' },
        { id: 'beforeDinner', name: 'Before Dinner', time: '7:00 - 8:00 PM', icon: 'moon' },
        { id: 'afterDinner', name: 'After Dinner', time: '9:00 - 10:00 PM', icon: 'moon' }
    ];
    
    timingOptions.innerHTML = '';
    
    timings.forEach(timing => {
        const timingElement = document.createElement('div');
        timingElement.className = 'timing-option';
        timingElement.dataset.id = timing.id;
        
        timingElement.innerHTML = `
            <div class="timing-icon">
                <i class="fas fa-${timing.icon}"></i>
            </div>
            <div class="timing-info">
                <h4>${timing.name}</h4>
                <p>${timing.time}</p>
            </div>
        `;
        
        timingElement.addEventListener('click', function() {
            this.classList.toggle('selected');
        });
        
        timingOptions.appendChild(timingElement);
    });
}

// Update Every Day Option
function updateEveryDayOption() {
    const everydayOption = document.getElementById('everydayOption');
    const dayOptions = document.querySelectorAll('.day-option');
    
    if (!everydayOption || !dayOptions.length) return;
    
    // If all days are selected, check the "Every Day" option
    const allSelected = Array.from(dayOptions).every(day => day.classList.contains('selected'));
    
    if (allSelected) {
        everydayOption.checked = true;
    } else {
        everydayOption.checked = false;
    }
}

// Setup Configure Event Listeners
function setupConfigureEventListeners() {
    // Back Button
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to go back? Unsaved changes will be lost.')) {
                window.location.href = 'dashboard.html';
            }
        });
    }
    
    // Cancel Button
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
                window.location.href = 'dashboard.html';
            }
        });
    }
    
    // Schedule Options
    const everydayOption = document.getElementById('everydayOption');
    if (everydayOption) {
        everydayOption.addEventListener('change', function() {
            const dayOptions = document.querySelectorAll('.day-option');
            if (this.checked) {
                dayOptions.forEach(day => day.classList.add('selected'));
            } else {
                dayOptions.forEach(day => day.classList.remove('selected'));
            }
        });
    }
    
    const weekdaysOption = document.getElementById('weekdaysOption');
    if (weekdaysOption) {
        weekdaysOption.addEventListener('change', function() {
            const dayOptions = document.querySelectorAll('.day-option');
            if (this.checked) {
                // Select weekdays (M-F, indices 0-4)
                dayOptions.forEach((day, index) => {
                    if (index < 5) {
                        day.classList.add('selected');
                    } else {
                        day.classList.remove('selected');
                    }
                });
                
                // Uncheck other options
                document.getElementById('weekendsOption').checked = false;
                document.getElementById('everydayOption').checked = false;
            }
        });
    }
    
    const weekendsOption = document.getElementById('weekendsOption');
    if (weekendsOption) {
        weekendsOption.addEventListener('change', function() {
            const dayOptions = document.querySelectorAll('.day-option');
            if (this.checked) {
                // Select weekends (S-S, indices 5-6)
                dayOptions.forEach((day, index) => {
                    if (index >= 5) {
                        day.classList.add('selected');
                    } else {
                        day.classList.remove('selected');
                    }
                });
                
                // Uncheck other options
                document.getElementById('weekdaysOption').checked = false;
                document.getElementById('everydayOption').checked = false;
            }
        });
    }
    
    // Save Button
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveMedicine);
    }
    
    // Add Another Button
    const addAnotherBtn = document.getElementById('addAnotherBtn');
    if (addAnotherBtn) {
        addAnotherBtn.addEventListener('click', function() {
            saveMedicine(true);
        });
    }
    
    // Go to Dashboard Button (in success modal)
    const goToDashboardBtn = document.getElementById('goToDashboardBtn');
    if (goToDashboardBtn) {
        goToDashboardBtn.addEventListener('click', function() {
            window.location.href = 'dashboard.html';
        });
    }
    
    // Add More Button (in success modal)
    const addMoreBtn = document.getElementById('addMoreBtn');
    if (addMoreBtn) {
        addMoreBtn.addEventListener('click', function() {
            document.getElementById('successModal').classList.remove('active');
            resetForm();
        });
    }
}

// Save Medicine
function saveMedicine(addAnother = false) {
    // Get form values
    const medName = document.getElementById('medicineName').value;
    const dosage = document.getElementById('medicineDosage').value;
    const totalCapsules = parseInt(document.getElementById('totalCapsules').value);
    
    if (!medName.trim()) {
        showNotification('Please enter medicine name', 'warning');
        document.getElementById('medicineName').focus();
        return;
    }
    
    if (!totalCapsules || totalCapsules < 1) {
        showNotification('Please enter a valid total capsules count', 'warning');
        document.getElementById('totalCapsules').focus();
        return;
    }
    
    // Get selected days
    const selectedDays = Array.from(document.querySelectorAll('.day-option.selected'))
        .map(day => day.dataset.day)
        .join(' ');
    
    if (!selectedDays.trim()) {
        showNotification('Please select at least one day', 'warning');
        return;
    }
    
    // Get schedule text
    let scheduleText = selectedDays;
    if (document.getElementById('everydayOption').checked) {
        scheduleText = 'Every Day';
    } else if (document.getElementById('weekdaysOption').checked) {
        scheduleText = 'Weekdays';
    } else if (document.getElementById('weekendsOption').checked) {
        scheduleText = 'Weekends';
    }
    
    // Get selected timings
    const selectedTimings = Array.from(document.querySelectorAll('.timing-option.selected'))
        .map(timing => {
            const timingName = timing.querySelector('h4').textContent;
            return timingName;
        });
    
    if (selectedTimings.length === 0) {
        showNotification('Please select at least one timing', 'warning');
        return;
    }
    
    // Create medicine object
    const newMedicine = {
        id: Date.now(), // Use timestamp as unique ID
        name: medName,
        dosage: dosage === 'custom' ? 'Custom dosage' : `${dosage} capsule${dosage !== '1' ? 's' : ''}`,
        schedule: scheduleText,
        timings: selectedTimings,
        totalCapsules: totalCapsules,
        takenCapsules: 0,
        nextDose: 'Today, ' + getNextTiming(selectedTimings)
    };
    
    // Load existing medicines
    const savedMedicines = localStorage.getItem('medicines');
    let medicines = savedMedicines ? JSON.parse(savedMedicines) : [];
    
    // Add new medicine
    medicines.push(newMedicine);
    
    // Save to localStorage
    localStorage.setItem('medicines', JSON.stringify(medicines));
    
    // Show success modal
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.classList.add('active');
    }
    
    // Reset form if adding another
    if (addAnother) {
        setTimeout(() => {
            successModal.classList.remove('active');
            resetForm();
        }, 2000);
    }
}

// Get Next Timing
function getNextTiming(timings) {
    // This is a simplified version - in a real app, you'd calculate based on current time
    const now = new Date();
    const hour = now.getHours();
    
    if (timings.some(t => t.includes('Before Breakfast'))) {
        return '8:00 AM';
    } else if (timings.some(t => t.includes('After Breakfast'))) {
        return '9:30 AM';
    } else if (timings.some(t => t.includes('Before Lunch'))) {
        return '12:30 PM';
    } else if (timings.some(t => t.includes('After Lunch'))) {
        return '2:30 PM';
    } else if (timings.some(t => t.includes('Before Dinner'))) {
        return '7:30 PM';
    } else if (timings.some(t => t.includes('After Dinner'))) {
        return '9:30 PM';
    }
    
    return '8:00 AM';
}

// Reset Form
function resetForm() {
    document.getElementById('medicineName').value = '';
    document.getElementById('medicineDosage').value = '1';
    document.getElementById('totalCapsules').value = '10';
    
    // Reset days
    document.querySelectorAll('.day-option').forEach(day => {
        day.classList.remove('selected');
    });
    
    // Reset schedule options
    document.getElementById('everydayOption').checked = false;
    document.getElementById('weekdaysOption').checked = false;
    document.getElementById('weekendsOption').checked = false;
    
    // Reset timings
    document.querySelectorAll('.timing-option').forEach(timing => {
        timing.classList.remove('selected');
    });
    
    // Focus on medicine name
    document.getElementById('medicineName').focus();
}

// Edit Medicine
function editMedicine(medId) {
    // In a real app, you'd load the medicine data and populate the configure form
    // For this demo, we'll just show a notification
    showNotification(`Editing medicine with ID: ${medId}. Redirecting to edit page...`, 'info');
    
    // Simulate redirect after a delay
    setTimeout(() => {
        window.location.href = 'configure.html?edit=' + medId;
    }, 1500);
}

// Delete Medicine
function deleteMedicine(medId) {
    if (confirm('Are you sure you want to delete this medicine?')) {
        // Load medicines
        const savedMedicines = localStorage.getItem('medicines');
        let medicines = savedMedicines ? JSON.parse(savedMedicines) : [];
        
        // Remove medicine
        medicines = medicines.filter(med => med.id !== medId);
        
        // Save back to localStorage
        localStorage.setItem('medicines', JSON.stringify(medicines));
        
        // Reload medicines
        loadMedicines();
        
        // Update count
        updateMedicineCount();
        
        // Show notification
        showNotification('Medicine deleted successfully', 'success');
    }
}

// Update Date and Time
function updateDateTime() {
    const now = new Date();
    
    // Format date
    const dateOptions = { day: '2-digit', month: '2-digit', year: '2-digit' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    
    const dateStr = now.toLocaleDateString('en-IN', dateOptions);
    const timeStr = now.toLocaleTimeString('en-US', timeOptions);
    
    // Update date elements
    const currentDateElement = document.getElementById('currentDate');
    const currentDateTimeElement = document.getElementById('currentDateTime');
    
    if (currentDateElement) {
        currentDateElement.textContent = now.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
    if (currentDateTimeElement) {
        currentDateTimeElement.textContent = `${dateStr} | ${timeStr}`;
    }
}

// Show Notification
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Add CSS for notification
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 10px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
                padding: 15px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 300px;
                max-width: 400px;
                z-index: 10000;
                animation: slideInRight 0.3s ease-out, fadeOut 0.3s ease-out 3.7s forwards;
                border-left: 4px solid #4a6fff;
            }
            
            .notification-success {
                border-left-color: #38a169;
            }
            
            .notification-warning {
                border-left-color: #ed8936;
            }
            
            .notification-info {
                border-left-color: #4a6fff;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
                flex: 1;
            }
            
            .notification-content i {
                font-size: 1.2rem;
            }
            
            .notification-success .notification-content i {
                color: #38a169;
            }
            
            .notification-warning .notification-content i {
                color: #ed8936;
            }
            
            .notification-info .notification-content i {
                color: #4a6fff;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: #a0aec0;
                cursor: pointer;
                font-size: 1rem;
                padding: 5px;
                margin-left: 10px;
            }
            
            .notification-close:hover {
                color: #4a5568;
            }
            
            @keyframes fadeOut {
                from { opacity: 1; transform: translateX(0); }
                to { opacity: 0; transform: translateX(100%); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add close event listener
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 4000);
}