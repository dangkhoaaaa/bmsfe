import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Grid, Avatar, Button, Pagination, Dialog, DialogActions, DialogContent, IconButton, CircularProgress } from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { ApiChangeStatusStudent, ApiGetStudentListConfirm } from '../../services/StudentServices';

export default function StaffStudentConfirm() {
  const shopId = localStorage.getItem('shopId');
  const token = localStorage.getItem('token');
  const [currentPage, setCurrentPage] = useState(1);
  const [students, setStudents] = useState([]);
  const studentsPerPage = 5; // Số sinh viên hiển thị mỗi trang
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const STATUS_PENDING = 1;
  const STATUS_ACCEPTED = 2;
  const STATUS_DENY = 3;
  const [loading, setLoading] = useState(false);

  // Fetch danh sách sinh viên
  const fetchStudentConfirmList = async () => {
    const result = await ApiGetStudentListConfirm("", true, 1, 1000, token);
    if (result.ok) {
      setStudents(result.body.data.data);
    } else {
      alert(result.message);
    }
  };

  // Cập nhật sinh viên cho mỗi trang
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

  // Gọi API khi trang thay đổi
  useEffect(() => {
    fetchStudentConfirmList();
  }, [currentPage]);  // Chạy lại khi trang thay đổi

  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Sửa lại thành setCurrentPage
  };

  // Xử lý nút xác nhận sinh viên
  const handleConfirm = async (id) => {
    setLoading(true);
    const result = await ApiChangeStatusStudent(id, STATUS_ACCEPTED, "Accepted", token);
    if (result.ok) {
      fetchStudentConfirmList();
    } else {
      alert(result.message);
    }
    setLoading(false);
  };

  const handleDeny = async (id) => {
    setLoading(true);
    const result = await ApiChangeStatusStudent(id, STATUS_DENY, "Invalid Student ID or Image Card ID, please try again", token);
    if (result.ok) {
      fetchStudentConfirmList();
    } else {
      alert(result.message);
    }
    setLoading(false);
  };

  // Mở modal xem ảnh
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setOpenModal(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImage(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Student Information
      </Typography>

      {currentStudents.map((student) => (
        <Paper key={student.id} sx={{ mb: 3, p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4} sx={{ position: 'relative' }}>
              <Avatar
                alt={student.studentId}
                src={student.imageCardStudent || "https://via.placeholder.com/150"}
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '10px',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    cursor: 'pointer',
                  }
                }}
                onClick={() => handleImageClick(student.imageCardStudent)}
              />
              {/* Icon mắt khi hover */}
              <IconButton
                sx={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  visibility: 'hidden',
                  '&:hover': {
                    visibility: 'visible',
                  },
                }}
                onClick={() => handleImageClick(student.imageCardStudent)}
              >
                <VisibilityIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="h6">Student ID: {student.studentId}</Typography>
              <Typography variant="body1">User ID: {student.userId}</Typography>
              <Typography variant="body1">First Name: {student.user.firstName}</Typography>
              <Typography variant="body1">Last Name: {student.user.lastName}</Typography>
              <Typography variant="body1">University: {student.university.name}</Typography>
              {student.statusStudent === STATUS_ACCEPTED && (
                <Button
                  variant="outlined"
                  color="success"
                  sx={{ mt: 2 }}
                  disabled
                >
                  Activated
                </Button>
              ) || student.statusStudent === STATUS_DENY && (
                <Button
                  variant="outlined"
                  color="error"
                  sx={{ mt: 2 }}
                  disabled
                >
                  Denied
                </Button>
              ) || (
                  <div>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleConfirm(student.id)}
                      sx={{ mt: 2 }}
                    >
                      Confirm
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeny(student.id)}
                      sx={{ mt: 2, ml: 1 }}
                    >
                      Deny
                    </Button>
                  </div>
                )}
            </Grid>
          </Grid>
        </Paper>
      ))}

      {/* Phân trang */}
      <Pagination
        count={Math.ceil(students.length / studentsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
      />

      {/* Modal xem hình ảnh */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogContent>
          <img
            src={selectedImage}
            alt="Selected"
            style={{ width: '100%', height: 'auto', borderRadius: '10px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Loading */}
      <Dialog open={loading} disableEscapeKeyDown>
        <DialogContent sx={{ textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading...
          </Typography>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
