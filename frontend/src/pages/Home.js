import React, { useEffect } from 'react';
import './Home.css';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/esm/Button';
// eslint-disable-next-line
import Spinner from 'react-bootstrap/esm/Spinner';
import { useNavigate, useLocation } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import { useState } from "react";
// eslint-disable-next-line
import { BarChart, Bar, XAxis, YAxis, Tooltip, LabelList, ResponsiveContainer } from 'recharts';
import { LineChart, Line, Legend } from 'recharts';

const backendURL = process.env.REACT_APP_API_URL;

function Home() {
    const navigate = useNavigate();
    const location = useLocation();
    const franchise = location.state.franchise;

    const today = new Date();

    let month = '' + (today.getMonth() + 1);
    let day = '' + today.getDate();
    const year = today.getFullYear();
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    const [toDate, setToDate] = useState([year, month, day].join('-'));
    let [fromDate, setFromDate] = useState([year-1, month, day].join('-'));
    let [ytdRevenue, setYTDRevenue] = useState([]);
    let [countriesA, setCountriesA] = useState([]);
    let countriesArr = [];
    // Insert top10Countries variable for Lab 6 Section 6.3 (6.3.1)
    // Insert top10Trucks and trucks variables for Lab 6 Section 6.3 (6.3.5)

    const lineColors = ["#8884d8", "#f0d490", "#9e2866", "#1140e8", "#97d29e", "#4f011e", "#295fb1", "#48cb71", "#6ce146", "#ebb118", "#b015ea", "#e4604e", "#86368d", "#7ea178", "#718992", "#dd2cbd", "#8349c2", "#8a2574"];

    function logout() {
        navigate("/login");
    }

    // Add your code here for Lab 6, section 6.3 (6.3.2)
    function fetchTop10Countries() {
        
    }

    // Add your code here for Lab 6, section 6.3 (6.3.6)
    function fetchTop10Trucks() {
        
    }

    function fetchYTDRevenue() {
        let monthsArr = [];
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + location.state.accessToken },
        };
        fetch(backendURL+'/franchise/'+franchise+'/revenue/'+fromDate.substring(0,4), requestOptions)
            .then((result) => result.json())
                .then((data1) => {
                    for (let i=0; i<data1.length; i++) {
                        if (!countriesArr.includes(data1[i].COUNTRY.replace(" ", "_"))) {
                            countriesArr.push(data1[i].COUNTRY.replace(" ", "_"));
                        }
                        if (!monthsArr.includes(data1[i].DATE)) {
                            monthsArr.push(parseInt(data1[i].DATE));
                        }
                    }
                    let tr = [];
                    monthsArr.sort(function(a, b){return a-b});
                    for (let m=0; m<monthsArr.length; m++) {
                        let a = {};
                        a["Month"] = monthsArr[m];

                        for (let i=0; i<data1.length; i++) {
                            if (monthsArr[m] === data1[i].DATE) {
                                a[data1[i].COUNTRY.replace(" ", "_")] = data1[i].REVENUE;
                            }
                        } 
                        tr.push(a);                     
                    }
                    setYTDRevenue(tr);
                    setCountriesA([]);
                    let countriesAA = [];
                    for (let ii=0; ii<countriesArr.length; ii++) {
                        const cn = {name: countriesArr[ii], color: lineColors[ii]};
                        countriesAA.push(cn);
                    }
                    setCountriesA(countriesAA);
                    
        })
    }
    
    // eslint-disable-next-line
    useEffect(() => {
        if (location.state.hasOwnProperty('fromDate')) {
            setFromDate(location.state.fromDate);
        }
        if (location.state.hasOwnProperty('toDate')) {
            setToDate(location.state.toDate);
        }

        fetchYTDRevenue();
        // Add fetchTop10Countries function reference for Lab 6, section 6.3 (6.3.3)
        // Add fetchTop10Trucks function reference for Lab 6, section 6.3 (6.3.7)
        // eslint-disable-next-line react-hooks/exhaustive-deps -- Do not delete this line.
    }, [])

    function applyFilter() {
        fetchTop10Countries();
        fetchTop10Trucks();
        fetchYTDRevenue();
    }

    // Add your code here for Lab 6, section 6.3 (6.3.9)
    function gotoDetails() {
        
    }

    const tickFormater = (number) => {
        if(number > 1000000000){
            return (number/1000000000).toString() + 'B';
        } else if(number > 1000000){
            return (number/1000000).toString() + 'M';
        } else if(number > 1000){
            return (number/1000).toString() + 'K';
        } else{
            return number.toString();
        }
    }
    // eslint-disable-next-line
    const labelFormatter = (number) => {
        if(number > 1000000000){
            return '$'+(Math.round((number/1000000000) * 100)/100).toString() + 'B';
        } else if(number > 1000000){
            return '$'+(Math.round((number/1000000) * 100)/100).toString() + 'M';
        } else if(number > 1000){
            return '$'+(Math.round((number/1000) * 100)/100).toString() + 'K';
        } else{
            return number.toString();
        }
    }

    return (
        <div>
            <div className='home-header'>
                <Image src='bug-sno-R-blue.png' className='homeLogo' />
                <h1 className="homeTitle"> Tasty App</h1>

                <Button className='backBtn' onClick={gotoDetails}>  🚚 Truck Details</Button>
                <Button className='home-logoutBtn' onClick={logout}>⎋ Logout</Button>
            </div>

            <div className='home-breadcrumbs'>
                <Image src='filters-icon.png' className='home-filtersLogo' />

                <div className='home-breadcrumb-capsule'>
                    Franchise Name <b>{location.state.franchise}</b>
                </div>

                <Form>
                    <Form.Group className="mb-3 dateGroup" controlId="fromDate">
                        <Form.Label className='dateLabel'>
                            <span className='dateSpan'>Date From</span>
                            <Form.Control type='date' value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                        </Form.Label>

                        <Form.Label className='dateLabel'>
                            <span className='dateSpan'>Date To</span>
                            <Form.Control type='date' value={toDate} onChange={(e) => setToDate(e.target.value)} />
                        </Form.Label>

                        <Button onClick={applyFilter}> Apply</Button>
                    </Form.Group>
                </Form>

            </div>

            
            {/* Charts. */}
            <div className='homerow'>
                
                <div className='row1col'>
                    <div className='colHeader'>
                        Top 10 Countries
                    </div>
                    <div className='homecol'>
                        {/* Add your code here for Lab 6, section 6.3 (6.3.4) */}
                    </div>
                </div>
                <div className='row1col'>
                    <div className='colHeader'>
                        Top 10 Trucks
                    </div>
                    <div className='homecol'>
                        {/* Add your code here for Lab 6, section 6.3 (6.3.8) */}
                    </div>
                </div>
            </div>
            <div className='homerow'>
                
                <div className='row2col'>
                    <div className='colHeader'>
                        YTD Revenue By Country
                    </div>
                    <div className='homecol'>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                            width={500}
                            height={300}
                            data={ytdRevenue}
                            margin={{top: 5, right: 30, left: 20, bottom: 5,}}>
                            <XAxis dataKey="Month" />
                            <YAxis  tickFormatter={tickFormater} />
                            <Tooltip formatter={(value) => 'US$'+(new Intl.NumberFormat('en').format(value))} />
                            <Legend verticalAlign="top" align="center" />
                            {
                                countriesA.map(
                                    (c) => {
                                        return <Line type="monotone" dataKey={c.name} stroke={c.color} strokeWidth={2} activeDot={{ r: 8 }} />
                                    }
                                )
                            }
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;