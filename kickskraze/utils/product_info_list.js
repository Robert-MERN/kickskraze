// Icons For Category List 
import FaceIcon from '@mui/icons-material/Face';
import Face4Icon from '@mui/icons-material/Face4';
import WcIcon from '@mui/icons-material/Wc';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { nanoid } from 'nanoid';

// Icons For Condition List
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VerifiedIcon from '@mui/icons-material/Verified';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';


// Icons for Store List

export const category_list = [
    { category: "unisex", _id: "1", icon: <WcIcon className='mr-3' /> },
    { category: "men", _id: "2", icon: <FaceIcon className='mr-3' /> },
    { category: "women", _id: "3", icon: <Face4Icon className='mr-3' /> },
    { category: "kids", _id: "4", icon: <WcIcon className='mr-3' /> },
    { category: "Kids-boys", _id: "4", icon: <ChildCareIcon className='mr-3' /> },
    { category: "kids-girls", _id: "4", icon: <ChildCareIcon className='mr-3' /> },
];

export const condition_list = [
    { condition: "very good", _id: "1", icon: <ThumbUpOffAltIcon className="mr-3" /> },
    { condition: "excellent", _id: "2", icon: <ThumbUpAltIcon className="mr-3" /> },
    { condition: "premium", _id: "3", icon: <WorkspacePremiumIcon className="mr-3" /> },
    { condition: "premium +", _id: "4", icon: <VerifiedIcon className="mr-3" /> },
    { condition: "brand new", _id: "5", icon: <AutoAwesomeIcon className="mr-3" /> },
];

export const store_list = [
    { title: "Barefoot (e.g. Converse, Vans)", store_name: "Barefoot" },
    { title: "Kickskraze (Sport Shoes)", store_name: "Kickskraze" },
    { title: "Casual Footwear (e.g. Slippers, Crocs)", store_name: "Casual-footwear" },
    { title: "Formal Footwear (Men's Footwear)", store_name: "Formal-footwear" },
    { title: "Areeba's Sandals (Casual & Formal)", store_name: "Areeba-sandals" },
    { title: "SM's Sandals (Casual & Formal)", store_name: "SM-sandals" },
    { title: "Footwear Accessories (e.g. Polish, Laces)", store_name: "Footwear-accessories" },
];

export const size_list = [
    { title: "Small (S)", size: "S" },
    { title: "Medium (M)", size: "M" },
    { title: "Large (L)", size: "L" },
    { title: "Extra Large (XL)", size: "XL" },
    { title: "Double Extra Large (XXL)", size: "XXL" },
    { title: "Tripple Extra Large (XXL)", size: "XXXL" },

];


export const jewelry_type_list = [
    { title: "Necklaces", type: "necklaces" },
    { title: "Pendants & Charms", type: "pendants" },
    { title: "Rings", type: "rings" },
    { title: "Bracelets (Cuffs)", type: "bracelets" },
    { title: "Earrings", type: "earrings" },
    { title: "Watches", type: "watches" },
]



export const apparel_type_list = [
    { title: "Casual (e.g. T-shirts, Jeans, Sweatshirts)", type: "casual" },
    { title: "Formal (e.g. Suits, Dress-shirts, Office-wear)", type: "formal" },
    { title: "Sportswear (e.g. Gym-wear, Tracksuits)", type: "sportswear" },
    { title: "Traditional (e.g. Shalwar-kameez, Saree, Kurta)", type: "traditional" },
    { title: "Sleepwear (e.g. Pajamas, Night-suits)", type: "sleepwear" },
    { title: "Undergarments (e.g. Sando, Bra, Underwear)", type: "undergarments" },
    { title: "Outerwear (e.g. Jackets, Rain-Suits, Vests)", type: "outerwear" },
]

export const footwear_accessories_type_list = [
    { title: "Polish", type: "polish" },
    { title: "Shiner", type: "shiner" },
    { title: "Shoe Laces", type: "shoelaces" },
    { title: "Insole", type: "insole" },
    { title: "Socks", type: "socks" },
]


export const sandals_type_list = [
    { title: "Sandals", type: "sandals" },
    { title: "Heels", type: "heels" },
    { title: "Flats", type: "flats" },
]



