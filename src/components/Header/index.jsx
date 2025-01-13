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
import { ApiGetWalletByUser } from '../../services/WalletServices';
import { useWallet } from '../../context/WalletProvider';
dayjs.extend(relativeTime);

export default function Header() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notis, setNotis] = useState([]);
    const token = localStorage.getItem('token');
    const shopId = localStorage.getItem('shopId');
    var decoded = null;
    if (token) {
        decoded = jwtDecode(token);
    }
    const navigate = useNavigate();
    const socket = io(HTTP_SOCKET_SERVER);
    const { wallet, fetchWallet } = useWallet();

    const handleNotificationClick = async (event) => {
        setAnchorEl(event.currentTarget);
        await fetchNotiByRole();
    };

    useEffect(() => {
        fetchWallet(token);
        fetchCountNotiByRole();
        socket.on('connect', () => {
            console.log('Connected to server with socket ID:', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        // Connect to the shop's room using shopId
        if (decoded && decoded.role.includes('Shop')) {
            const shopId = localStorage.getItem('shopId');
            console.log('Emitting join-shop-topic for shopId:', shopId);
            socket.emit('join-shop-topic', shopId);

            // Listen for order notifications
            socket.on('order-notification', (message) => {
                fetchCountNotiByRole(); // Update unread notifications count
                fetchNotiByRole(); // Fetch updated notifications
            });
        }

        return () => {
            socket.disconnect(); // Disconnect socket on component unmount
        };
    }, []);

    const fetchNotiByRole = async () => {
        if (decoded && decoded.role.includes('Shop')) {
            await fetchNotiForShop();
            await fetchReadAllNotiForShop();
        }
    };

    const fetchCountNotiByRole = async () => {
        if (decoded && decoded.role.includes('Shop')) {
            await fetchCountNotiForShop();
        }
    };

    const fetchReadAllNotiForShop = async () => {
        const shopId = localStorage.getItem('shopId');
        const result = await ApiReadAllNotiForShop(shopId, token);
        if (!result.ok) {
            alert(result.message);
        }
    };

    const fetchNotiForShop = async () => {
        const shopId = localStorage.getItem('shopId');
        const result = await ApiGetNotiForShop(shopId, 1, 10, null, token);
        if (result.ok) {
            setNotis(result.body.data.data);
        } else {
            alert(result.message);
        }
    };

    const fetchCountNotiForShop = async () => {
        const shopId = localStorage.getItem('shopId');
        const result = await ApiCountUnreadForShop(shopId, token);
        if (result.ok) {
            setUnreadCount(result.body.data);
        } else {
            alert(result.message);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
        setUnreadCount(0); // Reset unread count
    };

    const handleItemClick = (id) => {
        navigate(`/shop/orders/detail?orderId=${id}&&refreshString=${generateRandomString(10)}`);
    };

    const handleClickWallet = () => {
        navigate(`/shop/wallet`);
    }

    function generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    return (
        <div
            className='w-100 bg-success d-flex justify-content-between align-items-center'
            style={{
                height: 50,
                background: 'linear-gradient(135deg, #b4ec51, #429321, #0f9b0f)',
                padding: '0 20px',
            }}
        >
            <div className='d-flex align-items-center'>
                <img
                    src="/logo192.png" // Update this path if your logo is stored elsewhere
                    alt="Logo"
                    style={{
                        height: 40, // Adjust logo height to match header
                        marginRight: 10, // Add spacing between logo and text
                    }}
                />
                <span style={{ color: 'white', fontWeight: 'bold' }}>
                    Welcome to BMS
                </span>
            </div>
            <div className='d-flex align-items-center'>
                {shopId && (
                    <span className='text-light mx-3 text-underline-hv' onClick={handleClickWallet}>{new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    }).format(wallet && wallet.balance)}</span>
                )}
                <IconButton onClick={handleNotificationClick} style={{ color: 'white' }}>
                    <Badge badgeContent={unreadCount} color='error' overlap='circular'>
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
            </div>
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
                                className="notification-item"
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
