import App_footer from '@/components/utilities/App_footer'
import Footer from '@/components/utilities/Footer'
import Navbar from '@/components/utilities/Navbar'
import Head from 'next/head'
import Link from 'next/link'

export default function Privacy_policy({ logoUrl, fullUrl }) {
    return (
        <>
            <Head>
                <title>Kickskraze | Privacy Policy</title>
                <meta property="og:title" content="Kickskraze | Privacy Policy" />
                <meta property="og:description" content="Privacy Policy Page" />
                <meta property="og:image" content={logoUrl} />
                <meta property="og:url" content={fullUrl} />
                <meta property="og:type" content="privacy-policy" />
                <link rel="icon" href="/images/icon.png" />
            </Head>
            <div className='w-screen flex flex-col items-center'>
                <Navbar />
                <div className='w-full 2xl:w-[1650px] xl:w-[1400px] lg:w-[1100px] px-[20px] lg:px-[120px]' >
                    {/* Privacy Policy content */}

                    <div className="w-full py-16 flex flex-col gap-10 text-gray-800">

                        {/* Header */}
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Privacy Policy</h1>
                            <p className="text-sm text-gray-500">
                                Last updated: 12/01/2024
                            </p>
                            <p className="text-lg text-gray-600 max-w-3xl">
                                At <span className="font-semibold">Kickskraze</span>, we respect your privacy and are committed to
                                protecting your personal information. This Privacy Policy explains how we collect, use and safeguard
                                your data when you visit our website or place an order.
                            </p>
                        </div>

                        {/* Section: Information We Collect */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">1. Information We Collect</h2>
                            <div className="col-span-2 flex flex-col gap-4 text-gray-600 leading-7">
                                <div>
                                    <h3 className="font-semibold text-gray-700">1.1 Personal Information</h3>
                                    <p>
                                        When you create an account, place an order, or contact us, we may collect:
                                        your name, email address, phone number, shipping address, billing address and any other
                                        details you choose to share with us.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-700">1.2 Payment Information</h3>
                                    <p>
                                        We do not store your full card details on our servers. Payments are processed securely
                                        by our third-party payment providers. They may store and process your payment information
                                        according to their own privacy policies.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-700">1.3 Automatically Collected Data</h3>
                                    <p>
                                        When you browse our website, we may automatically collect certain information,
                                        such as your IP address, device type, browser type, pages visited and time spent on pages.
                                        This helps us understand how our website is used and improve performance.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Section: How We Use Your Information */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">2. How We Use Your Information</h2>
                            <ul className="col-span-2 list-disc ml-4 space-y-2 text-gray-600 leading-7">
                                <li>To process and deliver your orders.</li>
                                <li>To create and manage your account.</li>
                                <li>To communicate with you about your orders, support requests or updates.</li>
                                <li>To improve our website, products and overall customer experience.</li>
                                <li>To prevent fraud, abuse or illegal activities.</li>
                                <li>To send marketing emails or promotions (only if you have opted in; you can unsubscribe anytime).</li>
                            </ul>
                        </div>

                        {/* Section: Cookies & Tracking */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">3. Cookies & Tracking Technologies</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                We use cookies and similar technologies to remember your preferences, keep you logged in,
                                analyze website traffic and personalize your experience. You can control or delete cookies
                                through your browser settings, but some features of the website may not work properly if
                                cookies are disabled.
                            </p>
                        </div>

                        {/* Section: Sharing Your Information */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">4. Sharing Your Information</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                We do not sell your personal information. We may share your data only with:
                                <br /><br />
                                <span className="font-semibold">Service providers</span> such as payment processors, courier and
                                shipping companies, IT and analytics tools – strictly for order processing and website operations.
                                <br />
                                <span className="font-semibold">Legal authorities</span> if required by law, to protect our rights
                                or prevent fraud and abuse.
                            </p>
                        </div>

                        {/* Section: Data Retention */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">5. Data Retention</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                We keep your information only for as long as it is necessary for the purposes described in this
                                Privacy Policy, or as required by law (for example, for accounting or tax purposes). When your data
                                is no longer needed, we will delete or anonymize it securely.
                            </p>
                        </div>

                        {/* Section: Your Rights */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">6. Your Rights</h2>
                            <ul className="col-span-2 list-disc ml-4 space-y-2 text-gray-600 leading-7">
                                <li>Access the personal data we hold about you.</li>
                                <li>Request correction of inaccurate or incomplete information.</li>
                                <li>Request deletion of your data, where applicable.</li>
                                <li>Opt out of marketing emails by using the “unsubscribe” link in our emails.</li>
                            </ul>
                        </div>

                        {/* Section: Security */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">7. Security</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                We use reasonable technical and organizational measures to protect your data from unauthorized access,
                                loss, misuse or disclosure. However, no method of transmission over the internet or electronic storage
                                is 100% secure, so we cannot guarantee absolute security.
                            </p>
                        </div>

                        {/* Section: Third-Party Links */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">8. Third-Party Links</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                Our website may contain links to third-party websites or services. We are not responsible for the
                                privacy practices or content of those websites. We recommend reading their privacy policies before
                                providing any personal information.
                            </p>
                        </div>

                        {/* Section: Children's Privacy */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">9. Children&apos;s Privacy</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                Our website is not intended for children under the age of 13. We do not knowingly collect personal
                                information from children. If you believe a child has provided us with personal data, please contact
                                us and we will delete it as soon as possible.
                            </p>
                        </div>

                        {/* Section: Changes */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">10. Changes to This Policy</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                We may update this Privacy Policy from time to time. Any changes will be posted on this page with an
                                updated &quot;Last updated&quot; date. We encourage you to review this page regularly to stay informed
                                about how we protect your information.
                            </p>
                        </div>

                        {/* Section: Contact */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">11. Contact Us</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                If you have any questions about this Privacy Policy or how your data is handled, you can contact us at:
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