export const brand_list = [
    {
        "brand": "Adidas",
        "_id": nanoid(8)
    },
    {
        "brand": "And 1",
        "_id": nanoid(8)
    },
    {
        "brand": "Anko",
        "_id": nanoid(8)
    },
    {
        "brand": "Armani Jeans",
        "_id": nanoid(8)
    },
    {
        "brand": "ASICS",
        "_id": nanoid(8)
    },
    {
        "brand": "Athletic",
        "_id": nanoid(8)
    },
    {
        "brand": "Bench",
        "_id": nanoid(8)
    },
    {
        "brand": "Blowfish",
        "_id": nanoid(8)
    },
    {
        "brand": "Brooks",
        "_id": nanoid(8)
    },
    {
        "brand": "Camper",
        "_id": nanoid(8)
    },
    {
        "brand": "Carters",
        "_id": nanoid(8)
    },
    {
        "brand": "Caterpillar",
        "_id": nanoid(8)
    },
    {
        "brand": "Champion",
        "_id": nanoid(8)
    },
    {
        "brand": "Cloudsurfer",
        "_id": nanoid(8)
    },
    {
        "brand": "Coach",
        "_id": nanoid(8)
    },
    {
        "brand": "Columbia Drainmaker",
        "_id": nanoid(8)
    },
    {
        "brand": "Converse",
        "_id": nanoid(8)
    },
    {
        "brand": "Cruyff",
        "_id": nanoid(8)
    },
    {
        "brand": "DC",
        "_id": nanoid(8)
    },
    {
        "brand": "Decathlon",
        "_id": nanoid(8)
    },
    {
        "brand": "Diadora",
        "_id": nanoid(8)
    },
    {
        "brand": "Diesel",
        "_id": nanoid(8)
    },
    {
        "brand": "Dockers",
        "_id": nanoid(8)
    },
    {
        "brand": "DSG",
        "_id": nanoid(8)
    },
    {
        "brand": "ECCO",
        "_id": nanoid(8)
    },
    {
        "brand": "Escalante Altra",
        "_id": nanoid(8)
    },
    {
        "brand": "Esmara",
        "_id": nanoid(8)
    },
    {
        "brand": "Esprit",
        "_id": nanoid(8)
    },
    {
        "brand": "etnies",
        "_id": nanoid(8)
    },
    {
        "brand": "FC EST. 1972",
        "_id": nanoid(8)
    },
    {
        "brand": "Fila",
        "_id": nanoid(8)
    },
    {
        "brand": "Fred Perry",
        "_id": nanoid(8)
    },
    {
        "brand": "Furla",
        "_id": nanoid(8)
    },
    {
        "brand": "FUSION4",
        "_id": nanoid(8)
    },
    {
        "brand": "G-Star Raw",
        "_id": nanoid(8)
    },
    {
        "brand": "Gabor",
        "_id": nanoid(8)
    },
    {
        "brand": "Gemo Sneaker",
        "_id": nanoid(8)
    },
    {
        "brand": "GEOX",
        "_id": nanoid(8)
    },
    {
        "brand": "Gerry Weber",
        "_id": nanoid(8)
    },
    {
        "brand": "Graceland",
        "_id": nanoid(8)
    },
    {
        "brand": "Guess",
        "_id": nanoid(8)
    },
    {
        "brand": "Hinson",
        "_id": nanoid(8)
    },
    {
        "brand": "HM Jewels",
        "_id": nanoid(8)
    },
    {
        "brand": "Hoka",
        "_id": nanoid(8)
    },
    {
        "brand": "Jack & Jones",
        "_id": nanoid(8)
    },
    {
        "brand": "Joma",
        "_id": nanoid(8)
    },
    {
        "brand": "jordan",
        "_id": nanoid(8)
    },
    {
        "brand": "Kappa",
        "_id": nanoid(8)
    },
    {
        "brand": "Keds",
        "_id": nanoid(8)
    },
    {
        "brand": "Kenji",
        "_id": nanoid(8)
    },
    {
        "brand": "Kickskraze",
        "_id": nanoid(8)
    },
    {
        "brand": "Lacoste",
        "_id": nanoid(8)
    },
    {
        "brand": "Le Coq Sportif",
        "_id": nanoid(8)
    },
    {
        "brand": "Legero",
        "_id": nanoid(8)
    },
    {
        "brand": "Levi's",
        "_id": nanoid(8)
    },
    {
        "brand": "Lotto",
        "_id": nanoid(8)
    },
    {
        "brand": "Massimo Dutti",
        "_id": nanoid(8)
    },
    {
        "brand": "Merrell",
        "_id": nanoid(8)
    },
    {
        "brand": "mizuno",
        "_id": nanoid(8)
    },
    {
        "brand": "Native",
        "_id": nanoid(8)
    },
    {
        "brand": "Nautica",
        "_id": nanoid(8)
    },
    {
        "brand": "New Balance",
        "_id": nanoid(8)
    },
    {
        "brand": "Newfeel",
        "_id": nanoid(8)
    },
    {
        "brand": "Next",
        "_id": nanoid(8)
    },
    {
        "brand": "Nike",
        "_id": nanoid(8)
    },
    {
        "brand": "Nine West",
        "_id": nanoid(8)
    },
    {
        "brand": "Noclaim",
        "_id": nanoid(8)
    },
    {
        "brand": "On Cloud",
        "_id": nanoid(8)
    },
    {
        "brand": "Old Navy",
        "_id": nanoid(8)
    },
    {
        "brand": "Onitsuka Tiger",
        "_id": nanoid(8)
    },
    {
        "brand": "Pantofola D'oro",
        "_id": nanoid(8)
    },
    {
        "brand": "Pierre Cardin",
        "_id": nanoid(8)
    },
    {
        "brand": "Primark",
        "_id": nanoid(8)
    },
    {
        "brand": "Pull&Bear",
        "_id": nanoid(8)
    },
    {
        "brand": "Puma",
        "_id": nanoid(8)
    },
    {
        "brand": "Quechua",
        "_id": nanoid(8)
    },
    {
        "brand": "Reebok",
        "_id": nanoid(8)
    },
    {
        "brand": "Roots",
        "_id": nanoid(8)
    },
    {
        "brand": "Salomon",
        "_id": nanoid(8)
    },
    {
        "brand": "Saucony",
        "_id": nanoid(8)
    },
    {
        "brand": "Shaq",
        "_id": nanoid(8)
    },
    {
        "brand": "Skechers",
        "_id": nanoid(8)
    },
    {
        "brand": "Sneaky Steve",
        "_id": nanoid(8)
    },
    {
        "brand": "Sperry",
        "_id": nanoid(8)
    },
    {
        "brand": "Steve Madden",
        "_id": nanoid(8)
    },
    {
        "brand": "Straye",
        "_id": nanoid(8)
    },
    {
        "brand": "Stride Rite",
        "_id": nanoid(8)
    },
    {
        "brand": "Sun68",
        "_id": nanoid(8)
    },
    {
        "brand": "Super Soft",
        "_id": nanoid(8)
    },
    {
        "brand": "SUPERDRY",
        "_id": nanoid(8)
    },
    {
        "brand": "Supra",
        "_id": nanoid(8)
    },
    {
        "brand": "Tams",
        "_id": nanoid(8)
    },
    {
        "brand": "Tarmak",
        "_id": nanoid(8)
    },
    {
        "brand": "Tex",
        "_id": nanoid(8)
    },
    {
        "brand": "The North Face",
        "_id": nanoid(8)
    },
    {
        "brand": "Timberland",
        "_id": nanoid(8)
    },
    {
        "brand": "Tommy Hilfiger",
        "_id": nanoid(8)
    },
    {
        "brand": "Toms",
        "_id": nanoid(8)
    },
    {
        "brand": "Under Armour",
        "_id": nanoid(8)
    },
    {
        "brand": "Vans",
        "_id": nanoid(8)
    },
    {
        "brand": "Vty",
        "_id": nanoid(8)
    },
    {
        "brand": "Wittner",
        "_id": nanoid(8)
    },
    {
        "brand": "Zara",
        "_id": nanoid(8)
    }
];



export const PK_cities = ["Abbaspur", "Abbottabad", "Adezai", "Adilpur", "Ahmadpur East", "Ahmadpur Sial", "Ahmed Nager", "Akora", "Akora Khattak", "Ali Khan", "Aliabad", "Alik Ghund", "Alipur", "Alizai", "Alpurai", "Alpuri", "Aman Garh", "Amangarh", "Amirabad", "Arif Wala", "Arifwala", "Ashanagro Koto", "Athmuqam", "Attock", "Attock City", "Awaran", "Ayubia", "Baddomalhi", "Badin", "Baffa", "Bagarji", "Bagh", "Bahawalnagar", "Bahawalpur", "Bahrain", "Bakhri Ahmad Khan", "Banda Daud", "Bandhi", "Bannu", "Barikot", "Barishal", "Barkhan", "Basirpur", "Basti Dosa", "Batkhela", "Battagram", "Begowala", "Bela", "Benazirabad", "Berani", "Bhag", "Bhakkar", "Bhalwal", "Bhan", "Bhawana", "Bhera", "Bhimbar", "Bhimber", "Bhiria", "Bhirkan", "Bhit Shah", "Bhopalwala", "Birote", "Bolhari", "Bozdar Wada", "Buleda", "Bulri", "Burewala", "Chagai", "Chak", "Chak Azam Sahu", "Chak Five Hundred Seventy-five", "Chak Jhumra", "Chak One Hundred Twenty Nine Left", "Chak Thirty-one -eleven Left", "Chak Two Hundred Forty-nine Thal Development Authority", "Chakdara", "Chakswari", "Chakwal", "Chaman", "Chamber", "Charhoi", "Charsadda", "Chawinda", "Chenab Nagar", "Cherat Cantonement", "Chhor", "Chichawatni", "Chikkar", "Chilas", "Chillianwala", "Chiniot", "Chishtian", "Chitkan", "Chitral", "Choa Saidan Shah", "Chowki Jamali", "Chuchar-kana Mandi", "Chuhar Jamali", "Chunian", "Dadhar", "Dadu", "Dadyal", "Daggar", "Daharki", "Daira Din Panah", "Dajal", "Dalbandin", "Dambudas", "Dandot Rs", "Danyor", "Dargai", "Daromehar", "Darya Khan", "Darya Khan Marri", "Daska", "Daska Kalan", "Dasu", "Daud Khel", "Daulatpur", "Daultala", "Daur", "Dera Allahyar", "Dera Bugti", "Dera Ghazi Khan", "Dera Ismail Khan", "Dera Murad Jamali", "Dhadar", "Dhanot", "Dhaular", "Dhaunkal", "Dhirkot", "Dhoro Naro", "Digri", "Dijkot", "Dina", "Dinan Bashnoian Wala", "Dinga", "Dipalpur", "Diplo", "Dir", "Doaba", "Dokri", "Drosh", "Duki", "Dullewala", "Dunga Bunga", "Dunyapur", "Dureji", "Eidgah", "Eidghah", "Eminabad", "Faisalabad", "Faqirwali", "Farooqabad", "Faruka", "Fateh Jhang", "Fatehpur Thakiala", "Fazilpur", "Ferozewala", "Fort Abbas", "Forward Kahuta", "Gadani", "Gahkuch", "Gajjar Mashkay", "Gakuch", "Gambat", "Gandava", "Garh Maharaja", "Garhi Dupatta", "Garhi Khairo", "Garhiyasin", "Ghakhar Mandi", "Gharo", "Ghauspur", "Ghotki", "Gilgit", "Gojra", "Goth Garelo", "Goth Phulji", "Goth Radhan", "Gujar Khan", "Gujranwala", "Gujranwala Cantonment", "Gujrat", "Gulishah Kach", "Gwadar", "Haala", "Hadali", "Hafizabad", "Hajira", "Hala", "Hangu", "Haripur", "Harnai", "Harnoli", "Haroonabad", "Harunabad", "Hasilpur", "Hattian Bala", "Haveli", "Haveli Lakha", "Havelian", "Hazro City", "Hingorja", "Hub", "Hujra Shah Muqim", "Huramzai", "Hyderabad", "Ishkoman", "Islamabad", "Islamgarh", "Islamkot", "Jacobabad", "Jafarabad", "Jahanian Shah", "Jalalpur", "Jalalpur Jattan", "Jalalpur Pirwala", "Jampur", "Jamrud", "Jamshoro", "Jand", "Jandiala Sher Khan", "Jaranwala", "Jati", "Jatoi", "Jatoi Shimali", "Jattan", "Jauharabad", "Jehangira", "Jhal Magsi", "Jhang", "Jhang City", "Jhang Sadr", "Jhawarian", "Jhelum", "Jhol", "Jiwani", "Johi", "Juglot", "Jungshahi", "Jām Sāhib", "Kabal", "Kabirwala", "Kacchi", "Kadhan", "Kahna Nau", "Kahror Pakka", "Kahuta", "Kakad Wari Dir Upper", "Kalabagh", "Kalaswala", "Kalat", "Kaleke Mandi", "Kallar Kahar", "Kalur Kot", "Kamalia", "Kamar Mushani", "Kambar", "Kamber Ali Khan", "Kamoke", "Kamra", "Kandhkot", "Kandiari", "Kandiaro", "Kanganpur", "Karachi", "Karak", "Karaundi", "Karimabad", "Kario Ghanwar", "Karor", "Karor Lal", "Kashmor", "Kashmore", "Kasur", "Kech", "Keshupur", "Keti Bandar", "Khadan Khak", "Khadro", "Khai Gala", "Khairpur", "Khairpur Mir's", "Khairpur Nathan Shah", "Khairpur Tamewah", "Khalabat", "Khandowa", "Khanewal", "Khangah Dogran", "Khangarh", "Khanozai", "Khanpur", "Khanpur Mahar", "Khaplu", "Kharan", "Kharian Cantonement", "Khewra", "Khipro", "Khuiratta", "Khurrianwala", "Khushab", "Khuzdar", "Khwazakhela", "Killa Abdullah", "Killa Saifullah", "Kohat", "Kohlu", "Kot Abdul Malik", "Kot Addu", "Kot Diji", "Kot Ghulam Muhammad", "Kot Malik Barkhurdar", "Kot Mumin", "Kot Radha Kishan", "Kot Rajkour", "Kot Samaba", "Kot Sultan", "Kotli", "Kotli Loharan", "Kotri", "Kulachi", "Kundian", "Kunjah", "Kunri", "Lachi", "Ladhewala Waraich", "Lahore", "Lakha", "Lakhi", "Lakki", "Lakki Marwat", "Lala Musa", "Lalamusa", "Lalian", "Landi Kotal", "Larkana", "Lasbela", "Latamber", "Layyah", "Lehri", "Liaquat Pur", "Liliani", "Lodhran", "Loralai", "Ludhewala Waraich", "Mach", "Machh", "Madeji", "Madyan", "Mailsi", "Makli", "Malakand", "Malakwal", "Malakwal City", "Malir Cantonment", "Mamoori", "Mamu Kanjan", "Mananwala", "Mandi Bahauddin", "Mangla", "Mankera", "Mansehra", "Mardan", "Mastuj", "Mastung", "Matiari", "Matli", "Matta", "Mehar", "Mehmand Chak", "Mehrabpur", "Mian Channu", "Mianke Mor", "Mianwali", "Minchianabad", "Mingora", "Miran Shah", "Miro Khan", "Mirpur", "Mirpur Bhtoro", "Mirpur Khas", "Mirpur Mathelo", "Mirpur Sakro", "Mirwah Gorchani", "Mitha Tiwana", "Mithani", "Mithi", "Moro", "Moza Shahwala", "Multan", "Muridke", "Murree", "Musa Khel Bazar", "Musakhel", "Muslim Bagh", "Mustafābād", "Muzaffarabad", "Muzaffargarh", "Nabisar", "Nagarkhas", "Nagarparkar", "Nal", "Nankana Sahib", "Narang Mandi", "Narowal", "Nasirabad", "Naudero", "Naukot", "Naushahra Virkan", "Naushahro Feroze", "Naushahro Firoz", "Naushara", "Nawabshah", "Nawan Shehr", "Nazimabad", "Nazir Town", "New Bādāh", "New Mirpur", "Noorabad", "Nowshera", "Nowshera Cantonment", "Nushki", "Okara", "Ormara", "Pabbi", "Pad Idan", "Paharpur", "Pakpattan", "Palandri", "Panjgur", "Pano Akil", "Pano Aqil", "Parachinar", "Paroa", "Pasni", "Pasrur", "Pathika", "Pattoki", "Peshawar", "Phalia", "Phool Nagar", "Pind Dadan Khan", "Pindi Bhattian", "Pindi Gheb", "Pir Jo Goth", "Pir Mahal", "Pishin", "Pishin Valley", "Pithoro", "Qadirpur Ran", "Qaimpur", "Qalat", "Qambar", "Qasimabad", "Qila Abdullah", "Qila Didar", "Qila Saifullah", "Quetta", "Rabwah", "Rahim Yar Khan", "Raiwind", "Raja Jang", "Rajanpur", "Rajo Khanani", "Ranipur", "Rasulnagar", "Ratodero", "Rawalakot", "Rawalpindi", "Renala Khurd", "Risalpur", "Risalpur Cantonment", "Rohri", "Rojhan", "Rustam", "Sadda", "Saddiqabad", "Sadiqabad", "Safdarabad", "Sahiwal", "Saidu Sharif", "Sakrand", "Samahni", "Samaro", "Sambrial", "Samundri", "Sanghar", "Sangla Hill", "Sanjawi", "Sanjwal", "Sann", "Sarai Alamgir", "Sarai Naurang", "Sarai Sidhu", "Saranan", "Sargodha", "Sawat", "Sehnsa", "Sehwan", "Sehwan Sharif", "Setharja Old", "Shabqadar", "Shahbandar", "Shahdadkot", "Shahdadpur", "Shahkot", "Shahpur", "Shahpur Chakar", "Shahr Sultan", "Shahrug", "Shakargarh", "Sharqpur Sharif", "Sheikhupura", "Sherani", "Shewa Adda", "Shigar", "Shikarpur", "Shingli Bala", "Shinpokh", "Shorkot", "Shujaabad", "Sialkot", "Sibi", "Sillanwali", "Sinjhoro", "Siranwali", "Skardu", "Sobhodero", "Sodhri", "Sohawa", "Sohbatpur", "Soianwala", "Sui Town", "Sukheke Mandi", "Sukkur", "Surab", "Surkhpur", "Swabi", "Swat", "Sīta Road", "Takht-i-bahi", "Talagang", "Talamba", "Talhar", "Tall", "Tandlianwala", "Tando Adam", "Tando Adam Khan", "Tando Allahyar", "Tando Bago", "Tando Jam", "Tando Mitha Khan", "Tando Muhammad Khan", "Tangi", "Tangir", "Tangwani", "Tank", "Tasp", "Taunsa", "Taunsa Sharif", "Taxila", "Thal", "Thall", "Tharu Shah", "Thatta", "Thul", "Timargara", "Toba Tek Singh", "Tolti", "Topi", "Tordher", "Tump", "Turbat", "Ubauro", "Umarkot", "Upper Dir", "Usta Muhammad", "Uthal", "Utmanzai", "Vehari", "Wadh", "Wah Cantonment", "Wana", "Warah", "Washuk", "Wazirabad", "Winder", "Yazman", "Zafarwal", "Zahir Pir", "Zaida", "Zehri", "Zhob", "Ziarat"];




