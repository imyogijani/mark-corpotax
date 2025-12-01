import express from 'express';
import { Request, Response } from 'express';
import { NotificationService, UserService } from '../services/firebaseService';
import { protect } from '../middleware/auth';

const router = express.Router();

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
router.get('/', protect, async (req: any, res: Response) => {
  try {
    const { read, type, category, limit = 50, page = 1 } = req.query;
    
    // Get all user notifications
    let notifications = await NotificationService.findByUser(req.user.id);
    
    // Apply filters
    if (read !== undefined) {
      const isRead = read === 'true';
      notifications = notifications.filter(n => n.read === isRead);
    }
    
    if (type) {
      notifications = notifications.filter(n => n.type === type);
    }
    
    if (category) {
      notifications = notifications.filter(n => n.category === category);
    }
    
    // Sort by createdAt descending
    notifications.sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
    
    const total = notifications.length;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;
    
    // Paginate
    const paginatedNotifications = notifications.slice(skip, skip + limitNum);
    
    // Get unread count
    const allUserNotifications = await NotificationService.findByUser(req.user.id);
    const unreadCount = allUserNotifications.filter(n => !n.read).length;
    
    res.status(200).json({
      success: true,
      message: 'Notifications retrieved successfully',
      data: {
        notifications: paginatedNotifications,
        pagination: {
          current: pageNum,
          pages: Math.ceil(total / limitNum),
          total,
          limit: limitNum
        },
        unreadCount
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error retrieving notifications'
    });
  }
});

// @desc    Get unread count
// @route   GET /api/notifications/unread-count
// @access  Private
router.get('/unread-count', protect, async (req: any, res: Response) => {
  try {
    const notifications = await NotificationService.findByUser(req.user.id);
    const unreadCount = notifications.filter(n => !n.read).length;
    
    res.status(200).json({
      success: true,
      message: 'Unread count retrieved',
      data: { count: unreadCount }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error getting unread count'
    });
  }
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
router.put('/:id/read', protect, async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    
    const notification = await NotificationService.findById(id);
    
    if (!notification || notification.userId !== req.user.id) {
      res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
      return;
    }
    
    const updated = await NotificationService.markAsRead(id);
    
    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: updated
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating notification'
    });
  }
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
router.put('/read-all', protect, async (req: any, res: Response) => {
  try {
    await NotificationService.markAllAsRead(req.user.id);
    
    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating notifications'
    });
  }
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
router.delete('/:id', protect, async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    
    const notification = await NotificationService.findById(id);
    
    if (!notification || notification.userId !== req.user.id) {
      res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
      return;
    }
    
    await NotificationService.delete(id);
    
    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting notification'
    });
  }
});

// @desc    Clear all notifications
// @route   DELETE /api/notifications
// @access  Private
router.delete('/', protect, async (req: any, res: Response) => {
  try {
    const notifications = await NotificationService.findByUser(req.user.id);
    
    // Delete all user notifications
    for (const notification of notifications) {
      await NotificationService.delete(notification.id!);
    }
    
    res.status(200).json({
      success: true,
      message: 'All notifications cleared'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error clearing notifications'
    });
  }
});

// @desc    Create notification (Admin only or system use)
// @route   POST /api/notifications
// @access  Private
router.post('/', protect, async (req: any, res: Response) => {
  try {
    const { 
      userId, 
      type, 
      title, 
      message, 
      category, 
      actionUrl, 
      actionLabel, 
      metadata 
    } = req.body;
    
    // Allow admin to create notifications for any user
    // Or allow users to create notifications for themselves
    const targetUserId = req.user.role === 'admin' ? (userId || req.user.id) : req.user.id;
    
    // Verify target user exists
    const targetUser = await UserService.findById(targetUserId);
    if (!targetUser) {
      res.status(404).json({
        success: false,
        message: 'Target user not found'
      });
      return;
    }
    
    const notification = await NotificationService.create({
      userId: targetUserId,
      type: type || 'info',
      title,
      message,
      category: category || 'general',
      actionUrl,
      actionLabel,
      metadata
    });
    
    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating notification'
    });
  }
});

export default router;