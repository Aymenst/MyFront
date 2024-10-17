import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    Box,
    TextField,
    DialogActions,
    Typography,
    Snackbar
} from '@material-ui/core';
import ConfirmDialog from '../../../components/DeleteConfirmation/ConfirmDialog';
import MuiAlert from "@material-ui/lab/Alert";
import withStyles from '@material-ui/core/styles/withStyles';
import GeneralTable from '../GenralTables/GeneralTable';
import { PropTypes } from 'prop-types';
import TicketService from "../../Services/TicketService";
import axios from "axios";
import MenuItem from "@material-ui/core/MenuItem";

const styles = {
    gridSizing: {
        marginBottom: '4%'
    },
    gridSizing2: {
        marginBottom: '1%'
    },
    buttonSpacing: {
        minHeight: 30,
        minWidth: 200
    }
};

class BlankPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tickets: [],
            id: '',
            ticketNumber: '',
            description: '',
            status: '',
            createdDate: '',
            record: '',
            message: '',
            openAdd: false,
            openNotif: false,
            openWarning: false,
            openPopUp: false,
            edit: false,
            success: false,
            columns: [
                    {
                      label: 'Ticket Id',
                      name: 'ticketNumber',
                      options: {
                        filter: true
                      }
                    },
                    {
                      label: 'Description',
                      name: 'description',
                      options: {
                        filter: true
                      }
                    },
                    {
                      label: 'Status',
                      name: 'status',
                      options: {
                        filter: true,
                          customBodyRender: (value, tableMeta) => (value ? "Open" : "Close")
                      }
                    },
                    {
                      label: 'Date',
                      name: 'createdDate',
                      options: {
                        filter: true,
                          customBodyRender: (value, tableMeta) => {
                              if (value) {
                                  const date = new Date(value);
                                  const options = { year: 'numeric', month: 'long', day: 'numeric' };
                                  const formattedDate = date.toLocaleDateString('en-US', options);
                                  const [month, day, year] = formattedDate.split(' ');
                                  return `${month.substring(0, 3)}-${day.replace(',', '')}-${year}`;
                              }
                              return '';
                          }
                        }
                    }
                  ]
        };
    }

    fetchTickets = async (page = 1, pageSize = 100) => {
        try {
            const response = await TicketService.getData(page, pageSize);
            this.setState({
                tickets: response.data.tickets,
                count: response.data.count,
            });
        } catch (error) {
            this.setState({ error: 'Failed to fetch tickets.' });
        }
    };
    componentDidMount() {
        this.fetchTickets();
    }

    handleAddData = () => {
        this.setState({
            description: '',
            status: '',
            ticketNumber: '',
            edit: true,
            openAdd: true
        });
    };

    handleAdd = async () => {
        const { ticketNumber, description, status } = this.state;
        
        const newTicket = {
            ticketNumber,
            description,
            status
        };

        try {
            const response = await TicketService.saveRequest(newTicket);
            if (response.status === 201) {
                this.fetchTickets();
                this.setState({
                    openAdd: false,
                    severity: 'success',
                    message: 'Ticket added successfully',
                    openNotif: true,
                    description: '',
                    status: '' 
                });
            }
        } catch (err) {
            console.log(err);
            console.log(err.response);
            this.setState({
                openNotif: true,
                severity: 'error',
                message: err.response ? err.response.data.title : 'Failed to add ticket'
            });
        }
    };

    handleEditData = (data) => {
        console.log(data);
        const objectIdString = this.createObjectId(data[0].id);
        this.setState({
            ticketId: objectIdString,
            ticketNumber: data[0].ticketNumber,
            description: data[0].description,
            status: data[0].status,
            createdDate: data[0].createdDate?.substring(0, 10),
            edit: true,
            openPopUp: true
        });
    };

    handleEdit = async () => {
        const { ticketId, ticketNumber, description, status } = this.state;
        
        const newTicket = {
            ticketId,
            ticketNumber,
            description,
            status
        };
        console.log(newTicket);
        try {
            const response = await TicketService.updateRequest(ticketId, newTicket);
            console.log(response);
            if (response.status === 204) {
                this.fetchTickets();
                this.setState({
                    openPopUp: false,
                    severity: 'success',
                    message: 'Ticket updated successfully',
                    openNotif: true,
                    description: '',
                    status: ''
                });
            }
        } catch (err) {
            this.setState({
                openNotif: true,
                severity: 'error',
                message: err.response ? err.response.data.title : 'Failed to update ticket'
            });
        }
    };

    handlePreviewData = (data) => {
        this.setState({
            ticketId: data[0].id,
            ticketNumber: data[0].ticketNumber,
            description: data[0].description,
            status: data[0].status,
            createdDate: data[0].createdDate?.substring(0, 10),
            edit: false,
            openPopUp: true
        });
    };

    createObjectId = (id) => {
        const timestampHex = Math.floor(id.timestamp).toString(16).padStart(8, '0');
        const machineHex = (id.machine & 0xFFFFFF).toString(16).padStart(6, '0');
        const pidHex = (id.pid & 0xFFFF).toString(16).padStart(4, '0');
        const incrementHex = (id.increment & 0xFFFFFF).toString(16).padStart(6, '0');

        return `${timestampHex}${machineHex}${pidHex}${incrementHex}`;
    }

    handleDeleteData = (data) => {
        const objectIdString = this.createObjectId(data[0].id);
        this.setState({
            ticketId: objectIdString,
            openWarning: true
        });
    };

    handleDelete = async () => {
        const { ticketId } = this.state;
        try {
            const response = await TicketService.deleteRequest(ticketId);
            if (response.status === 204) {
                this.fetchTickets();
                this.setState({
                    openWarning: false,
                    severity: 'success',
                    message: 'Ticket had been deleted successfully',
                    openNotif: true
                });
            }
        } catch (err) {
            this.setState({
                openNotif: true,
                severity: 'error',
                message: err.response ? err.response.data.title : 'Failed to delete ticket'
            });
        }
    };

    handleClose = () => {
        this.setState({ openPopUp: false, openWarning: false, openAdd: false });
    };

    handleChange = (ev) => {
        this.setState({ [ev.target.name]: ev.target.value });
    };

    handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') return;
        this.setState({ openNotif: false });
    };

    render() {
        const { classes } = this.props;
        const states = [
            {
                name: 'Open',
                value: true,
            },
            {
                name: 'Close',
                value: false,
            }];
        const { message, tickets, columns, openPopUp, openAdd, openWarning, edit, openNotif, severity, ticketNumber, status, description } = this.state;
        // TODO Generalize this on all the pages
        const title = brand.name;
        const desc = brand.desc;
        return (
            <div>
                <Helmet>
                    <title>{title}</title>
                    <meta name="description" content={desc}/>
                    <meta property="og:title" content={title}/>
                    <meta property="og:description" content={desc}/>
                </Helmet>
                <Grid
                    container
                    spacing={4}
                    alignItems="center"
                    justify="center"
                >
                    <Grid item xs={12} className={classes.gridSizing}>
                        <Box
                            color="white"
                            textAlign="center"
                            fontWeight="fontWeightBold"
                            fontSize={42}
                            letterSpacing={2}
                            sx={{
                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                                fontFamily: '"Poppins", sans-serif',
                                padding: '20px',
                                borderRadius: '10px',
                                background: 'linear-gradient(45deg, rgba(255, 0, 150, 0.7), rgba(0, 204, 255, 0.7))',
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
                                transition: 'transform 0.3s',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                },
                            }}
                        >
                            HaHn Fullstack Developer .NET Test
                        </Box>
                    </Grid>
                </Grid>
                <br/><br/>
                <br/><br/>
                <br/><br/>
                <Grid
                    container
                    alignItems="center"
                    justify="center"
                >
                    <Grid item xs={12} className={classes.gridSizing2}>
                        <GeneralTable
                            title='Ticket Table'
                            data={tickets}
                            columns={columns}
                            handleAddData={this.handleAddData}
                            handleEditData={this.handleEditData}
                            handlePreviewData={this.handlePreviewData}
                            handleDeleteData={this.handleDeleteData}
                            addButtonVisibility={true}
                            deleteButtonVisibility={true}
                        />
                    </Grid>
                </Grid>
                <Dialog
                    open={openAdd}
                    keepMounted
                    scroll="paper"
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                    fullWidth="md"
                    maxWidth="md"
                >
                    <DialogTitle id="alert-dialog-slide-title">Add New Ticket</DialogTitle>
                    <DialogContent dividers>
                        <div>
                            <Grid
                                container
                                spacing={2}
                                alignItems="flex-start"
                                direction="row"
                                justify="center"
                            >
                                <Grid item xs={12} md={1}/>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        id="ticketNumber"
                                        label="Ticket Id"
                                        variant="outlined"
                                        name="ticketNumber"
                                        value={ticketNumber}
                                        required
                                        multiline
                                        fullWidth
                                        onChange={this.handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        id="description"
                                        label="Description"
                                        variant="outlined"
                                        name="description"
                                        value={description}
                                        required
                                        multiline
                                        fullWidth
                                        onChange={this.handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        id="status"
                                        name="status"
                                        variant="outlined"
                                        select
                                        required
                                        fullWidth
                                        label="Select Status"
                                        value={status}
                                        onChange={this.handleChange}
                                    >
                                        {states.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} md={1}/>
                            </Grid>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button color="secondary" onClick={this.handleClose}>
                            Cancel
                        </Button>
                        <Button
                                variant="contained"
                                color="primary"
                                onClick={this.handleAdd}
                        >
                                Add Ticket
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={openPopUp}
                    keepMounted
                    scroll="paper"
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                    fullWidth="md"
                    maxWidth="md"
                >
                    <DialogTitle id="alert-dialog-slide-title">View Details</DialogTitle>
                    <DialogContent dividers>
                        <div>
                            <Grid
                                container
                                spacing={2}
                                alignItems="flex-start"
                                direction="row"
                                justify="center"
                            >
                                <Grid item xs={12} md={1}/>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        id="ticketNumber"
                                        label="Ticket Id"
                                        variant="outlined"
                                        name="ticketNumber"
                                        value={ticketNumber}
                                        multiline
                                        required
                                        fullWidth
                                        onChange={this.handleChange}
                                        InputProps={{readOnly: !edit}}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        id="description"
                                        label="Description"
                                        variant="outlined"
                                        name="description"
                                        value={description}
                                        multiline
                                        required
                                        fullWidth
                                        onChange={this.handleChange}
                                        InputProps={{readOnly: !edit}}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        id="status"
                                        name="status"
                                        variant="outlined"
                                        select
                                        required
                                        fullWidth
                                        label="Select Status"
                                        value={status}
                                        onChange={this.handleChange}
                                        InputProps={{readOnly: !edit}}
                                        InputLabelProps={{shrink: true}}
                                    >
                                        {states.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} md={1}/>
                            </Grid>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button color="secondary" onClick={this.handleClose}>
                            Cancel
                        </Button>
                        {edit ? (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.handleEdit}
                            >
                                Update Ticket
                            </Button>
                        ) : null}
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={openWarning}
                    keepMounted
                    scroll="paper"
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                    fullWidth="xs"
                    maxWidth="xs"
                >
                    <DialogTitle id="alert-dialog-slide-title"> Confirm Deletion </DialogTitle>
                    <DialogContent dividers>
                        <Typography>
                            Are you sure you want to delete this register ?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={this.handleClose}>
                            Cancel
                        </Button>
                        <Button color="inherit" onClick={this.handleDelete}>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
                
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                    }}
                    autoHideDuration={4000}
                    open={openNotif}
                    onClose={this.handleCloseSnack}
                >
                    <MuiAlert onClose={this.handleCloseSnack} severity={severity}>
                        {message}
                    </MuiAlert>
                </Snackbar>
            </div>
        );
    }
}

BlankPage.propTypes = {
    classes: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
};

export default withStyles(styles)(BlankPage);
