import React, { useEffect, useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { IconButton, Badge, Menu, MenuItem, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ApiCountUnreadForShop, ApiGetNotiForShop, ApiReadAllNotiForShop } from '../../services/NotificationServices';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { io } from 'socket.io-client';
import { HTTP_SOCKET_SERVER } from '../../constants/Constant';

dayjs.extend(relativeTime);

export default function Header() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notis, setNotis] = useState([]);
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const navigate = useNavigate();
    const socket = io(HTTP_SOCKET_SERVER);

    const handleNotificationClick = async (event) => {
        setAnchorEl(event.currentTarget);
        await fetchNotiByRole();
    };

    useEffect(() => {
        fetchCountNotiByRole();

        socket.on('connect', () => {
            console.log('Connected to server with socket ID:', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        // Kết nối tới room "shop" theo shopId
        if (decoded.role.includes('Shop')) {
            const shopId = localStorage.getItem('shopId');
            console.log('Emitting join-shop-topic for shopId:', shopId);
            socket.emit('join-shop-topic', shopId);

            // Lắng nghe sự kiện thông báo
            socket.on('order-notification', (message) => {
                fetchCountNotiByRole(); // Cập nhật lại số lượng thông báo chưa đọc
                fetchNotiByRole(); // Lấy danh sách thông báo mới
            });
        }

        return () => {
            socket.disconnect(); // Ngắt kết nối khi component unmount
        };
    }, []);

    const fetchNotiByRole = async () => {
        if (decoded.role.includes('Shop')) {
            await fetchNotiForShop();
            await fetchReadAllNotiForShop();
        }
    }

    const fetchCountNotiByRole = async () => {
        if (decoded.role.includes('Shop')) {
            await fetchCountNotiForShop();
        }
    }

    const fetchReadAllNotiForShop = async () => {
        const shopId = localStorage.getItem('shopId');
        const result = await ApiReadAllNotiForShop(shopId, token);
        if (!result.ok) {
            alert(result.message);
        }
    }

    const fetchNotiForShop = async () => {
        const shopId = localStorage.getItem('shopId');
        const result = await ApiGetNotiForShop(shopId, 1, 10, null, token);
        if (result.ok) {
            setNotis(result.body.data.data);
        } else {
            alert(result.message);
        }
    }

    const fetchCountNotiForShop = async () => {
        const shopId = localStorage.getItem('shopId');
        const result = await ApiCountUnreadForShop(shopId, token);
        if (result.ok) {
            setUnreadCount(result.body.data);
        } else {
            alert(result.message);
        }
    }

    const handleClose = () => {
        setAnchorEl(null);
        setUnreadCount(0); // Reset unread count
    };

    const handleItemClick = (id) => {
        navigate(`/shop/orders/detail?orderId=${id}`);
    };

    return (
        <div
            className='w-100 bg-success d-flex justify-content-between align-items-center'
            style={{
                height: 50,
                background: 'linear-gradient(135deg, #b4ec51, #429321, #0f9b0f)',
                padding: '0 20px',
            }}
        >
            <div className='logo' style={{ color: 'white', fontWeight: 'bold' }}>
                Welcome to BMS
            </div>
            <IconButton onClick={handleNotificationClick} style={{ color: 'white' }}>
                <Badge badgeContent={unreadCount} color='error' overlap='circular'>
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: 300,
                        width: '350px',
                    },
                }}
            >
                <List sx={{ padding: 0 }}>
                    {notis.length > 0 ? (
                        notis.map((noti) => (
                            <ListItem
                                key={noti.id}
                                alignItems="flex-start"
                                onClick={() => handleItemClick(noti.orderId)}
                                className="notification-item" // Sử dụng class CSS
                            >
                                <ListItemAvatar>
                                    <Avatar alt={`${noti.firstName} ${noti.lastName}`} src={noti.avatar} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`${noti.firstName} ${noti.lastName}`}
                                    secondary={
                                        <>
                                            {noti.object} <br />
                                            <span style={{ fontSize: '0.8rem', color: '#888' }}>
                                                {dayjs(noti.createDate).fromNow()}
                                            </span>
                                        </>
                                    }
                                />
                            </ListItem>
                        ))
                    ) : (
                        <ListItem alignItems="center" className="no-notifications">
                            <ListItemText
                                primary="You have no notifications"
                                primaryTypographyProps={{
                                    style: { textAlign: 'center', color: '#888', fontStyle: 'italic' },
                                }}
                            />
                        </ListItem>
                    )}
                </List>
            </Menu>
        </div>
    );
}