export const color_list = [
    { color: "Black", bg: "bg-[#000000]" },
    { color: "White", bg: "bg-[#FFFFFF]" },
    { color: "Gray", bg: "bg-[#808080]" },
    { color: "Light Gray", bg: "bg-[#D3D3D3]" },
    { color: "Dark Gray", bg: "bg-[#505050]" },
    { color: "Silver", bg: "bg-[#C0C0C0]" },
    { color: "Charcoal", bg: "bg-[#36454F]" },
    { color: "Navy", bg: "bg-[#000080]" },
    { color: "Midnight Blue", bg: "bg-[#191970]" },
    { color: "Royal Blue", bg: "bg-[#4169E1]" },
    { color: "Sky Blue", bg: "bg-[#87CEEB]" },
    { color: "Baby Blue", bg: "bg-[#89CFF0]" },
    { color: "Turquoise", bg: "bg-[#40E0D0]" },
    { color: "Teal", bg: "bg-[#008080]" },
    { color: "Aqua", bg: "bg-[#00FFFF]" },
    { color: "Cyan", bg: "bg-[#00BFFF]" },
    { color: "Mint", bg: "bg-[#98FF98]" },
    { color: "Forest Green", bg: "bg-[#228B22]" },
    { color: "Lime Green", bg: "bg-[#32CD32]" },
    { color: "Olive", bg: "bg-[#808000]" },
    { color: "Emerald", bg: "bg-[#50C878]" },
    { color: "Kelly Green", bg: "bg-[#4CBB17]" },
    { color: "Neon Green", bg: "bg-[#39FF14]" },
    { color: "Beige", bg: "bg-[#F5F5DC]" },
    { color: "Tan", bg: "bg-[#D2B48C]" },
    { color: "Brown", bg: "bg-[#8B4513]" },
    { color: "Chocolate", bg: "bg-[#7B3F00]" },
    { color: "Coffee", bg: "bg-[#4B3621]" },
    { color: "Ivory", bg: "bg-[#FFFFF0]" },
    { color: "Cream", bg: "bg-[#FFFDD0]" },
    { color: "Camel", bg: "bg-[#C19A6B]" },
    { color: "Burgundy", bg: "bg-[#800020]" },
    { color: "Maroon", bg: "bg-[#800000]" },
    { color: "Wine", bg: "bg-[#722F37]" },
    { color: "Red", bg: "bg-[#FF0000]" },
    { color: "Crimson", bg: "bg-[#DC143C]" },
    { color: "Scarlet", bg: "bg-[#FF2400]" },
    { color: "Rose", bg: "bg-[#FF007F]" },
    { color: "Pink", bg: "bg-[#FFC0CB]" },
    { color: "Hot Pink", bg: "bg-[#FF69B4]" },
    { color: "Magenta", bg: "bg-[#FF00FF]" },
    { color: "Fuchsia", bg: "bg-[#FF77FF]" },
    { color: "Purple", bg: "bg-[#800080]" },
    { color: "Violet", bg: "bg-[#8A2BE2]" },
    { color: "Lavender", bg: "bg-[#E6E6FA]" },
    { color: "Lilac", bg: "bg-[#C8A2C8]" },
    { color: "Indigo", bg: "bg-[#4B0082]" },
    { color: "Yellow", bg: "bg-[#FFFF00]" },
    { color: "Mustard", bg: "bg-[#FFDB58]" },
    { color: "Amber", bg: "bg-[#FFBF00]" },
    { color: "Gold", bg: "bg-[#FFD700]" },
    { color: "Bronze", bg: "bg-[#CD7F32]" },
    { color: "Orange", bg: "bg-[#FFA500]" },
    { color: "Coral", bg: "bg-[#FF7F50]" },
    { color: "Peach", bg: "bg-[#FFE5B4]" },
    { color: "Salmon", bg: "bg-[#FA8072]" },
    { color: "Rust", bg: "bg-[#B7410E]" },
    { color: "Copper", bg: "bg-[#B87333]" },
    { color: "Brick Red", bg: "bg-[#CB4154]" },
    { color: "Bordeaux", bg: "bg-[#5C0120]" },
    { color: "Plum", bg: "bg-[#8E4585]" },
    { color: "Slate Blue", bg: "bg-[#6A5ACD]" },
    { color: "Periwinkle", bg: "bg-[#CCCCFF]" },
    { color: "Off White", bg: "bg-[#FAF9F6]" },
    { color: "Sand", bg: "bg-[#C2B280]" },
    { color: "Khaki", bg: "bg-[#C3B091]" },
    { color: "Denim", bg: "bg-[#1560BD]" },
    { color: "Steel Blue", bg: "bg-[#4682B4]" },
    { color: "Graphite", bg: "bg-[#383838]" },
    { color: "Transparent", bg: "bg-transparent" }
];




