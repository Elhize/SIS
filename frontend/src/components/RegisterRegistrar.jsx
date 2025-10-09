import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Snackbar,
    Alert,
    Stack
} from "@mui/material";

const RegisterRegistrar = () => {
    const [department, setDepartment] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [form, setForm] = useState({
        employee_id: "",
        last_name: "",
        middle_name: "",
        first_name: "",
        role: "registrar",
        email: "",
        password: "",
        status: 1,
        dprtmnt_id: ""
    });

    // 📥 Fetch Departments
    const fetchDepartments = async () => {
        try {
            const res = await axios.get("http://localhost:5000/get_department");
            setDepartment(res.data);
            console.log("✅ Departments fetched:", res.data);
        } catch (err) {
            console.error("❌ Department fetch error:", err);
            setErrorMessage("Failed to load department list");
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 📝 Register Registrar Account
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/register_registrar", form);
            setOpenSnackbar(true);
            setForm({
                employee_id: "",
                last_name: "",
                middle_name: "",
                first_name: "",
                role: "registrar",
                email: "",
                password: "",
                status: 1,
                dprtmnt_id: ""
            });
        } catch (err) {
            console.error("❌ Submit error:", err);
            setErrorMessage(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <Box sx={{ height: "calc(100vh - 150px)", overflowY: "auto", pr: 1 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} mt={2}>
                {/* Left: Header */}
                <Typography variant="h4" fontWeight="bold" color="maroon">
                 REGISTRAR ACCOUNTS
                </Typography>

                {/* Right: Search */}
              
            </Box>

            <hr style={{ border: "1px solid #ccc", width: "100%" }} />


            <br />
            <Card sx={{ maxWidth: 500, width: "100%", boxShadow: 5, borderRadius: 3 }}>
                <CardContent>
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        mb={2}
                        textAlign="center"
                        color="maroon"
                    >
                        Registrar Registration
                    </Typography>

                    <Stack spacing={2}>
                        <TextField
                            label="Employee ID"
                            name="employee_id"
                            value={form.employee_id}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Last Name"
                            name="last_name"
                            value={form.last_name}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Middle Name"
                            name="middle_name"
                            value={form.middle_name}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="First Name"
                            name="first_name"
                            value={form.first_name}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            fullWidth
                        />

                        {/* 🏫 Department Dropdown */}
                        <FormControl fullWidth required>
                            <InputLabel id="department-label">Department</InputLabel>
                            <Select
                                labelId="department-label"
                                name="dprtmnt_id"
                                value={form.dprtmnt_id}
                                label="Department"
                                onChange={handleChange}
                            >
                                <MenuItem value="">Select Department</MenuItem>
                                {department.map((dep) => (
                                    <MenuItem key={dep.dprtmnt_id} value={dep.dprtmnt_id}>
                                        {dep.dprtmnt_name} ({dep.dprtmnt_code})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button
                            variant="contained"
                            sx={{
                                mt: 1,
                                py: 1.2,
                                fontWeight: "bold",
                                backgroundColor: "#800000",
                                "&:hover": { backgroundColor: "#6D2323" }
                            }}
                            onClick={handleSubmit}
                        >
                            Register
                        </Button>

                        {errorMessage && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {errorMessage}
                            </Alert>
                        )}
                    </Stack>
                </CardContent>
            </Card>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert severity="success" sx={{ width: "100%" }}>
                    Registrar registered successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default RegisterRegistrar;
