// import { useLocation } from 'react-router-dom';
import React, { useEffect, PureComponent } from 'react';
import './Home.css';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import { useState } from "react";
import axios from "axios";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

class Test extends React.Component {
    
    // constructor(props) {
    //     super(props);

    //     // this.location = useLocation();
    //     this.navigate = useNavigate();

    //     this.today = new Date();

    //     this.month = '' + (this.today.getMonth() + 1);
    //     this.day = '' + this.today.getDate();
    //     this.year = this.today.getFullYear();
    //     if (this.month.length < 2) 
    //         this.month = '0' + this.month;
    //     if (this.day.length < 2) 
    //         this.day = '0' + this.day;

    //     [this.toDate, this.setToDate] = useState([this.year, this.month, this.day].join('-'));
    //     [this.fromDate, this.setFromDate] = useState([this.year-1, this.month, this.day].join('-'));
    //     [this.data, this.setData] = useState([]);
    // }

    // componentDidMount() {
    //     // Update the document title using the browser API
    //     // chartData()
    //     // .then(
    //     //     (result) => { 
    //     //         console.log("Top 10 countries");
    //     //         console.log(result);
    //     //         setData(result);

    //     //     },
    //     //     (error) => { 
    //     //        console.log(error);
    //     //     }
    //     // );
    // }

    // logout() {
    //     navigate("/login");
    // }

    // chartData() {
    //     const p = new Promise(function(resolve, reject) {
    //         axios({
    //             // Endpoint to send files
    //             url: "http://localhost:3000/franchise/FRANCHISE_1/countries/",
    //             method: "GET",
    //             params: {start: "2022-03-28", end: "2023-03-28"}
    //         })
            
    //         // Handle the response from backend here
    //         .then((res) => {
    //             resolve(res.data);
    //         })
            
    //         // Catch errors if any
    //         .catch((err) => { reject(err); });
    //     });
        
    //     return p;
    // }

    // applyFilter() {
    //     console.log("To Date: "+this.toDate);
    //     console.log(typeof toDate);
    //     this.chartData();
    // }

    // render() {
    //     return (
    //         <div>
    //         <div className='home-header'>
    //             <Image src='bug-sno-R-blue.png' className='homeLogo' />
    //             <h1 className="homeTitle"> Tasty App</h1>

    //             <Button className='logoutBtn' onClick={this.logout}>Logout</Button>
    //         </div>

    //         <Form>
    //             <Form.Group className="mb-3 dateGroup" controlId="fromDate">
    //                 <Form.Label className='dateLabel'>
    //                     <span className='dateSpan'>Date From</span>
    //                     <Form.Control type='date' value={this.fromDate} onChange={(e) => this.setFromDate(e.target.value)} />
    //                 </Form.Label>

    //                 <Form.Label className='dateLabel'>
    //                     <span className='dateSpan'>Date To</span>
    //                     <Form.Control type='date' value={this.toDate} onChange={(e) => this.setToDate(e.target.value)} />
    //                 </Form.Label>
    //                 <Button onClick={this.applyFilter}> Apply</Button>
    //             </Form.Group>
    //         </Form>
    //         {/* Charts. */}
    //         <div>
    //             <BarChart width={150} height={40} data={this.data}>
    //                 <Bar dataKey="REVENUE" fill="#8884d8" />
    //             </BarChart>
    //             {/* <BarChart
    //                 width={500}
    //                 height={300}
    //                 data={data}
    //                 margin={{
    //                     top: 5,
    //                     right: 30,
    //                     left: 20,
    //                     bottom: 5,
    //                 }}
    //                 >
    //                 <CartesianGrid strokeDasharray="3 3" />
    //                 <XAxis />
    //                 <YAxis dataKey="COUNTRY" />
    //                 <Tooltip />
    //                 <Legend />
    //                 <Bar dataKey="COUNTRY" fill="#8884d8" />
    //                 { <Bar dataKey="uv" fill="#82ca9d" /> }
    //                 </BarChart> */}
    //         </div>
    //     </div>
    //     );
    // }
}

export default Test;