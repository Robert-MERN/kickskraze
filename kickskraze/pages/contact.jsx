import App_footer from '@/components/utilities/App_footer'
import Footer from '@/components/utilities/Footer'
import Navbar from '@/components/utilities/Navbar'
import Head from 'next/head'
import Link from 'next/link'

export default function Contact({ logoUrl, fullUrl }) {
    return (
        <>
            <Head>
                <title>Kickskraze | Contact</title>
                <meta property="og:title" content="Kickskraze | Contact" />
                <meta property="og:description" content="Contact Page" />
                <meta property="og:image" content={logoUrl} />
                <meta property="og:url" content={fullUrl} />
                <meta property="og:type" content="contact" />
                <link rel="icon" href="/images/icon.png" />
            </Head>
            <div className='w-screen flex flex-col items-center'>
                <Navbar />
                <div className='w-full 2xl:w-[1650px] xl:w-[1400px] lg:w-[1100px] px-[20px] lg:px-[120px]' >
                    {/* Contact content */}
                    <div className="w-full py-16 flex flex-col gap-14 text-gray-800">

                        {/* Header */}
                        <div className="flex flex-col gap-3">
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Contact Us</h1>
                            <p className="text-lg text-gray-600 max-w-3xl">
                                Have a question about your order, exchange, or product details?
                                Our team at <span className="font-semibold">Kickskraze</span> is here to help.
                                Reach out through any method below and we’ll get back to you as soon as possible.
                            </p>
                        </div>

                        {/* Section: Direct Contact */}
                        <div className="grid md:grid-cols-3 gap-10">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">1. Direct Contact</h2>
                            <div className="col-span-2 text-gray-600 leading-7 flex flex-col gap-4">

                                <p>
                                    For fastest support, message us on WhatsApp or Instagram.
                                    You can also email us if you prefer communicating formally.
                                </p>

                                <div className="flex flex-col gap-2">
                                    < a target='_blank' href="https://wa.me/923020215755">
                                        <span className="font-semibold">WhatsApp:</span> 03020215755 <br />
                                    </a>
                                    <a href="mailto:ms.kickskraze@gmail.com">
                                        <span className="font-semibold">Email:</span> ms.kickskraze@gmail.com<br />
                                    </a>
                                    <Link className='' href="https://www.instagram.com/kickskraze.pk?igsh=Z3dvcDk3eXRlN3Z1&utm_source=qr" target='_blank'>
                                        <span className="font-semibold">Instagram:</span> @kickskraze.pk
                                    </Link>
                                </div>

                                <p>
                                    Our usual reply time is <span className="font-semibold">within a few hours</span>,
                                    but during peak days it may take slightly longer.
                                </p>

                            </div>
                        </div>

                        {/* Section: Business Hours */}
                        <div className="grid md:grid-cols-3 gap-10">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">2. Business Hours</h2>
                            <div className="col-span-2 text-gray-600 leading-7">
                                <p>We operate and respond during the following hours:</p>
                                <br />
                                <ul className="list-disc ml-4 space-y-2">
                                    <li>Monday – Saturday: 11:00 AM to 9:00 PM</li>
                                    <li>Sunday: Limited support</li>
                                </ul>
                                <br />
                                <p>Feel free to message anytime; we'll get back to you as soon as we are available.</p>
                            </div>
                        </div>

                        {/* Section: Contact Form (UI only) */}
                        <div className="grid md:grid-cols-3 gap-10">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">3. Send Us a Message</h2>
                            <div className="col-span-2 flex flex-col gap-4">

                                <p className="text-gray-600 leading-7">
                                    Prefer writing your query directly here? Fill out the form below and our support team
                                    will get back to you via email.
                                </p>

                                <form className="flex flex-col gap-4">

                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-gray-500"
                                    />

                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-gray-500"
                                    />

                                    <input
                                        type="text"
                                        placeholder="Order Number (optional)"
                                        className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-gray-500"
                                    />

                                    <textarea
                                        rows="5"
                                        placeholder="Write your message..."
                                        className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-gray-500"
                                    ></textarea>

                                    <button
                                        type="submit"
                                        className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-900 transition-all"
                                    >
                                        Send Message
                                    </button>

                                </form>
                            </div>
                        </div>

                        {/* Section: Shipping & Exchange Support */}
                        <div className="grid md:grid-cols-3 gap-10">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">4. Order / Exchange Support</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                For issues related to shipping, tracking numbers, inspection, exchanges or returns,
                                please include your <span className="font-semibold">order number</span> when you contact us.
                                This helps us resolve your request faster.
                            </p>
                        </div>

                        {/* Section: Response Time */}
                        <div className="grid md:grid-cols-3 gap-10">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">5. Response Time</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                We try our best to respond quickly. Standard response times:
                                <br /><br />
                                • WhatsApp: 1–3 hours
                                • Instagram DM: 3–6 hours
                                • Email: 12–24 hours
                                <br /><br />
                                During peak seasons or sale days, delays may occur, but we always ensure every message is answered.
                            </p>
                        </div>

                        {/* Section: FAQ Link */}
                        <div className="grid md:grid-cols-3 gap-10">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">6. Need Quick Answers?</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                Many common questions about delivery, exchanges, or product conditions are already covered
                                in our FAQ section and policy pages. Reviewing them may save you time!
                                <br /><br />
                                You can also message us directly if your question is not listed.
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