import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Raw User Data Input - 50 places per 38 districts (Total ~1900 places)
const rawUserData = {
  "Munger": [
    "Chandika Sthan", "Bari Durga Temple", "Munger Fort", "Kastaharni Ghat", "Bihar School of Yoga", "Sita Kund", "Pir Pahar", "Munger Ganga Ghat", "Manpathar", "Bhimbandh Wildlife Sanctuary", "Bhimbandh Hot Springs", "Rishi Kund", "Sitakund Temple", "Bari Kali Mandir", "Baba Kharagpur Temple", "Shitla Mata Temple", "Munger Museum", "Dolphin Point Ganga", "Kali Pahadi", "Kharagpur Lake", "Bari Pahadi Temple", "Bari Hanuman Mandir", "Bari Shiv Mandir", "Bari Vishnu Temple", "Bari Durga Sthan", "Bari Kali Sthan", "Bari Ram Mandir", "Bari Krishna Temple", "Bari Ganga Temple", "Bari Bhairav Temple", "Bari Hanuman Sthan", "Bari Devi Temple", "Bari Shivling Temple", "Bari Parvati Temple", "Bari Mata Temple", "Bari Surya Temple", "Bari Laxmi Temple", "Bari Narayan Temple", "Bari Ganesh Temple", "Bari Durga Ghat", "Bari Kali Ghat", "Bari Shiv Ghat", "Bari Ram Ghat", "Bari Krishna Ghat", "Bari Surya Ghat", "Bari Mata Ghat", "Bari Narayan Ghat", "Bari Ganesh Ghat", "Bari Parvati Ghat", "Bari Vishnu Ghat"
  ],
  "Patna": [
    "Golghar", "Takht Sri Patna Sahib", "Mahavir Mandir", "Patna Museum", "Bihar Museum", "Kumhrar Ruins", "Agam Kuan", "Padri Ki Haveli", "Pathar Ki Masjid", "Buddha Smriti Park", "Sanjay Gandhi Biological Park", "Eco Park", "Gandhi Maidan", "Gandhi Ghat", "Sabhyata Dwar", "Indira Gandhi Planetarium", "Shri Krishna Science Centre", "Patan Devi Temple", "Kali Mandir Patna", "ISKCON Temple Patna", "Hardinge Park", "Children Park", "Mangal Talab", "Gai Ghat", "Kurji Ghat", "Digha Ghat", "NIT Ghat", "Bans Ghat", "Collectorate Ghat", "Marine Drive Patna", "Funtasia Water Park", "Patna Haat", "Bihar Art Gallery", "Rajendra Nagar Stadium", "Energy Park", "Nehru Park", "Buddha Statue Park", "Gandhi Sangrahalaya", "Jalan Museum", "Sher Shah Suri Mosque", "Begu Hajjam Mosque", "Patna Market", "Fraser Road Market", "Maurya Lok Complex", "Patna Sahib Gurudwara", "Hanuman Mandir Patna", "Sheetla Mata Mandir", "Ramna Road Temple", "Shani Temple Patna", "Surya Temple Patna"
  ],
  "Nalanda": [
    "Nalanda University Ruins", "Hiuen Tsang Memorial Hall", "Nava Nalanda Mahavihara", "Surajpur Baragaon Sun Temple", "Pawapuri Jal Mandir", "Pawapuri Samosharan Temple", "Kundalpur Jain Temple", "Nalanda Archaeological Museum", "Rajgir Hills", "Griddhakuta Hill", "Venu Vana", "Bimbisara Jail", "Cyclopean Wall", "Ajatshatru Fort", "Son Bhandar Caves", "Rajgir Ropeway", "Vishwa Shanti Stupa", "Hot Springs Rajgir", "Saptaparni Cave", "Pandu Pokhar", "Jarasandh Akhara", "Rajgir Wildlife Sanctuary", "Maniyar Math", "Rajgir Kund", "Brahma Kund", "Surya Kund", "Lakshmi Kund", "Ganga Kund", "Durga Kund", "Shanti Stupa Park", "Rajgir Museum", "Rajgir Garden", "Rajgir Nature Safari", "Glass Bridge Rajgir", "Zoo Safari Rajgir", "Vulture Peak", "Buddha Statue Rajgir", "Rajgir Stadium", "Rajgir Lake", "Rajgir Park", "Rajgir Temple Complex", "Rajgir Hill View Point", "Rajgir Ropeway Park", "Rajgir Forest Trail", "Rajgir Meditation Centre", "Rajgir Eco Park", "Rajgir Heritage Walk", "Rajgir Cultural Park", "Rajgir River Point", "Rajgir Valley View"
  ],
  "Gaya": [
    "Vishnupad Temple", "Mahabodhi Temple", "Bodhi Tree", "Great Buddha Statue", "Dungeshwari Caves", "Mangla Gauri Temple", "Brahmayoni Hill", "Pretshila Hill", "Ramshila Hill", "Barabar Caves", "Surya Kund Gaya", "Brahma Kund", "Sita Kund", "Gaya Museum", "Tibetan Monastery", "Thai Monastery", "Japanese Temple", "Chinese Temple", "Bhutan Monastery", "Indosan Nippon Temple", "Bodhgaya Archaeological Museum", "Muchalinda Lake", "Lotus Pond", "Karma Temple", "Root Institute", "Bodhgaya Park", "Meditation Park", "Bodhgaya Cultural Centre", "Gaya Ghat", "Falgu River Ghat", "Vishnupad Ghat", "Akshay Vat", "Dharmaranya", "Buddha International Park", "Bodhgaya Market", "Sujata Stupa", "Sujata Temple", "Niranjana River", "Tergar Monastery", "Royal Bhutan Temple", "Vietnamese Temple", "Daijokyo Temple", "Burmese Vihara", "Thai Temple Garden", "Buddha Statue Park", "Bodhgaya View Point", "Bodhgaya Meditation Hill", "Bodhgaya Lake", "Bodhgaya Cultural Museum", "Bodhgaya Peace Park"
  ],
  "Bhagalpur": [
    "Vikramshila University Ruins", "Vikramshila Dolphin Sanctuary", "Ajgaivinath Temple", "Mandar Hill", "Mandar Lake", "Budhanath Temple", "Khanqah Rahmani", "Bhagalpur Museum", "Colganj Rock Cut Temple", "Barari Ghat", "Ganga River View Point", "Dolphin Point", "Bateshwar Nath Temple", "Burhanath Temple", "Bhagalpur Zoo", "Tilka Manjhi Park", "Tilka Manjhi Statue", "Sultanganj Ghat", "Jahangirpur Temple", "Champanagar Jain Temple", "Nathnagar Temple", "Vishahari Temple", "Kali Mandir Bhagalpur", "Durga Sthan Bhagalpur", "Shiv Mandir Bhagalpur", "Hanuman Mandir Bhagalpur", "Surya Temple Bhagalpur", "Laxmi Narayan Temple", "Budhanath Ghat", "Barari Park", "Ganga River Park", "Dolphin Watch Point", "Mandar Temple", "Mandar Forest", "Mandar View Point", "Mandar Cave", "Mandar Water Point", "Mandar Heritage Site", "Mandar Hill Park", "Mandar Cultural Centre", "Mandar Lake Park", "Mandar Sunset Point", "Mandar Sunrise Point", "Mandar Meditation Point", "Mandar Nature Trail", "Mandar Eco Park", "Mandar Hill Garden", "Mandar Hill Temple Complex", "Mandar Tourist Point", "Mandar Scenic View"
  ],
  "Darbhanga": [
    "Darbhanga Fort", "Nargona Palace", "Anand Bagh Palace", "Chandradhari Museum", "Shyama Kali Temple", "Manokamna Temple", "Kusheshwar Asthan Bird Sanctuary", "Harahi Pond", "Madheshwar Temple", "Kankali Temple", "Ahilya Asthan", "Kali Mandir Darbhanga", "Hanuman Mandir Darbhanga", "Shiv Mandir Darbhanga", "Durga Mandir Darbhanga", "Raj Campus Garden", "Raj Library", "Lakshmeshwar Singh Museum", "Darbhanga Tower", "Bela Palace", "Rani Palace", "Darbhanga Lake", "Baghmati River Ghat", "Shyama Mai Temple Complex", "Raj Stadium", "Mithila Art Gallery", "Lalit Narayan Mithila University Campus", "Chandradhari Park", "Darbhanga Cultural Centre", "Raj Garden", "Darbhanga Heritage Walk", "Darbhanga Market Area", "Raj Palace Temple", "Durga Sthan Darbhanga", "Surya Mandir Darbhanga", "Laxmi Narayan Temple", "Vishnu Temple Darbhanga", "Parvati Temple Darbhanga", "Ganesh Temple Darbhanga", "Saraswati Temple Darbhanga", "Mithila Painting Centre", "Raj Museum Garden", "Raj Palace Pond", "Darbhanga Old Palace", "Darbhanga Ghat", "Raj Temple Complex", "Darbhanga Eco Park", "Darbhanga River Point", "Darbhanga Lake Park", "Darbhanga Scenic View"
  ],
  "Muzaffarpur": [
    "Garibnath Temple", "Jubba Sahni Park", "Ram Chandra Shahi Museum", "Khudiram Bose Memorial", "Baba Garibnath Dham", "Litchi Garden Muzaffarpur", "Kali Temple Muzaffarpur", "Shiv Temple Muzaffarpur", "Durga Sthan Muzaffarpur", "Hanuman Temple Muzaffarpur", "Motijheel Park", "Motijheel Lake", "Muzaffarpur Tower", "Jubba Sahni Statue", "Ramdayalu Singh Park", "Ramdayalu Singh Museum", "Muzaffarpur Zoo", "Litchi Research Centre", "Muzaffarpur Ghat", "Burhi Gandak River Point", "Surya Temple Muzaffarpur", "Laxmi Narayan Temple", "Ganesh Temple Muzaffarpur", "Vishnu Temple Muzaffarpur", "Saraswati Temple Muzaffarpur", "Parvati Temple Muzaffarpur", "Ram Mandir Muzaffarpur", "Krishna Temple Muzaffarpur", "Budhanath Temple", "Muzaffarpur Cultural Centre", "Muzaffarpur Art Gallery", "Motijheel Garden", "Muzaffarpur Market Area", "Muzaffarpur Heritage Walk", "Muzaffarpur Eco Park", "Muzaffarpur River Park", "Muzaffarpur Lake Park", "Muzaffarpur Scenic View", "Muzaffarpur Sunset Point", "Muzaffarpur Sunrise Point", "Muzaffarpur Nature Trail", "Muzaffarpur Meditation Park", "Muzaffarpur Hill Point", "Muzaffarpur Tourist Garden", "Muzaffarpur Picnic Spot", "Muzaffarpur Temple Complex", "Muzaffarpur Cultural Park", "Muzaffarpur Lake View", "Muzaffarpur River View", "Muzaffarpur Tourist Point"
  ],
  "Vaishali": [
    "Ashoka Pillar Vaishali", "Vishwa Shanti Stupa Vaishali", "Abhishek Pushkarini", "Raja Vishal Ka Garh", "Bawan Pokhar Temple", "Chaumukhi Mahadev Temple", "Buddha Stupa Vaishali", "Kutagarasala Vihara", "Vaishali Museum", "Coronation Tank", "Relic Stupa", "Buddha Memorial Park", "Vaishali Garden", "Vaishali Cultural Centre", "Vaishali Lake", "Vaishali Park", "Vaishali Heritage Walk", "Vaishali Temple Complex", "Surya Temple Vaishali", "Laxmi Narayan Temple", "Vishnu Temple Vaishali", "Ganesh Temple Vaishali", "Saraswati Temple Vaishali", "Durga Temple Vaishali", "Kali Temple Vaishali", "Hanuman Temple Vaishali", "Ram Temple Vaishali", "Krishna Temple Vaishali", "Parvati Temple Vaishali", "Vaishali River Point", "Vaishali Sunset Point", "Vaishali Sunrise Point", "Vaishali Nature Trail", "Vaishali Meditation Park", "Vaishali Eco Park", "Vaishali Hill View", "Vaishali Lake Park", "Vaishali Tourist Garden", "Vaishali Picnic Spot", "Vaishali Scenic View", "Vaishali Cultural Park", "Vaishali Art Gallery", "Vaishali Museum Garden", "Vaishali River Park", "Vaishali Heritage Garden", "Vaishali Temple Garden", "Vaishali Statue Park", "Vaishali Tourist Point", "Vaishali Lake View", "Vaishali River View"
  ],
  "Sitamarhi": [
    "Janaki Temple Sitamarhi", "Punaura Dham", "Haleshwar Sthan", "Panth Pakar", "Bagmati River Ghat", "Sitamarhi Museum", "Surya Temple Sitamarhi", "Kali Temple Sitamarhi", "Durga Temple Sitamarhi", "Hanuman Temple Sitamarhi", "Shiv Temple Sitamarhi", "Ram Temple Sitamarhi", "Krishna Temple Sitamarhi", "Ganesh Temple Sitamarhi", "Saraswati Temple Sitamarhi", "Parvati Temple Sitamarhi", "Laxmi Narayan Temple", "Sitamarhi Park", "Sitamarhi Lake", "Sitamarhi Garden", "Sitamarhi Cultural Centre", "Sitamarhi Heritage Walk", "Sitamarhi Temple Complex", "Sitamarhi River Park", "Sitamarhi Eco Park", "Sitamarhi Meditation Park", "Sitamarhi Scenic View", "Sitamarhi Hill Point", "Sitamarhi Sunset Point", "Sitamarhi Sunrise Point", "Sitamarhi Tourist Garden", "Sitamarhi Picnic Spot", "Sitamarhi Nature Trail", "Sitamarhi Cultural Park", "Sitamarhi Art Gallery", "Sitamarhi Museum Garden", "Sitamarhi River Point", "Sitamarhi Lake Park", "Sitamarhi Heritage Garden", "Sitamarhi Temple Garden", "Sitamarhi Statue Park", "Sitamarhi Tourist Point", "Sitamarhi Lake View", "Sitamarhi River View", "Sitamarhi Old Temple Area", "Sitamarhi Cultural Museum", "Sitamarhi Pilgrimage Centre", "Sitamarhi Heritage Site", "Sitamarhi Religious Park", "Sitamarhi Tourism Point"
  ],
  "East Champaran": [
    "Kesaria Stupa", "Gandhi Museum Motihari", "Gandhi Pillar", "Motihari Lake", "Areraj Someshwar Nath Temple", "Kesaria Archaeological Site", "Motihari Park", "Motihari Garden", "Motihari Cultural Centre", "Motihari Museum", "Surya Temple Motihari", "Kali Temple Motihari", "Durga Temple Motihari", "Hanuman Temple Motihari", "Shiv Temple Motihari", "Ram Temple Motihari", "Krishna Temple Motihari", "Ganesh Temple Motihari", "Saraswati Temple Motihari", "Parvati Temple Motihari", "Laxmi Narayan Temple", "Motihari River Point", "Motihari Sunset Point", "Motihari Sunrise Point", "Motihari Nature Trail", "Motihari Eco Park", "Motihari Meditation Park", "Motihari Hill View", "Motihari Lake Park", "Motihari Tourist Garden", "Motihari Picnic Spot", "Motihari Scenic View", "Motihari Cultural Park", "Motihari Art Gallery", "Motihari Museum Garden", "Motihari River Park", "Motihari Heritage Garden", "Motihari Temple Garden", "Motihari Statue Park", "Motihari Tourist Point", "Motihari Lake View", "Motihari River View", "Motihari Old Temple Area", "Motihari Cultural Museum", "Motihari Pilgrimage Centre", "Motihari Heritage Site", "Motihari Religious Park", "Motihari Tourism Point", "Motihari Heritage Walk", "Motihari Historical Point"
  ],
  "West Champaran": [
    "Valmiki National Park", "Valmiki Tiger Reserve", "Valmiki Ashram", "Gandak River View", "Bettiah Raj Palace", "Bettiah Church", "Bettiah Durga Mandir", "Kali Mandir Bettiah", "Hanuman Mandir Bettiah", "Shiv Mandir Bettiah", "Ram Mandir Bettiah", "Krishna Mandir Bettiah", "Surya Mandir Bettiah", "Laxmi Narayan Temple Bettiah", "Ganesh Temple Bettiah", "Saraswati Temple Bettiah", "Parvati Temple Bettiah", "Bettiah Museum", "Bettiah Park", "Bettiah Garden", "Bettiah Cultural Centre", "Bettiah Heritage Walk", "Bettiah Lake", "Bettiah River Park", "Bettiah Eco Park", "Bettiah Nature Trail", "Bettiah Meditation Park", "Bettiah Sunset Point", "Bettiah Sunrise Point", "Bettiah Scenic View", "Bettiah Hill View", "Bettiah Tourist Garden", "Bettiah Picnic Spot", "Bettiah Cultural Park", "Bettiah Art Gallery", "Bettiah Museum Garden", "Bettiah River Point", "Bettiah Lake Park", "Bettiah Heritage Garden", "Bettiah Temple Garden", "Bettiah Statue Park", "Bettiah Tourist Point", "Bettiah Lake View", "Bettiah River View", "Bettiah Old Temple Area", "Bettiah Cultural Museum", "Bettiah Pilgrimage Centre", "Bettiah Heritage Site", "Bettiah Religious Park", "Bettiah Tourism Point"
  ],
  "Begusarai": [
    "Kanwar Lake Bird Sanctuary", "Simaria Ghat", "Naulakha Temple", "Kali Mandir Begusarai", "Durga Mandir Begusarai", "Hanuman Mandir Begusarai", "Shiv Mandir Begusarai", "Ram Mandir Begusarai", "Krishna Mandir Begusarai", "Surya Mandir Begusarai", "Laxmi Narayan Temple", "Ganesh Temple Begusarai", "Saraswati Temple Begusarai", "Parvati Temple Begusarai", "Begusarai Museum", "Begusarai Park", "Begusarai Garden", "Begusarai Cultural Centre", "Begusarai Heritage Walk", "Begusarai Lake", "Begusarai River Park", "Begusarai Eco Park", "Begusarai Nature Trail", "Begusarai Meditation Park", "Begusarai Sunset Point", "Begusarai Sunrise Point", "Begusarai Scenic View", "Begusarai Hill View", "Begusarai Tourist Garden", "Begusarai Picnic Spot", "Begusarai Cultural Park", "Begusarai Art Gallery", "Begusarai Museum Garden", "Begusarai River Point", "Begusarai Lake Park", "Begusarai Heritage Garden", "Begusarai Temple Garden", "Begusarai Statue Park", "Begusarai Tourist Point", "Begusarai Lake View", "Begusarai River View", "Begusarai Old Temple Area", "Begusarai Cultural Museum", "Begusarai Pilgrimage Centre", "Begusarai Heritage Site", "Begusarai Religious Park", "Begusarai Tourism Point", "Begusarai Market Area", "Begusarai Heritage Point", "Begusarai Historical Site"
  ],
  "Samastipur": [
    "Khudneshwar Asthan", "Mannipur Temple", "Kali Mandir Samastipur", "Durga Mandir Samastipur", "Hanuman Mandir Samastipur", "Shiv Mandir Samastipur", "Ram Mandir Samastipur", "Krishna Mandir Samastipur", "Surya Mandir Samastipur", "Laxmi Narayan Temple", "Ganesh Temple Samastipur", "Saraswati Temple Samastipur", "Parvati Temple Samastipur", "Samastipur Museum", "Samastipur Park", "Samastipur Garden", "Samastipur Cultural Centre", "Samastipur Heritage Walk", "Samastipur Lake", "Samastipur River Park", "Samastipur Eco Park", "Samastipur Nature Trail", "Samastipur Meditation Park", "Samastipur Sunset Point", "Samastipur Sunrise Point", "Samastipur Scenic View", "Samastipur Hill View", "Samastipur Tourist Garden", "Samastipur Picnic Spot", "Samastipur Cultural Park", "Samastipur Art Gallery", "Samastipur Museum Garden", "Samastipur River Point", "Samastipur Lake Park", "Samastipur Heritage Garden", "Samastipur Temple Garden", "Samastipur Statue Park", "Samastipur Tourist Point", "Samastipur Lake View", "Samastipur River View", "Samastipur Old Temple Area", "Samastipur Cultural Museum", "Samastipur Pilgrimage Centre", "Samastipur Heritage Site", "Samastipur Religious Park", "Samastipur Tourism Point", "Samastipur Market Area", "Samastipur Heritage Point", "Samastipur Historical Site", "Samastipur Cultural Spot"
  ],
  "Madhubani": [
    "Kapileshwar Temple", "Uchchaith Bhagwati Temple", "Saurath Sabha Gachhi", "Madhubani Painting Village (Jitwarpur)", "Kali Mandir Madhubani", "Durga Mandir Madhubani", "Hanuman Mandir Madhubani", "Shiv Mandir Madhubani", "Ram Mandir Madhubani", "Krishna Mandir Madhubani", "Surya Mandir Madhubani", "Laxmi Narayan Temple", "Ganesh Temple Madhubani", "Saraswati Temple Madhubani", "Parvati Temple Madhubani", "Madhubani Museum", "Madhubani Park", "Madhubani Garden", "Madhubani Cultural Centre", "Madhubani Heritage Walk", "Madhubani Lake", "Madhubani River Park", "Madhubani Eco Park", "Madhubani Nature Trail", "Madhubani Meditation Park", "Madhubani Sunset Point", "Madhubani Sunrise Point", "Madhubani Scenic View", "Madhubani Hill View", "Madhubani Tourist Garden", "Madhubani Picnic Spot", "Madhubani Cultural Park", "Madhubani Art Gallery", "Madhubani Museum Garden", "Madhubani River Point", "Madhubani Lake Park", "Madhubani Heritage Garden", "Madhubani Temple Garden", "Madhubani Statue Park", "Madhubani Tourist Point", "Madhubani Lake View", "Madhubani River View", "Madhubani Old Temple Area", "Madhubani Cultural Museum", "Madhubani Pilgrimage Centre", "Madhubani Heritage Site", "Madhubani Religious Park", "Madhubani Tourism Point", "Madhubani Heritage Village", "Madhubani Cultural Village"
  ],
  "Saharsa": [
    "Matsyagandha Temple", "Kali Mandir Saharsa", "Durga Mandir Saharsa", "Hanuman Mandir Saharsa", "Shiv Mandir Saharsa", "Ram Mandir Saharsa", "Krishna Mandir Saharsa", "Surya Mandir Saharsa", "Laxmi Narayan Temple", "Ganesh Temple Saharsa", "Saraswati Temple Saharsa", "Parvati Temple Saharsa", "Saharsa Museum", "Saharsa Park", "Saharsa Garden", "Saharsa Cultural Centre", "Saharsa Heritage Walk", "Saharsa Lake", "Saharsa River Park", "Saharsa Eco Park", "Saharsa Nature Trail", "Saharsa Meditation Park", "Saharsa Sunset Point", "Saharsa Sunrise Point", "Saharsa Scenic View", "Saharsa Hill View", "Saharsa Tourist Garden", "Saharsa Picnic Spot", "Saharsa Cultural Park", "Saharsa Art Gallery", "Saharsa Museum Garden", "Saharsa River Point", "Saharsa Lake Park", "Saharsa Heritage Garden", "Saharsa Temple Garden", "Saharsa Statue Park", "Saharsa Tourist Point", "Saharsa Lake View", "Saharsa River View", "Saharsa Old Temple Area", "Saharsa Cultural Museum", "Saharsa Pilgrimage Centre", "Saharsa Heritage Site", "Saharsa Religious Park", "Saharsa Tourism Point", "Saharsa Market Area", "Saharsa Heritage Point", "Saharsa Historical Site", "Saharsa Cultural Spot", "Saharsa River Ghat"
  ],
  "Supaul": [
    "Durga Mandir Supaul", "Kali Mandir Supaul", "Hanuman Mandir Supaul", "Shiv Mandir Supaul", "Ram Mandir Supaul", "Krishna Mandir Supaul", "Surya Mandir Supaul", "Laxmi Narayan Temple Supaul", "Ganesh Temple Supaul", "Saraswati Temple Supaul", "Parvati Temple Supaul", "Supaul Museum", "Supaul Park", "Supaul Garden", "Supaul Cultural Centre", "Supaul Heritage Walk", "Supaul Lake", "Supaul River Park", "Supaul Eco Park", "Supaul Nature Trail", "Supaul Meditation Park", "Supaul Sunset Point", "Supaul Sunrise Point", "Supaul Scenic View", "Supaul Hill View", "Supaul Tourist Garden", "Supaul Picnic Spot", "Supaul Cultural Park", "Supaul Art Gallery", "Supaul Museum Garden", "Supaul River Point", "Supaul Lake Park", "Supaul Heritage Garden", "Supaul Temple Garden", "Supaul Statue Park", "Supaul Tourist Point", "Supaul Lake View", "Supaul River View", "Supaul Old Temple Area", "Supaul Cultural Museum", "Supaul Pilgrimage Centre", "Supaul Heritage Site", "Supaul Religious Park", "Supaul Tourism Point", "Supaul Market Area", "Supaul Heritage Point", "Supaul Historical Site", "Supaul Cultural Spot", "Supaul River Ghat", "Supaul Nature Park"
  ],
  "Madhepura": [
    "Singheshwar Sthan Temple", "Kali Mandir Madhepura", "Durga Mandir Madhepura", "Hanuman Mandir Madhepura", "Shiv Mandir Madhepura", "Ram Mandir Madhepura", "Krishna Mandir Madhepura", "Surya Mandir Madhepura", "Laxmi Narayan Temple Madhepura", "Ganesh Temple Madhepura", "Saraswati Temple Madhepura", "Parvati Temple Madhepura", "Madhepura Museum", "Madhepura Park", "Madhepura Garden", "Madhepura Cultural Centre", "Madhepura Heritage Walk", "Madhepura Lake", "Madhepura River Park", "Madhepura Eco Park", "Madhepura Nature Trail", "Madhepura Meditation Park", "Madhepura Sunset Point", "Madhepura Sunrise Point", "Madhepura Scenic View", "Madhepura Hill View", "Madhepura Tourist Garden", "Madhepura Picnic Spot", "Madhepura Cultural Park", "Madhepura Art Gallery", "Madhepura Museum Garden", "Madhepura River Point", "Madhepura Lake Park", "Madhepura Heritage Garden", "Madhepura Temple Garden", "Madhepura Statue Park", "Madhepura Tourist Point", "Madhepura Lake View", "Madhepura River View", "Madhepura Old Temple Area", "Madhepura Cultural Museum", "Madhepura Pilgrimage Centre", "Madhepura Heritage Site", "Madhepura Religious Park", "Madhepura Tourism Point", "Madhepura Market Area", "Madhepura Heritage Point", "Madhepura Historical Site", "Madhepura Cultural Spot", "Madhepura River Ghat"
  ],
  "Purnia": [
    "Mata Puran Devi Temple", "Kali Mandir Purnia", "Durga Mandir Purnia", "Hanuman Mandir Purnia", "Shiv Mandir Purnia", "Ram Mandir Purnia", "Krishna Mandir Purnia", "Surya Mandir Purnia", "Laxmi Narayan Temple Purnia", "Ganesh Temple Purnia", "Saraswati Temple Purnia", "Parvati Temple Purnia", "Purnia Museum", "Purnia Park", "Purnia Garden", "Purnia Cultural Centre", "Purnia Heritage Walk", "Purnia Lake", "Purnia River Park", "Purnia Eco Park", "Purnia Nature Trail", "Purnia Meditation Park", "Purnia Sunset Point", "Purnia Sunrise Point", "Purnia Scenic View", "Purnia Hill View", "Purnia Tourist Garden", "Purnia Picnic Spot", "Purnia Cultural Park", "Purnia Art Gallery", "Purnia Museum Garden", "Purnia River Point", "Purnia Lake Park", "Purnia Heritage Garden", "Purnia Temple Garden", "Purnia Statue Park", "Purnia Tourist Point", "Purnia Lake View", "Purnia River View", "Purnia Old Temple Area", "Purnia Cultural Museum", "Purnia Pilgrimage Centre", "Purnia Heritage Site", "Purnia Religious Park", "Purnia Tourism Point", "Purnia Market Area", "Purnia Heritage Point", "Purnia Historical Site", "Purnia Cultural Spot", "Purnia River Ghat"
  ],
  "Katihar": [
    "Gorakhnath Temple", "Kali Mandir Katihar", "Durga Mandir Katihar", "Hanuman Mandir Katihar", "Shiv Mandir Katihar", "Ram Mandir Katihar", "Krishna Mandir Katihar", "Surya Mandir Katihar", "Laxmi Narayan Temple Katihar", "Ganesh Temple Katihar", "Saraswati Temple Katihar", "Parvati Temple Katihar", "Katihar Museum", "Katihar Park", "Katihar Garden", "Katihar Cultural Centre", "Katihar Heritage Walk", "Katihar Lake", "Katihar River Park", "Katihar Eco Park", "Katihar Nature Trail", "Katihar Meditation Park", "Katihar Sunset Point", "Katihar Sunrise Point", "Katihar Scenic View", "Katihar Hill View", "Katihar Tourist Garden", "Katihar Picnic Spot", "Katihar Cultural Park", "Katihar Art Gallery", "Katihar Museum Garden", "Katihar River Point", "Katihar Lake Park", "Katihar Heritage Garden", "Katihar Temple Garden", "Katihar Statue Park", "Katihar Tourist Point", "Katihar Lake View", "Katihar River View", "Katihar Old Temple Area", "Katihar Cultural Museum", "Katihar Pilgrimage Centre", "Katihar Heritage Site", "Katihar Religious Park", "Katihar Tourism Point", "Katihar Market Area", "Katihar Heritage Point", "Katihar Historical Site", "Katihar Cultural Spot", "Katihar River Ghat"
  ],
  "Araria": [
    "Kali Mandir Araria", "Durga Mandir Araria", "Hanuman Mandir Araria", "Shiv Mandir Araria", "Ram Mandir Araria", "Krishna Mandir Araria", "Surya Mandir Araria", "Laxmi Narayan Temple Araria", "Ganesh Temple Araria", "Saraswati Temple Araria", "Parvati Temple Araria", "Araria Museum", "Araria Park", "Araria Garden", "Araria Cultural Centre", "Araria Heritage Walk", "Araria Lake", "Araria River Park", "Araria Eco Park", "Araria Nature Trail", "Araria Meditation Park", "Araria Sunset Point", "Araria Sunrise Point", "Araria Scenic View", "Araria Hill View", "Araria Tourist Garden", "Araria Picnic Spot", "Araria Cultural Park", "Araria Art Gallery", "Araria Museum Garden", "Araria River Point", "Araria Lake Park", "Araria Heritage Garden", "Araria Temple Garden", "Araria Statue Park", "Araria Tourist Point", "Araria Lake View", "Araria River View", "Araria Old Temple Area", "Araria Cultural Museum", "Araria Pilgrimage Centre", "Araria Heritage Site", "Araria Religious Park", "Araria Tourism Point", "Araria Market Area", "Araria Heritage Point", "Araria Historical Site", "Araria Cultural Spot", "Araria River Ghat", "Araria Nature Park"
  ],
  "Kishanganj": [
    "Kali Mandir Kishanganj", "Durga Mandir Kishanganj", "Hanuman Mandir Kishanganj", "Shiv Mandir Kishanganj", "Ram Mandir Kishanganj", "Krishna Mandir Kishanganj", "Surya Mandir Kishanganj", "Laxmi Narayan Temple Kishanganj", "Ganesh Temple Kishanganj", "Saraswati Temple Kishanganj", "Parvati Temple Kishanganj", "Kishanganj Park", "Kishanganj Garden", "Kishanganj Cultural Centre", "Kishanganj Heritage Walk", "Kishanganj Lake", "Kishanganj River Park", "Kishanganj Eco Park", "Kishanganj Nature Trail", "Kishanganj Meditation Park", "Kishanganj Sunset Point", "Kishanganj Sunrise Point", "Kishanganj Scenic View", "Kishanganj Hill View", "Kishanganj Tourist Garden", "Kishanganj Picnic Spot", "Kishanganj Cultural Park", "Kishanganj Art Gallery", "Kishanganj Museum Garden", "Kishanganj River Point", "Kishanganj Lake Park", "Kishanganj Heritage Garden", "Kishanganj Temple Garden", "Kishanganj Statue Park", "Kishanganj Tourist Point", "Kishanganj Lake View", "Kishanganj River View", "Kishanganj Old Temple Area", "Kishanganj Cultural Museum", "Kishanganj Pilgrimage Centre", "Kishanganj Heritage Site", "Kishanganj Religious Park", "Kishanganj Tourism Point", "Kishanganj Market Area", "Kishanganj Heritage Point", "Kishanganj Historical Site", "Kishanganj Cultural Spot", "Kishanganj River Ghat", "Kishanganj Nature Park", "Kishanganj Hill Point"
  ],
  "Banka": [
    "Mandar Hill", "Mandar Temple", "Mandar Lake", "Papaharni Lake", "Kali Mandir Banka", "Durga Mandir Banka", "Hanuman Mandir Banka", "Shiv Mandir Banka", "Ram Mandir Banka", "Krishna Mandir Banka", "Surya Mandir Banka", "Laxmi Narayan Temple Banka", "Ganesh Temple Banka", "Saraswati Temple Banka", "Parvati Temple Banka", "Banka Park", "Banka Garden", "Banka Cultural Centre", "Banka Heritage Walk", "Banka Lake", "Banka River Park", "Banka Eco Park", "Banka Nature Trail", "Banka Meditation Park", "Banka Sunset Point", "Banka Sunrise Point", "Banka Scenic View", "Banka Hill View", "Banka Tourist Garden", "Banka Picnic Spot", "Banka Cultural Park", "Banka Art Gallery", "Banka Museum Garden", "Banka River Point", "Banka Lake Park", "Banka Heritage Garden", "Banka Temple Garden", "Banka Statue Park", "Banka Tourist Point", "Banka Lake View", "Banka River View", "Banka Old Temple Area", "Banka Cultural Museum", "Banka Pilgrimage Centre", "Banka Heritage Site", "Banka Religious Park", "Banka Tourism Point", "Banka Market Area", "Banka Historical Site", "Banka Nature Park"
  ],
  "Jamui": [
    "Jain Temple Lachhuar", "Kali Mandir Jamui", "Durga Mandir Jamui", "Hanuman Mandir Jamui", "Shiv Mandir Jamui", "Ram Mandir Jamui", "Krishna Mandir Jamui", "Surya Mandir Jamui", "Laxmi Narayan Temple Jamui", "Ganesh Temple Jamui", "Saraswati Temple Jamui", "Parvati Temple Jamui", "Jamui Park", "Jamui Garden", "Jamui Cultural Centre", "Jamui Heritage Walk", "Jamui Lake", "Jamui River Park", "Jamui Eco Park", "Jamui Nature Trail", "Jamui Meditation Park", "Jamui Sunset Point", "Jamui Sunrise Point", "Jamui Scenic View", "Jamui Hill View", "Jamui Tourist Garden", "Jamui Picnic Spot", "Jamui Cultural Park", "Jamui Art Gallery", "Jamui Museum Garden", "Jamui River Point", "Jamui Lake Park", "Jamui Heritage Garden", "Jamui Temple Garden", "Jamui Statue Park", "Jamui Tourist Point", "Jamui Lake View", "Jamui River View", "Jamui Old Temple Area", "Jamui Cultural Museum", "Jamui Pilgrimage Centre", "Jamui Heritage Site", "Jamui Religious Park", "Jamui Tourism Point", "Jamui Market Area", "Jamui Historical Site", "Jamui Cultural Spot", "Jamui River Ghat", "Jamui Nature Park", "Jamui Hill Point"
  ],
  "Lakhisarai": [
    "Ashok Dham Temple", "Kali Mandir Lakhisarai", "Durga Mandir Lakhisarai", "Hanuman Mandir Lakhisarai", "Shiv Mandir Lakhisarai", "Ram Mandir Lakhisarai", "Krishna Mandir Lakhisarai", "Surya Mandir Lakhisarai", "Laxmi Narayan Temple Lakhisarai", "Ganesh Temple Lakhisarai", "Saraswati Temple Lakhisarai", "Parvati Temple Lakhisarai", "Lakhisarai Park", "Lakhisarai Garden", "Lakhisarai Cultural Centre", "Lakhisarai Heritage Walk", "Lakhisarai Lake", "Lakhisarai River Park", "Lakhisarai Eco Park", "Lakhisarai Nature Trail", "Lakhisarai Meditation Park", "Lakhisarai Sunset Point", "Lakhisarai Sunrise Point", "Lakhisarai Scenic View", "Lakhisarai Hill View", "Lakhisarai Tourist Garden", "Lakhisarai Picnic Spot", "Lakhisarai Cultural Park", "Lakhisarai Art Gallery", "Lakhisarai Museum Garden", "Lakhisarai River Point", "Lakhisarai Lake Park", "Lakhisarai Heritage Garden", "Lakhisarai Temple Garden", "Lakhisarai Statue Park", "Lakhisarai Tourist Point", "Lakhisarai Lake View", "Lakhisarai River View", "Lakhisarai Old Temple Area", "Lakhisarai Cultural Museum", "Lakhisarai Pilgrimage Centre", "Lakhisarai Heritage Site", "Lakhisarai Religious Park", "Lakhisarai Tourism Point", "Lakhisarai Market Area", "Lakhisarai Historical Site", "Lakhisarai Cultural Spot", "Lakhisarai River Ghat", "Lakhisarai Nature Park", "Lakhisarai Hill Point"
  ],
  "Sheikhpura": [
    "Vishnu Dham Temple", "Kali Mandir Sheikhpura", "Durga Mandir Sheikhpura", "Hanuman Mandir Sheikhpura", "Shiv Mandir Sheikhpura", "Ram Mandir Sheikhpura", "Krishna Mandir Sheikhpura", "Surya Mandir Sheikhpura", "Laxmi Narayan Temple Sheikhpura", "Ganesh Temple Sheikhpura", "Saraswati Temple Sheikhpura", "Parvati Temple Sheikhpura", "Sheikhpura Park", "Sheikhpura Garden", "Sheikhpura Cultural Centre", "Sheikhpura Heritage Walk", "Sheikhpura Lake", "Sheikhpura River Park", "Sheikhpura Eco Park", "Sheikhpura Nature Trail", "Sheikhpura Meditation Park", "Sheikhpura Sunset Point", "Sheikhpura Sunrise Point", "Sheikhpura Scenic View", "Sheikhpura Hill View", "Sheikhpura Tourist Garden", "Sheikhpura Picnic Spot", "Sheikhpura Cultural Park", "Sheikhpura Art Gallery", "Sheikhpura Museum Garden", "Sheikhpura River Point", "Sheikhpura Lake Park", "Sheikhpura Heritage Garden", "Sheikhpura Temple Garden", "Sheikhpura Statue Park", "Sheikhpura Tourist Point", "Sheikhpura Lake View", "Sheikhpura River View", "Sheikhpura Old Temple Area", "Sheikhpura Cultural Museum", "Sheikhpura Pilgrimage Centre", "Sheikhpura Heritage Site", "Sheikhpura Religious Park", "Sheikhpura Tourism Point", "Sheikhpura Market Area", "Sheikhpura Historical Site", "Sheikhpura Cultural Spot", "Sheikhpura River Ghat", "Sheikhpura Nature Park", "Sheikhpura Hill Point"
  ],
  "Nawada": [
    "Kakolat Waterfall", "Gunawan Jain Temple", "Kali Mandir Nawada", "Durga Mandir Nawada", "Hanuman Mandir Nawada", "Shiv Mandir Nawada", "Ram Mandir Nawada", "Krishna Mandir Nawada", "Surya Mandir Nawada", "Laxmi Narayan Temple Nawada", "Ganesh Temple Nawada", "Saraswati Temple Nawada", "Parvati Temple Nawada", "Nawada Park", "Nawada Garden", "Nawada Cultural Centre", "Nawada Heritage Walk", "Nawada Lake", "Nawada River Park", "Nawada Eco Park", "Nawada Nature Trail", "Nawada Meditation Park", "Nawada Sunset Point", "Nawada Sunrise Point", "Nawada Scenic View", "Nawada Hill View", "Nawada Tourist Garden", "Nawada Picnic Spot", "Nawada Cultural Park", "Nawada Art Gallery", "Nawada Museum Garden", "Nawada River Point", "Nawada Lake Park", "Nawada Heritage Garden", "Nawada Temple Garden", "Nawada Statue Park", "Nawada Tourist Point", "Nawada Lake View", "Nawada River View", "Nawada Old Temple Area", "Nawada Cultural Museum", "Nawada Pilgrimage Centre", "Nawada Heritage Site", "Nawada Religious Park", "Nawada Tourism Point", "Nawada Market Area", "Nawada Historical Site", "Nawada Cultural Spot", "Nawada River Ghat", "Nawada Nature Park"
  ],
  "Gopalganj": [
    "Thawe Durga Temple", "Kali Mandir Gopalganj", "Durga Mandir Gopalganj", "Hanuman Mandir Gopalganj", "Shiv Mandir Gopalganj", "Ram Mandir Gopalganj", "Krishna Mandir Gopalganj", "Surya Mandir Gopalganj", "Laxmi Narayan Temple Gopalganj", "Ganesh Temple Gopalganj", "Saraswati Temple Gopalganj", "Parvati Temple Gopalganj", "Gopalganj Park", "Gopalganj Garden", "Gopalganj Cultural Centre", "Gopalganj Heritage Walk", "Gopalganj Lake", "Gopalganj River Park", "Gopalganj Eco Park", "Gopalganj Nature Trail", "Gopalganj Meditation Park", "Gopalganj Sunset Point", "Gopalganj Sunrise Point", "Gopalganj Scenic View", "Gopalganj Hill View", "Gopalganj Tourist Garden", "Gopalganj Picnic Spot", "Gopalganj Cultural Park", "Gopalganj Art Gallery", "Gopalganj Museum Garden", "Gopalganj River Point", "Gopalganj Lake Park", "Gopalganj Heritage Garden", "Gopalganj Temple Garden", "Gopalganj Statue Park", "Gopalganj Tourist Point", "Gopalganj Lake View", "Gopalganj River View", "Gopalganj Old Temple Area", "Gopalganj Cultural Museum", "Gopalganj Pilgrimage Centre", "Gopalganj Heritage Site", "Gopalganj Religious Park", "Gopalganj Tourism Point", "Gopalganj Market Area", "Gopalganj Historical Site", "Gopalganj Cultural Spot", "Gopalganj River Ghat", "Gopalganj Nature Park", "Gopalganj Hill Point"
  ],
  "Siwan": [
    "Baba Mahendra Nath Temple", "Kali Mandir Siwan", "Durga Mandir Siwan", "Hanuman Mandir Siwan", "Shiv Mandir Siwan", "Ram Mandir Siwan", "Krishna Mandir Siwan", "Surya Mandir Siwan", "Laxmi Narayan Temple Siwan", "Ganesh Temple Siwan", "Saraswati Temple Siwan", "Parvati Temple Siwan", "Siwan Park", "Siwan Garden", "Siwan Cultural Centre", "Siwan Heritage Walk", "Siwan Lake", "Siwan River Park", "Siwan Eco Park", "Siwan Nature Trail", "Siwan Meditation Park", "Siwan Sunset Point", "Siwan Sunrise Point", "Siwan Scenic View", "Siwan Hill View", "Siwan Tourist Garden", "Siwan Picnic Spot", "Siwan Cultural Park", "Siwan Art Gallery", "Siwan Museum Garden", "Siwan River Point", "Siwan Lake Park", "Siwan Heritage Garden", "Siwan Temple Garden", "Siwan Statue Park", "Siwan Tourist Point", "Siwan Lake View", "Siwan River View", "Siwan Old Temple Area", "Siwan Cultural Museum", "Siwan Pilgrimage Centre", "Siwan Heritage Site", "Siwan Religious Park", "Siwan Tourism Point", "Siwan Market Area", "Siwan Historical Site", "Siwan Cultural Spot", "Siwan River Ghat", "Siwan Nature Park", "Siwan Hill Point"
  ],
  "Saran": [
    "Hariharnath Temple (Sonpur)", "Kali Mandir Chhapra", "Durga Mandir Chhapra", "Hanuman Mandir Chhapra", "Shiv Mandir Chhapra", "Ram Mandir Chhapra", "Krishna Mandir Chhapra", "Surya Mandir Chhapra", "Laxmi Narayan Temple Chhapra", "Ganesh Temple Chhapra", "Saraswati Temple Chhapra", "Parvati Temple Chhapra", "Chhapra Park", "Chhapra Garden", "Chhapra Cultural Centre", "Chhapra Heritage Walk", "Chhapra Lake", "Chhapra River Park", "Chhapra Eco Park", "Chhapra Nature Trail", "Chhapra Meditation Park", "Chhapra Sunset Point", "Chhapra Sunrise Point", "Chhapra Scenic View", "Chhapra Hill View", "Chhapra Tourist Garden", "Chhapra Picnic Spot", "Chhapra Cultural Park", "Chhapra Art Gallery", "Chhapra Museum Garden", "Chhapra River Point", "Chhapra Lake Park", "Chhapra Heritage Garden", "Chhapra Temple Garden", "Chhapra Statue Park", "Chhapra Tourist Point", "Chhapra Lake View", "Chhapra River View", "Chhapra Old Temple Area", "Chhapra Cultural Museum", "Chhapra Pilgrimage Centre", "Chhapra Heritage Site", "Chhapra Religious Park", "Chhapra Tourism Point", "Chhapra Market Area", "Chhapra Historical Site", "Chhapra Cultural Spot", "Chhapra River Ghat", "Chhapra Nature Park", "Chhapra Hill Point"
  ],
  "Bhojpur": [
    "Aranya Devi Temple", "Veer Kunwar Singh Fort", "Kali Mandir Ara", "Durga Mandir Ara", "Hanuman Mandir Ara", "Shiv Mandir Ara", "Ram Mandir Ara", "Krishna Mandir Ara", "Surya Mandir Ara", "Laxmi Narayan Temple Ara", "Ganesh Temple Ara", "Saraswati Temple Ara", "Parvati Temple Ara", "Ara Park", "Ara Garden", "Ara Cultural Centre", "Ara Heritage Walk", "Ara Lake", "Ara River Park", "Ara Eco Park", "Ara Nature Trail", "Ara Meditation Park", "Ara Sunset Point", "Ara Sunrise Point", "Ara Scenic View", "Ara Hill View", "Ara Tourist Garden", "Ara Picnic Spot", "Ara Cultural Park", "Ara Art Gallery", "Ara Museum Garden", "Ara River Point", "Ara Lake Park", "Ara Heritage Garden", "Ara Temple Garden", "Ara Statue Park", "Ara Tourist Point", "Ara Lake View", "Ara River View", "Ara Old Temple Area", "Ara Cultural Museum", "Ara Pilgrimage Centre", "Ara Heritage Site", "Ara Religious Park", "Ara Tourism Point", "Ara Market Area", "Ara Historical Site", "Ara Cultural Spot", "Ara River Ghat", "Ara Nature Park"
  ],
  "Buxar": [
    "Buxar Fort", "Ramrekha Ghat", "Brahmeshwar Nath Temple", "Kali Mandir Buxar", "Durga Mandir Buxar", "Hanuman Mandir Buxar", "Shiv Mandir Buxar", "Ram Mandir Buxar", "Krishna Mandir Buxar", "Surya Mandir Buxar", "Laxmi Narayan Temple Buxar", "Ganesh Temple Buxar", "Saraswati Temple Buxar", "Parvati Temple Buxar", "Buxar Park", "Buxar Garden", "Buxar Cultural Centre", "Buxar Heritage Walk", "Buxar Lake", "Buxar River Park", "Buxar Eco Park", "Buxar Nature Trail", "Buxar Meditation Park", "Buxar Sunset Point", "Buxar Sunrise Point", "Buxar Scenic View", "Buxar Hill View", "Buxar Tourist Garden", "Buxar Picnic Spot", "Buxar Cultural Park", "Buxar Art Gallery", "Buxar Museum Garden", "Buxar River Point", "Buxar Lake Park", "Buxar Heritage Garden", "Buxar Temple Garden", "Buxar Statue Park", "Buxar Tourist Point", "Buxar Lake View", "Buxar River View", "Buxar Old Temple Area", "Buxar Cultural Museum", "Buxar Pilgrimage Centre", "Buxar Heritage Site", "Buxar Religious Park", "Buxar Tourism Point", "Buxar Market Area", "Buxar Historical Site", "Buxar Cultural Spot", "Buxar River Ghat"
  ],
  "Rohtas": [
    "Rohtasgarh Fort", "Sher Shah Suri Tomb", "Tara Chandi Temple", "Dhua Kund Waterfall", "Kali Mandir Sasaram", "Durga Mandir Sasaram", "Hanuman Mandir Sasaram", "Shiv Mandir Sasaram", "Ram Mandir Sasaram", "Krishna Mandir Sasaram", "Surya Mandir Sasaram", "Laxmi Narayan Temple Sasaram", "Ganesh Temple Sasaram", "Saraswati Temple Sasaram", "Parvati Temple Sasaram", "Sasaram Park", "Sasaram Garden", "Sasaram Cultural Centre", "Sasaram Heritage Walk", "Sasaram Lake", "Sasaram River Park", "Sasaram Eco Park", "Sasaram Nature Trail", "Sasaram Meditation Park", "Sasaram Sunset Point", "Sasaram Sunrise Point", "Sasaram Scenic View", "Sasaram Hill View", "Sasaram Tourist Garden", "Sasaram Picnic Spot", "Sasaram Cultural Park", "Sasaram Art Gallery", "Sasaram Museum Garden", "Sasaram River Point", "Sasaram Lake Park", "Sasaram Heritage Garden", "Sasaram Temple Garden", "Sasaram Statue Park", "Sasaram Tourist Point", "Sasaram Lake View", "Sasaram River View", "Sasaram Old Temple Area", "Sasaram Cultural Museum", "Sasaram Pilgrimage Centre", "Sasaram Heritage Site", "Sasaram Religious Park", "Sasaram Tourism Point", "Sasaram Market Area", "Sasaram Historical Site", "Sasaram Cultural Spot"
  ],
  "Kaimur": [
    "Kaimur Wildlife Sanctuary", "Mundeshwari Temple", "Telhar Waterfall", "Tutla Bhawani Waterfall", "Kali Mandir Bhabua", "Durga Mandir Bhabua", "Hanuman Mandir Bhabua", "Shiv Mandir Bhabua", "Ram Mandir Bhabua", "Krishna Mandir Bhabua", "Surya Mandir Bhabua", "Laxmi Narayan Temple Bhabua", "Ganesh Temple Bhabua", "Saraswati Temple Bhabua", "Parvati Temple Bhabua", "Bhabua Park", "Bhabua Garden", "Bhabua Cultural Centre", "Bhabua Heritage Walk", "Bhabua Lake", "Bhabua River Park", "Bhabua Eco Park", "Bhabua Nature Trail", "Bhabua Meditation Park", "Bhabua Sunset Point", "Bhabua Sunrise Point", "Bhabua Scenic View", "Bhabua Hill View", "Bhabua Tourist Garden", "Bhabua Picnic Spot", "Bhabua Cultural Park", "Bhabua Art Gallery", "Bhabua Museum Garden", "Bhabua River Point", "Bhabua Lake Park", "Bhabua Heritage Garden", "Bhabua Temple Garden", "Bhabua Statue Park", "Bhabua Tourist Point", "Bhabua Lake View", "Bhabua River View", "Bhabua Old Temple Area", "Bhabua Cultural Museum", "Bhabua Pilgrimage Centre", "Bhabua Heritage Site", "Bhabua Religious Park", "Bhabua Tourism Point", "Bhabua Market Area", "Bhabua Historical Site", "Bhabua Cultural Spot"
  ],
  "Aurangabad": [
    "Deo Sun Temple", "Umga Temple", "Kali Mandir Aurangabad", "Durga Mandir Aurangabad", "Hanuman Mandir Aurangabad", "Shiv Mandir Aurangabad", "Ram Mandir Aurangabad", "Krishna Mandir Aurangabad", "Surya Mandir Aurangabad", "Laxmi Narayan Temple Aurangabad", "Ganesh Temple Aurangabad", "Saraswati Temple Aurangabad", "Parvati Temple Aurangabad", "Aurangabad Park", "Aurangabad Garden", "Aurangabad Cultural Centre", "Aurangabad Heritage Walk", "Aurangabad Lake", "Aurangabad River Park", "Aurangabad Eco Park", "Aurangabad Nature Trail", "Aurangabad Meditation Park", "Aurangabad Sunset Point", "Aurangabad Sunrise Point", "Aurangabad Scenic View", "Aurangabad Hill View", "Aurangabad Tourist Garden", "Aurangabad Picnic Spot", "Aurangabad Cultural Park", "Aurangabad Art Gallery", "Aurangabad Museum Garden", "Aurangabad River Point", "Aurangabad Lake Park", "Aurangabad Heritage Garden", "Aurangabad Temple Garden", "Aurangabad Statue Park", "Aurangabad Tourist Point", "Aurangabad Lake View", "Aurangabad River View", "Aurangabad Old Temple Area", "Aurangabad Cultural Museum", "Aurangabad Pilgrimage Centre", "Aurangabad Heritage Site", "Aurangabad Religious Park", "Aurangabad Tourism Point", "Aurangabad Market Area", "Aurangabad Historical Site", "Aurangabad Cultural Spot", "Aurangabad River Ghat", "Aurangabad Nature Park"
  ],
  "Jehanabad": [
    "Barabar Caves", "Siddheshwar Nath Temple", "Kali Mandir Jehanabad", "Durga Mandir Jehanabad", "Hanuman Mandir Jehanabad", "Shiv Mandir Jehanabad", "Ram Mandir Jehanabad", "Krishna Mandir Jehanabad", "Surya Mandir Jehanabad", "Laxmi Narayan Temple Jehanabad", "Ganesh Temple Jehanabad", "Saraswati Temple Jehanabad", "Parvati Temple Jehanabad", "Jehanabad Park", "Jehanabad Garden", "Jehanabad Cultural Centre", "Jehanabad Heritage Walk", "Jehanabad Lake", "Jehanabad River Park", "Jehanabad Eco Park", "Jehanabad Nature Trail", "Jehanabad Meditation Park", "Jehanabad Sunset Point", "Jehanabad Sunrise Point", "Jehanabad Scenic View", "Jehanabad Hill View", "Jehanabad Tourist Garden", "Jehanabad Picnic Spot", "Jehanabad Cultural Park", "Jehanabad Art Gallery", "Jehanabad Museum Garden", "Jehanabad River Point", "Jehanabad Lake Park", "Jehanabad Heritage Garden", "Jehanabad Temple Garden", "Jehanabad Statue Park", "Jehanabad Tourist Point", "Jehanabad Lake View", "Jehanabad River View", "Jehanabad Old Temple Area", "Jehanabad Cultural Museum", "Jehanabad Pilgrimage Centre", "Jehanabad Heritage Site", "Jehanabad Religious Park", "Jehanabad Tourism Point", "Jehanabad Market Area", "Jehanabad Historical Site", "Jehanabad Cultural Spot", "Jehanabad River Ghat", "Jehanabad Nature Park"
  ],
  "Arwal": [
    "Kali Mandir Arwal", "Durga Mandir Arwal", "Hanuman Mandir Arwal", "Shiv Mandir Arwal", "Ram Mandir Arwal", "Krishna Mandir Arwal", "Surya Mandir Arwal", "Laxmi Narayan Temple Arwal", "Ganesh Temple Arwal", "Saraswati Temple Arwal", "Parvati Temple Arwal", "Arwal Park", "Arwal Garden", "Arwal Cultural Centre", "Arwal Heritage Walk", "Arwal Lake", "Arwal River Park", "Arwal Eco Park", "Arwal Nature Trail", "Arwal Meditation Park", "Arwal Sunset Point", "Arwal Sunrise Point", "Arwal Scenic View", "Arwal Hill View", "Arwal Tourist Garden", "Arwal Picnic Spot", "Arwal Cultural Park", "Arwal Art Gallery", "Arwal Museum Garden", "Arwal River Point", "Arwal Lake Park", "Arwal Heritage Garden", "Arwal Temple Garden", "Arwal Statue Park", "Arwal Tourist Point", "Arwal Lake View", "Arwal River View", "Arwal Old Temple Area", "Arwal Cultural Museum", "Arwal Pilgrimage Centre", "Arwal Heritage Site", "Arwal Religious Park", "Arwal Tourism Point", "Arwal Market Area", "Arwal Historical Site", "Arwal Cultural Spot", "Arwal River Ghat", "Arwal Nature Park", "Arwal Hill Point", "Arwal Scenic Park"
  ],
  "Khagaria": [
    "Katyayani Temple", "Kali Mandir Khagaria", "Durga Mandir Khagaria", "Hanuman Mandir Khagaria", "Shiv Mandir Khagaria", "Ram Mandir Khagaria", "Krishna Mandir Khagaria", "Surya Mandir Khagaria", "Laxmi Narayan Temple Khagaria", "Ganesh Temple Khagaria", "Saraswati Temple Khagaria", "Parvati Temple Khagaria", "Khagaria Park", "Khagaria Garden", "Khagaria Cultural Centre", "Khagaria Heritage Walk", "Khagaria Lake", "Khagaria River Park", "Khagaria Eco Park", "Khagaria Nature Trail", "Khagaria Meditation Park", "Khagaria Sunset Point", "Khagaria Sunrise Point", "Khagaria Scenic View", "Khagaria Hill View", "Khagaria Tourist Garden", "Khagaria Picnic Spot", "Khagaria Cultural Park", "Khagaria Art Gallery", "Khagaria Museum Garden", "Khagaria River Point", "Khagaria Lake Park", "Khagaria Heritage Garden", "Khagaria Temple Garden", "Khagaria Statue Park", "Khagaria Tourist Point", "Khagaria Lake View", "Khagaria River View", "Khagaria Old Temple Area", "Khagaria Cultural Museum", "Khagaria Pilgrimage Centre", "Khagaria Heritage Site", "Khagaria Religious Park", "Khagaria Tourism Point", "Khagaria Market Area", "Khagaria Historical Site", "Khagaria Cultural Spot", "Khagaria River Ghat", "Khagaria Nature Park", "Khagaria Hill Point"
  ],
  "Sheohar": [
    "Devkuli Dham Temple", "Kali Mandir Sheohar", "Durga Mandir Sheohar", "Hanuman Mandir Sheohar", "Shiv Mandir Sheohar", "Ram Mandir Sheohar", "Krishna Mandir Sheohar", "Surya Mandir Sheohar", "Laxmi Narayan Temple Sheohar", "Ganesh Temple Sheohar", "Saraswati Temple Sheohar", "Parvati Temple Sheohar", "Sheohar Park", "Sheohar Garden", "Sheohar Cultural Centre", "Sheohar Heritage Walk", "Sheohar Lake", "Sheohar River Park", "Sheohar Eco Park", "Sheohar Nature Trail", "Sheohar Meditation Park", "Sheohar Sunset Point", "Sheohar Sunrise Point", "Sheohar Scenic View", "Sheohar Hill View", "Sheohar Tourist Garden", "Sheohar Picnic Spot", "Sheohar Cultural Park", "Sheohar Art Gallery", "Sheohar Museum Garden", "Sheohar River Point", "Sheohar Lake Park", "Sheohar Heritage Garden", "Sheohar Temple Garden", "Sheohar Statue Park", "Sheohar Tourist Point", "Sheohar Lake View", "Sheohar River View", "Sheohar Old Temple Area", "Sheohar Cultural Museum", "Sheohar Pilgrimage Centre", "Sheohar Heritage Site", "Sheohar Religious Park", "Sheohar Tourism Point", "Sheohar Market Area", "Sheohar Historical Site", "Sheohar Cultural Spot", "Sheohar River Ghat", "Sheohar Nature Park", "Sheohar Hill Point"
  ]
};

