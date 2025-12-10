import App_footer from '@/components/utilities/App_footer'
import Footer from '@/components/utilities/Footer'
import Navbar from '@/components/utilities/Navbar'
import Head from 'next/head'
import Link from 'next/link'

export default function Return_policy({ logoUrl, fullUrl }) {
    return (
        <>
            <Head>
                <title>Kickskraze | Return Policy</title>
                <meta property="og:title" content="Kickskraze | Return Policy" />
                <meta property="og:description" content="Return Policy Page" />
                <meta property="og:image" content={logoUrl} />
                <meta property="og:url" content={fullUrl} />
                <meta property="og:type" content="return-policy" />
                <link rel="icon" href="/images/icon.png" />
            </Head>
            <div className='w-screen flex flex-col items-center'>
                <Navbar />
                <div className='w-full 2xl:w-[1650px] xl:w-[1400px] lg:w-[1100px] px-[20px] lg:px-[120px]' >
                    {/* Return Policy content */}
                    <div className="w-full py-16 flex flex-col gap-10 text-gray-800">

                        {/* Header */}
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Return & Exchange Policy</h1>
                            <p className="text-lg text-gray-600 max-w-3xl">
                                At <span className="font-semibold">Kickskraze</span>, customer satisfaction matters to us.
                                While we usually do not encourage returns, we do offer exchanges and in certain cases
                                we may allow returns as well. Please read our policy carefully before placing an order.
                            </p>
                        </div>

                        {/* Section: General Policy */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">1. General Policy</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                We do <span className="font-semibold">not normally accept returns</span> since most of our items
                                (including thrifted shoes, new footwear, accessories, jewellery and apparel) are limited stock,
                                one-piece items or specially curated articles.
                                <br /><br />
                                However, we <span className="font-semibold">do offer exchanges</span> and in special circumstances,
                                based on our team’s approval, we may allow a return.
                            </p>
                        </div>

                        {/* Section: Return Time Window */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">2. Return Request Window</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                Any return request must be made within
                                <span className="font-semibold"> 24 hours (1 day)</span> of delivery.
                                <br /><br />
                                After 24 hours have passed, we cannot accept a return request under any circumstances.
                                <br /><br />
                                The product must remain unused, unworn, and in the same condition as delivered.
                            </p>
                        </div>

                        {/* Section: Exchange Window */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">3. Exchange Request Window</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                For exchanges, you must contact us within
                                <span className="font-semibold"> 48 hours (2 days)</span> of delivery.
                                <br /><br />
                                Exchange requests made after 48 hours will not be accepted.
                                We strictly follow this time frame to maintain item quality and handling standards.
                            </p>
                        </div>

                        {/* Section: Price Differences */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">4. Price Differences</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                If the product you want in exchange has a higher price,
                                <span className="font-semibold">you must pay the difference.</span>
                                <br /><br />
                                If the exchanged product is lower in price,
                                <span className="font-semibold">we will refund the remaining balance to you</span> through your
                                preferred method (bank transfer or wallet).
                            </p>
                        </div>

                        {/* Section: Exchange Process */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">5. Exchange Process</h2>
                            <div className="col-span-2 text-gray-600 leading-7 flex flex-col gap-4">
                                <p>
                                    All exchange shipping is the customer’s responsibility.
                                    The process is as follows:
                                </p>

                                <ul className="list-disc ml-4 space-y-3">
                                    <li>Contact us on WhatsApp for exchange approval.</li>
                                    <li>We will provide you with the return shipping address.</li>
                                    <li>You will ship the product back to us through your preferred courier service.</li>
                                    <li>Once received, our team will <span className="font-semibold">inspect the item</span> to confirm it is in its original condition.</li>
                                    <li>After inspection approval, we will dispatch the new item to you.</li>
                                </ul>

                                <p className="font-semibold text-gray-700">
                                    Please note: You must pay shipping charges for both sides (sending and receiving).
                                </p>
                            </div>
                        </div>

                        {/* Section: Conditions for Approval */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">6. Conditions for Approval</h2>
                            <ul className="col-span-2 list-disc ml-4 space-y-3 text-gray-600 leading-7">
                                <li>Product must be unused, unworn, and in original packaging.</li>
                                <li>No perfume, stains, dirt, or damage should be present.</li>
                                <li>All accessories, tags, box, and add-ons must be returned if included.</li>
                                <li>Items failing inspection will be returned back to the customer with no exchange allowed.</li>
                            </ul>
                        </div>

                        {/* Section: Special Case Returns */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">7. Special Case Returns</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                In certain exceptional circumstances—such as receiving the wrong item or a product that does not
                                match the photos—we may allow a return instead of an exchange.
                                <br /><br />
                                These cases are reviewed individually by our team and must also be reported within
                                <span className="font-semibold">24 hours</span> of delivery with clear photos and videos.
                            </p>
                        </div>

                        {/* Section: Non-Returnable Items */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">8. Non-Returnable Items</h2>
                            <ul className="col-span-2 list-disc ml-4 space-y-3 text-gray-600 leading-7">
                                <li>Used or worn shoes</li>
                                <li>Items returned after the allowed time frame</li>
                                <li>Customized or altered products</li>
                                <li>Socks, innerwear, hygiene-related items</li>
                                <li>Items damaged by the customer after delivery</li>
                            </ul>
                        </div>

                        {/* Section: Contact */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">9. Contact Us</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                For return or exchange requests, please contact us:
                                <br /><br />
                                < a target='_blank' href="https://wa.me/923020215755">
                                    <span className="font-semibold">WhatsApp:</span> 03020215755 <br />
                                </a>
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