// Dictionnaire des personnages avec leurs liens et rangs par univers
const characters = {
    'C': {
        'HUNTER_X_HUNTER': {
            'SILVA': {'lien': 'https://i.ibb.co/ns12wpMg/Image-2025-04-27-21-46-47-4.jpg'},
            'KURAPIKA': {'lien': 'https://i.ibb.co/YBBfNJ7h/Image-2025-04-27-21-46-47-2.jpg'},
            'HISOKA': {'lien': 'https://i.ibb.co/ymHYbFmZ/Image-2025-04-27-21-46-47-3.jpg'}
        },
        'ONE_PIECE': {
            'NAMI': {'lien': 'https://i.ibb.co/N6YgjsfM/Image-2025-04-27-21-46-47-7.jpg'},
            'SANJI': {'lien': 'https://i.ibb.co/p6SjB2QV/Image-2025-04-27-21-46-47-8.jpg'},
            'ROBIN': {'lien': 'https://i.ibb.co/ds6kyhPG/Image-2025-04-27-21-46-47-9.jpg'},
            'BROOKS': {'lien': 'https://i.ibb.co/Cssw7Fs6/Image-2025-04-27-21-46-47-10.jpg'},
            'LAW': {'lien': 'https://i.ibb.co/DHjtmp02/Image-2025-04-27-21-46-47-11.jpg'}
        },
        'NARUTO_SHIPPUDEN': {
            'NARUTO': {'lien': 'https://i.ibb.co/pvyN2XMW/Image-2025-07-27-11-18-40-0.jpg'},
            'SAKURA': {'lien': 'https://i.ibb.co/4ZFzSqk9/Image-2025-07-27-11-18-40-4.jpg'},
            'GAARA': {'lien': 'https://i.ibb.co/VP3sZZn/Image-2025-07-27-11-18-40-3.jpg'},
            'CHIYO': {'lien': 'https://i.ibb.co/5gvByqbm/Image-2025-07-27-11-18-40-2.jpg'},
            'SAI': {'lien': 'https://i.ibb.co/sdLRgVkq/Image-2025-07-27-11-18-40-1.jpg'},
            'KABUTO': {'lien': 'https://i.ibb.co/tpcZKd42/Image-2025-07-27-11-18-40-7.jpg'},
            'JUGO': {'lien': 'https://i.ibb.co/qYF7vLkV/Image-2025-07-27-11-18-40-6.jpg'},
            'SUIGETSU': {'lien': 'https://i.ibb.co/v6g4DYrC/Image-2025-07-27-11-18-40-5.jpg'},
            'KANKURO': {'lien': 'https://i.ibb.co/xKYZh4CG/Image-2025-07-27-11-18-40-8.jpg'},
            'KAKASHI': {'lien': 'https://i.ibb.co/99PCrDwD/Image-2025-07-27-11-18-40-9.jpg'},
            'DANZO': {'lien': 'https://i.ibb.co/j9dRWYqc/Image-2025-07-27-11-18-40-12.jpg'},
            'OBITO': {'lien': 'https://i.ibb.co/1tjj0xNH/Image-2025-07-27-11-18-40-10.jpg'},
            'SHIKAMARU': {'lien': 'https://i.ibb.co/2Y03SZsr/Image-2025-07-27-11-18-40-11.jpg'},
            'LEE': {'lien': 'https://i.ibb.co/cKh8HXPP/Image-2025-07-27-11-18-40-13.jpg'},
            'HINATA': {'lien': 'https://i.ibb.co/h1DjzdKX/Image-2025-07-27-11-18-40-15.jpg'},
            'INO': {'lien': 'https://i.ibb.co/QFWLBMgB/Image-2025-07-27-11-18-40-14.jpg'},
            'TENTEN': {'lien': 'https://i.ibb.co/rGBsdmbq/Image-2025-07-27-11-18-40-16.jpg'},
            'NEJI': {'lien': 'https://i.ibb.co/BHYmg4Z3/Image-2025-07-27-11-18-40-18.jpg'},
            'SHINO': {'lien': 'https://i.ibb.co/3YmYDR6Y/Image-2025-07-27-11-18-40-17.jpg'},
            'KONAN': {'lien': 'https://i.ibb.co/svYmDpfK/Image-2025-07-27-11-18-40-19.jpg'},
            'KIBA': {'lien': 'https://i.ibb.co/SDgSptfC/Image-2025-07-27-11-18-40-21.jpg'},
            'CHOJI': {'lien': 'https://i.ibb.co/BHf2m8FP/Image-2025-07-27-11-18-40-20.jpg'},
            'OMOI': {'lien': 'https://i.ibb.co/Cr2fjzz/Image-2025-07-27-11-18-41-23.jpg'},
            'TEMARI': {'lien': 'https://i.ibb.co/99kyCgyR/Image-2025-07-27-11-18-41-22.jpg'}
        },
        'ONE_PUNCH_MAN': {
            'GENOS': { lien: 'https://i.ibb.co/VW4XRWwg/Image-2025-03-03-15-12-14-0.jpg' },
            'BANG': { lien: 'https://i.ibb.co/LdqTLWgP/Image-2025-03-03-15-12-14-1.jpg' },
            'BLIZZARD': { lien: 'https://i.ibb.co/KpLT4RHQ/Image-2025-03-03-15-12-14-2.jpg' },
            'METAL_BAT': { lien: 'https://i.ibb.co/n8rTT5JH/Image-2025-03-03-15-12-14-3.jpg' },
            'ATOMIC_SAMURAI': { lien: 'https://i.ibb.co/xS7JRrFS/Image-2025-03-03-15-12-14-5.jpg' },
            'TANKTOP_MARCEL': { lien: 'https://i.ibb.co/rfzJwp5z/Image-2025-03-03-15-12-14-4.jpg' },
            'SONIC': { lien: 'https://i.ibb.co/N60bQyQX/Image-2025-03-03-15-12-14-6.jpg' },
            'GAROU': { lien: 'https://i.ibb.co/mV3xW4pS/Image-2025-03-03-15-12-14-8.jpg' },
            'SUIRYU': { lien: 'https://i.ibb.co/QFK6sRq5/Image-2025-03-03-15-12-14-7.jpg' }
        },
        'BLACK_CLOVER': {
            'ASTA': { lien: 'https://i.ibb.co/khfFhfQ/Image-2024-10-02-19-26-48-0.jpg' },
            'NOELLE': { lien: 'https://i.ibb.co/kMbkzL9/Image-2024-10-02-19-26-48-3.jpg' },
            'MAGNA': { lien: 'https://i.ibb.co/DfDv87k/Image-2024-10-02-19-26-48-2.jpg' },
            'GAUCHE': { lien: 'https://i.ibb.co/KFNVJ9h/Image-2024-10-02-19-26-48-4.jpg' },
            'YUNO': { lien: 'https://i.ibb.co/K7yv6pw/Image-2024-10-02-19-26-48-1.jpg' },
            'VANESSA': { lien: 'https://i.ibb.co/DDSGBnH/Image-2024-10-02-19-26-48-7.jpg' },
            'ZORA': { lien: 'https://i.ibb.co/0cDXhjK/Image-2024-10-02-19-26-48-8.jpg' },
            'LANGRIS': { lien: 'https://i.ibb.co/rGbpzD4/Image-2024-10-02-19-26-48-9.jpg' },
            'LEOPOLD': { lien: 'https://i.ibb.co/Cw3yfjD/Image-2024-10-02-19-26-48-6.jpg' },
            'LUCK': { lien: 'https://i.ibb.co/PMwq7ZC/Image-2024-10-02-19-26-48-5.jpg' }
        },
        'FAIRY_TAIL': {
            'ROGUE': {'lien': 'https://i.ibb.co/MxCbY7mx/Image-2025-02-12-16-42-49-7.jpg'},
            'LYON': {'lien': 'https://i.ibb.co/gMtX2t32/Image-2025-02-12-16-42-49-8.jpg'},
            'GAJEEL': {'lien': 'https://i.ibb.co/mVspng8r/Image-2025-02-12-16-42-49-5.jpg'},
            'STING': {'lien': 'https://i.ibb.co/xqcBw6YK/Image-2025-02-12-16-42-49-6.jpg'},
            'GRAY': {'lien': 'https://i.ibb.co/ZpjczDny/Image-2025-02-12-16-42-49-3.jpg'},
            'LUCY': {'lien': 'https://i.ibb.co/C3rKy3Pj/Image-2025-02-12-16-42-49-2.jpg'},
            'WENDY': {'lien': 'https://i.ibb.co/m5VJZMNR/Image-2025-02-12-16-42-49-4.jpg'}
        },
        'MY_HERO_ACADEMIA': {
            'FUMIKAGE': {'lien': 'https://i.ibb.co/6R1y6Tmx/Image-2025-02-12-13-12-17-4.jpg'},
            'DABI': {'lien': 'https://i.ibb.co/4RSk9xwP/Image-2025-02-12-13-12-17-7.jpg'},
            'SHOTO': {'lien': 'https://i.ibb.co/C3954bBv/Image-2025-02-12-13-12-17-6.jpg'},
            'NEJIRE': {'lien': 'https://i.ibb.co/Gfb9fWSZ/Image-2025-02-12-13-12-17-9.jpg'},
            'MIRKO': {'lien': 'https://i.ibb.co/5W9MHzwM/Image-2025-02-12-13-12-17-8.jpg'},
            'OVERHAUL': {'lien': 'https://i.ibb.co/nM0hYLwM/Image-2025-02-12-13-12-17-11.jpg'},
            'HAWKS': {'lien': 'https://i.ibb.co/FkT1xJBT/Image-2025-02-12-13-12-17-10.jpg'},
            'HIMIKO': {'lien': 'https://i.ibb.co/d4L6P4BK/Image-2025-02-12-13-12-17-12.jpg'},
            'OCHACO': {'lien': 'https://i.ibb.co/7dGVxvwt/Image-2025-02-12-13-12-17-5.jpg'},
            'LEMILLION': {'lien': 'https://i.ibb.co/9mL6dF7Z/Image-2025-02-12-13-12-17-2.jpg'},
            'MOMO': {'lien': 'https://i.ibb.co/svhRjbsh/Image-2025-02-12-13-12-17-3.jpg'},
            'BAKUGO': {'lien': 'https://i.ibb.co/rGP0WrR8/Image-2025-02-12-13-12-17-0.jpg'},
            'DEKU': {'lien': 'https://i.ibb.co/qMy95d4P/Image-2025-02-12-13-12-17-1.jpg'}
        },
        'BORUTO': {
            'INOJIN': {'lien': 'https://i.ibb.co/Kz9yCJbn/Image-2025-02-16-13-22-54-7.jpg'},
            'SHIKADAI': {'lien': 'https://i.ibb.co/bjLJP2Bq/Image-2025-02-16-13-22-54-8.jpg'},
            'SHIN': {'lien': 'https://i.ibb.co/qLnKWwK6/Image-2025-02-16-13-22-54-5.jpg'},
            'SHINKI': {'lien': 'https://i.ibb.co/gZ2wwZm9/Image-2025-02-16-13-22-54-6.jpg'},
            'KAWAKI': {'lien': 'https://i.ibb.co/gLxs2TJH/Image-2025-02-16-13-22-54-4.jpg'},
            'SARADA': {'lien': 'https://i.ibb.co/LX83Y3Y1/Image-2025-02-16-13-22-54-3.jpg'},
            'METAL_LEE': {'lien': 'https://i.ibb.co/ycmNTNY9/Image-2025-02-16-13-22-54-1.jpg'},
            'MITSUKI': {'lien': 'https://i.ibb.co/XZwSCcmH/Image-2025-02-16-13-22-54-2.jpg'},
            'BORUTO': {'lien': 'https://i.ibb.co/svrmRCq8/Image-2025-02-16-13-22-54-0.jpg'}
        },
        'DEMON_SLAYER': {
            'TANJIRO_WB': { lien: 'https://i.ibb.co/NsZp3mb/Image-2024-10-02-19-51-46-0.jpg' },
            'NEZUKO': { lien: 'https://i.ibb.co/DGMgsBR/Image-2024-10-02-19-51-46-1.jpg' },
            'ZENITSU': { lien: 'https://i.ibb.co/nQZt1nM/Image-2024-10-02-19-51-46-2.jpg' },
            'INOSUKE': { lien: 'https://i.ibb.co/2PsDh85/Image-2024-10-02-19-51-46-3.jpg' },
            'YAHABA': { lien: 'https://i.ibb.co/SNhjnbW/Image-2024-10-02-19-51-46-4.jpg' },
            'SUSAMARU': { lien: 'https://i.ibb.co/JsfJKSr/Image-2024-10-02-19-51-46-5.jpg' },
            'RIU': { lien: 'https://i.ibb.co/7gh2Hvz/Image-2024-10-02-19-51-46-6.jpg' },
            'ENMU': { lien: 'https://i.ibb.co/gVCfKsX/Image-2024-10-02-19-51-46-7.jpg' },
            'TANJIRO_SB': { lien: 'https://i.ibb.co/K9xHhtJ/Image-2024-10-02-19-51-46-8.jpg' },
            'KANAO': { lien: 'https://i.ibb.co/FxRz0Kx/Image-2024-10-02-19-51-46-9.jpg' }
        },
        'JUJUTSU_KAISEN': {
            'YUJI': { lien: 'https://i.ibb.co/kGrfKgW/Image-2024-10-02-20-05-39-0.jpg' },
            'MEGUMI': { lien: 'https://i.ibb.co/VMXWTgh/Image-2024-10-02-20-05-39-1.jpg' },
            'AOI': { lien: 'https://i.ibb.co/FDqvc7r/Image-2024-10-02-20-05-39-2.jpg' },
            'NOBARA': { lien: 'https://i.ibb.co/znZCXYX/Image-2024-10-02-20-05-39-3.jpg' },
            'NANAMI': { lien: 'https://i.ibb.co/j6GrFtm/Image-2024-10-02-20-05-39-4.jpg' },
            'MAKI': { lien: 'https://i.ibb.co/4Vbv31Q/Image-2024-10-02-20-05-39-5.jpg' },
            'MAHITO': { lien: 'https://i.ibb.co/cgySkn4/Image-2024-10-02-20-05-39-6.jpg' },
            'MIWA': { lien: 'https://i.ibb.co/vd0FNTL/Image-2024-10-02-20-05-39-7.jpg' },
            'TOGE': { lien: 'https://i.ibb.co/kMVTKLy/Image-2024-10-02-20-05-39-8.jpg' },
            'MAI': { lien: 'https://i.ibb.co/RH46BwN/Image-2024-10-02-20-05-39-9.jpg' },
            'CHOSO': { lien: 'https://i.ibb.co/27fNC4H/Image-2024-10-02-20-05-39-10.jpg' },
            'GETO': { lien: 'https://i.ibb.co/dgn0FHn/Image-2024-10-02-20-05-39-11.jpg' },
            'MECHAMARU': { lien: 'https://i.ibb.co/cgdRNfG/Image-2024-10-02-20-05-39-12.jpg' },
            'INO': { lien: 'https://i.ibb.co/6HSKdfR/Image-2024-10-02-20-05-39-13.jpg' },
            'KAMO': { lien: 'https://i.ibb.co/XVdST0Y/Image-2024-10-02-20-05-39-14.jpg' }
        }
    },
    'B': {
        'FAIRYTAIL': {
            'NATSU': { lien: 'https://i.ibb.co/1GjBFZBY/Image-2025-02-12-16-42-49-0.jpg' },
            'ERZA': { lien: 'https://i.ibb.co/DNr8tTK/Image-2025-02-12-16-42-49-1.jpg' }
        },
        'ONE_PIECE': {
            'LUFFY': { lien: 'https://i.ibb.co/pvMzqq0K/Image-2025-04-27-21-46-47-5.jpg' },
            'ZORO': { lien: 'https://i.ibb.co/35BPKMnX/Image-2025-04-27-21-46-47-6.jpg' }
        },
        'HUNTER_X_HUNTER': {
            'GON': { lien: 'https://i.ibb.co/5Wsh5q32/Image-2025-04-27-21-46-47-0.jpg' },
            'KILUA': { lien: 'https://i.ibb.co/bwgmPkJ/Image-2025-04-27-21-46-47-1.jpg' }
        }
    },
    'A': {
        'JUJUTSU_KAISEN': {
            'GOJO_CG': { lien: 'https://i.ibb.co/vCqcZzqN/Image-2025-03-09-15-40-36-0.jpg' },
            'SUKUNA_CG': { lien: 'https://i.ibb.co/hJzZXCzf/Image-2025-03-09-15-40-36-1.jpg' }
        }
    }
};

module.exports = {
    characters
};