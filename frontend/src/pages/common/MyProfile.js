import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  AdminPanelSettings as AdminIcon,
  SupervisorAccount as SupervisorIcon,
  AccountBalance as AccountBalanceIcon,
  Group as GroupIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import { parseJwt } from '../../utils/jwt';

const MyProfile = ({ role }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const token = localStorage.getItem('token');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProfile(response.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const getRoleIcon = (userRole) => {
    const roleIcons = {
      'admin': <AdminIcon />,
      'superadmin': <AdminIcon />,
      'teacher': <PersonIcon />,
      'student': <SchoolIcon />,
      'hod': <SupervisorIcon />,
      'dean': <AccountBalanceIcon />,
      'cc': <GroupIcon />
    };
    return roleIcons[userRole] || <PersonIcon />;
  };

  const getRoleColor = (userRole) => {
    const roleColors = {
      'admin': '#d32f2f',
      'superadmin': '#7b1fa2',
      'teacher': '#1976d2',
      'student': '#388e3c',
      'hod': '#f57c00',
      'dean': '#5d4037',
      'cc': '#0097a7'
    };
    return roleColors[userRole] || '#757575';
  };

  const getRoleLabel = (userRole) => {
    const roleLabels = {
      'admin': 'Administrator',
      'superadmin': 'Super Administrator',
      'teacher': 'Teacher',
      'student': 'Student',
      'hod': 'Head of Department',
      'dean': 'Dean',
      'cc': 'Course Coordinator'
    };
    return roleLabels[userRole] || userRole?.toUpperCase();
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={fetchProfile}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">No profile data available</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3 
      }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          My Profile
        </Typography>
        <Tooltip title="Refresh Profile">
          <IconButton onClick={fetchProfile} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                mb: 3 
              }}>
                <Avatar 
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    bgcolor: getRoleColor(profile.role),
                    fontSize: '2.5rem',
                    fontWeight: 600,
                    mb: 2,
                    border: '4px solid',
                    borderColor: getRoleColor(profile.role) + '20'
                  }}
                >
                  {getInitials(profile.name)}
                </Avatar>
                
                <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
                  {profile.name}
                </Typography>
                
                <Chip 
                  icon={getRoleIcon(profile.role)}
                  label={getRoleLabel(profile.role)}
                  sx={{ 
                    bgcolor: getRoleColor(profile.role),
                    color: 'white',
                    fontWeight: 600,
                    '& .MuiChip-icon': {
                      color: 'white'
                    }
                  }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Basic Information */}
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email" 
                    secondary={profile.email}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <BadgeIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="User ID" 
                    secondary={profile._id}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItem>

                {profile.regNo && (
                  <ListItem>
                    <ListItemIcon>
                      <BadgeIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Registration Number" 
                      secondary={profile.regNo}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                )}

                {profile.teacherId && (
                  <ListItem>
                    <ListItemIcon>
                      <BadgeIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Teacher ID" 
                      secondary={profile.teacherId}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Additional Information */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                Additional Information
              </Typography>

              <List dense>
                {profile.school && (
                  <ListItem>
                    <ListItemIcon>
                      <SchoolIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="School" 
                      secondary={`${profile.school.name} (${profile.school.code})`}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                )}

                {profile.department && (
                  <ListItem>
                    <ListItemIcon>
                      <BusinessIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Department" 
                      secondary={`${profile.department.name} (${profile.department.code})`}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                )}

                {profile.roles && profile.roles.length > 1 && (
                  <ListItem>
                    <ListItemIcon>
                      <SupervisorIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="All Roles" 
                      secondary={
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                          {profile.roles.map((role, index) => (
                            <Chip 
                              key={index}
                              size="small"
                              label={getRoleLabel(role)}
                              sx={{ 
                                bgcolor: getRoleColor(role) + '20',
                                color: getRoleColor(role),
                                fontWeight: 500
                              }}
                            />
                          ))}
                        </Box>
                      }
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                )}

                {profile.coursesAssigned && profile.coursesAssigned.length > 0 && (
                  <ListItem>
                    <ListItemIcon>
                      <SchoolIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Assigned Courses" 
                      secondary={`${profile.coursesAssigned.length} courses assigned`}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                )}
              </List>

              {/* Account Details */}
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Account Details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Created: {new Date(profile.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last Updated: {new Date(profile.updatedAt).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Full Profile Details Card */}
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 2 
              }}>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                  Complete Profile Data
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setDialogOpen(true)}
                  startIcon={<PersonIcon />}
                >
                  View Details
                </Button>
              </Box>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                This shows your complete profile information as stored in the system.
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Profile Details Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          Complete Profile Details
          <IconButton onClick={handleDialogClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
            <pre style={{ 
              margin: 0, 
              fontSize: '0.875rem',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {JSON.stringify(profile, null, 2)}
            </pre>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyProfile;