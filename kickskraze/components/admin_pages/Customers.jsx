import React from 'react'
import { DataGrid, gridClasses } from '@mui/x-data-grid';



const Customers = () => {

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'age', headerName: 'Age', width: 110 },
        { field: 'email', headerName: 'Email', width: 200 },
    ];

    const rows = [
        { id: 1, name: 'John Doe', age: 25, email: 'john.doe@example.com' },
        { id: 2, name: 'Jane Smith', age: 30, email: 'jane.smith@example.com' },
        { id: 3, name: 'Alice Johnson', age: 35, email: 'alice.johnson@example.com' },
    ];


    return (
        <div className='w-full h-full' >
            <DataGrid
                sx={{
                    [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: {
                        outline: 'none',
                    },
                    [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]:
                    {
                        outline: 'none',
                    },
                }}
                columns={columns}
                rows={rows}
                pageSize={5}
                checkboxSelection


            />
        </div>
    )
}

export default Customers