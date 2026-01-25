interface Iuser {
  name: string;
  username: string;
  comment: string;
  image: string;
  rowSpan: string;
}

const users = [
  {
    name: "Gerald Makiling",
    username: "@GerMakiling",
    comment:
      "Super convenient yung online appointment system ng Olympus Medical. Hindi ko na kailangan pumila nang matagal para lang magpa-schedule. May reminders pa and mabilis makita yung results. Ang dali-dali ng proseso—highly recommended!",
    rowSpan: "row-span-2",
  },
  {
    name: "Andres Cruz",
    username: "@shaiii29",
    comment:
      "As a parent, sobrang helpful nito. Ang bilis mag-book para sa checkup ng anak ko, tapos may notifications pa bago dumating yung schedule. Hassle-free talaga.",
    rowSpan: "row-span-1",
  },
  {
    name: "Gwyneth Esguerra",
    username: "@gwyn_esguerra19",
    comment:
      "Ang smooth ng system! In less than 2 minutes, naka-book na ako for my lab tests. Maaga pa lumabas yung results, love it!",
    rowSpan: "row-span-1",
  },
  {
    name: "Sir Mike",
    username: "@mike_edward",
    comment:
      "Napaka user-friendly ng app. Kahit yung mga older patients namin sa school clinic, kayang-kaya gamitin.",
    rowSpan: "row-span-1",
  },
  {
    name: "Angel Cuenca",
    username: "@angelcuenca12",
    comment:
      "Since ako yung nag-aasikaso ng appointments ng buong family, sobrang lifesaver nito. Hindi ko na kailangan tumawag sa clinic lagi. Lahat—from booking hanggang results—ayos at mabilis.",
    rowSpan: "row-span-2",
  },
  {
    name: "Lara Chua",
    username: "@laraaa_",
    comment:
      "Ang organized ng process pagdating sa clinic. Pagpasok ko, alam na agad ng staff yung appointment ko. Walang waiting time masyado.",
    rowSpan: "row-span-1",
  },
  {
    name: "Sharlien Vargas",
    username: "@SharVargas",
    comment:
      "Dati sobrang hassle magpa-lab test, pero ngayon mabilis lahat. Book online, punta sa clinic, then results agad. Sobrang laking ginhawa!",
    rowSpan: "row-span-2",
  },
  {
    name: "Sheryll Dumlao",
    username: "@dumlaosheryll",
    comment:
      "Ang ganda ng appointment validation nila. Pagdating mo, alam agad ng staff kung ano yung test mo. Very smooth ang flow.",
    rowSpan: "row-span-1",
  },
  {
    name: "Veloria Araneta",
    username: "@vel_araneta18",
    comment:
      "Game changer yung online booking at results tracking! Mas mabilis, mas organized, at mas convenient ang clinic visit.",
    rowSpan: "row-span-1",
  },
];

export { users };
export type { Iuser };
