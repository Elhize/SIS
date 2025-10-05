import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    TextField,
    Button,
    CircularProgress,
    Typography,
    ListItem,
    ListItemText,
    Switch,
    Box,
    Container,
    CssBaseline,
    ThemeProvider,
    createTheme,
    AppBar,
    Toolbar,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FaRegMoon, FaMoon } from "react-icons/fa";

const UserPageAccess = () => {
    const [userFound, setUserFound] = useState(null);
    const [pages, setPages] = useState([]);
    const [pageAccess, setPageAccess] = useState({});
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState('light');
    const [userID, setUserID] = useState("");
    const [user, setUser] = useState("");
    const [userRole, setUserRole] = useState("");

    const theme = createTheme({
        palette: {
            mode,
            primary: { main: '#800000' },
            secondary: { main: '#8B008B' },
        },
    });

    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const handleSearchUser = async (e) => {
        e.preventDefault();
        if (!userID) return;

        setLoading(true);
        try {
            const { data: allPages } = await axios.get('http://localhost:5000/api/pages');
            const { data: accessRows } = await axios.get(`http://localhost:5000/api/page_access/${userID}`);

            const accessMap = accessRows.reduce((acc, curr) => {
                acc[curr.page_id] = curr.page_privilege === 0;
                return acc;
            }, {});

            allPages.forEach((page) => {
                if (accessMap[page.id] === undefined) {
                    accessMap[page.id] = false;
                }
            });

            setUserFound({ id: userID });
            setPages(allPages);
            setPageAccess(accessMap);

        } catch (error) {
            console.error('Error searching user:', error);
            setUserFound(null);
            alert("User not found or error loading data");
        }
        setLoading(false);
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("email");
        const storedRole = localStorage.getItem("role");
        const storedID = localStorage.getItem("person_id");

        if (storedUser && storedRole && storedID) {
            setUser(storedUser);
            setUserRole(storedRole);
            setUserID(storedID);

            if (storedRole !== "registrar") {
                window.location.href = "/login";
            }
        } else {
            window.location.href = "/login";
        }
    }, []);

    const fetchPages = async () => {
        try {
            const { data: allPages } = await axios.get('http://localhost:5000/api/pages');
            const { data: accessRows } = await axios.get(`http://localhost:5000/api/page_access/${userID}`);

            const accessMap = accessRows.reduce((acc, curr) => {
                acc[curr.page_id] = curr.page_privilege === 0;
                return acc;
            }, {});

            allPages.forEach((page) => {
                if (accessMap[page.id] === undefined) {
                    accessMap[page.id] = false;
                }
            });

            setPages(allPages);
            setPageAccess(accessMap);
        } catch (err) {
            console.error("Error fetching pages or access:", err);
        }
    };

    const handleToggleChange = async (pageId, hasAccess) => {
        const updatedAccess = !hasAccess;
        try {
            await axios.put(`http://localhost:5000/api/page_access/${userID}/${pageId}`, {
                page_privilege: updatedAccess ? 0 : 1,
            });
            await fetchPages();
        } catch (error) {
            console.error('Error updating page access:', error);
        }
    };

    // divide pages into 5 groups (like elevator style)
    const chunkSize = Math.ceil(pages.length / 5);
    const groupedPages = [];
    for (let i = 0; i < pages.length; i += chunkSize) {
        groupedPages.push(pages.slice(i, i + chunkSize));
    }
    // inside your return
    return (
        <Box sx={{ height: "calc(100vh - 100px)", overflowY: "auto", paddingRight: 1, backgroundColor: "transparent" }}>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    mt: 2,

                    mb: 2,
                    px: 2,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        color: 'maroon',
                        fontSize: '36px',
                    }}
                >
                   USER PAGE ACCESS MANAGEMENT
                </Typography>




            </Box>
            <hr style={{ border: "1px solid #ccc", width: "100%" }} />

            <br />

            <div style={{
                width: '100%',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                padding: '20px',
           
            }}>
                <div style={{
                    width: '13in',     // ✅ landscape width
                    height: '8.5in',   // ✅ landscape height
                    border: '2px solid maroon',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    padding: '20px',
                    overflowY: 'auto', // scroll inside "page" if too much
                    boxShadow: '0 0 10px rgba(0,0,0,0.3)'
                }}>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />


                        <Container sx={{ mt: 3, mb: 3 }}>
                            <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
                                User Page Access Management
                            </Typography>

                            {/* Search Bar */}
                            <Box component="form" onSubmit={handleSearchUser}
                                sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}
                            >
                                <TextField
                                    label="Enter User ID"
                                    variant="outlined"
                                    value={userID}
                                    onChange={(e) => setUserID(e.target.value)}
                                    required
                                    sx={{ mr: 2 }}
                                />
                                <Button type="submit" variant="contained" color="primary">
                                    Search User
                                </Button>
                            </Box>

                            {loading && <CircularProgress sx={{ display: 'block', mx: 'auto' }} />}

                            {/* User Found */}
                            {userFound && (
                                <Box>
                                    <Typography variant="h6" align="center" gutterBottom>
                                        Manage Page Access for User: ID {userFound.id}
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(10, 1fr)", // ✅ 10 columns
                                            gridAutoRows: "minmax(60px, auto)",    // ✅ uniform row height
                                            gap: 1,
                                            width: "100%",
                                        }}
                                    >
                                        {pages.map((page) => {
                                            const pageId = page.id;
                                            const hasAccess = !!pageAccess[pageId];
                                            return (
                                                <Box
                                                    key={pageId}
                                                    sx={{
                                                        border: "1px solid #ccc",
                                                        borderRadius: "6px",
                                                        padding: "8px",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        textAlign: "center",
                                                        backgroundColor: "#fafafa",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            whiteSpace: "nowrap",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            width: "100%",
                                                        }}
                                                    >
                                                        {page.page_description || "No Description"}
                                                    </Typography>
                                                    <Switch
                                                        checked={hasAccess}
                                                        onChange={() => handleToggleChange(pageId, hasAccess)}
                                                        color="primary"
                                                        size="small"
                                                    />
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                </Box>
                            )}


                            {/* No user */}
                            {!userFound && !loading && (
                                <Typography align="center">
                                    No user found. Please enter a valid User ID.
                                </Typography>
                            )}
                        </Container>
                    </ThemeProvider>
                </div>
            </div>
        </Box>
    );

};

export default UserPageAccess;
