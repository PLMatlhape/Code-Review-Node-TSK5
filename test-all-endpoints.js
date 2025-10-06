const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';
const HEALTH_URL = 'http://localhost:3001/health';

// Store test data
let testData = {
    authToken: '',
    userId: '',
    projectId: '',
    submissionId: '',
    commentId: '',
    reviewId: ''
};

// Helper function for API calls with better error handling
async function apiCall(method, url, data = null, headers = {}) {
    try {
        const config = {
            method,
            url,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };
        
        if (data) {
            config.data = data;
        }
        
        const response = await axios(config);
        return { success: true, data: response.data, status: response.status };
    } catch (error) {
        return { 
            success: false, 
            error: error.response?.data || error.message,
            status: error.response?.status || 0
        };
    }
}

// Test functions
async function testHealthCheck() {
    console.log('\n🏥 Testing Health Check...');
    const result = await apiCall('GET', HEALTH_URL);
    
    if (result.success) {
        console.log('✅ Health check passed:', result.data);
    } else {
        console.log('❌ Health check failed:', result.error);
    }
    return result.success;
}

async function testUserRegistration() {
    console.log('\n👤 Testing User Registration...');
    const userData = {
        email: 'john.doe@example.com',
        password: 'password123',
        name: 'John Doe',
        role: 'submitter'
    };
    
    const result = await apiCall('POST', `${BASE_URL}/auth/register`, userData);
    
    if (result.success) {
        console.log('✅ User registration successful:', result.data);
        if (result.data.user) {
            testData.userId = result.data.user.id;
        }
        return true;
    } else {
        console.log('❌ User registration failed:', result.error);
        return false;
    }
}

async function testUserLogin() {
    console.log('\n🔐 Testing User Login...');
    const loginData = {
        email: 'john.doe@example.com',
        password: 'password123'
    };
    
    const result = await apiCall('POST', `${BASE_URL}/auth/login`, loginData);
    
    if (result.success) {
        console.log('✅ Login successful:', result.data);
        if (result.data.token) {
            testData.authToken = result.data.token;
        }
        if (result.data.user) {
            testData.userId = result.data.user.id;
        }
        return true;
    } else {
        console.log('❌ Login failed:', result.error);
        return false;
    }
}

async function testGetProfile() {
    console.log('\n👥 Testing Get Profile...');
    const result = await apiCall('GET', `${BASE_URL}/users/me`, null, {
        'Authorization': `Bearer ${testData.authToken}`
    });
    
    if (result.success) {
        console.log('✅ Get profile successful:', result.data);
        return true;
    } else {
        console.log('❌ Get profile failed:', result.error);
        return false;
    }
}

async function testGetAllUsers() {
    console.log('\n👥 Testing Get All Users...');
    const result = await apiCall('GET', `${BASE_URL}/users`, null, {
        'Authorization': `Bearer ${testData.authToken}`
    });
    
    if (result.success) {
        console.log('✅ Get all users successful. Count:', result.data.users?.length || 0);
        return true;
    } else {
        console.log('❌ Get all users failed:', result.error);
        return false;
    }
}

async function testCreateProject() {
    console.log('\n📁 Testing Create Project...');
    const projectData = {
        name: 'React Dashboard',
        description: 'Modern React dashboard with TypeScript'
    };
    
    const result = await apiCall('POST', `${BASE_URL}/projects`, projectData, {
        'Authorization': `Bearer ${testData.authToken}`
    });
    
    if (result.success) {
        console.log('✅ Project creation successful:', result.data);
        if (result.data.project) {
            testData.projectId = result.data.project.id;
        }
        return true;
    } else {
        console.log('❌ Project creation failed:', result.error);
        return false;
    }
}

async function testGetAllProjects() {
    console.log('\n📁 Testing Get All Projects...');
    const result = await apiCall('GET', `${BASE_URL}/projects`, null, {
        'Authorization': `Bearer ${testData.authToken}`
    });
    
    if (result.success) {
        console.log('✅ Get all projects successful. Count:', result.data.projects?.length || 0);
        return true;
    } else {
        console.log('❌ Get all projects failed:', result.error);
        return false;
    }
}

async function testCreateSubmission() {
    console.log('\n📝 Testing Create Submission...');
    const submissionData = {
        project_id: testData.projectId,
        title: 'User Authentication Module',
        description: 'JWT-based authentication implementation',
        code_content: `import jwt from 'jsonwebtoken';

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};`,
        file_name: 'auth.js',
        language: 'javascript'
    };
    
    const result = await apiCall('POST', `${BASE_URL}/submissions`, submissionData, {
        'Authorization': `Bearer ${testData.authToken}`
    });
    
    if (result.success) {
        console.log('✅ Submission creation successful:', result.data);
        if (result.data.submission) {
            testData.submissionId = result.data.submission.id;
        }
        return true;
    } else {
        console.log('❌ Submission creation failed:', result.error);
        return false;
    }
}

async function testGetMySubmissions() {
    console.log('\n📝 Testing Get My Submissions...');
    const result = await apiCall('GET', `${BASE_URL}/submissions/my-submissions`, null, {
        'Authorization': `Bearer ${testData.authToken}`
    });
    
    if (result.success) {
        console.log('✅ Get my submissions successful. Count:', result.data.submissions?.length || 0);
        return true;
    } else {
        console.log('❌ Get my submissions failed:', result.error);
        return false;
    }
}

