import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Upload, Spin, Avatar, Divider, Tooltip, Space } from 'antd';
import { CameraOutlined, SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import api from '../api/interceptor';
import { useAuthStore } from '../store/authStore';
import '../styles/dashboard.scss';

const EditProfile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/ref/api/ref/editprofile');
      if (response.data.success) {
        const userData = response.data.data;
        setProfileData(userData);
        setImagePreview(userData.imgURL);
        form.setFieldsValue({
          name: userData.name,
          email: userData.email,
          cin: userData.cin,
        });
      }
    } catch (error) {
      message.error('Failed to load profile data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (info) => {
    const file = info.file.originFileObj;
    
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      message.error('Image size must not exceed 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      message.error('Please upload an image file');
      return;
    }

    try {
      setImageLoading(true);
      
      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append('image', file);

      // Upload to Cloudinary via your backend
      const response = await api.post('/ref/api/ref/editprofile/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setImagePreview(response.data.data.imgURL);
        message.success('Image uploaded successfully');
      }
    } catch (error) {
      message.error('Failed to upload image');
      console.error(error);
    } finally {
      setImageLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.file.originFileObj;
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);

      // Validate passwords match if provided
      if (values.password && values.password !== values.confirmPassword) {
        message.error('Passwords do not match');
        return;
      }

      // Prepare update data
      const updateData = {
        name: values.name,
        email: values.email,
      };

      // Only add password if it's provided (user wants to change it)
      if (values.password && values.password.trim()) {
        updateData.password = values.password;
      }

      const response = await api.put('/ref/api/ref/editprofile', updateData);

      if (response.data.success || response.status === 200) {
        message.success('Profile updated successfully');
        form.resetFields(['password', 'confirmPassword']);
        loadProfileData();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      message.error(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" tip="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="edit-profile-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <Card
        title={
          <span style={{ fontSize: '20px', fontWeight: '600' }}>
            Edit Profile
          </span>
        }
        extra={
          <Button
            type="link"
            icon={<ReloadOutlined />}
            onClick={loadProfileData}
            loading={loading}
          >
            Refresh
          </Button>
        }
        className="profile-card"
        style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
      >
        {/* Profile Picture Section */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ marginBottom: '15px' }}>
            <Avatar
              size={100}
              src={imagePreview || profileData?.imgURL}
              alt={profileData?.name}
              style={{ border: '3px solid #1890ff' }}
            />
          </div>

          <Upload
            maxCount={1}
            beforeUpload={() => false}
            onChange={(info) => {
              handleImageChange(info);
              handleImageUpload(info);
            }}
            accept="image/*"
          >
            <Tooltip title="Click to upload a new profile picture">
              <Button
                type="primary"
                icon={<CameraOutlined />}
                loading={imageLoading}
                style={{ marginTop: '10px' }}
              >
                Change Picture
              </Button>
            </Tooltip>
          </Upload>
          <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
            Max file size: 5MB
          </p>
        </div>

        <Divider />

        {/* Profile Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          className="profile-form"
        >
          {/* Name Field */}
          <Form.Item
            label="Full Name"
            name="name"
            rules={[
              { required: true, message: 'Please enter your full name' },
              { min: 2, message: 'Name must be at least 2 characters' },
              { max: 100, message: 'Name must not exceed 100 characters' },
            ]}
          >
            <Input
              placeholder="Enter your full name"
              size="large"
              prefix={<span style={{ color: '#999' }}>👤</span>}
            />
          </Form.Item>

          {/* Email Field */}
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email address' },
            ]}
          >
            <Input
              placeholder="Enter your email address"
              size="large"
              type="email"
              prefix={<span style={{ color: '#999' }}>✉️</span>}
            />
          </Form.Item>

          {/* CIN Field (Read-only) */}
          <Form.Item
            label="CIN (Identification Number)"
            name="cin"
          >
            <Input
              placeholder="Your CIN"
              size="large"
              disabled
              prefix={<span style={{ color: '#999' }}>📋</span>}
              style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
            />
          </Form.Item>

          <Divider orientation="left" style={{ margin: '20px 0' }}>
            Change Password (Optional)
          </Divider>

          {/* Password Field */}
          <Form.Item
            label="New Password"
            name="password"
            rules={[
              {
                min: 6,
                message: 'Password must be at least 6 characters',
              },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
              },
            ]}
          >
            <Input.Password
              placeholder="Leave empty to keep current password"
              size="large"
              prefix={<span style={{ color: '#999' }}>🔒</span>}
            />
          </Form.Item>

          {/* Confirm Password Field */}
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              {
                validate: (_, value) => {
                  const password = form.getFieldValue('password');
                  if (password && value && password !== value) {
                    return Promise.reject(new Error('Passwords do not match'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.Password
              placeholder="Confirm your new password"
              size="large"
              prefix={<span style={{ color: '#999' }}>🔑</span>}
            />
          </Form.Item>

          <Divider />

          {/* Submit Buttons */}
          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button
                size="large"
                onClick={() => {
                  form.resetFields();
                  loadProfileData();
                }}
              >
                Reset
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                icon={<SaveOutlined />}
                loading={loading}
              >
                Save Changes
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* Info Message */}
      <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#e6f7ff', borderRadius: '4px', textAlign: 'center' }}>
        <p style={{ margin: 0, color: '#0050b3', fontSize: '12px' }}>
          ℹ️ Your profile changes will be saved securely. Password changes require re-login.
        </p>
      </div>
    </div>
  );
};

export default EditProfile;
