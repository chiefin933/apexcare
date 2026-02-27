// ApexCare Medical Centre — Mock Data
// Design: Warm Medical Humanity | Teal + Cream palette

export const departments = [
  {
    id: "cardiology",
    name: "Cardiology",
    icon: "Heart",
    description: "Advanced cardiac care with state-of-the-art diagnostics, interventional procedures, and comprehensive heart health management.",
    shortDesc: "Heart & Vascular Care",
    color: "bg-rose-50 text-rose-600 border-rose-100",
    iconBg: "bg-rose-100",
    stats: { patients: "2,400+", specialists: 8, procedures: "150+" },
    services: [
      "Echocardiography",
      "Cardiac Catheterization",
      "Electrophysiology",
      "Heart Failure Management",
      "Preventive Cardiology",
      "Cardiac Rehabilitation"
    ],
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80"
  },
  {
    id: "neurology",
    name: "Neurology",
    icon: "Brain",
    description: "Comprehensive neurological care for brain, spine, and nervous system disorders with cutting-edge diagnostic and treatment options.",
    shortDesc: "Brain & Nervous System",
    color: "bg-violet-50 text-violet-600 border-violet-100",
    iconBg: "bg-violet-100",
    stats: { patients: "1,800+", specialists: 6, procedures: "120+" },
    services: [
      "Stroke Care",
      "Epilepsy Management",
      "Neurodegenerative Disorders",
      "Headache Clinic",
      "Neuro-rehabilitation",
      "Sleep Disorders"
    ],
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80"
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    icon: "Baby",
    description: "Dedicated child health services from newborn care through adolescence, with a compassionate team focused on your child's wellbeing.",
    shortDesc: "Child & Adolescent Health",
    color: "bg-sky-50 text-sky-600 border-sky-100",
    iconBg: "bg-sky-100",
    stats: { patients: "3,200+", specialists: 10, procedures: "200+" },
    services: [
      "Neonatal Care",
      "Pediatric Surgery",
      "Vaccination Programs",
      "Growth & Development",
      "Pediatric Cardiology",
      "Child Psychology"
    ],
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80"
  },
  {
    id: "orthopedics",
    name: "Orthopedics",
    icon: "Bone",
    description: "Expert musculoskeletal care including joint replacement, sports medicine, spine surgery, and comprehensive rehabilitation programs.",
    shortDesc: "Bones, Joints & Spine",
    color: "bg-amber-50 text-amber-600 border-amber-100",
    iconBg: "bg-amber-100",
    stats: { patients: "2,100+", specialists: 7, procedures: "180+" },
    services: [
      "Joint Replacement",
      "Sports Medicine",
      "Spine Surgery",
      "Fracture Care",
      "Arthroscopy",
      "Physical Therapy"
    ],
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=80"
  },
  {
    id: "radiology",
    name: "Radiology",
    icon: "Scan",
    description: "Advanced imaging services including MRI, CT, PET scans, and interventional radiology with rapid reporting and expert interpretation.",
    shortDesc: "Imaging & Diagnostics",
    color: "bg-teal-50 text-teal-600 border-teal-100",
    iconBg: "bg-teal-100",
    stats: { patients: "5,000+", specialists: 9, procedures: "500+" },
    services: [
      "MRI Scanning",
      "CT Scanning",
      "PET Imaging",
      "Ultrasound",
      "Interventional Radiology",
      "Nuclear Medicine"
    ],
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80"
  },
  {
    id: "emergency",
    name: "Emergency",
    icon: "Siren",
    description: "24/7 emergency medical services with rapid triage, trauma care, and a fully equipped resuscitation unit staffed by emergency specialists.",
    shortDesc: "24/7 Emergency Care",
    color: "bg-red-50 text-red-600 border-red-100",
    iconBg: "bg-red-100",
    stats: { patients: "8,000+", specialists: 15, procedures: "700+" },
    services: [
      "Trauma Care",
      "Cardiac Emergency",
      "Stroke Response",
      "Pediatric Emergency",
      "Toxicology",
      "Critical Care"
    ],
    image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&q=80"
  }
];

