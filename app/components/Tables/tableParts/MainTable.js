import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import AddIcon from '@material-ui/icons/Add';
import css from 'dan-styles/Table.scss';
import withWidth, {isWidthUp} from '@material-ui/core/withWidth';
import Row from './Row';
import styles from '../tableStyle-jss';

function MainTable(props) {
    const {
        classes,
        items,
        addEmptyRow,
        removeRow,
        updateRow,
        editRow,
        finishEditRow,
        anchor,
        branch,
        title,
        width
    } = props;
    useEffect(() => {
        console.log(items);
    }, [items])
    const getItems = dataArray => dataArray.map(item => (
        <Row
            anchor={anchor}
            updateRow={(event) => updateRow(event, item, branch)}
            item={item}
            removeRow={() => removeRow(item, branch)}
            key={item.get('id')}
            editRow={() => editRow(item, branch)}
            finishEditRow={() => finishEditRow(item, branch)}
            branch={branch}
        />
    ));

    const getHead = dataArray => dataArray.map((item, index) => {
        if (!item.hidden) {
            return (
                <TableCell padding="none" key={index.toString()} width={item.width}>{item.label}</TableCell>
            );
        }
        return false;
    });
    return (
        <div>
            <Toolbar className={classes.toolbar}>
                <div className={classes.title}>
                    <Typography variant="h6">{title}</Typography>
                </div>
                <div className={classes.spacer}/>
                <div className={classes.actions}>
                    <Tooltip title="Add Item">
                        <Button variant="contained" onClick={() => addEmptyRow(anchor, branch)} color="secondary"
                                className={classes.button}>
                            <AddIcon
                                className={classNames(isWidthUp('sm', width) && classes.leftIcon, classes.iconSmall)}/>
                            {isWidthUp('sm', width) && 'Add New'}
                        </Button>
                    </Tooltip>
                </div>
            </Toolbar>
            <div className={classes.rootTable}>
                <Table className={classNames(css.tableCrud, classes.table, classes.stripped)}>
                    <TableHead>
                        <TableRow>
                            {getHead(anchor)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {getItems(items)}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

MainTable.propTypes = {
    title: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    items: PropTypes.object.isRequired,
    anchor: PropTypes.array.isRequired,
    addEmptyRow: PropTypes.func.isRequired,
    removeRow: PropTypes.func.isRequired,
    updateRow: PropTypes.func.isRequired,
    editRow: PropTypes.func.isRequired,
    finishEditRow: PropTypes.func.isRequired,
    branch: PropTypes.string.isRequired,
    width: PropTypes.string.isRequired
};

export default withWidth()(withStyles(styles)(MainTable));