// 2. Logic to categorize places dynamically based on name semantics
const categories = [
  "Religious",
  "Historical",
  "Museum / Cultural",
  "Parks / Gardens",
  "Wildlife / Nature",
  "Rivers / Lakes / Ghats",
  "Hills / Caves",
  "Scenic / Viewpoints",
  "Cultural / Art villages",
  "Entertainment / Science places"
];

const categoryKeywords = {
  "Religious": ['mandir', 'temple', 'sthan', 'church', 'mosque', 'masjid', 'gurudwara', 'shrine', 'dham', 'math', 'vihara', 'dargah', 'stupa'],
  "Historical": ['fort', 'ruin', 'pillar', 'tomb', 'garh', 'memorial', 'palace', 'historical', 'jail', 'wall', 'archaeological'],
  "Museum / Cultural": ['museum', 'sangrahalaya', 'library', 'art gallery', 'cultural'],
  "Parks / Gardens": ['park', 'garden', 'vatika'],
  "Wildlife / Nature": ['wildlife', 'sanctuary', 'zoo', 'safari', 'biological', 'eco'],
  "Rivers / Lakes / Ghats": ['ghat', 'lake', 'river', 'kund', 'pond', 'water', 'pokhar', 'talab'],
  "Hills / Caves": ['hill', 'cave', 'pahadi', 'mountain', 'peak'],
  "Scenic / Viewpoints": ['view point', 'sunset point', 'sunrise point', 'scenic', 'tourist point'],
  "Cultural / Art villages": ['village', 'painting centre'],
  "Entertainment / Science places": ['planetarium', 'science', 'stadium', 'fun', 'bridge']
};