export const doctors = [
  {
    id: "dr-amara-osei",
    name: "Dr. Amara Osei",
    title: "Chief of Cardiology",
    department: "cardiology",
    departmentName: "Cardiology",
    experience: 18,
    education: "MD, Harvard Medical School",
    specializations: ["Interventional Cardiology", "Heart Failure", "Preventive Cardiology"],
    bio: "Dr. Osei is a board-certified cardiologist with over 18 years of experience in interventional procedures and heart failure management. She leads our cardiac care team with a patient-first philosophy.",
    availability: ["Mon", "Tue", "Thu", "Fri"],
    rating: 4.9,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80",
    languages: ["English", "French", "Twi"]
  },
  {
    id: "dr-james-mwangi",
    name: "Dr. James Mwangi",
    title: "Head of Neurology",
    department: "neurology",
    departmentName: "Neurology",
    experience: 22,
    education: "MD, University of Nairobi; Fellowship, Mayo Clinic",
    specializations: ["Stroke Neurology", "Epilepsy", "Neurodegenerative Diseases"],
    bio: "Dr. Mwangi is a distinguished neurologist with fellowship training at Mayo Clinic. His expertise in stroke care and epilepsy management has transformed outcomes for hundreds of patients.",
    availability: ["Mon", "Wed", "Thu"],
    rating: 4.8,
    reviews: 278,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
    languages: ["English", "Swahili", "Kikuyu"]
  },
  {
    id: "dr-priya-sharma",
    name: "Dr. Priya Sharma",
    title: "Senior Pediatrician",
    department: "pediatrics",
    departmentName: "Pediatrics",
    experience: 14,
    education: "MBBS, AIIMS Delhi; MD Pediatrics",
    specializations: ["Neonatal Care", "Pediatric Cardiology", "Child Development"],
    bio: "Dr. Sharma brings warmth and expertise to pediatric care. Her specialized training in neonatal care and pediatric cardiology makes her a trusted choice for families across the region.",
    availability: ["Tue", "Wed", "Fri", "Sat"],
    rating: 4.9,
    reviews: 445,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
    languages: ["English", "Hindi", "Tamil"]
  },
  {
    id: "dr-samuel-adeyemi",
    name: "Dr. Samuel Adeyemi",
    title: "Orthopedic Surgeon",
    department: "orthopedics",
    departmentName: "Orthopedics",
    experience: 16,
    education: "MD, University of Lagos; Fellowship, HSS New York",
    specializations: ["Joint Replacement", "Sports Medicine", "Spine Surgery"],
    bio: "Dr. Adeyemi is a highly skilled orthopedic surgeon with fellowship training at Hospital for Special Surgery, New York. He specializes in minimally invasive joint replacement and sports injuries.",
    availability: ["Mon", "Tue", "Wed", "Fri"],
    rating: 4.7,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80",
    languages: ["English", "Yoruba", "Igbo"]
  },
  {
    id: "dr-chen-wei",
    name: "Dr. Chen Wei",
    title: "Chief Radiologist",
    department: "radiology",
    departmentName: "Radiology",
    experience: 20,
    education: "MD, Peking Union Medical College; Fellowship, Johns Hopkins",
    specializations: ["Interventional Radiology", "Neuroradiology", "Oncologic Imaging"],
    bio: "Dr. Wei is a world-class radiologist with fellowship training at Johns Hopkins. His expertise in interventional radiology and advanced imaging has elevated our diagnostic capabilities significantly.",
    availability: ["Mon", "Tue", "Thu", "Fri"],
    rating: 4.8,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
    languages: ["English", "Mandarin", "Cantonese"]
  },
  {
    id: "dr-fatima-hassan",
    name: "Dr. Fatima Hassan",
    title: "Emergency Medicine Director",
    department: "emergency",
    departmentName: "Emergency",
    experience: 12,
    education: "MD, Cairo University; EM Residency, Johns Hopkins",
    specializations: ["Trauma Care", "Critical Care", "Toxicology"],
    bio: "Dr. Hassan leads our emergency department with precision and calm under pressure. Her training at Johns Hopkins and extensive trauma experience ensure every patient receives the highest standard of emergency care.",
    availability: ["Available 24/7 on rotation"],
    rating: 4.9,
    reviews: 521,
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&q=80",
    languages: ["English", "Arabic", "French"]
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Margaret Okonkwo",
    role: "Cardiac Patient",
    department: "Cardiology",
    rating: 5,
    text: "Dr. Osei and her team gave me a second chance at life. The care I received at ApexCare was not just medically excellent — it was deeply human. I felt seen, heard, and cared for every step of the way.",
    date: "January 2026",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80"
  },
  {
    id: 2,
    name: "Robert Kimani",
    role: "Parent of Pediatric Patient",
    department: "Pediatrics",
    rating: 5,
    text: "When our son was admitted at 2am with a severe asthma attack, the emergency and pediatric teams responded instantly. Dr. Sharma's calm expertise and the nurses' compassion made an incredibly frightening night manageable.",
    date: "December 2025",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"
  },
  {
    id: 3,
    name: "Amina Diallo",
    role: "Orthopedic Patient",
    department: "Orthopedics",
    rating: 5,
    text: "After my knee replacement with Dr. Adeyemi, I was back to walking without pain within six weeks. The rehabilitation team was exceptional. ApexCare truly delivers world-class care with a warm, personal touch.",
    date: "November 2025",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80"
  },
  {
    id: 4,
    name: "Thomas Mensah",
    role: "Neurology Patient",
    department: "Neurology",
    rating: 5,
    text: "Dr. Mwangi's expertise in epilepsy management changed my life. After years of uncontrolled seizures, I've been seizure-free for eight months. The entire neurology team is outstanding.",
    date: "October 2025",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80"
  }
];

