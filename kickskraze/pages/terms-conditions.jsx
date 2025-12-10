import App_footer from '@/components/utilities/App_footer'
import Footer from '@/components/utilities/Footer'
import Navbar from '@/components/utilities/Navbar'
import Head from 'next/head'
import Link from 'next/link'

export default function Terms_conditions({ logoUrl, fullUrl }) {
    return (
        <>
            <Head>
                <title>Kickskraze | Terms & Conditions</title>
                <meta property="og:title" content="Kickskraze | Terms & Conditions" />
                <meta property="og:description" content="Terms & Conditions Page" />
                <meta property="og:image" content={logoUrl} />
                <meta property="og:url" content={fullUrl} />
                <meta property="og:type" content="terms & conditions" />
                <link rel="icon" href="/images/icon.png" />
            </Head>
            <div className='w-screen flex flex-col items-center'>
                <Navbar />
                <div className='w-full 2xl:w-[1650px] xl:w-[1400px] lg:w-[1100px] px-[20px] lg:px-[120px]' >
                    {/* Terms & Conditions content */}

                    <div className="w-full py-16 flex flex-col gap-10 text-gray-800">

                        {/* Header */}
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Terms & Conditions</h1>
                            <p className="text-lg text-gray-600 max-w-3xl">
                                Welcome to <span className="font-semibold">Kickskraze</span>.
                                By using our website, placing an order, or interacting with our services, you agree to the
                                following Terms & Conditions. Please read them carefully.
                            </p>
                        </div>

                        {/* Section: Use of Website */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">1. Use of Our Website</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                By accessing our website, you confirm that:
                                <br /><br />
                                • You are at least 13 years old.
                                • You will not misuse or attempt to harm the website.
                                • You will provide accurate and complete information when placing an order.
                                <br /><br />
                                We reserve the right to refuse service to anyone who violates our terms or engages in fraudulent activity.
                            </p>
                        </div>

                        {/* Section: Product Availability */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">2. Product Availability</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                Most of our products—especially thrifted shoes—are <span className="font-semibold">limited stock</span>
                                or one-piece items.
                                <br /><br />
                                Once sold, the same product may not be restocked.
                                We try our best to keep inventory updated, but in rare cases, if an item becomes unavailable after
                                an order is placed, we may cancel the order and issue a refund or offer an alternative item.
                            </p>
                        </div>

                        {/* Section: Order Confirmation */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">3. Order Confirmation</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                After placing an order, you will receive an order confirmation via email.
                                Your order is considered confirmed only after our team verifies availability and prepares it for dispatch.
                                <br /><br />
                                We reserve the right to cancel any order due to:
                                • Payment issues
                                • Incorrect information
                                • Suspicious activity
                                • Stock unavailability
                            </p>
                        </div>

                        {/* Section: Pricing Policy */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">4. Pricing & Payments</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                All prices displayed on our website are final and non-negotiable.
                                <br /><br />
                                Prices may change at any time without prior notice due to product availability,
                                market variations, or operational costs.
                                <br /><br />
                                By placing an order, you agree to pay the full amount mentioned at checkout,
                                including shipping charges where applicable.
                            </p>
                        </div>

                        {/* Section: Shipping Policy Summary */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">5. Shipping & Delivery</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                Delivery usually takes <span className="font-semibold">3–4 business days</span>.
                                We ship through **Trax** and **Leopards Courier Service**.
                                <br /><br />
                                Tracking numbers are added to your order details page and emailed to you after dispatch.
                                Delivery delays caused by courier services, weather, or public holidays are not our responsibility.
                            </p>
                        </div>

                        {/* Section: Returns & Exchanges */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">6. Returns & Exchanges</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                We do <span className="font-semibold">not normally accept returns</span>, but we do offer exchanges.
                                <br /><br />
                                • Return requests must be reported within <span className="font-semibold">24 hours</span> of delivery.
                                • Exchange requests must be reported within <span className="font-semibold">48 hours</span>.
                                <br /><br />
                                Price differences must be settled accordingly, and customers must pay both-way shipping fees for exchanges.
                                Full details can be found in our <span className="font-semibold">Return & Exchange Policy</span>.
                            </p>
                        </div>

                        {/* Section: Product Condition Disclaimer */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">7. Product Condition Disclaimer</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                Thrifted items may show minor signs of wear, which are clearly shown in the product photos.
                                By purchasing thrift items, you acknowledge and accept their condition as described.
                                <br /><br />
                                We ensure accurate photography and inspection of every product before dispatch.
                            </p>
                        </div>

                        {/* Section: Prohibited Activities */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">8. Prohibited Activities</h2>
                            <ul className="col-span-2 list-disc ml-4 space-y-3 text-gray-600 leading-7">
                                <li>Providing false or misleading information.</li>
                                <li>Attempting fraudulent orders or chargebacks.</li>
                                <li>Copying, redistributing, or misusing website content.</li>
                                <li>Using the website for illegal or unauthorized activities.</li>
                            </ul>
                        </div>

                        {/* Section: Intellectual Property */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">9. Intellectual Property</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                All content on this website—including images, text, designs, graphics, and logos—
                                is the property of <span className="font-semibold">Kickskraze</span> and is protected by copyright laws.
                                <br /><br />
                                You may not use, copy, or redistribute our content without written permission.
                            </p>
                        </div>

                        {/* Section: Limitation of Liability */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">10. Limitation of Liability</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                Kickskraze is not responsible for:
                                <br /><br />
                                • Delays in delivery caused by courier services
                                • Damage occurring during courier transit
                                • Incorrect address provided by the customer
                                • Wrong size chosen by the customer
                                • Minor color differences due to screen settings
                                <br /><br />
                                We ensure all items are inspected and packed securely before dispatch.
                            </p>
                        </div>

                        {/* Section: Changes to Terms */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">11. Changes to Terms</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                We may update these Terms & Conditions at any time.
                                Changes will be posted on this page with an updated effective date.
                                We encourage all customers to review this page periodically.
                            </p>
                        </div>

                        {/* Section: Contact */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">12. Contact Us</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                If you have any questions about these Terms & Conditions, please contact us:
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