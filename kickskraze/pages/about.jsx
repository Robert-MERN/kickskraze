import App_footer from '@/components/utilities/App_footer'
import Footer from '@/components/utilities/Footer'
import Navbar from '@/components/utilities/Navbar'
import Head from 'next/head'

export default function About({ logoUrl, fullUrl }) {
    return (
        <>
            <Head>
                <title>Kickskraze | About</title>
                <meta property="og:title" content="Kickskraze | About" />
                <meta property="og:description" content="About Page" />
                <meta property="og:image" content={logoUrl} />
                <meta property="og:url" content={fullUrl} />
                <meta property="og:type" content="about" />
                <link rel="icon" href="/images/icon.png" />
            </Head>
            <div className='w-screen flex flex-col items-center'>
                <Navbar />
                <div className='w-full 2xl:w-[1650px] xl:w-[1400px] lg:w-[1100px] px-[20px] lg:px-[120px]' >
                    {/* About us content */}
                    <div className="w-full py-16 flex flex-col gap-16">

                        {/* Header Section */}
                        <div className="flex flex-col gap-3">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-700">About Kickskraze</h1>
                            <p className="text-lg text-gray-600 max-w-3xl">
                                Where fashion meets authenticity — thrifted gems, fresh releases, premium jewellery,
                                and modern apparel curated with passion.
                            </p>
                        </div>

                        {/* Section 1 */}
                        <div className="grid md:grid-cols-3 gap-10">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">Who We Are</h2>
                            <p className="text-gray-600 leading-7 col-span-2">
                                Kickskraze started from a simple love for sneakers and unique fashion. Today, it has grown into
                                a trusted destination for thrifted shoes, brand-new footwear, stainless-steel jewellery,
                                streetwear apparel, and premium footwear accessories.
                                <br /><br />
                                Every piece you see in our store is handpicked, quality-checked, and curated to ensure you get
                                the best value without compromising on style.
                            </p>
                        </div>

                        {/* Section 2 */}
                        <div className="grid md:grid-cols-3 gap-10">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">What We Offer</h2>
                            <div className="col-span-2 flex flex-col gap-4 text-gray-600">

                                <div>
                                    <h3 className="font-semibold text-lg text-gray-700">Thrifted Shoes</h3>
                                    <p>Premium pre-loved sneakers cleaned, verified, and restored for a fresh second life.</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg text-gray-700">New Footwear</h3>
                                    <p>Stylish, comfortable and trendy pairs — perfect for everyday wear.</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg text-gray-700">Footwear Accessories</h3>
                                    <p>Laces, care kits, cleaners, and essentials to keep your kicks in top condition.</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg text-gray-700">Stainless Steel Jewellery</h3>
                                    <p>Water-proof, tarnish-free, long-lasting jewellery built for daily use.</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg text-gray-700">Apparel</h3>
                                    <p>Clean, modern streetwear made for comfort, confidence, and everyday styling.</p>
                                </div>

                            </div>
                        </div>

                        {/* Section 3 */}
                        <div className="grid md:grid-cols-3 gap-10">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">Our Commitment</h2>
                            <p className="text-gray-600 leading-7 col-span-2">
                                We stand for authenticity, transparency, and quality.
                                Every product is photographed, described, and verified with care so you always know exactly
                                what you're getting.
                                <br /><br />
                                Kickskraze aims to make premium fashion affordable — without cutting corners.
                            </p>
                        </div>

                        {/* Section 4 */}
                        <div className="grid md:grid-cols-3 gap-10">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">Why People Choose Us</h2>
                            <ul className="text-gray-600 leading-7 col-span-2 list-disc ml-4 space-y-3">
                                <li>Unique thrifted and new sneaker collection</li>
                                <li>Premium quality at honest pricing</li>
                                <li>Trusted product verification process</li>
                                <li>Clean, modern, and seamless shopping experience</li>
                                <li>Fast responses and customer-first service</li>
                            </ul>
                        </div>

                        {/* Section 5 */}
                        <div className="grid md:grid-cols-3 gap-10">
                            <h2 className="text-2xl font-semibold text-gray-700 col-span-1">Our Story</h2>
                            <p className="text-gray-600 leading-7 col-span-2">
                                Kickskraze was built on passion — a passion for sneakers, fashion, and individuality.
                                What began as a small reselling journey evolved into a brand dedicated to sustainability through
                                thrifting and quality through curation.
                                <br /><br />
                                Today, we are more than a store — we are a community of trend-setters, collectors, and
                                everyday people who believe that style shouldn’t be expensive.
                            </p>
                        </div>

                        <div className="pt-6">
                            <p className="text-lg font-semibold text-gray-700">— Team Kickskraze</p>
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