export const blogPosts = [
  {
    id: "understanding-heart-health",
    title: "Understanding Heart Health: 10 Signs You Should Never Ignore",
    excerpt: "Cardiovascular disease remains the leading cause of death globally. Learn the warning signs that demand immediate medical attention and how preventive care can save your life.",
    category: "Cardiology",
    author: "Dr. Amara Osei",
    authorImage: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&q=80",
    date: "February 20, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=800&q=80",
    tags: ["Heart Health", "Prevention", "Cardiology"]
  },
  {
    id: "childrens-vaccination-guide",
    title: "The Complete Vaccination Guide for Children in 2026",
    excerpt: "Vaccines are one of medicine's greatest achievements. This comprehensive guide covers the recommended vaccination schedule for children from birth through age 18, with expert insights from our pediatric team.",
    category: "Pediatrics",
    author: "Dr. Priya Sharma",
    authorImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&q=80",
    date: "February 14, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    tags: ["Pediatrics", "Vaccination", "Child Health"]
  },
  {
    id: "managing-chronic-back-pain",
    title: "Managing Chronic Back Pain: Modern Approaches That Work",
    excerpt: "Chronic back pain affects millions worldwide. Our orthopedic experts share evidence-based strategies combining physical therapy, minimally invasive procedures, and lifestyle modifications.",
    category: "Orthopedics",
    author: "Dr. Samuel Adeyemi",
    authorImage: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&q=80",
    date: "February 8, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    tags: ["Orthopedics", "Pain Management", "Spine"]
  },
  {
    id: "stroke-recognition-fast",
    title: "FAST: Recognizing Stroke Symptoms and Saving Lives",
    excerpt: "Every minute counts during a stroke. Learn the FAST method for recognizing stroke symptoms and understand why immediate emergency response is critical for recovery.",
    category: "Neurology",
    author: "Dr. James Mwangi",
    authorImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&q=80",
    date: "January 30, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
    tags: ["Neurology", "Stroke", "Emergency"]
  }
];

export const stats = [
  { label: "Patients Served", value: "50,000+", icon: "Users" },
  { label: "Expert Specialists", value: "120+", icon: "Stethoscope" },
  { label: "Years of Excellence", value: "25+", icon: "Award" },
  { label: "Departments", value: "18", icon: "Building2" }
];
