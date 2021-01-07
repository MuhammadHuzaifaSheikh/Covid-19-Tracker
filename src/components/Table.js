import React from "react";
import "./Table.css";
// import numeral from "numeral";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import numeral from "numeral";

function Tables({ countries }) {
    return (
        <div  className="table">
            <TableContainer  component={Paper}>
                <Table  aria-label="simple table">
                    <TableBody>
                        {countries.map((country,index) => (
                            <TableRow key={index}>
                                <TableCell component="th" scope="row">
                                    {country.country}
                                </TableCell>
                                <TableCell align="right">{numeral(country.cases).format("0,0")}</TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default Tables;
