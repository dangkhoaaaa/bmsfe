import React, { useState } from "react";

const Setting = () => {
  const [profileImage, setProfileImage] = useState(
    "https://via.placeholder.com/100"
  );

  // Xử lý khi người dùng nhấn nút Delete
  const handleDelete = () => {
    setProfileImage(""); // Đặt lại ảnh về rỗng hoặc ảnh placeholder khác
  };

  // Xử lý khi người dùng chọn ảnh mới
  const handleUpdate = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Tạo URL cho ảnh mới
      setProfileImage(imageUrl); // Cập nhật ảnh
    }
  };

  // Xử lý khi người dùng nhấn nút Save
  const handleSave = () => {
    alert("Profile updated and saved!"); // Thực hiện hành động lưu (có thể thêm logic gửi dữ liệu về server)
  };

  return (
    <div style={styles.content}>
      <h1>Settings</h1>
      <div style={styles.profileSection}>
        <div style={styles.profileHeader}>
          <img
            style={styles.smallPhoto} // Sử dụng style giống smallPhoto
            src={profileImage || "https://via.placeholder.com/100"}
            alt="Profile"
          />
          <div>
            <h2>Profile</h2>
            <p>Update your photo and personal details.</p>
          </div>
          <div style={styles.profileButtons}>
            <button style={styles.cancelButton}>Cancel</button>
            <button style={styles.saveButton} onClick={handleSave}>
              Save
            </button>
          </div>
        </div>

        <div style={styles.form}>
          <label style={styles.formLabel}>Username</label>
          <input
            style={styles.formInput}
            type="text"
            placeholder="untitled.ui/olivia"
          />

          <label style={styles.formLabel}>Website</label>
          <input
            style={styles.formInput}
            type="text"
            placeholder="www.untitled.com"
          />

          <label style={styles.formLabel}>Your photo</label>
          <div style={styles.photoSection}>
            <img
              style={styles.smallPhoto}
              src={profileImage || "https://via.placeholder.com/50"}
              alt="Small"
            />
            <button onClick={handleDelete}>Delete</button>
            <input type="file" accept="image/*" onChange={handleUpdate} />
          </div>

          <label style={styles.formLabel}>Your bio</label>
          <textarea
            style={styles.formTextarea}
            placeholder="Add a short bio..."
          />

          <label style={styles.formLabel}>Title</label>
          <input
            style={styles.formInput}
            type="text"
            placeholder="Product Designer"
          />

          <label style={styles.formLabel}>Contact email</label>
          <input
            style={styles.formInput}
            type="email"
            placeholder="example@example.com"
          />
        </div>
      </div>
    </div>
  );
};

const styles = {
  content: {
    flexGrow: 1,
    padding: "40px",
    backgroundColor: "#ffffff",
  },
  profileSection: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "30px",
  },
  profileButtons: {
    display: "flex",
    gap: "10px",
  },
  cancelButton: {
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    backgroundColor: "transparent",
    border: "1px solid #ccc",
  },
  saveButton: {
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    backgroundColor: "#3d996c",
    color: "white",
    border: "none",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px", // Khoảng cách giữa các phần tử form
  },
  formLabel: {
    fontWeight: "bold",
    marginBottom: "5px",
  },
  formInput: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "100%",
  },
  formTextarea: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    resize: "none",
    height: "100px",
    width: "100%",
  },
  photoSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    maxWidth: "200px", // Giới hạn độ rộng của phần "Your photo"
  },
  smallPhoto: {
    width: "100px", // Điều chỉnh chiều rộng ảnh
    height: "100px", // Điều chỉnh chiều cao ảnh
    borderRadius: "50%", // Bo tròn ảnh
    objectFit: "cover", // Đảm bảo ảnh vừa khít với khung
  },
};

export default Setting;
