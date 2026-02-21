import { Product } from '../types';

export const products: Product[] = [
  {
    id: 1,
    name: "כבושים מסורתיים",
    description: "מלפפונים חמוצים בסגנון הבית שלנו, עם שום ושמיר",
    imageUrl: "/src/assets/products/pickles-traditional.jpg",
    details: [
      "מתכון משפחתי מסורתי",
      "תהליך התססה טבעי",
      "ללא חומרים משמרים",
      "נשמר עד 6 חודשים במקרר"
    ],
    featured: true
  },
  {
    id: 2,
    name: "קימצ'י קוריאני",
    description: "קימצ'י מסורתי בסגנון קוריאני עם כרוב וצ'ילי",
    imageUrl: "/src/assets/products/kimchi-korean.jpg",
    details: [
      "מתכון קוריאני מסורתי",
      "חריף במידה",
      "עשיר בפרוביוטיקה",
      "מושלם כתוספת לכל ארוחה"
    ],
    featured: true
  },
  {
    id: 3,
    name: "לימונים כבושים",
    description: "לימונים כבושים מסורתיים בסגנון מרוקאי",
    imageUrl: "/src/assets/products/lemons-preserved.jpg",
    details: [
      "לימונים אורגניים",
      "תהליך כבישה מסורתי",
      "מושלם למטבח המרוקאי",
      "נותן טעם עשיר לתבשילים"
    ]
  },
  {
    id: 4,
    name: "ירקות מוחמצים מעורבים",
    description: "תערובת ירקות כבושים בסגנון אסייתי",
    imageUrl: "/src/assets/products/mixed-pickled-vegetables.jpg",
    details: [
      "מבחר ירקות עונתיים",
      "תיבול אסייתי מסורתי",
      "מתאים לטבעונים",
      "נהדר כתוספת לאורז"
    ]
  },
  {
    id: 5,
    name: "ריבת תות ביתית",
    description: "ריבת תות עשירה וארומטית מתותים טריים",
    imageUrl: "/src/assets/products/strawberry-jam.jpg",
    details: [
      "תותים מקומיים",
      "מתיקות מאוזנת",
      "ללא חומרים משמרים",
      "מושלם לארוחת בוקר"
    ]
  }
];