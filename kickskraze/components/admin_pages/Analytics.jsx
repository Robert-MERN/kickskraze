import React, { useEffect, useState, useRef } from 'react'
import useStateContext from '@/context/ContextProvider';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { LineChart, lineElementClasses } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import millify from 'millify';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { CircularProgress, MenuItem, Select, FormControl, OutlinedInput } from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CountUp from 'react-countup';

const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip slotProps={{
        popper: {
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: [0, -14],
                    },
                },
            ],
        },
    }}
        {...props}
        arrow
        classes={{ popper: className }}
    />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
        fontSize: "16px",
        backgroundColor: theme.palette.common.black,
    },
}));

const Analytics = ({ axios }) => {

    const { get_orders_analytics_api } = useStateContext();

    const [analytics, set_analytics] = useState(null);
    const [is_loading, set_is_loading] = useState(false);
    const [revenue_time_period, set_revenue_time_period] = useState("daily");
    const [net_revenue_time_period, set_net_revenue_time_period] = useState("daily");
    const [sales_time_period, set_sales_time_period] = useState("daily");
    const [orders_time_period, set_orders_time_period] = useState("daily");
    const [store_name, set_store_name] = useState("Total");
    const [stats_time_period, set_stats_time_period] = useState("currentYear");
    const [order_status_time_period, set_order_status_time_period] = useState("currentYear");
    const [order_by_cities_time_period, set_order_by_cities_time_period] = useState("currentYear");
    const [inventory_time_period, set_inventory_time_period] = useState("currentYear");


    const hasFetched = useRef(false);


    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        get_orders_analytics_api(axios, set_analytics, set_is_loading);
    }, []);




    const getArcLabel = (param, data) => {
        const TOTAL_ORDERS = data.reduce((sum, item) => sum + item.value, 0);
        if (TOTAL_ORDERS === 0) return "0%";
        const percent = param.value / TOTAL_ORDERS;
        return `${(percent * 100).toFixed(0)}%`;
    };

    return (
        <div className='w-full h-full' >
            {is_loading ?
                <div className='w-full flex flex-col justify-center items-center h-[65vh]'>
                    <CircularProgress variant={"indeterminate"} color="inherit" size={30} className='text-gray-400' />
                    <p className='text-[18px] text-gray-500 font-semibold mt-6' >Loading Analytics...</p>
                </div>

                : analytics ?
                    <div className='w-full'>

                        <div className="w-full justify-start items-center flex gap-1 mb-12">
                            <FormControl className='w-full md:w-[280px] xl:w-[320px]' variant="outlined">
                                <Select
                                    value={store_name}
                                    onChange={(e) => set_store_name(e.target.value)}
                                    size='small'
                                    input={
                                        <OutlinedInput
                                            startAdornment={<StoreIcon style={{ marginRight: 8 }} />} // Icon at start
                                        />
                                    }
                                >
                                    <MenuItem value={"Total"}>All Stores</MenuItem>
                                    <MenuItem value={"Barefoot"}>Barefoot Store</MenuItem>
                                    <MenuItem value={"Kickskraze"}>Kickskraze Store</MenuItem>
                                </Select>
                            </FormControl>
                        </div>



                        {/* Dashboard Statistics */}
                        <div className='w-full'>
                            <div className='w-full flex justify-between items-center mb-8' >
                                <h1 className='text-[20px] md:text-[30px] xl:text-[32px] font-bold text-gray-600'>Statistics</h1>
                                <FormControl className='w-[140px] md:w-[160px]' variant="outlined">
                                    <Select
                                        value={stats_time_period}
                                        onChange={(e) => set_stats_time_period(e.target.value)}
                                        size='small'
                                        input={
                                            <OutlinedInput
                                                startAdornment={<CalendarMonthIcon style={{ marginRight: 8 }} />} // Icon at start
                                            />
                                        }
                                    >
                                        <MenuItem value="currentYear">This Year</MenuItem>
                                        <MenuItem value="allYears">All Years</MenuItem>
                                        <MenuItem value="currentYearDelivered">This Year Delivered</MenuItem>
                                        <MenuItem value="allYearsDelivered">All Years Delivered</MenuItem>
                                        <MenuItem value="currentYearUndelivered">This Year Undelivered</MenuItem>
                                        <MenuItem value="allYearsUndelivered">All Years Undelivered</MenuItem>

                                    </Select>
                                </FormControl>
                            </div>

                            {/* Sats Cards */}
                            <div className='w-full grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-x-8 gap-y-5 justify-between transition-all' >

                                <div className="min-h-[100px] w-full rounded-2xl bg-white bg-gradient-to-r from-[rgba(200,250,214,0.48)] to-[rgba(91,228,155,0.48)] text-[#004B50] relative z-0 overflow-hidden p-[24px]">
                                    <span className="flex-shrink-0 [mask-image:url('/images/shape-square.svg')] [mask-size:contain] [mask-position:center] [mask-repeat:no-repeat] absolute top-0 left-[-20px] bg-[rgb(0,167,111)] w-[240px] h-[240px] z-[-1] inline-flex text-[#00a76f] opacity-[0.24]"></span>
                                    <div>
                                        <img src="/images/ic-glass-revenue.svg" className='w-[48px] h-[48px]' alt="" />

                                        <p className='mt-6 font-medium'>Total Revenue</p>
                                        <BootstrapTooltip placement='bottom' arrow title={analytics[store_name].revenueReport[stats_time_period].toLocaleString("en-US")} >
                                            <p className='text-[19px] md:text-[28px] font-bold mt-2 w-fit cursor-default'>
                                                <CountUp
                                                    start={0}
                                                    end={analytics[store_name].revenueReport[stats_time_period]}
                                                    duration={2}
                                                    formattingFn={(value) => millify(value, { precision: 2 })}
                                                />
                                            </p>
                                        </BootstrapTooltip>
                                    </div>

                                </div>


                                <div className="min-h-[100px] w-full rounded-2xl bg-white bg-gradient-to-r from-[rgba(239,214,255,0.48)] to-[rgba(198,132,255,0.48)] text-[#27097A] relative z-0 overflow-hidden p-[24px]">
                                    <span className="flex-shrink-0 [mask-image:url('/images/shape-square.svg')] [mask-size:contain] [mask-position:center] [mask-repeat:no-repeat] absolute top-0 left-[-20px] bg-[#8E33FF] w-[240px] h-[240px] z-[-1] inline-flex text-[#8E33FF] opacity-[0.24]"></span>
                                    <div>
                                        <img src="/images/ic-glass-profit.svg" className='w-[48px] h-[48px]' alt="" />

                                        <p className='mt-6 font-medium'>Total Net Profit</p>
                                        <BootstrapTooltip placement='bottom' arrow title={analytics[store_name].netRevenueReport[stats_time_period].toLocaleString("en-US")} >
                                            <p className='text-[19px] md:text-[28px] font-bold mt-2 w-fit cursor-default'>
                                                <CountUp
                                                    start={0}
                                                    end={analytics[store_name].netRevenueReport[stats_time_period]}
                                                    duration={2}
                                                    formattingFn={(value) => millify(value, { precision: 2 })}
                                                />
                                            </p>
                                        </BootstrapTooltip>
                                    </div>

                                </div>


                                <div className="h-[200px] w-full rounded-2xl bg-white bg-gradient-to-r from-[rgba(255,245,204,0.48)] to-[rgba(255,214,102,0.48)] text-[#7A4100] relative z-0 overflow-hidden p-[24px]">
                                    <span className="flex-shrink-0 [mask-image:url('/images/shape-square.svg')] [mask-size:contain] [mask-position:center] [mask-repeat:no-repeat] absolute top-0 left-[-20px] bg-[rgb(255,171,0)] w-[240px] h-[240px] z-[-1] inline-flex text-[#FFAB00] opacity-[0.24]"></span>
                                    <img src="/images/ic-glass-sales.svg" className='w-[48px] h-[48px]' alt="" />

                                    <p className='mt-6 font-medium'>Total Sales</p>
                                    <BootstrapTooltip placement='bottom' arrow title={analytics[store_name].salesReport[stats_time_period].toLocaleString("en-US")} >
                                        <p className='text-[19px] md:text-[28px] font-bold mt-2 w-fit cursor-default'>
                                            <CountUp
                                                start={0}
                                                end={analytics[store_name].salesReport[stats_time_period]}
                                                duration={2}
                                                formattingFn={(value) => millify(value, { precision: 2 })}
                                            />
                                        </p>
                                    </BootstrapTooltip>
                                </div>

                                <div className="h-[200px] w-full rounded-2xl bg-white bg-gradient-to-br from-[rgba(255,233,213,0.48)] to-[rgba(255,172,130,0.48)] text-[#7A0916] relative z-0 overflow-hidden p-[24px]">
                                    <span className="flex-shrink-0 [mask-image:url('/images/shape-square.svg')] [mask-size:contain] [mask-position:center] [mask-repeat:no-repeat] absolute top-0 left-[-20px] bg-[#FF5630] w-[240px] h-[240px] z-[-1] inline-flex text-[#FF5630] opacity-[0.24]"></span>
                                    <img src="/images/ic-glass-orders.svg" className='w-[48px] h-[48px]' alt="" />

                                    <p className='mt-6 font-medium'>Total Orders</p>
                                    <BootstrapTooltip placement='bottom' arrow title={analytics[store_name].ordersReport[stats_time_period].toLocaleString("en-US")} >
                                        <p className='text-[19px] md:text-[28px] font-bold mt-2 w-fit cursor-default'>
                                            <CountUp
                                                start={0}
                                                end={analytics[store_name].ordersReport[stats_time_period]}
                                                duration={2}
                                                formattingFn={(value) => millify(value, { precision: 2 })}
                                            />
                                        </p>
                                    </BootstrapTooltip>
                                </div>

                            </div>
                        </div>

                        <div className='w-full flex justify-center flex-col items-center gap-12 mt-24'>


                            {/* Order Status Pie Chart */}
                            <div className='w-full'>
                                <div className='w-full flex justify-between items-center mb-8' >
                                    <h1 className='text-[20px] md:text-[30px] xl:text-[32px] font-bold text-gray-600'>Order Status</h1>
                                    <FormControl className='w-[140px] md:w-[160px]' variant="outlined">
                                        <Select
                                            value={order_status_time_period}
                                            onChange={(e) => set_order_status_time_period(e.target.value)}
                                            size='small'
                                            input={
                                                <OutlinedInput
                                                    startAdornment={<CalendarMonthIcon style={{ marginRight: 8 }} />} // Icon at start
                                                />
                                            }
                                        >
                                            <MenuItem value="currentMonth">This Month</MenuItem>
                                            <MenuItem value="currentYear">This Year</MenuItem>
                                            <MenuItem value="allYears">All Years</MenuItem>

                                        </Select>
                                    </FormControl>
                                </div>

                                <div className='w-full flex justify-center' >
                                    <div className='w-full lg:w-fit'>
                                        <PieChart
                                            series={[{
                                                data: analytics[store_name].orderStatus[order_status_time_period],
                                                arcLabel: (param) => getArcLabel(param, analytics[store_name].orderStatus[order_status_time_period]),
                                            }]}
                                            className='w-full md:w-[600px] h-[180px] md:h-[400px]'
                                            sx={{
                                                [`& .${pieArcLabelClasses.root}`]: {
                                                    fill: 'white',
                                                    fontSize: 14,
                                                },
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>



                            {/* Gross Revenue Bar Chart */}
                            <div className="w-full mt-16 lg:mt-24">

                                <div className='w-full flex justify-between items-center mb-8' >
                                    <h1 className='text-[20px] md:text-[30px] xl:text-[32px] font-bold text-gray-600'>
                                        Gross Revenue Report
                                    </h1>
                                    <FormControl className='w-[140px] sm:w-[170px]' variant="outlined">
                                        <Select
                                            value={revenue_time_period}
                                            onChange={(e) => set_revenue_time_period(e.target.value)}
                                            size='small'
                                            input={
                                                <OutlinedInput
                                                    startAdornment={<CalendarViewMonthIcon style={{ marginRight: 8 }} />} // Icon at start
                                                />
                                            }
                                        >
                                            {["daily", "monthly", "yearly"].map((period) => (
                                                <MenuItem key={period} value={period}>
                                                    {period.charAt(0).toUpperCase() + period.slice(1)} Report
                                                </MenuItem>
                                            ))}

                                        </Select>
                                    </FormControl>
                                </div>
                                <BarChart
                                    xAxis={[{ data: analytics[store_name].revenueData[revenue_time_period].map(d => d.x), scaleType: 'band' }]}
                                    series={[{ data: analytics[store_name].revenueData[revenue_time_period].map(d => d.y), label: 'Gross Revenue', color: "rgb(245, 158, 11)" }]}
                                    className='w-full h-[350px] lg:h-[500px]'
                                />
                            </div>
                            
                            
                            
                             {/* Net Revenue Bar Chart */}
                            <div className="w-full mt-16 lg:mt-24">

                                <div className='w-full flex justify-between items-center mb-8' >
                                    <h1 className='text-[20px] md:text-[30px] xl:text-[32px] font-bold text-gray-600'>
                                        Net Revenue Report
                                    </h1>
                                    <FormControl className='w-[140px] sm:w-[170px]' variant="outlined">
                                        <Select
                                            value={net_revenue_time_period}
                                            onChange={(e) => set_net_revenue_time_period(e.target.value)}
                                            size='small'
                                            input={
                                                <OutlinedInput
                                                    startAdornment={<CalendarViewMonthIcon style={{ marginRight: 8 }} />} // Icon at start
                                                />
                                            }
                                        >
                                            {["daily", "monthly", "yearly"].map((period) => (
                                                <MenuItem key={period} value={period}>
                                                    {period.charAt(0).toUpperCase() + period.slice(1)} Report
                                                </MenuItem>
                                            ))}

                                        </Select>
                                    </FormControl>
                                </div>
                                <BarChart
                                    xAxis={[{ data: analytics[store_name].netRevenueData[net_revenue_time_period].map(d => d.x), scaleType: 'band' }]}
                                    series={[{ data: analytics[store_name].netRevenueData[net_revenue_time_period].map(d => d.y), label: 'Net Revenue', color: "rgb(20,184,166)" }]}
                                    className='w-full h-[350px] lg:h-[500px]'
                                />
                            </div>


                            {/* Orders Bar Chart */}
                            <div className="w-full mt-16 lg:mt-24">

                                <div className='w-full flex justify-between items-center mb-8' >
                                    <h1 className='text-[20px] md:text-[30px] xl:text-[32px] font-bold text-gray-600'>
                                        Orders Report
                                    </h1>
                                    <FormControl className='w-[140px] sm:w-[170px]' variant="outlined">
                                        <Select
                                            value={orders_time_period}
                                            onChange={(e) => set_orders_time_period(e.target.value)}
                                            size='small'
                                            input={
                                                <OutlinedInput
                                                    startAdornment={<CalendarViewMonthIcon style={{ marginRight: 8 }} />} // Icon at start
                                                />
                                            }
                                        >
                                            {["daily", "monthly", "yearly"].map((period) => (
                                                <MenuItem key={period} value={period}>
                                                    {period.charAt(0).toUpperCase() + period.slice(1)} Report
                                                </MenuItem>
                                            ))}

                                        </Select>
                                    </FormControl>
                                </div>
                                <BarChart
                                    xAxis={[{ data: analytics[store_name].ordersData[orders_time_period].map(d => d.x), scaleType: 'band' }]}
                                    series={[{ data: analytics[store_name].ordersData[orders_time_period].map(d => d.y), label: 'Orders', color: "rgb(79, 70, 229)" }]}
                                    className='w-full h-[350px] lg:h-[500px]'
                                />
                            </div>



                            {/* Sales Bar Chart */}
                            <div className="w-full mt-16 lg:mt-24">

                                <div className='w-full flex justify-between items-center mb-8' >
                                    <h1 className='text-[20px] md:text-[30px] xl:text-[32px] font-bold text-gray-600'>
                                        Sales Report
                                    </h1>
                                    <FormControl className='w-[140px] sm:w-[170px]' variant="outlined">
                                        <Select
                                            value={sales_time_period}
                                            onChange={(e) => set_sales_time_period(e.target.value)}
                                            size='small'
                                            input={
                                                <OutlinedInput
                                                    startAdornment={<CalendarViewMonthIcon style={{ marginRight: 8 }} />} // Icon at start
                                                />
                                            }
                                        >
                                            {["daily", "monthly", "yearly"].map((period) => (
                                                <MenuItem key={period} value={period}>
                                                    {period.charAt(0).toUpperCase() + period.slice(1)} Report
                                                </MenuItem>
                                            ))}

                                        </Select>
                                    </FormControl>
                                </div>

                                <BarChart
                                    xAxis={[{ data: analytics[store_name].salesData[sales_time_period].map(d => d.x), scaleType: 'band' }]}
                                    series={[{ data: analytics[store_name].salesData[sales_time_period].map(d => d.y), label: 'Sales', color: "rgb(139,92,246)" }]}
                                    className='w-full h-[350px] lg:h-[500px]'
                                />
                            </div>



                            {/* Orders By Cities Bar Chart */}
                            <div className="w-full mt-16 lg:mt-24">
                                <div className='w-full flex justify-between items-center mb-8' >
                                    <h1 className='text-[20px] md:text-[30px] xl:text-[32px] font-bold text-gray-600'>
                                        Orders By City Report
                                    </h1>
                                    <FormControl className='w-[140px] sm:w-[170px]' variant="outlined">
                                        <Select
                                            value={order_by_cities_time_period}
                                            onChange={(e) => set_order_by_cities_time_period(e.target.value)}
                                            size='small'
                                            input={
                                                <OutlinedInput
                                                    startAdornment={<CalendarViewMonthIcon style={{ marginRight: 8 }} />} // Icon at start
                                                />
                                            }
                                        >
                                            <MenuItem value="currentMonth">This Month</MenuItem>
                                            <MenuItem value="currentYear">This Year</MenuItem>
                                            <MenuItem value="allYears">All Years</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>

                                <BarChart
                                    xAxis={[{ data: analytics[store_name].ordersByCity[order_by_cities_time_period].map(d => d.x), scaleType: 'band' }]}
                                    series={[{ data: analytics[store_name].ordersByCity[order_by_cities_time_period].map(d => d.y), label: 'Orders', color: "rgb(96,165,250 )" }]}
                                    className='w-full h-[350px] lg:h-[500px]'
                                />
                            </div>
                            
                            
                          <div className='w-full mt-16 lg:mt-24' >
            
                            <div className='w-full flex justify-between items-center mb-8' >
                                <h1 className='text-[20px] md:text-[30px] xl:text-[32px] font-bold text-gray-600'>Inventory</h1>
                                <FormControl className='w-[140px] md:w-[160px]' variant="outlined">
                                    <Select
                                        value={inventory_time_period}
                                        onChange={(e) => set_inventory_time_period(e.target.value)}
                                        size='small'
                                        input={
                                            <OutlinedInput
                                                startAdornment={<CalendarMonthIcon style={{ marginRight: 8 }} />} // Icon at start
                                            />
                                        }
                                    >
                                        <MenuItem value="currentYear">This Year</MenuItem>
                                        <MenuItem value="allYears">All Years</MenuItem>
                                        
                                    </Select>
                                </FormControl>
                            </div>
                            {/* Inventory Cards */}
                            <div className='w-full grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-x-8 gap-y-5 justify-between transition-all' >
                            
                                <div className="h-[200px] w-full rounded-2xl bg-white bg-gradient-to-r from-[rgba(255,245,204,0.48)] to-[rgba(255,214,102,0.48)] text-[#7A4100] relative z-0 overflow-hidden p-[24px]">
                                    <span className="flex-shrink-0 [mask-image:url('/images/shape-square.svg')] [mask-size:contain] [mask-position:center] [mask-repeat:no-repeat] absolute top-0 left-[-20px] bg-[rgb(255,171,0)] w-[240px] h-[240px] z-[-1] inline-flex text-[#FFAB00] opacity-[0.24]"></span>
                                    <img src="/images/ic-glass-sales.svg" className='w-[48px] h-[48px]' alt="" />

                                    <p className='mt-6 font-medium'>Total Inventory</p>
                                    
                                         {/* In Stock */}
                                              <p className='mt-6 font-medium'>In Stock</p>
                                                <BootstrapTooltip placement='bottom' arrow title={analytics[store_name].inventoryReport[inventory_time_period].inStock.toLocaleString("en-US")} >
                                                    <p className='text-[19px] md:text-[28px] font-bold mt-2 w-fit cursor-default'>
                                                    <CountUp
                                                       start={0}
                                                       end={analytics[store_name].inventoryReport[inventory_time_period].inStock}
                                                       duration={2}
                                                       formattingFn={(value) => millify(value, { precision: 2 })}
                                                    />
                                                    </p>
                                               </BootstrapTooltip>
                                        
                                        {/* Out Of Stock */}
                                        <p className='mt-6 font-medium'>Out Of Stock</p>
                                                <BootstrapTooltip placement='bottom' arrow title={analytics[store_name].inventoryReport[inventory_time_period].outOfStock.toLocaleString("en-US")} >
                                                    <p className='text-[19px] md:text-[28px] font-bold mt-2 w-fit cursor-default'>
                                                    <CountUp
                                                       start={0}
                                                       end={analytics[store_name].inventoryReport[inventory_time_period].outOfStock}
                                                       duration={2}
                                                       formattingFn={(value) => millify(value, { precision: 2 })}
                                                    />
                                                    </p>
                                               </BootstrapTooltip>
                                    
                                </div>
                            
                            </div>
                            
                            </div>



                        </div>


                    </div>

                    :
                    <div className='w-full flex justify-center items-center h-[65vh] text-[21px] text-gray-500 font-semibold'>No Data</div>
            }
        </div >
    )
}

export default Analytics