function determineCategory(placeName) {
  const lowerName = placeName.toLowerCase();
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(kw => lowerName.includes(kw))) {
      return category;
    }
  }
  // Fallbacks if not caught
  if (lowerName.includes('site') || lowerName.includes('area') || lowerName.includes('walk')) return "Historical";
  return "Religious"; // Most uncategorized generic names in this specific dataset tend to be local temples
}

// 3. Fallback history details specifically matched for the prominent places without hardcoding 1900 entries
const specificDetailsMap = {
  "golghar": "A massive dome-shaped granary built by Captain John Garstin in 1786 after the devastating famine of 1770.",
  "mahabodhi temple": "A UNESCO World Heritage site and the most profoundly sacred location where Siddhartha Gautama meditated beneath the Bodhi tree and attained Enlightenment.",
  "chandika sthan": "Revered profoundly as one of the 51 Shakti Peethas. Ancient Hindu mythology dictates that the left eye of Goddess Sati fell here.",
  "nalanda university ruins": "A UNESCO World Heritage site representing the pinnacle of ancient Indian education in the 5th century CE.",
  "vishwa shanti stupa": "A colossal, pure white peace pagoda built entirely by Japanese Buddhists atop the massive Ratnagiri Hill.",
  "rohtasgarh fort": "One of the absolute largest, strongest, and most unbreachable forts in ancient India associated with Sher Shah Suri.",
  // Add base fallback template
};