async function testAddComment() {
    console.log('\n💬 Testing Add Comment...');
    const commentData = {
        content: 'Great implementation! Consider adding input validation for the payload parameter.',
        line_number: 3
    };
    
    const result = await apiCall('POST', `${BASE_URL}/submissions/${testData.submissionId}/comments`, commentData, {
        'Authorization': `Bearer ${testData.authToken}`
    });
    
    if (result.success) {
        console.log('✅ Comment creation successful:', result.data);
        if (result.data.comment) {
            testData.commentId = result.data.comment.id;
        }
        return true;
    } else {
        console.log('❌ Comment creation failed:', result.error);
        return false;
    }
}

async function testGetComments() {
    console.log('\n💬 Testing Get Comments...');
    const result = await apiCall('GET', `${BASE_URL}/submissions/${testData.submissionId}/comments`, null, {
        'Authorization': `Bearer ${testData.authToken}`
    });
    
    if (result.success) {
        console.log('✅ Get comments successful. Count:', result.data.comments?.length || 0);
        return true;
    } else {
        console.log('❌ Get comments failed:', result.error);
        return false;
    }
}

async function testApproveSubmission() {
    console.log('\n✅ Testing Approve Submission...');
    const approvalData = {
        comment: 'Code looks excellent! Clean implementation and follows best practices.'
    };
    
    const result = await apiCall('POST', `${BASE_URL}/submissions/${testData.submissionId}/approve`, approvalData, {
        'Authorization': `Bearer ${testData.authToken}`
    });
    
    if (result.success) {
        console.log('✅ Submission approval successful:', result.data);
        return true;
    } else {
        console.log('❌ Submission approval failed:', result.error);
        return false;
    }
}

async function testGetNotifications() {
    console.log('\n🔔 Testing Get Notifications...');
    const result = await apiCall('GET', `${BASE_URL}/notifications/me`, null, {
        'Authorization': `Bearer ${testData.authToken}`
    });
    
    if (result.success) {
        console.log('✅ Get notifications successful. Count:', result.data.notifications?.length || 0);
        return true;
    } else {
        console.log('❌ Get notifications failed:', result.error);
        return false;
    }
}

// Error testing
async function testErrorHandling() {
    console.log('\n🚫 Testing Error Handling...');
    
    // Test invalid email registration
    console.log('  Testing invalid email...');
    const invalidEmail = await apiCall('POST', `${BASE_URL}/auth/register`, {
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User'
    });
    
    if (!invalidEmail.success && invalidEmail.status === 400) {
        console.log('  ✅ Invalid email properly rejected');
    } else {
        console.log('  ❌ Invalid email not properly handled');
    }
    
    // Test unauthorized request
    console.log('  Testing unauthorized request...');
    const unauthorized = await apiCall('GET', `${BASE_URL}/users/me`);
    
    if (!unauthorized.success && unauthorized.status === 401) {
        console.log('  ✅ Unauthorized request properly rejected');
    } else {
        console.log('  ❌ Unauthorized request not properly handled');
    }
    
    // Test non-existent resource
    console.log('  Testing non-existent resource...');
    const notFound = await apiCall('GET', `${BASE_URL}/projects/00000000-0000-0000-0000-000000000000`, null, {
        'Authorization': `Bearer ${testData.authToken}`
    });
    
    if (!notFound.success && notFound.status === 404) {
        console.log('  ✅ Non-existent resource properly handled');
    } else {
        console.log('  ❌ Non-existent resource not properly handled');
    }
}

// Main test runner
async function runAllTests() {
    console.log('🧪 Starting Comprehensive API Testing...\n');
    console.log('=' .repeat(50));
    
    let passedTests = 0;
    let totalTests = 0;
    
    const tests = [
        { name: 'Health Check', fn: testHealthCheck },
        { name: 'User Registration', fn: testUserRegistration },
        { name: 'User Login', fn: testUserLogin },
        { name: 'Get Profile', fn: testGetProfile },
        { name: 'Get All Users', fn: testGetAllUsers },
        { name: 'Create Project', fn: testCreateProject },
        { name: 'Get All Projects', fn: testGetAllProjects },
        { name: 'Create Submission', fn: testCreateSubmission },
        { name: 'Get My Submissions', fn: testGetMySubmissions },
        { name: 'Add Comment', fn: testAddComment },
        { name: 'Get Comments', fn: testGetComments },
        { name: 'Approve Submission', fn: testApproveSubmission },
        { name: 'Get Notifications', fn: testGetNotifications }
    ];
    
    for (const test of tests) {
        totalTests++;
        try {
            const passed = await test.fn();
            if (passed) passedTests++;
        } catch (error) {
            console.log(`❌ ${test.name} threw an error:`, error.message);
        }
    }
    
    // Run error handling tests
    await testErrorHandling();
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 Test Results Summary:');
    console.log(`✅ Passed: ${passedTests}/${totalTests}`);
    console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
    console.log(`📈 Success Rate: ${((passedTests/totalTests) * 100).toFixed(1)}%`);
    
    if (passedTests === totalTests) {
        console.log('\n🎉 All tests passed! API is working correctly.');
    } else {
        console.log('\n⚠️  Some tests failed. Please check the logs above.');
    }
    
    console.log('\n📋 Test Data Generated:');
    console.log('Auth Token:', testData.authToken ? '✅ Generated' : '❌ Not generated');
    console.log('User ID:', testData.userId ? '✅ Generated' : '❌ Not generated');
    console.log('Project ID:', testData.projectId ? '✅ Generated' : '❌ Not generated');
    console.log('Submission ID:', testData.submissionId ? '✅ Generated' : '❌ Not generated');
}

// Check if axios is available
if (typeof require !== 'undefined') {
    runAllTests().catch(error => {
        console.error('❌ Test runner crashed:', error.message);
        process.exit(1);
    });
} else {
    console.log('❌ This script requires Node.js environment with axios installed.');
}