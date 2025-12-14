import Link from "next/link";

export default function Landing_page({ logoUrl, fullUrl }) {
    return (
        <>


            <div className="w-screen flex flex-col items-center">

                <main className="w-full 2xl:w-[1650px] xl:w-[1400px] lg:w-[1100px] px-[20px] sm:px-6 md:px-10 lg:px-[80px] pt-6 sm:pt-10 pb-16 flex flex-col gap-16">

                    {/* -------------------------------------------------- */}
                    {/* HERO SECTION – UNIVERSAL PREMIUM MINIMAL */}
                    {/* -------------------------------------------------- */}

                    <section className="w-full flex flex-col lg:flex-row items-center gap-12">

                        {/* HERO TEXT */}
                        <div className="flex-1 flex flex-col gap-5 text-center lg:text-left">

                            <p className="uppercase tracking-[0.25em] text-[11px] md:text-[12px] text-gray-500">
                                Footwear • Thrift • Jewellery • Apparel • Accessories
                            </p>

                            <h1 className="text-[30px] sm:text-[38px] lg:text-[42px] font-bold tracking-tight text-gray-900 leading-snug">
                                Step into Style. <br />
                                Sustainably & Affordably.
                            </h1>

                            <p className="text-gray-600 text-[14px] sm:text-[16px] max-w-lg mx-auto lg:mx-0">
                                Shop curated thrifted shoes, new footwear, stainless steel jewellery,
                                apparel essentials and premium accessories — all verified and hand-picked.
                            </p>

                            {/* CTA BUTTONS */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                                <Link
                                    href="/collection"
                                    className="px-6 py-3 rounded-full bg-black text-white text-[14px] font-semibold hover:bg-white hover:text-black border border-black transition-all"
                                >
                                    Shop All Collections
                                </Link>

                                <Link
                                    href="/collection/footwear"
                                    className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 text-[14px] font-semibold hover:border-black hover:text-black transition-all"
                                >
                                    Explore Thrifted Shoes
                                </Link>
                            </div>
                        </div>

                        {/* HERO IMAGES (UNIVERSAL THEME) */}
                        <div className="flex-1 w-full">
                            <div className="relative w-full aspect-[5/3] rounded-3xl overflow-hidden shadow-sm bg-gray-50">

                                {/* LEFT IMAGE */}
                                <img
                                    src="/images/landing/universal-hero-1.webp"
                                    alt="Footwear & accessories"
                                    className="absolute left-4 top-6 w-[40%] rounded-2xl shadow-md object-cover"
                                />

                                {/* RIGHT IMAGE */}
                                <img
                                    src="/images/landing/universal-hero-2.webp"
                                    alt="Jewellery & apparel"
                                    className="absolute right-4 bottom-6 w-[50%] rounded-2xl shadow-md object-cover"
                                />

                                {/* BADGE */}
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-3 bg-white/80 backdrop-blur px-4 py-1 rounded-full text-[11px] text-gray-700 border border-gray-200">
                                    Curated by Kickskraze
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* -------------------------------------------------- */}
                    {/* STORE-SPECIFIC CATEGORY BLOCKS */}
                    {/* -------------------------------------------------- */}

                    <section className="flex flex-col gap-8">

                        {/* TOP HEADING */}
                        <div className="text-center">
                            <h2 className="text-[30px] font-semibold text-gray-900">
                                Shop by Store
                            </h2>
                            <p className="text-gray-600 text-[16px]">
                                Explore what you love — curated by category and store.
                            </p>
                        </div>

                        {/* GRID – 4 STORES */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

                            {/* FOOTWEAR STORE */}
                            <StoreCard
                                title="Footwear"
                                desc="New arrivals, sneakers & everyday shoes"
                                image="/images/landing/store-footwear.webp"
                                href="/collection/footwear"
                            />

                            {/* FOOTWEAR ACCESSORIES STORE */}
                            <StoreCard
                                title="Footwear Accessories"
                                desc="Clean, protect, and level up your footwear."
                                image="/images/landing/store-accessories.webp"
                                href="/collection/footwear-accessories"
                            />

                            {/* JEWELLERY STORE */}
                            <StoreCard
                                title="Jewellery"
                                desc="Fashion-forward stainless steel pieces"
                                image="/images/landing/store-jewellery.webp"
                                href="/collection/jewellry"
                            />

                            {/* APPAREL STORE */}
                            <StoreCard
                                title="Apparel"
                                desc="Tees, hoodies & everyday fits"
                                image="/images/landing/store-apparel.webp"
                                href="/collection/apparel"
                            />

                        </div>
                    </section>

                    {/* -------------------------------------------------- */}
                    {/* CATEGORY BREAKDOWN FOR EACH STORE */}
                    {/* -------------------------------------------------- */}

                    <section className="flex flex-col gap-20 mt-10">

                        {/* FOOTWEAR CATEGORIES */}
                        <CategorySection
                            title="Footwear Categories"
                            items={[
                                {
                                    label: "Men's Fashion Sneakers",
                                    image: "/images/landing/men-fashion-footwear.webp",
                                    href: "/collection/footwear?store_name=Barefoot&category=men"
                                },
                                {
                                    label: "Women’s Fasion Sneakers",
                                    image: "/images/landing/women-fashion-footwear.webp",
                                    href: "/collection/footwear?store_name=Barefoot&category=women"
                                },
                                {
                                    label: "Women's Heels & Sandals",
                                    image: "/images/landing/women-heels-footwear.webp",
                                    href: "/collection/footwear?store_name=heels,sandals,flats"
                                },
                                {
                                    label: "Men's Sports",
                                    image: "/images/landing/men-sports-footwear.webp",
                                    href: "/collection/footwear?store_name=Kickskraze&category=men"
                                },
                                {
                                    label: "Women's Sports",
                                    image: "/images/landing/women-sports-footwear.webp",
                                    href: "/collection/footwear?store_name=Kickskraze&category=women"
                                },
                                {
                                    label: "Men's Formal",
                                    image: "/images/landing/formal-footwear.webp",
                                    href: "/collection/footwear?store_name=Formal-footwear"
                                },
                                {
                                    label: "Men's Casual",
                                    image: "/images/landing/men-casual-footwear.webp",
                                    href: "/collection/footwear?store_name=Casual-footwear&category=men"
                                },
                                {
                                    label: "Women's Casual",
                                    image: "/images/landing/women-casual-footwear.webp",
                                    href: "/collection/footwear?store_name=Casual-footwear&category=women"
                                },
                                {
                                    label: "Kids",
                                    image: "/images/landing/kids-footwear.webp",
                                    href: "/collection/footwear?category=kids"
                                },

                            ]}
                        />


                        {/* JEWELLERY CATEGORIES */}
                        <CategorySection
                            title="Jewellery Categories"
                            items={[
                                {
                                    label: "Rings",
                                    image: "/images/landing/j-rings.webp",
                                    href: "/collection/jewellery?type=rings"
                                },
                                {
                                    label: "Pendants & Necklaces",
                                    image: "/images/landing/j-pendants.webp",
                                    href: "/collection/jewellery?type=pendants,necklaces"
                                },
                                {
                                    label: "Bracelets",
                                    image: "/images/landing/j-bracelets.webp",
                                    href: "/collection/jewellery?type=bracelets"
                                }
                            ]}
                        />

                        {/* APPAREL CATEGORIES */}
                        <CategorySection
                            title="Apparel Categories"
                            items={[
                                {
                                    label: "Casual (T-Shirts, Jeans, Hoodies)",
                                    image: "/images/landing/a-casual.webp",
                                    href: "/collection/apparel?type=casual"
                                },
                                {
                                    label: "Formal (Suits & Office Wear)",
                                    image: "/images/landing/a-formal.webp",
                                    href: "/collection/apparel?type=formal"
                                },
                                {
                                    label: "Men's Traditional (Shalwar kameez)",
                                    image: "/images/landing/a-men-traditional.webp",
                                    href: "/collection/apparel?type=traditional"
                                },
                                {
                                    label: "Women's Traditional (Suits, Kurti, Saree)",
                                    image: "/images/landing/a-women-traditional.webp",
                                    href: "/collection/apparel?type=traditional"
                                },
                                {
                                    label: "Nigh Suits & Pajamas",
                                    image: "/images/landing/a-sleepwear.webp",
                                    href: "/collection/apparel?type=sleepwear"
                                },
                                {
                                    label: "Sports (Track Suits & Gym Wear)",
                                    image: "/images/landing/a-sportswear.webp",
                                    href: "/collection/apparel?type=sportswear"
                                },
                                {
                                    label: "Outerwear (Jackets & Rain Suits)",
                                    image: "/images/landing/a-jackets.webp",
                                    href: "/collection/apparel?type=outerwear"
                                },
                                {
                                    label: "Modest (Abaya, Burka)",
                                    image: "/images/landing/a-abaya.webp",
                                    href: "/collection/apparel?type=abaya"
                                },
                                {
                                    label: "Headscarf (Hijab, Scarf, Shawls)",
                                    image: "/images/landing/a-headscarf.webp",
                                    href: "/collection/apparel?type=headscarf"
                                },
                                {
                                    label: "Undergarments",
                                    image: "/images/landing/a-undergarments.webp",
                                    href: "/collection/apparel?type=undergarments"
                                },
                            ]}
                        />


                        {/* FOOTWEAR ACCESSORIES TYPES */}
                        <CategorySection
                            title="Footwear Accessories"
                            items={[
                                {
                                    label: "Polish",
                                    image: "/images/landing/polish.webp",
                                    href: "/collection/footwear-accessories?type=polish"
                                },
                                {
                                    label: "Shoe Laces",
                                    image: "/images/landing/shoelaces.webp",
                                    href: "/collection/footwear-accessories?type=shoelaces"
                                },
                                {
                                    label: "Shiner",
                                    image: "/images/landing/shiner.webp",
                                    href: "/collection/footwear-accessories?type=shiner"
                                }
                            ]}
                        />
                    </section>



                    {/* -------------------------------------------------- */}
                    {/* FINAL BRAND STORY / ABOUT SECTION */}
                    {/* -------------------------------------------------- */}

                    <section className="w-full flex flex-col items-center text-center gap-6 mt-10">

                        <h2 className="text-[26px] sm:text-[30px] font-bold tracking-tight text-gray-900">
                            Why Shop at Kickskraze?
                        </h2>

                        <p className="text-gray-600 text-[15px] sm:text-[17px] max-w-3xl leading-relaxed">
                            Kickskraze was created with one mission — to bring premium style within reach for everyone.
                            From brand-new footwear to carefully inspected thrifted shoes, fashion-forward stainless steel
                            jewellery, apparel essentials and daily accessories — every item is authenticated, checked,
                            and curated with care.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-6">

                            {/* Point 1 */}
                            <div className="flex flex-col items-center gap-2 px-4">
                                <p className="text-[18px] font-semibold text-gray-900">Hand-Picked Quality</p>
                                <p className="text-gray-600 text-[14px] leading-relaxed">
                                    Every product goes through a strict inspection process to ensure authenticity,
                                    condition and premium value.
                                </p>
                            </div>

                            {/* Point 2 */}
                            <div className="flex flex-col items-center gap-2 px-4">
                                <p className="text-[18px] font-semibold text-gray-900">Affordable, Always</p>
                                <p className="text-gray-600 text-[14px] leading-relaxed">
                                    Fashion shouldn’t be expensive. Our pricing is designed to make premium items
                                    accessible to everyone.
                                </p>
                            </div>

                            {/* Point 3 */}
                            <div className="flex flex-col items-center gap-2 px-4">
                                <p className="text-[18px] font-semibold text-gray-900">Authenticity Guaranteed</p>
                                <p className="text-gray-600 text-[14px] leading-relaxed">
                                    No replicas, no surprises. What you see is exactly what you'll receive — with detailed
                                    photos and condition notes.
                                </p>
                            </div>

                            {/* Point 4 */}
                            <div className="flex flex-col items-center gap-2 px-4">
                                <p className="text-[18px] font-semibold text-gray-900">Fast Delivery</p>
                                <p className="text-gray-600 text-[14px] leading-relaxed">
                                    Enjoy fast and reliable delivery across Pakistan through Trax & Leopard Courier Services.
                                </p>
                            </div>
                        </div>

                        {/* FINAL CTA */}
                        <Link
                            href="/collection"
                            className="mt-10 px-8 py-3 rounded-full bg-black text-white text-[14px] sm:text-[15px] font-semibold 
        hover:bg-white hover:text-black border border-black transition-all"
                        >
                            Start Shopping
                        </Link>
                    </section>

                </main>
            </div>
        </>
    );
}

/* ----------------------------------------- */
/* Reusable Components */
/* ----------------------------------------- */

function StoreCard({ title, desc, image, href }) {
    return (
        <Link
            href={href}
            className="group flex flex-col gap-2 border border-gray-200 p-4 rounded-2xl bg-white hover:-translate-y-1 hover:shadow-md transition-all duration-[250ms]"
        >
            <img src={image} className="w-full h-[180px] object-cover  object-center rounded-xl" alt={title} />
            <p className="text-[16px] font-semibold text-gray-900  leading-[20px]">{title}</p>
            <p className="text-[13px] text-gray-500 group-hover:text-gray-700">{desc}</p>
        </Link>
    );
}

function CategorySection({ title, items }) {
    return (
        <div className="flex flex-col gap-5">
            <h3 className="text-[24px] font-semibold text-gray-900">{title}</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {items.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="group relative rounded-2xl overflow-hidden bg-gray-100 h-[200px] sm:h-[300px] cursor-pointer"
                    >
                        <img
                            src={item.image}
                            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <p className="absolute bottom-4 left-4 text-white font-semibold text-[14px] md:text-[16px]">
                            {item.label}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export async function getServerSideProps({ req }) {
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers.host;
    const fullUrl = `${protocol}://${host}${req.url}`;
    const logoUrl = `${protocol}://${host}/images/og_logo.webp`;

    return {
        props: { fullUrl, logoUrl },
    };
}