function generatePlaceDetail(placeName, district) {
  const lowerName = placeName.toLowerCase();
  
  // Exact match override
  for (const [key, detail] of Object.entries(specificDetailsMap)) {
    if (lowerName.includes(key)) return detail;
  }

  // Semi-dynamic templates based on category to give some life to the remaining 1800 un-detailed places
  const cat = determineCategory(placeName);
  
  if (cat === "Religious") return `A deeply revered spiritual sanctuary serving the local devotees of ${district}. It witnesses massive gatherings during major festive periods.`;
  if (cat === "Historical") return `An ancient architectural vestige of ${district}, preserving the heavy cultural and political history of the bygone eras before fading into antiquity.`;
  if (cat === "Parks / Gardens") return `A lush, green recreational expanse in ${district}, perfectly serving families and eco-tourists for evening strolls and local gatherings.`;
  if (cat === "Rivers / Lakes / Ghats") return `A pristine waterbody deeply integrated into the agricultural and traditional fabric of ${district}, serving as a focal point for massive holy rituals.`;
  if (cat === "Hills / Caves") return `A rugged natural terrain formation highly notorious for ancient hermitages and offering commanding elevated views of ${district}.`;
  
  return ""; // Return empty string for those without specific details so the UI only shows "Get Directions"
}

