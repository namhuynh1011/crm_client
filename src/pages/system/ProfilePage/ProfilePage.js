import React, { useEffect, useState, useRef } from "react";
import Header from "../../../components/Header/Header";
import Sidebar from "../../../components/Sidebar/Sidebar";
import "./ProfilePage.css";
import { getCurrentUser, axiosInstance, updateProfile, changePassword } from "../../../services/Auth";
import defaultAvatar from "../../../assets/default-avatar.png";

/* Utility to read file as data URL for preview */
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.onerror = reject;
        r.readAsDataURL(file);
    });
}

const ProfilePage = () => {
    // store initial user object for reference
    const initialUserRef = useRef(null);

    // state: initialize empty and populate after async load
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [avatarPreview, setAvatarPreview] = useState(defaultAvatar);
    const [avatarFile, setAvatarFile] = useState(null);

    const [savingProfile, setSavingProfile] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    // Change password state
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);
    const passwordRef = useRef(null);

    // load current user once on mount (async)
    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const user = await getCurrentUser();
                if (!mounted) return;
                initialUserRef.current = user || {};
                setName(user?.fullName || user?.name || "");
                setEmail(user?.email || "");
                setRole(user?.role || "");
                setAvatarPreview(user?.avatar || defaultAvatar);
            } catch (err) {
                console.warn("Unable to load current user:", err);
                // fallback to localStorage cached user
                try {
                    const cached = JSON.parse(localStorage.getItem("currentUser") || "null");
                    if (cached) {
                        initialUserRef.current = cached;
                        setName(cached.fullName || cached.name || "");
                        setEmail(cached.email || "");
                        setRole(cached.role || "");
                        setAvatarPreview(cached.avatar || defaultAvatar);
                    }
                } catch { }
            }
        };
        load();

        const onStorage = (e) => {
            if (e.key === "currentUser" && e.newValue) {
                try {
                    const parsed = JSON.parse(e.newValue);
                    // update only safe display fields (don't overwrite editing name)
                    if (parsed.avatar) setAvatarPreview(parsed.avatar);
                    if (!document.activeElement || document.activeElement.tagName !== "INPUT") {
                        // if user isn't actively typing, update name/email/role
                        if (parsed.fullName) setName(parsed.fullName);
                        if (parsed.email) setEmail(parsed.email);
                        if (parsed.role) setRole(parsed.role);
                    }
                } catch { }
            }
        };
        window.addEventListener("storage", onStorage);

        return () => {
            mounted = false;
            window.removeEventListener("storage", onStorage);
        };
    }, []);

    const onSelectAvatar = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setError("Kích thước file quá lớn (tối đa 5MB).");
            return;
        }
        if (!file.type.startsWith("image/")) {
            setError("Vui lòng chọn file ảnh.");
            return;
        }
        setError(null);
        setAvatarFile(file);
        try {
            const dataUrl = await readFileAsDataURL(file);
            setAvatarPreview(dataUrl);
        } catch (err) {
            console.error(err);
            setError("Không thể đọc file ảnh.");
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        setSavingProfile(true);

        try {
            let avatarUrl = initialUserRef.current?.avatar || null;

            if (avatarFile) {
                try {
                    const form = new FormData();
                    form.append("avatar", avatarFile);

                    // upload avatar if backend supports it
                    const uploadRes = await axiosInstance.post("/users/avatar", form, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });
                    avatarUrl = uploadRes.data?.avatarUrl || avatarUrl;
                } catch (uploadErr) {
                    // fallback to dataURL if upload endpoint not available
                    console.warn("Avatar upload failed, falling back to preview data URL:", uploadErr);
                    avatarUrl = avatarPreview;
                }
            }

            // NOTE: backend controller expects `fullname` (lowercase) in body
            const payload = { fullName: name.trim(), avatar: avatarUrl };
            const res = await updateProfile(payload);

            if (res?.err && res.err !== 0) {
                setError(res.msg || "Lỗi khi cập nhật hồ sơ");
                setSavingProfile(false);
                return;
            }

            const updatedUser = res?.user || null;
            if (updatedUser) {
                try {
                    const stored = JSON.parse(localStorage.getItem("currentUser") || "{}");
                    const merged = { ...stored, ...updatedUser };
                    localStorage.setItem("currentUser", JSON.stringify(merged));
                } catch (e) { }
                initialUserRef.current = { ...initialUserRef.current, ...updatedUser };
                if (updatedUser.avatar) setAvatarPreview(updatedUser.avatar);
                if (updatedUser.fullName || updatedUser.fullname) setName(updatedUser.fullName || updatedUser.fullname);
                if (updatedUser.email) setEmail(updatedUser.email);
                if (updatedUser.role) setRole(updatedUser.role);
            } else {
                // fallback: update cached currentUser
                try {
                    const stored = JSON.parse(localStorage.getItem("currentUser") || "{}");
                    const merged = { ...stored, fullName: payload.fullname, avatar: payload.avatar };
                    localStorage.setItem("currentUser", JSON.stringify(merged));
                } catch (e) { }
            }

            // notify other components to refresh user display
            window.dispatchEvent(new Event("userUpdated"));

            setMessage(res?.msg || "Cập nhật thông tin thành công.");
        } catch (err) {
            console.error("Update profile error:", err);
            const msg = err?.msg || err?.message || err?.error || "Lỗi khi lưu thông tin.";
            setError(msg);
        } finally {
            setSavingProfile(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (!oldPassword || !newPassword || !confirmNewPassword) {
            setError("Vui lòng điền đầy đủ các trường mật khẩu.");
            return;
        }
        if (newPassword.length < 6) {
            setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setError("Mật khẩu mới và xác nhận không khớp.");
            return;
        }

        setChangingPassword(true);
        try {
            const payload = { oldPassword, newPassword };
            const res = await changePassword(payload);

            if (res?.err && res.err !== 0) {
                setError(res.msg || "Lỗi khi đổi mật khẩu.");
            } else {
                setMessage(res?.msg || "Đổi mật khẩu thành công.");
                setOldPassword("");
                setNewPassword("");
                setConfirmNewPassword("");
                if (passwordRef.current) passwordRef.current.blur();
            }
        } catch (err) {
            console.error("Change password error:", err);
            const msg =
                err?.msg ||
                err?.message ||
                err?.error ||
                (err?.response?.data && (err.response.data.msg || err.response.data.message)) ||
                "Lỗi khi đổi mật khẩu.";
            setError(msg);
        } finally {
            setChangingPassword(false);
        }
    };

    return (
        <div className="app-layout">
            <Header />
            <Sidebar />

            <main className="main-with-header">
                <div className="profile-page">
                    <h1 className="profile-title">Profile</h1>

                    <div className="profile-grid">
                        <section className="profile-card">
                            <form onSubmit={handleSaveProfile} className="profile-form">
                                <div className="avatar-row">
                                    <div className="avatar-preview">
                                        <img src={avatarPreview || defaultAvatar} alt="Avatar" />
                                    </div>

                                    <div className="avatar-controls">
                                        <label className="btn btn-secondary" htmlFor="avatarInput">
                                            Chọn ảnh
                                        </label>
                                        <input
                                            id="avatarInput"
                                            type="file"
                                            accept="image/*"
                                            onChange={onSelectAvatar}
                                            style={{ display: "none" }}
                                        />
                                        <div className="small-note">Kích thước tối đa 5MB. JPG/PNG.</div>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <label>Họ tên</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Họ tên"
                                    />
                                </div>

                                <div className="form-row">
                                    <label>Email</label>
                                    <input type="email" value={email} readOnly />
                                </div>

                                <div className="form-row">
                                    <label>Role</label>
                                    <input type="text" value={role} readOnly />
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary" disabled={savingProfile}>
                                        {savingProfile ? "Đang lưu..." : "Lưu thông tin"}
                                    </button>
                                </div>
                            </form>
                        </section>

                        <section className="profile-card">
                            <h2>Đổi mật khẩu</h2>
                            <form onSubmit={handleChangePassword} className="password-form">
                                <div className="form-row">
                                    <label>Mật khẩu hiện tại</label>
                                    <input
                                        type="password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        placeholder="Mật khẩu hiện tại"
                                        ref={passwordRef}
                                    />
                                </div>

                                <div className="form-row">
                                    <label>Mật khẩu mới</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Mật khẩu mới"
                                    />
                                </div>

                                <div className="form-row">
                                    <label>Xác nhận mật khẩu mới</label>
                                    <input
                                        type="password"
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        placeholder="Xác nhận mật khẩu mới"
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary" disabled={changingPassword}>
                                        {changingPassword ? "Đang xử lý..." : "Đổi mật khẩu"}
                                    </button>
                                </div>
                            </form>
                        </section>
                    </div>

                    {(message || error) && (
                        <div className={`profile-message ${error ? "error" : "success"}`}>{error || message}</div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;