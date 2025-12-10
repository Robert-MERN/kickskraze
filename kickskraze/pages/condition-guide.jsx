import App_footer from '@/components/utilities/App_footer'
import Footer from '@/components/utilities/Footer'
import Navbar from '@/components/utilities/Navbar'
import Head from 'next/head'
import Link from 'next/link'

export default function Condition_guide({ logoUrl, fullUrl }) {
    return (
        <>
            <Head>
                <title>Kickskraze | Condition Guide</title>
                <meta property="og:title" content="Kickskraze | Condition Guide" />
                <meta property="og:description" content="Condition Guide Page" />
                <meta property="og:image" content={logoUrl} />
                <meta property="og:url" content={fullUrl} />
                <meta property="og:type" content="condition-guide" />
                <link rel="icon" href="/images/icon.png" />
            </Head>
            <div className='w-screen flex flex-col items-center'>
                <Navbar />
                <div className='w-full 2xl:w-[1650px] xl:w-[1400px] lg:w-[1100px] px-[20px] lg:px-[120px]' >
                    {/* Condition Guide content */}
                    <div className="w-full py-16 flex flex-col gap-14 text-gray-800">

                        {/* Header */}
                        <div className="flex flex-col gap-3">
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Condition Guide</h1>
                            <p className="text-lg text-gray-600 max-w-3xl">
                                At <span className="font-semibold">Kickskraze</span>, we provide a transparent condition grading system
                                to help you understand the exact state of every product—especially thrifted shoes and accessories.
                                Each pair is inspected carefully before listing so you know exactly what you’re buying.
                            </p>
                        </div>

                        {/* Section: How We Grade */}
                        <div className="grid md:grid-cols-3 gap-10">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">1. How We Grade Conditions</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                Every thrifted article is cleaned, inspected, photographed, and categorized based on our internal
                                quality standards. Our condition guide ensures you receive products that match your expectations
                                with no surprises.
                                <br /><br />
                                Below is a detailed breakdown of each condition level we use across the store.
                            </p>
                        </div>

                        {/* Section: PREMIUM+ */}
                        <div className="grid md:grid-cols-3 gap-10 bg-stone-50 p-6 rounded-xl">
                            <h2 className="text-xl font-semibold text-gray-800 col-span-1">PREMIUM+</h2>
                            <ul className="col-span-2 list-disc ml-4 space-y-2 text-gray-700 leading-7">
                                <li>Item is brand new and has never been worn before.</li>
                                <li>No flaws, no marks, and no signs of handling.</li>
                                <li>Often includes original box or packaging (when available).</li>
                                <li>Perfect for gifting or collectors.</li>
                            </ul>
                        </div>

                        {/* Section: PREMIUM */}
                        <div className="grid md:grid-cols-3 gap-10 p-6">
                            <h2 className="text-xl font-semibold text-gray-800 col-span-1">PREMIUM</h2>
                            <ul className="col-span-2 list-disc ml-4 space-y-2 text-gray-700 leading-7">
                                <li>Item is in near-brand-new condition.</li>
                                <li>Might have been worn once or twice but looks untouched.</li>
                                <li>No noticeable flaws or damage.</li>
                                <li>Very minimal signs of handling.</li>
                            </ul>
                        </div>

                        {/* Section: EXCELLENT */}
                        <div className="grid md:grid-cols-3 gap-10 bg-stone-50 p-6 rounded-xl">
                            <h2 className="text-xl font-semibold text-gray-800 col-span-1">EXCELLENT</h2>
                            <ul className="col-span-2 list-disc ml-4 space-y-2 text-gray-700 leading-7">
                                <li>Item shows very little signs of wear.</li>
                                <li>Light creases, minor rubbing, or minimal outsole wear may exist.</li>
                                <li>Still looks clean, fresh, and well-maintained.</li>
                                <li>Perfect value-for-money option.</li>
                            </ul>
                        </div>

                        {/* Section: VERY GOOD */}
                        <div className="grid md:grid-cols-3 gap-10 p-6">
                            <h2 className="text-xl font-semibold text-gray-800 col-span-1">VERY GOOD</h2>
                            <ul className="col-span-2 list-disc ml-4 space-y-2 text-gray-700 leading-7">
                                <li>Item has visible signs of wear and previous usage.</li>
                                <li>Creasing, outsole wear, slight discoloration, or small marks may be present.</li>
                                <li>Still fully functional and in good usable condition.</li>
                                <li>Best option for customers looking for affordability.</li>
                            </ul>
                        </div>

                        {/* Optional Section: GOOD (Add only if you want one more level) */}
                        <div className="grid md:grid-cols-3 gap-10 bg-stone-50 p-6 rounded-xl">
                            <h2 className="text-xl font-semibold text-gray-800 col-span-1">GOOD</h2>
                            <ul className="col-span-2 list-disc ml-4 space-y-2 text-gray-700 leading-7">
                                <li>Item shows clear signs of wear and use.</li>
                                <li>Creasing, outsole usage, scuffs, or small cosmetic flaws.</li>
                                <li>Still wearable and functional but visually used.</li>
                            </ul>
                        </div>

                        {/* Section: Notes for Customers */}
                        <div className="grid md:grid-cols-3 gap-10">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">2. Important Notes</h2>
                            <ul className="col-span-2 list-disc ml-4 space-y-3 text-gray-600 leading-7">
                                <li>All items are cleaned and inspected before listing.</li>
                                <li>Actual condition is always shown in real product photos.</li>
                                <li>Colors may slightly vary due to screen brightness or lighting.</li>
                                <li>Thrifted items are pre-owned; minor cosmetic imperfections are normal.</li>
                                <li>We never list damaged or unusable items.</li>
                            </ul>
                        </div>

                        {/* Section: Why We Use This System */}
                        <div className="grid md:grid-cols-3 gap-10">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">3. Why This System Matters</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                Transparency is one of our core values. Condition grading allows you to:
                                <br /><br />
                                • Know exactly what you’re buying
                                • Choose based on your budget
                                • Compare different condition levels easily
                                • Shop confidently without worrying about hidden flaws
                                <br /><br />
                                Whether the item is PREMIUM+ or VERY GOOD, we make sure it meets our standard of quality before shipping.
                            </p>
                        </div>

                        {/* Section: Contact */}
                        <div className="grid md:grid-cols-3 gap-10">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">4. Need Help Understanding a Condition?</h2>
                            <p className="col-span-2 text-gray-600 leading-7">
                                If you have questions about a specific item’s condition, feel free to contact us:
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
                                <br /><br />
                                We will provide photos, videos, or clarifications to ensure you are fully satisfied before placing an order.
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