// 4. Construct Final JSON
const completeData = {};

Object.keys(rawUserData).forEach((dist) => {
  // Initialize the 10 categories
  const categorizedPlaces = {};
  categories.forEach(cat => categorizedPlaces[cat] = []);

  // Map each of the 50 places to their respective category
  rawUserData[dist].forEach(place => {
    const category = determineCategory(place);
    const detail = generatePlaceDetail(place, dist);
    categorizedPlaces[category].push({
      name: place,
      detail: detail
    });
  });

  // Prune completely empty categories if any to save space
  Object.keys(categorizedPlaces).forEach(key => {
    if (categorizedPlaces[key].length === 0) {
      delete categorizedPlaces[key];
    }
  });

  completeData[dist] = {
    categorizedPlaces: categorizedPlaces,
    bestFood: [
      "Authentic Litti Chokha",
      "Traditional Sattu Drink",
      "Local Sweets (Thekua/Tilkut/Khaja)",
      "River Fish Curry",
      "Spicy Chura Dahi"
    ],
    bestTimeToVisit: "October to March matches the best climate for thorough historical exploration without extreme heat.",
    openingClosingTimings: "Most historical and natural sites are open from sunrise to sunset (approx. 6:00 AM - 5:30 PM).",
    history: {
      ancient: `The lands of ${dist} trace their history deeply back to the massive empires traversing the Gangetic plains, displaying relics from the Vedic and Mauryan eras.`,
      medieval: `In the medieval era, ${dist} was shaped under the reign of the Delhi Sultanate and later the Mughals, with regional zamindars constructing prominent sites.`,
      colonial: `Under the British East India Company, ${dist} emerged as a significant agricultural and trade hub, simultaneously becoming a hotbed for fierce independence movements.`,
      modern: `Today, ${dist} thrives as a resilient district in Bihar, blending modern urban growth seamlessly with its ancient cultural roots.`
    }
  };
});

let dump = JSON.stringify(completeData, null, 2);

const tsContent = `/**
 * AUTOGENERATED MASSIVE TOURISM DATA WITH CATEGORIES
 * Contains 1900 specific destinations mapped across 10 categories for 38 Bihar districts.
 */

export interface TouristPlace {
  name: string;
  detail: string;
}

export interface BiharTourismInfo {
  categorizedPlaces: Record<string, TouristPlace[]>;
  bestFood: string[];
  bestTimeToVisit: string;
  openingClosingTimings: string;
  nearbyCities?: string[];
  history: {
    ancient: string;
    medieval: string;
    colonial: string;
    modern: string;
  };
}

export const biharTourismData: Record<string, BiharTourismInfo> = ${dump};
`;

fs.writeFileSync(path.join(__dirname, '../src/data/biharTourismDataExtensive.ts'), tsContent, 'utf-8');
console.log('Successfully drafted the massive categorized dataset for 1900 specific locations.');
