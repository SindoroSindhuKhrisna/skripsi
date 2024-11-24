import { Banknote, Blend, FilePenLine, FilePlus, FileSearch2, Globe, House, Printer, Replace, Stamp, TicketX, UserPen } from "lucide-react";

export default function sidebarMenu() {
  return [
    {
      "name": "Beranda",
      "link": "/",
      "icon": House
    },
    {
      "id": 11,
      "name": "Polisi",
      "menu": [
        {
          "id": 1111,
          "name": "Pendaftaran",
          "link": "/polisi/pendaftaran",
          "icon": FilePlus
        },
        {
          "id": 1112,
          "name": "Penelitian Regident",
          "link": "/polisi/regident",
          "icon": FileSearch2
        },
        {
          "id": 1113,
          "name": "Rubah Identitas Ranmor",
          "link": "/polisi/rubentina",
          "icon": FilePenLine,
          "submenu": [
            {
              "id": 111311,
              "name": "Alih Kepemilikan",
              "link": "/polisi/rubentina/pendaftaran",
              "icon": UserPen
            },
            {
              "id": 111312,
              "name": "Ganti NRKB / Warna TNKB",
              "link": "/polisi/rubentina/penelitian",
              "icon": Replace
            },
            {
              "id": 111313,
              "name": "Rubah Bentuk",
              "link": "/polisi/rubentina/rubah-bentuk",
              "icon": Blend
            }
          ]
        }
      ]
    },
    {
      "id": 12,
      "name": "Jasa Raharja",
      "menu": [
        {
          "id": 1211,
          "name": "Penetapan",
          "icon": Stamp,
          "link": "/jasa-raharja/penetapan"
        },
        {
          "id": 1212,
          "name": "Rekap Penerimaan SWDKLLJ",
          "icon": FileSearch2,
          "link": "/jasa-raharja/rekap"
        }
      ]
    },
    {
      "id": 13,
      "name": "PKB dan BBN-KB",
      "menu": [
        {
          "id": 1311,
          "name": "Penetapan",
          "icon": Stamp,
          "link": "/pkbbbnkb/penetapan"
        },
        {
          "id": 1312,
          "name": "Notice Pajak",
          "icon": Banknote,
          "submenu": [
            {
              "id": 131211,
              "name": "Cetak Notice Pajak",
              "link": "/pkbbbnkb/notice-pajak/cetak",
              "icon": Printer
            },
            {
              "id": 131212,
              "name": "Cetak Notice Pajak E-Samsat",
              "link": "/pkbbbnkb/notice-pajak/cetak-esamsat",
              "icon": Globe
            },
            {
              "id": 131213,
              "name": "Pembatalan Notice Pajak",
              "link": "/pkbbbnkb/notice-pajak/batal",
              "icon": TicketX
            }
          ]
        }
      ]
    },
    {
      "id": 14,
      "name": "E-Samsat",
      "menu": [
        {
          "id": 1411,
          "name": "Pendaftaran",
          "icon": FilePlus,
          "link": "/esamsat"
        }
      ]
    },
    {
      "id": 15,
      "name": "Notice Pajak",
      "menu": [
        {
          "id": 1511,
          "name": "Cetak Notice Pajak",
          "icon": Printer,
          "link": "/notice"
        }
      ]
    }
  ]
}