// Google Product Catalogue
export const google_product_category = {
    "Apparel": {
        undergarments: "Apparel & Accessories > Clothing > Underwear & Socks",
        sleepwear: "Apparel & Accessories > Clothing > Sleepwear & Loungewear",
        traditional: "Apparel & Accessories > Clothing > Traditional & Ceremonial Clothing",
        sportswear: "Apparel & Accessories > Clothing > Activewear",
        formal: "Apparel & Accessories > Clothing > Suits",
        casual: "Apparel & Accessories > Clothing > Outfit Sets",
        outerwear: "Apparel & Accessories > Clothing > Outerwear",
    },
    "Jewelry": {
        necklaces: "Apparel & Accessories > Jewelry > Necklaces",
        pendants: "Apparel & Accessories > Jewelry > Charms & Pendants",
        rings: "Apparel & Accessories > Jewelry > Rings",
        bracelets: "Apparel & Accessories > Jewelry > Bracelets",
        earrings: "Apparel & Accessories > Jewelry > Earrings",
        watches: "Apparel & Accessories > Jewelry > Watches"
    },
    "Footwear-accessories": {
        polish: "Apparel & Accessories > Shoe Accessories",
        shiner: "Apparel & Accessories > Shoe Accessories",
        shoelaces: "Apparel & Accessories > Shoe Accessories > Shoelaces",
        insole: "Apparel & Accessories > Shoe Accessories",
        socks: "Apparel & Accessories > Clothing > Underwear & Socks",
    },
    "Barefoot": "Apparel & Accessories > Shoes",
    "Kickskraze": "Apparel & Accessories > Shoes",
    "Casual-footwear": "Apparel & Accessories > Shoes",
    "Formal-footwear": "Apparel & Accessories > Shoes",
    "SM-sandals": "Apparel & Accessories > Shoes",
    "Areeba-sandals": "Apparel & Accessories > Shoes",
}

