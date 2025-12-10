import App_footer from '@/components/utilities/App_footer'
import Footer from '@/components/utilities/Footer'
import Navbar from '@/components/utilities/Navbar'
import Head from 'next/head'
import Link from 'next/link'

export default function Shipping_policy({ logoUrl, fullUrl }) {
    return (
        <>
            <Head>
                <title>Kickskraze | Shipping Policy</title>
                <meta property="og:title" content="Kickskraze | Shipping Policy" />
                <meta property="og:description" content="Shipping Policy Page" />
                <meta property="og:image" content={logoUrl} />
                <meta property="og:url" content={fullUrl} />
                <meta property="og:type" content="shipping-policy" />
                <link rel="icon" href="/images/icon.png" />
            </Head>
            <div className='w-screen flex flex-col items-center'>
                <Navbar />
                <div className='w-full 2xl:w-[1650px] xl:w-[1400px] lg:w-[1100px] px-[20px] lg:px-[120px]' >
                    {/* Shipping Policy content */}


                    <div className="w-full py-16 flex flex-col gap-10 text-gray-800">

                        {/* Header */}
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Shipping Policy</h1>
                            <p className="text-lg text-gray-600 max-w-3xl">
                                Thank you for shopping with <span className="font-semibold">Kickskraze</span>.
                                Below is our complete shipping process, timeline, and delivery expectations.
                            </p>
                        </div>

                        {/* Section: Delivery Time */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">1. Delivery Time</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                We deliver orders within <span className="font-semibold">3–4 business days</span> across Pakistan.
                                Delivery time may vary slightly depending on your city, weather conditions, or courier workload.
                            </p>
                        </div>

                        {/* Section: Courier Partners */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">2. Courier Partners</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                All orders are shipped using reliable and trusted courier services:
                                <br /><br />
                                • <span className="font-semibold">Trax Courier</span><br />
                                • <span className="font-semibold">Leopards Courier</span><br /><br />
                                Once your order is dispatched, we hand it over safely to our courier partner for delivery.
                            </p>
                        </div>

                        {/* Section: Order Inspection */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">3. Order Inspection</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                Every product — including thrifted shoes, new footwear, jewellery, accessories, and apparel —
                                is <span className="font-semibold">carefully inspected and quality-checked</span> before dispatch.
                                We ensure items are clean, accurate to the listing, and packed securely.
                            </p>
                        </div>

                        {/* Section: Tracking Information */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">4. Tracking Information</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                After dispatch, your <span className="font-semibold">tracking number</span> will be:
                                <br /><br />
                                • Added directly to your <span className="font-semibold">order details page</span> on our website, and <br />
                                • Sent to your <span className="font-semibold">email address</span> automatically.
                                <br /><br />
                                You can use the tracking number to monitor your shipment’s status through the courier’s website.
                            </p>
                        </div>

                        {/* Section: Incorrect / Incomplete Address */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">5. Incorrect or Incomplete Address</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                Please ensure your shipping address is correct at the time of placing your order.
                                We are not responsible for delays or failed deliveries caused by incorrect or incomplete address details.
                            </p>
                        </div>

                        {/* Section: Delays */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">6. Possible Delays</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                While we aim to deliver on time, delivery delays may occur due to:
                                <br /><br />
                                • Weather conditions
                                • Courier service delays
                                • Public holidays
                                • High-volume shipping seasons
                            </p>
                        </div>

                        {/* Section: Contact */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">7. Contact Us</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                If you have questions or need help tracking your order, feel free to contact us:
                                <br /><br />
                                <a href="mailto:ms.kickskraze@gmail.com">
                                    <span className="font-semibold">Email:</span> ms.kickskraze@gmail.com<br />
                                </a>
                                <Link className='' href="https://www.instagram.com/kickskraze.pk?igsh=Z3dvcDk3eXRlN3Z1&utm_source=qr" target='_blank'>
                                    <span className="font-semibold">Instagram:</span> @kickskraze.pk
                                </Link>
                            </p>
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