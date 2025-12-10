import App_footer from '@/components/utilities/App_footer'
import Footer from '@/components/utilities/Footer'
import Navbar from '@/components/utilities/Navbar'
import Head from 'next/head'
import Link from 'next/link'

export default function Size_chart({ logoUrl, fullUrl }) {
    return (
        <>
            <Head>
                <title>Kickskraze | Size Chart</title>
                <meta property="og:title" content="Kickskraze | Size Chart" />
                <meta property="og:description" content="Size Chart Page" />
                <meta property="og:image" content={logoUrl} />
                <meta property="og:url" content={fullUrl} />
                <meta property="og:type" content="size-chart" />
                <link rel="icon" href="/images/icon.png" />
            </Head>
            <div className='w-screen flex flex-col items-center'>
                <Navbar />
                <div className='w-full 2xl:w-[1650px] xl:w-[1400px] lg:w-[1100px] px-[20px] lg:px-[120px]' >
                    {/* Size Chart content */}

                    <div className="w-full py-10 flex flex-col gap-16 text-gray-800">

                        {/* HERO */}
                        {/* TOP PLAIN TEXT HEADER */}
                        <div className="flex flex-col items-center text-center gap-2">
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                                Shoe Size Chart
                            </h1>
                            <p className="text-gray-600 max-w-xl">
                                Find your perfect size using our complete international shoe size conversions for men, women, kids, toddlers and infants.
                            </p>
                        </div>
                        {/* ✨ ALL TABLES IN 2-COLUMN GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">

                            {/* MEN'S */}
                            <div>
                                <h2 className="bg-gray-100 px-4 py-3 font-semibold text-gray-900 text-lg uppercase border tracking-wide text-center rounded-t-md shadow-sm">
                                    MEN'S SHOE SIZE CONVERSIONS
                                </h2>
                                <table className="w-full border border-gray-300 text-sm rounded-md overflow-hidden shadow-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {["Euro Size", "UK/PAK Size", "US Size"].map((h, i) => (
                                                <th key={i} className="p-3 border-b border-r last:border-r-0 font-semibold text-gray-700 text-center tracking-wide">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            ["38", "5.5", "6"],
                                            ["39", "6", "6.5"],
                                            ["40", "6.5", "7"],
                                            ["41", "7", "7.5"],
                                            ["42", "7.5", "8.5"],
                                            ["42-43", "8.5", "9.5"],
                                            ["43", "9", "10"],
                                            ["44-45", "10.5", "11.5"],
                                            ["45", "11", "12"],
                                            ["46", "12", "13"],
                                            ["47", "12.5", "14"],
                                            ["48", "13.5", "15"],
                                            ["49", "14", "16"]
                                        ].map((row, i) => (
                                            <tr key={i} className="border-b hover:bg-gray-50">
                                                {row.map((cell, j) => (
                                                    <td key={j} className="p-3 border-r last:border-r-0 text-center">{cell}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* WOMEN'S */}
                            <div>
                                <h2 className="bg-gray-100 px-4 py-3 font-semibold text-gray-900 text-lg uppercase border tracking-wide text-center rounded-t-md shadow-sm">
                                    WOMEN'S SHOE SIZE CONVERSIONS
                                </h2>
                                <table className="w-full border border-gray-300 text-sm rounded-md overflow-hidden shadow-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {["Euro Size", "UK/PAK Size", "US Size"].map((h, i) => (
                                                <th key={i} className="p-3 border-b border-r last:border-r-0 font-semibold text-gray-700 text-center tracking-wide">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            ["35", "2", "4"],
                                            ["35", "2.5", "4.5"],
                                            ["35–36", "3", "5"],
                                            ["36", "3.5", "5.5"],
                                            ["36–37", "4", "6"],
                                            ["37", "4.5", "6.5"],
                                            ["37–38", "5", "7"],
                                            ["38", "5.5", "7.5"],
                                            ["38–39", "6", "8"],
                                            ["40", "7.5", "9.5"],
                                            ["40–41", "8", "10"],
                                            ["41", "8.5", "10.5"],
                                            ["41–42", "9", "11"],
                                            ["42", "9.5", "11.5"],
                                            ["42–43", "10", "12"]
                                        ].map((row, i) => (
                                            <tr key={i} className="border-b hover:bg-gray-50">
                                                {row.map((cell, j) => (
                                                    <td key={j} className="p-3 border-r last:border-r-0 text-center">{cell}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* BIG KID */}
                            <div>
                                <h2 className="bg-gray-100 px-4 py-3 font-semibold text-gray-900 text-lg uppercase border tracking-wide text-center rounded-t-md shadow-sm">
                                    BIG KID SIZE (7–12 YEARS)
                                </h2>
                                <table className="w-full border border-gray-300 text-sm rounded-md overflow-hidden shadow-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {["Euro Size", "UK/PAK Size", "US Size"].map((h, i) => (
                                                <th key={i} className="p-3 border-b border-r last:border-r-0 font-semibold text-gray-700 text-center tracking-wide">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            ["33", "2.5", "3.5"],
                                            ["36", "3", "4"],
                                            ["36", "3.5", "4.5"],
                                            ["37", "4", "5"],
                                            ["37", "4.5", "5.5"],
                                            ["38", "5.5", "6.5"]
                                        ].map((row, i) => (
                                            <tr key={i} className="border-b hover:bg-gray-50">
                                                {row.map((cell, j) => (
                                                    <td key={j} className="p-3 border-r last:border-r-0 text-center">{cell}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* INFANT */}
                            <div>
                                <h2 className="bg-gray-100 px-4 py-3 font-semibold text-gray-900 text-lg uppercase border tracking-wide text-center rounded-t-md shadow-sm">
                                    INFANT SIZE (0–9 MONTHS)
                                </h2>
                                <table className="w-full border border-gray-300 text-sm rounded-md overflow-hidden shadow-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {["Euro Size", "UK/PAK Size", "US Size"].map((h, i) => (
                                                <th key={i} className="p-3 border-b border-r last:border-r-0 font-semibold text-gray-700 text-center tracking-wide">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            ["15", "0", "0"],
                                            ["16", "0.5", "1"],
                                            ["17", "1", "1.5"],
                                            ["17", "1", "2"],
                                            ["18", "1.5", "2.5"],
                                            ["18", "2", "3"]
                                        ].map((row, i) => (
                                            <tr key={i} className="border-b hover:bg-gray-50">
                                                {row.map((cell, j) => (
                                                    <td key={j} className="p-3 border-r last:border-r-0 text-center">{cell}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* LITTLE KID */}
                            <div>
                                <h2 className="bg-gray-100 px-4 py-3 font-semibold text-gray-900 text-lg uppercase border tracking-wide text-center rounded-t-md shadow-sm">
                                    LITTLE KID SIZE (3–7 YEARS)
                                </h2>
                                <table className="w-full border border-gray-300 text-sm rounded-md overflow-hidden shadow-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {["Euro Size", "UK/PAK Size", "US Size"].map((h, i) => (
                                                <th key={i} className="p-3 border-b border-r last:border-r-0 font-semibold text-gray-700 text-center tracking-wide">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            ["27", "9.5", "10.5"],
                                            ["28", "10", "11"],
                                            ["29", "11", "12"],
                                            ["30", "12", "13"],
                                            ["31", "13", "13.5"],
                                            ["32", "1.5", "2"],
                                            ["33", "2", "2.5"],
                                            ["33", "2.5", "3"],
                                            ["33", "3", "3.5"],
                                            ["34", "3.5", "4"],
                                            ["34", "4", "4.5"],
                                            ["34", "4.5", "5"],
                                            ["34", "5", "5.5"]
                                        ].map((row, i) => (
                                            <tr key={i} className="border-b hover:bg-gray-50">
                                                {row.map((cell, j) => (
                                                    <td key={j} className="p-3 border-r last:border-r-0 text-center">{cell}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* TODDLER */}
                            <div>
                                <h2 className="bg-gray-100 px-4 py-3 font-semibold text-gray-900 text-lg uppercase border tracking-wide text-center rounded-t-md shadow-sm">
                                    TODDLER SIZE (9 MONTHS – 3 YEARS)
                                </h2>
                                <table className="w-full border border-gray-300 text-sm rounded-md overflow-hidden shadow-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {["Euro Size", "UK/PAK Size", "US Size"].map((h, i) => (
                                                <th key={i} className="p-3 border-b border-r last:border-r-0 font-semibold text-gray-700 text-center tracking-wide">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            ["19", "2.5", "3.5"],
                                            ["19", "3", "4"],
                                            ["20", "3.5", "4.5"],
                                            ["20", "4", "5"],
                                            ["21", "4.5", "5.5"],
                                            ["21", "5", "6"],
                                            ["22", "5.5", "6.5"],
                                            ["23", "6.5", "7.5"],
                                            ["24", "7", "8"],
                                            ["25", "7.5", "8.5"],
                                            ["25", "8", "9"],
                                            ["26", "8.5", "9.5"],
                                            ["27", "9", "10"]
                                        ].map((row, i) => (
                                            <tr key={i} className="border-b hover:bg-gray-50">
                                                {row.map((cell, j) => (
                                                    <td key={j} className="p-3 border-r last:border-r-0 text-center">{cell}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        </div>

                    </div>



                </div>
                <App_footer />
                <Footer />
            </div>
        </>
    )
}


export async function getServerSideProps({ req }) {
    const protocol = req.headers["x-forwarded-proto"] || "http"; // Detect HTTP or HTTPS
    const host = req.headers.host; // Get the domain (localhost:3000 or production domain)
    const fullUrl = `${protocol}://${host}${req.url}`; // Fully dynamic URL
    const logoUrl = `${protocol}://${host}/images/og_logo.png`; // Fully dynamic URL

    return {
        props: { fullUrl, logoUrl },
    };
}