export const getGoogleCategory = (storeName, type) => {
    const store = google_product_category[storeName];
    if (!store) return "";

    if (typeof store === "string") return store;
    return store[type] || "";
}




// Facebook Product Catalogue
const facebook_product_category = {
    "Apparel": {
        "unisex": {
            "undergarments": "clothing & accessories > clothing > underwear & socks",
            "sleepwear": "clothing & accessories > clothing > sleepwear",
            "traditional": "clothing & accessories > clothing > traditional & cultural clothing",
            "sportswear": "clothing & accessories > clothing > activewear",
            "formal": "clothing & accessories > clothing > outfits & sets",
            "casual": "clothing & accessories > clothing > tops",
            "outerwear": "clothing & accessories > clothing > coats & jackets"
        },
        "women": {
            "undergarments": "clothing & accessories > clothing > women's clothing > lingerie & sleepwear > lingerie",
            "sleepwear": "clothing & accessories > clothing > women's clothing > lingerie & sleepwear > sleepwear",
            "traditional": "clothing & accessories > clothing > women's clothing > traditional & cultural clothing",
            "sportswear": "clothing & accessories > clothing > women's clothing > activewear",
            "formal": "clothing & accessories > clothing > women's clothing > suits & blazers",
            "casual": "clothing & accessories > clothing > women's clothing > tops",
            "outerwear": "clothing & accessories > clothing > women's clothing > coats & jackets"
        },
        "men": {
            "undergarments": "clothing & accessories > clothing > men's clothing > underwear",
            "sleepwear": "clothing & accessories > clothing > men's clothing > sleepwear",
            "traditional": "clothing & accessories > clothing > men's clothing > traditional & cultural clothing",
            "sportswear": "clothing & accessories > clothing > men's clothing > activewear",
            "formal": "clothing & accessories > clothing > men's clothing > suits",
            "casual": "clothing & accessories > clothing > men's clothing > tops",
            "outerwear": "clothing & accessories > clothing > men's clothing > coats & jackets"
        },
        "kids": {
            "undergarments": "clothing & accessories > clothing > kids' clothing > underwear",
            "sleepwear": "clothing & accessories > clothing > kids' clothing > sleepwear",
            "traditional": "clothing & accessories > clothing > kids' clothing > traditional & cultural clothing",
            "sportswear": "clothing & accessories > clothing > kids' clothing > activewear",
            "formal": "clothing & accessories > clothing > kids' clothing > outfits & sets",
            "casual": "clothing & accessories > clothing > kids' clothing > tops",
            "outerwear": "clothing & accessories > clothing > kids' clothing > coats & jackets"
        },
        "kids-boys": {
            "undergarments": "clothing & accessories > clothing > kids' clothing > boys' clothing > underwear",
            "sleepwear": "clothing & accessories > clothing > kids' clothing > boys' clothing > sleepwear",
            "traditional": "clothing & accessories > clothing > kids' clothing > boys' clothing > traditional & cultural clothing",
            "sportswear": "clothing & accessories > clothing > kids' clothing > boys' clothing > activewear",
            "formal": "clothing & accessories > clothing > kids' clothing > boys' clothing > outfits & sets",
            "casual": "clothing & accessories > clothing > kids' clothing > boys' clothing > tops",
            "outerwear": "clothing & accessories > clothing > kids' clothing > boys' clothing > coats & jackets"
        },
        "kids-girls": {
            "undergarments": "clothing & accessories > clothing > kids' clothing > girls' clothing > underwear",
            "sleepwear": "clothing & accessories > clothing > kids' clothing > girls' clothing > sleepwear",
            "traditional": "clothing & accessories > clothing > kids' clothing > girls' clothing > traditional & cultural clothing",
            "sportswear": "clothing & accessories > clothing > kids' clothing > girls' clothing > activewear",
            "formal": "clothing & accessories > clothing > kids' clothing > girls' clothing > outfits & sets",
            "casual": "clothing & accessories > clothing > kids' clothing > girls' clothing > tops",
            "outerwear": "clothing & accessories > clothing > kids' clothing > girls' clothing > coats & jackets"
        }
    },
    "Jewelry": {
        unisex: {
            necklaces: "jewelry & watches > jewelry > necklaces",
            pendants: "jewelry & watches > jewelry > charms & pendants",
            rings: "jewelry & watches > jewelry > rings",
            bracelets: "jewelry & watches > jewelry > bracelets",
            earrings: "jewelry & watches > jewelry > earrings",
            watches: "jewelry & watches > watches",
        },
        men: {
            necklaces: "jewelry & watches > jewelry > necklaces",
            pendants: "jewelry & watches > jewelry > charms & pendants",
            rings: "jewelry & watches > jewelry > rings",
            bracelets: "jewelry & watches > jewelry > bracelets",
            earrings: "jewelry & watches > jewelry > earrings",
            watches: "jewelry & watches > watches > men's watches",
        },
        women: {
            necklaces: "jewelry & watches > jewelry > necklaces",
            pendants: "jewelry & watches > jewelry > charms & pendants",
            rings: "jewelry & watches > jewelry > rings",
            bracelets: "jewelry & watches > jewelry > bracelets",
            earrings: "jewelry & watches > jewelry > earrings",
            watches: "jewelry & watches > watches > women's watches",
        },
        kids: {
            necklaces: "jewelry & watches > jewelry > necklaces",
            pendants: "jewelry & watches > jewelry > charms & pendants",
            rings: "jewelry & watches > jewelry > rings",
            bracelets: "jewelry & watches > jewelry > bracelets",
            earrings: "jewelry & watches > jewelry > earrings",
            watches: "jewelry & watches > watches > kids' watches",
        },
        "kids-boys": {
            necklaces: "jewelry & watches > jewelry > necklaces",
            pendants: "jewelry & watches > jewelry > charms & pendants",
            rings: "jewelry & watches > jewelry > rings",
            bracelets: "jewelry & watches > jewelry > bracelets",
            earrings: "jewelry & watches > jewelry > earrings",
            watches: "jewelry & watches > watches > kids' watches",
        },
        "kids-girls": {
            necklaces: "jewelry & watches > jewelry > necklaces",
            pendants: "jewelry & watches > jewelry > charms & pendants",
            rings: "jewelry & watches > jewelry > rings",
            bracelets: "jewelry & watches > jewelry > bracelets",
            earrings: "jewelry & watches > jewelry > earrings",
            watches: "jewelry & watches > watches > kids' watches",
        },
    },
    "Footwear-accessories": {
        unisex: {
            polish: "clothing & accessories > shoes & footwear > shoe accessories",
            shiner: "clothing & accessories > shoes & footwear > shoe accessories",
            shoelaces: "clothing & accessories > shoes & footwear > shoe accessories > shoelaces",
            insole: "clothing & accessories > shoes & footwear > shoe accessories > insoles",
            socks: "clothing & accessories > clothing > underwear & socks",
        },
        men: {
            polish: "clothing & accessories > shoes & footwear > shoe accessories",
            shiner: "clothing & accessories > shoes & footwear > shoe accessories",
            shoelaces: "clothing & accessories > shoes & footwear > shoe accessories > shoelaces",
            insole: "clothing & accessories > shoes & footwear > shoe accessories > insoles",
            socks: "clothing & accessories > clothing > underwear & socks",
        },
        women: {
            polish: "clothing & accessories > shoes & footwear > shoe accessories",
            shiner: "clothing & accessories > shoes & footwear > shoe accessories",
            shoelaces: "clothing & accessories > shoes & footwear > shoe accessories > shoelaces",
            insole: "clothing & accessories > shoes & footwear > shoe accessories > insoles",
            socks: "clothing & accessories > clothing > underwear & socks",
        },
        kids: {
            polish: "clothing & accessories > shoes & footwear > shoe accessories",
            shiner: "clothing & accessories > shoes & footwear > shoe accessories",
            shoelaces: "clothing & accessories > shoes & footwear > shoe accessories > shoelaces",
            insole: "clothing & accessories > shoes & footwear > shoe accessories > insoles",
            socks: "clothing & accessories > clothing > underwear & socks",
        },
        "kids-boys": {
            polish: "clothing & accessories > shoes & footwear > shoe accessories",
            shiner: "clothing & accessories > shoes & footwear > shoe accessories",
            shoelaces: "clothing & accessories > shoes & footwear > shoe accessories > shoelaces",
            insole: "clothing & accessories > shoes & footwear > shoe accessories > insoles",
            socks: "clothing & accessories > clothing > underwear & socks",
        },
        "kids-girls": {
            polish: "clothing & accessories > shoes & footwear > shoe accessories",
            shiner: "clothing & accessories > shoes & footwear > shoe accessories",
            shoelaces: "clothing & accessories > shoes & footwear > shoe accessories > shoelaces",
            insole: "clothing & accessories > shoes & footwear > shoe accessories > insoles",
            socks: "clothing & accessories > clothing > underwear & socks",
        },
    },
    "Barefoot": {
        unisex: "clothing & accessories > shoes & footwear",
        men: "clothing & accessories > shoes & footwear > men's shoes > fashion sneakers",
        women: "clothing & accessories > shoes & footwear > women's shoes > fashion sneakers",
        kids: "clothing & accessories > shoes & footwear > kids' shoes",
        "kids-boys": "clothing & accessories > shoes & footwear > kids' shoes > boys' baby shoes",
        "kids-girls": "clothing & accessories > shoes & footwear > kids' shoes > girls' baby shoes",
    },
    "Kickskraze": {
        unisex: "clothing & accessories > shoes & footwear",
        men: "clothing & accessories > shoes & footwear > men's shoes > athletic sneakers; clothing & accessories > shoes & footwear > men's shoes > fashion sneakers",
        women: "clothing & accessories > shoes & footwear > women's shoes > athletic sneakers; clothing & accessories > shoes & footwear > women's shoes > fashion sneakers",
        kids: "clothing & accessories > shoes & footwear > kids' shoes",
        "kids-boys": "clothing & accessories > shoes & footwear > kids' shoes > boys' baby shoes",
        "kids-girls": "clothing & accessories > shoes & footwear > kids' shoes > girls' baby shoes",
    },
    "Casual-footwear": {
        unisex: "clothing & accessories > shoes & footwear",
        men: "clothing & accessories > shoes & footwear > men's shoes > slippers",
        women: "clothing & accessories > shoes & footwear > women's shoes > slippers",
        kids: "clothing & accessories > shoes & footwear > kids' shoes",
        "kids-boys": "clothing & accessories > shoes & footwear > kids' shoes > boys' baby shoes",
        "kids-girls": "clothing & accessories > shoes & footwear > kids' shoes > girls' baby shoes",
    },
    "Formal-footwear": {
        unisex: "clothing & accessories > shoes & footwear",
        men: "clothing & accessories > shoes & footwear > men's shoes > casual & dress shoes",
        women: "clothing & accessories > shoes & footwear > women's shoes > heels; clothing & accessories > shoes & footwear > women's shoes > flats",
        kids: "clothing & accessories > shoes & footwear > kids' shoes",
        "kids-boys": "clothing & accessories > shoes & footwear > kids' shoes > boys' baby shoes",
        "kids-girls": "clothing & accessories > shoes & footwear > kids' shoes > girls' baby shoes",
    },
    "SM-sandals": {
        "unisex": {
            "sandals": "clothing & accessories > shoes & footwear",
            "flats": "clothing & accessories > shoes & footwear",
            "heels": "clothing & accessories > shoes & footwear"
        },
        "men": {
            "sandals": "clothing & accessories > shoes & footwear > men's shoes > sandals",
            "flats": "clothing & accessories > shoes & footwear > men's shoes > sandals",
            "heels": "clothing & accessories > shoes & footwear > men's shoes > sandals"
        },
        "women": {
            "sandals": "clothing & accessories > shoes & footwear > women's shoes > sandals",
            "flats": "clothing & accessories > shoes & footwear > women's shoes > flats",
            "heels": "clothing & accessories > shoes & footwear > women's shoes > heels"
        },
        "kids": {
            "sandals": "clothing & accessories > shoes & footwear > kids' shoes",
            "flats": "clothing & accessories > shoes & footwear > kids' shoes",
            "heels": "clothing & accessories > shoes & footwear > kids' shoes"
        },
        "kids-boys": {
            "sandals": "clothing & accessories > shoes & footwear > kids' shoes > boys' baby shoes",
            "flats": "clothing & accessories > shoes & footwear > kids' shoes > boys' baby shoes",
            "heels": "clothing & accessories > shoes & footwear > kids' shoes > boys' baby shoes"
        },
        "kids-girls": {
            "sandals": "clothing & accessories > shoes & footwear > kids' shoes > girls' baby shoes",
            "flats": "clothing & accessories > shoes & footwear > kids' shoes > girls' baby shoes",
            "heels": "clothing & accessories > shoes & footwear > kids' shoes > girls' baby shoes"
        }
    },
    "Areeba-sandals": {
        "unisex": {
            "sandals": "clothing & accessories > shoes & footwear",
            "flats": "clothing & accessories > shoes & footwear",
            "heels": "clothing & accessories > shoes & footwear"
        },
        "men": {
            "sandals": "clothing & accessories > shoes & footwear > men's shoes > sandals",
            "flats": "clothing & accessories > shoes & footwear > men's shoes > sandals",
            "heels": "clothing & accessories > shoes & footwear > men's shoes > sandals"
        },
        "women": {
            "sandals": "clothing & accessories > shoes & footwear > women's shoes > sandals",
            "flats": "clothing & accessories > shoes & footwear > women's shoes > flats",
            "heels": "clothing & accessories > shoes & footwear > women's shoes > heels"
        },
        "kids": {
            "sandals": "clothing & accessories > shoes & footwear > kids' shoes",
            "flats": "clothing & accessories > shoes & footwear > kids' shoes",
            "heels": "clothing & accessories > shoes & footwear > kids' shoes"
        },
        "kids-boys": {
            "sandals": "clothing & accessories > shoes & footwear > kids' shoes > boys' baby shoes",
            "flats": "clothing & accessories > shoes & footwear > kids' shoes > boys' baby shoes",
            "heels": "clothing & accessories > shoes & footwear > kids' shoes > boys' baby shoes"
        },
        "kids-girls": {
            "sandals": "clothing & accessories > shoes & footwear > kids' shoes > girls' baby shoes",
            "flats": "clothing & accessories > shoes & footwear > kids' shoes > girls' baby shoes",
            "heels": "clothing & accessories > shoes & footwear > kids' shoes > girls' baby shoes"
        }
    },

};

export const getFacebookCategory = (storeName, category, type) => {
    const store = facebook_product_category[storeName];
    if (!store) return "";

    // Case 1: direct string (rare but possible)
    if (typeof store[category] === "string") {
        return store[category];
    }

    // Case 2: nested gender object
    const categoryObj = store[category];
    if (!categoryObj) return "";

    // Case 3: inner property (like “sandals”, “flats”, “heels”)
    if (typeof categoryObj[type] === "string") {
        return categoryObj[type];
    }

    // Default fallback
    return "";
}
