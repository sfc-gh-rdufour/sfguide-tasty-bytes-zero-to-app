import './Details.css';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/Form';

import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from 'react';

// eslint-disable-next-line
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LabelList, ResponsiveContainer } from 'recharts';
// eslint-disable-next-line
import { AreaChart, Area } from 'recharts';

const backendURL = process.env.REACT_APP_API_URL;

function Details() {
    const navigate = useNavigate();
    const location = useLocation();
    const franchise = location.state.franchise;
    let [truckName, setTruckName] = useState(location.state.truck_brand_name);

    const [toDate, setToDate] = useState(location.state.toDate);
    let [fromDate, setFromDate] = useState(location.state.fromDate);
    let [truck, setTruck] = useState(location.state.truck_brand_name);
    let [itemsByDOW, setItemsByDOW] = useState([]);
    let [locationsByDOW, setLocationsByDOW] = useState([]);
    let [itemsArr, setItemsArr] = useState([]);
    let [locationsArr, setLocationsArr] = useState([]);

    // Insert topItemsByTruck variable for Lab 5 Section 6.4 (6.4.1)
    // Insert salesByDOW variable for Lab 5 Section 6.4 (6.4.5)


    const barColors = ["#8884d8", "#f0d490", "#9e2866", "#1140e8", "#97d29e", "#4f011e", "#295fb1", "#48cb71", "#6ce146", "#ebb118", "#b015ea", "#e4604e", "#86368d", "#7ea178", "#718992", "#dd2cbd", "#8349c2", "#8a2574"];
    

    function logout() {
        navigate("/login");
    }

    function back() {
        navigate("/home", {state: {franchise: franchise, fromDate: fromDate, toDate:toDate, accessToken: location.state.accessToken, refreshToken: location.state.refreshToken}});
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

    // Add your code here for Lab 5, section 6.4 (6.4.2)
    function fetchTopItemsByTruck() {
        
    }

    function createSelectItems() {
        const trucks = location.state.trucks;
        let items = []; 

        trucks.forEach((trk) => {
            items.push(<option key={trk} value={trk}>{trk}</option>);   
        });
        return items;
    }  

    // Add your code here for Lab 5, section 6.4 (6.4.6)
    function fetchSalesByDOW() {

    }

    function dayofWeek(dow) {
        if (dow === 0) {
            return "Sunday";
        } else if (dow === 1) {
            return "Monday";
        } else if (dow === 2) {
            return "Tuesday";
        } else if (dow === 3) {
            return "Wednesday";
        } else if (dow === 4) {
            return "Thursday";
        } else if (dow === 5) {
            return "Friday";
        } else if (dow === 6) {
            return "Saturday";
        }
    }

    function fetchItemsByDOW() {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + location.state.accessToken },
        };
        fetch(backendURL+'/franchise/'+franchise+'/trucks/'+truck+'/sales_topitems_dayofweek?start='+fromDate+'&end='+toDate, requestOptions)
            .then((result) => result.json())
                .then((data) => {
                    let dows = [];
                    let idowArr = [];
                    let iArr = [];
                    let imArr = [];
                    for (let i=0; i<data.length; i++) {
                        if (!dows.includes(data[i].DOW)) {
                            dows.push(data[i].DOW);
                        }
                        if (!iArr.includes(data[i].MENU_ITEM_NAME)) {
                            iArr.push(data[i].MENU_ITEM_NAME);
                        }
                    }

                    for (let i=0; i<iArr.length; i++) {
                        const im = {"name": iArr[i], "color": barColors[i]};
                        imArr.push(im);
                    }

                    for (let d=0; d<dows.length; d++) {
                        let a = {};
                        a["DOW"] = dayofWeek(dows[d]);

                        for (let i=0; i<data.length; i++) {
                            if (dows[d] === data[i].DOW) {
                                a[data[i].MENU_ITEM_NAME] = data[i].REVENUE;
                            }
                        }
                        idowArr.push(a);
                    }
                    setItemsArr(imArr);
                    setItemsByDOW(idowArr);
                    
        })
    }

    function fetchBestTruckLocations() {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + location.state.accessToken },
        };
        fetch(backendURL+'/franchise/'+franchise+'/trucks/'+truck+'/locations?start='+fromDate+'&end='+toDate, requestOptions)
            .then((result) => result.json())
                .then((data) => {
                    let dows = [];
                    let ldowArr = [];
                    let lArr = [];
                    let locArr = [];
                    for (let i=0; i<data.length; i++) {
                        if (!dows.includes(data[i].DOW)) {
                            dows.push(data[i].DOW);
                        }
                        if (!lArr.includes(data[i].PRIMARY_CITY)) {
                            lArr.push(data[i].PRIMARY_CITY);
                        }
                    }

                    for (let i=0; i<10; i++) {
                        const loc = {"name": lArr[i], "color": barColors[i]};
                        locArr.push(loc);
                    }

                    for (let d=0; d<dows.length; d++) {
                        let a = {};
                        a["DOW"] = dayofWeek(dows[d]);

                        for (let i=0; i<data.length; i++) {
                            if (dows[d] === data[i].DOW) {
                                a[data[i].PRIMARY_CITY] = data[i].REVENUE;
                            }
                        }
                        ldowArr.push(a);
                    }
                    setLocationsArr(locArr);
                    setLocationsByDOW(ldowArr);
        })
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

    function applyFilter() {
        setTruckName(truck);
        fetchTopItemsByTruck();
        fetchSalesByDOW();
        fetchItemsByDOW();
        fetchBestTruckLocations();
    }

    // eslint-disable-next-line
    useEffect(() => {
        // Add fetchTopItemsByTruck function reference for Lab 5, section 6.4 (6.4.3)
        // Add fetchSalesByDOW function reference for Lab 5, section 6.4 (6.4.7)
        fetchItemsByDOW();
        fetchBestTruckLocations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <div className='details-header'>
                <Image src='bug-sno-R-blue.png' className='detailsLogo' />
                <h1 className="detailsTitle"> Tasty App</h1>

                <Button className='backBtn' onClick={back}> ◀︎ Back to Overview</Button>
                <Button onClick={logout}>⎋ Logout</Button>
            </div>

            <div className='details-breadcrumbs'>
                <Image src='filters-icon.png' className='details-filtersLogo' />
                
                <div className='details-breadcrumb-capsule'>
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

                        <Form.Label className='dateLabel'>
                            <span className='dateSpan'>Truck Brand</span>
                            <Form.Select aria-label="Default select example" value={truck} onChange={(e) => setTruck(e.target.value)}>
                                {createSelectItems()}
                            </Form.Select>
                        </Form.Label>

                        <Button onClick={applyFilter}> Apply</Button>
                    </Form.Group>
                </Form>

            </div>

            {/* Charts. */}
            <div className='detailsrow'>
                
                <div className='details-row1col'>
                    <div className='details-colHeader'>
                        Best Items by <b><i>{truckName}</i></b>
                    </div>
                    <div className='detailscol'>
                        {/* Add your code here for Lab 5, section 6.4 (6.4.4) */}
                    </div>
                </div>
                <div className='row1col'>
                    <div className='colHeader'>
                        <b><i>{truckName}</i></b> Sales by Day of Week
                    </div>
                    <div className='homecol'>
                        {/* Add your code here for Lab 5, section 6.4 (6.4.8) */}
                    </div>
                </div>
            </div>

            <div className='detailsrow'>
                <div className='details-row1col'>
                    <div className='colHeader'>
                    <b><i>{truckName}</i></b> Best Selling Items by Day of Week
                    </div>
                    <div className='homecol'>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                            width={500}
                            height={300}
                            data={itemsByDOW}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                            >
                            {/* <CartesianGrid strokeDasharray="3 3" /> */}
                            <XAxis dataKey="DOW" />
                            <YAxis tickFormatter={tickFormater} />
                            <Tooltip formatter={(value) => 'US$'+(new Intl.NumberFormat('en').format(value))} />
                            <Legend verticalAlign="top" align="center" />
                            {
                                itemsArr.map(
                                    (i) => {
                                        return <Bar dataKey={i.name} stackId="a" fill={i.color} />
                                    }
                                )
                            }
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className='details-row1col'>
                    <div className='colHeader'>
                    <b><i>{truckName}</i></b> Best Cities by Day of Week
                    </div>
                    <div className='homecol'>
                    <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                            width={500}
                            height={300}
                            data={locationsByDOW}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                            >
                            <XAxis dataKey="DOW" />
                            <YAxis tickFormatter={tickFormater} />
                            <Tooltip formatter={(value) => 'US$'+(new Intl.NumberFormat('en').format(value))} />
                            <Legend verticalAlign="top" align="center" />
                            {
                                locationsArr.map(
                                    (l) => {
                                        return <Bar dataKey={l.name} stackId="a" fill={l.color} />
                                    }
                                )
                            }
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            
        </div>
    );
}

export default Details;