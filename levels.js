// Level Data Structure and Default Levels

// Level format structure:
// {
//   id: number,
//   name: string,
//   player: { x: number (0-1 relative), y: number (0-1 relative) },
//   arcGates: [{ x, y, width, height (all 0-1 relative), active: true }],
//   slippageClouds: [{ x, y, radius (all 0-1 relative) }],
//   settlementZone: { x, y, width, height (all 0-1 relative) }
// }

const DEFAULT_LEVELS = [
    {
        id: 1,
        name: "First Launch",
        player: {
            x: 0.1,
            y: 0.8
        },
        arcGates: [
            {
                x: 0.43450969257993116,
                y: 0.4927021901778504,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0
            }
        ],
        slippageClouds: [],
        settlementZone: {
            x: 0.8262743843967434,
            y: 0.10366105580402393,
            width: 0.1,
            height: 0.13,
            rotation: 0
        },
        barriers: [
            {
                x: 0.8774508531475883,
                y: 0.5876793170445674,
                width: 0.01,
                height: 0.3,
                size: "large",
                rotation: 240
            }
        ],
        lifeRestores: []
    },
    {
        id: 2,
        name: "Pathfinder",
        player: {
            x: 0.08,
            y: 0.78
        },
        arcGates: [
            {
                x: 0.6498038024972784,
                y: 0.3857223747065923,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0
            },
            {
                x: 0.3471731448763251,
                y: 0.01762632197414804,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0
            }
        ],
        slippageClouds: [],
        settlementZone: {
            x: 0.86,
            y: 0.7,
            width: 0.1,
            height: 0.13
        },
        barriers: [
            {
                x: 0.7256861527140481,
                y: 0.06634860542793392,
                width: 0.01,
                height: 0.2,
                size: "medium",
                rotation: 270
            },
            {
                x: 0.550980276633578,
                y: 0.6953033269223726,
                width: 0.01,
                height: 0.3,
                size: "large",
                rotation: 90
            },
            {
                x: 0.8280390902157381,
                y: 0.6743068347357444,
                width: 0.01,
                height: 0.2,
                size: "medium",
                rotation: 0
            }
        ],
        lifeRestores: []
    },
    {
        id: 3,
        name: "Create an arc",
        player: {
            x: 0.1,
            y: 0.8
        },
        arcGates: [
            {
                x: 0.5,
                y: 0.4,
                width: 0.05,
                height: 0.13,
                active: true
            }
        ],
        slippageClouds: [
            {
                x: 0.3003920503363378,
                y: 0.5829826439669401,
                radius: 0.06
            }
        ],
        settlementZone: {
            x: 0.85,
            y: 0.75,
            width: 0.1,
            height: 0.13
        },
        barriers: [
            {
                x: 0.69215674215315,
                y: 0.6722194324418593,
                width: 0.01,
                height: 0.3,
                size: "large",
                rotation: 0
            }
        ],
        lifeRestores: []
    },
    {
        id: 4,
        name: "Pass through the gate",
        player: {
            x: 0.1,
            y: 0.75
        },
        arcGates: [
            {
                x: 0.42117646982793583,
                y: 0.4063600769315279,
                width: 0.05,
                height: 0.13,
                active: true
            },
            {
                x: 0.6394117650860321,
                y: 0.4831702500274658,
                width: 0.05,
                height: 0.13,
                active: true
            }
        ],
        slippageClouds: [
            {
                x: 0.2570588232759786,
                y: 0.563405086547969,
                radius: 0.06
            }
        ],
        settlementZone: {
            x: 0.82,
            y: 0.75,
            width: 0.1,
            height: 0.13
        },
        barriers: [
            {
                x: 0.7768626214648933,
                y: 0.730927845912201,
                width: 0.01,
                height: 0.2,
                size: "medium",
                rotation: 0
            }
        ],
        lifeRestores: []
    },
    {
        id: 5,
        name: "Routing",
        player: {
            x: 0.12,
            y: 0.78
        },
        arcGates: [
            {
                x: 0.6127449802983908,
                y: 0.5122716135576015,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0
            }
        ],
        slippageClouds: [],
        settlementZone: {
            x: 0.85,
            y: 0.72,
            width: 0.1,
            height: 0.13
        },
        barriers: [
            {
                x: 0.3921567529240596,
                y: 0.6649134885804897,
                width: 0.01,
                height: 0.3,
                size: "large",
                rotation: 15
            },
            {
                x: 0.2898038154223699,
                y: 0.3575423362408283,
                width: 0.01,
                height: 0.3,
                size: "large",
                rotation: 0
            }
        ],
        lifeRestores: []
    },
    {
        id: 6,
        name: "Two barriers",
        player: {
            x: 0.15470588038883415,
            y: 0.12769081721437897
        },
        arcGates: [
            {
                x: 0.5386273359006155,
                y: 0.43973411509930654,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0
            }
        ],
        slippageClouds: [
            {
                x: 0.42215675184696866,
                y: 0.27195855552936576,
                radius: 0.06
            }
        ],
        settlementZone: {
            x: 0.07058826291833266,
            y: 0.6425048942191487,
            width: 0.1,
            height: 0.13
        },
        barriers: [
            {
                x: 0.19098028955866955,
                y: 0.16706614235199294,
                width: 0.01,
                height: 0.3,
                size: "large",
                rotation: 90
            },
            {
                x: 0.7062743887051073,
                y: 0.20255212467912648,
                width: 0.01,
                height: 0.3,
                size: "large",
                rotation: 0
            },
            {
                x: 0.3515685190871827,
                y: 0.6886577882135549,
                width: 0.01,
                height: 0.2,
                size: "medium",
                rotation: 90
            },
            {
                x: 0.3180391085262843,
                y: 0.47704656547539664,
                width: 0.01,
                height: 0.12,
                size: "small",
                rotation: 0
            }
        ],
        lifeRestores: []
    },
    {
        id: 7,
        name: "Looks simple",
        player: {
            x: 0.07293286219081273,
            y: 0.10370152761457108
        },
        arcGates: [
            {
                x: 0.32102473498233214,
                y: 0.09553466509988251,
                width: 0.05,
                height: 0.13,
                active: true
            },
            {
                x: 0.5566784452296821,
                y: 0.29774383078730915,
                width: 0.05,
                height: 0.13,
                active: true
            }
        ],
        slippageClouds: [
            {
                x: 0.4673144876325089,
                y: 0.2596944770857814,
                radius: 0.06
            }
        ],
        settlementZone: {
            x: 0.04614840989399294,
            y: 0.7833607520564043,
            width: 0.1,
            height: 0.13
        },
        barriers: [
            {
                x: 0.6298586572438163,
                y: 0.36075205640423025,
                width: 0.01,
                height: 0.3,
                size: "large",
                rotation: 30
            }
        ],
        lifeRestores: []
    },
    {
        id: 8,
        name: "Storm Warning",
        player: {
            x: 0.8570587963487049,
            y: 0.8140117403927143
        },
        arcGates: [
            {
                x: 0.7323321554770317,
                y: 0.20329024676850765,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0
            },
            {
                x: 0.4443462897526502,
                y: 0.7555816686251466,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0
            }
        ],
        slippageClouds: [],
        settlementZone: {
            x: 0.06651469887648757,
            y: 0.7446523806371512,
            width: 0.1,
            height: 0.13
        },
        barriers: [
            {
                x: 0.20862734774861605,
                y: 0,
                width: 0.01,
                height: 0.3,
                size: "large",
                rotation: 90
            },
            {
                x: 0.21215675938660533,
                y: 0.3045743328278285,
                width: 0.01,
                height: 0.3,
                size: "large",
                rotation: 0
            },
            {
                x: 0.21215675938660533,
                y: 0.6198019502536753,
                width: 0.01,
                height: 0.3,
                size: "large",
                rotation: 0
            },
            {
                x: 0.010980296021215245,
                y: 0.3079663346808128,
                width: 0.01,
                height: 0.3,
                size: "large",
                rotation: 0
            },
            {
                x: 0.010980296021215242,
                y: 0.6249917674206574,
                width: 0.01,
                height: 0.3,
                size: "large",
                rotation: 0
            },
            {
                x: 0.7517667844522968,
                y: 0.45475910693302,
                width: 0.01,
                height: 0.3,
                size: "large",
                rotation: 0
            },
            {
                x: 0.465547703180212,
                y: 0.7696827262044653,
                width: 0.01,
                height: 0.3,
                size: "large",
                rotation: 90
            }
        ],
        lifeRestores: []
    },
    {
        id: 9,
        name: "The Gauntlet",
        player: {
            x: 0.08,
            y: 0.78
        },
        arcGates: [
            {
                x: 0.241696113074205,
                y: 0.3647003525264395,
                width: 0.05,
                height: 0.13,
                active: true
            },
            {
                x: 0.3987279151943463,
                y: 0.13783783783783785,
                width: 0.05,
                height: 0.13,
                active: true
            },
            {
                x: 0.5905300353356892,
                y: 0.23539365452408928,
                width: 0.05,
                height: 0.13,
                active: true
            },
            {
                x: 0.7370318021201413,
                y: 0.3576498237367802,
                width: 0.05,
                height: 0.13,
                active: true
            }
        ],
        slippageClouds: [
            {
                x: 0.5167844522968198,
                y: 0.2784958871915394,
                radius: 0.06
            },
            {
                x: 0.6828621908127208,
                y: 0.36310223266745006,
                radius: 0.06
            },
            {
                x: 0.3330388692579505,
                y: 0.28319623971797886,
                radius: 0.06
            }
        ],
        settlementZone: {
            x: 0.82,
            y: 0.66,
            width: 0.1,
            height: 0.13
        },
        barriers: [
            {
                x: 0.22349823321554776,
                y: 0.6474735605170387,
                width: 0.01,
                height: 0.3,
                size: "large",
                rotation: 0
            }
        ],
        lifeRestores: []
    },
    {
        id: 10,
        name: "Fully Backed",
        player: {
            x: 0.08,
            y: 0.78
        },
        arcGates: [
            {
                x: 0.2121,
                y: 0.7088,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0
            },
            {
                x: 0.7161,
                y: 0.6016,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0
            }
        ],
        slippageClouds: [
            {
                x: 0.6386,
                y: 0.674,
                radius: 0.06
            }
        ],
        settlementZone: {
            x: 0.84,
            y: 0.6,
            width: 0.1,
            height: 0.13
        },
        barriers: [
            {
                x: 0.2476,
                y: 0.4385,
                width: 0.01,
                height: 0.3,
                size: "large",
                rotation: 312
            }
        ],
        lifeRestores: []
    },
    {
        id: 11,
        name: "One In, One Out",
        player: {
            x: 0.88,
            y: 0.78
        },
        arcGates: [
            {
                x: 0.2523,
                y: 0.4668,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0
            },
            {
                x: 0.7895,
                y: 0.4081,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0
            }
        ],
        slippageClouds: [
            {
                x: 0.2046,
                y: 0.4704,
                radius: 0.06
            }
        ],
        settlementZone: {
            x: 0.06,
            y: 0.58,
            width: 0.1,
            height: 0.13
        },
        barriers: [
            {
                x: 0.6394,
                y: 0.559,
                width: 0.01,
                height: 0.3,
                size: "large",
                rotation: 190
            }
        ],
        lifeRestores: []
    },
    {
        id: 12,
        name: "Not Only Dollars",
        player: {
            x: 0.1,
            y: 0.14
        },
        arcGates: [
            {
                x: 0.7735,
                y: 0.3591,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0
            },
            {
                x: 0.23,
                y: 0.0056,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0
            }
        ],
        slippageClouds: [
            {
                x: 0.6693,
                y: 0.2737,
                radius: 0.06
            }
        ],
        settlementZone: {
            x: 0.82,
            y: 0.72,
            width: 0.1,
            height: 0.13
        },
        barriers: [
            {
                x: 0.3289,
                y: 0.1382,
                width: 0.01,
                height: 0.3,
                size: "large",
                rotation: 6
            }
        ],
        lifeRestores: []
    },
    {
        id: 13,
        name: "Both Legs at Once",
        player: {
            x: 0.08,
            y: 0.8
        },
        arcGates: [
            {
                x: 0.7627,
                y: 0.4709,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0
            },
            {
                x: 0.2343,
                y: 0.4441,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0
            }
        ],
        slippageClouds: [
            {
                x: 0.2486,
                y: 0.6434,
                radius: 0.06
            },
            {
                x: 0.7034,
                y: 0.5223,
                radius: 0.06
            }
        ],
        settlementZone: {
            x: 0.86,
            y: 0.78,
            width: 0.09,
            height: 0.11
        },
        barriers: [
            {
                x: 0.3291,
                y: 0.6524,
                width: 0.01,
                height: 0.3,
                size: "large",
                rotation: 337
            }
        ],
        lifeRestores: []
    },
    {
        id: 14,
        name: "Sealed Envelope",
        player: {
            x: 0.09,
            y: 0.76
        },
        arcGates: [
            {
                x: 0.6836,
                y: 0.3179,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0
            },
            {
                x: 0.2967,
                y: 0.5303,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0
            }
        ],
        slippageClouds: [
            {
                x: 0.5499,
                y: 0.4455,
                radius: 0.06
            }
        ],
        settlementZone: {
            x: 0.82,
            y: 0.26,
            width: 0.1,
            height: 0.13
        },
        barriers: [
            {
                x: 0.2509,
                y: 0.4135,
                width: 0.01,
                height: 0.2,
                size: "medium",
                rotation: 321
            }
        ],
        lifeRestores: [
            {
                x: 0.436,
                y: 0.5623,
                radius: 0.022
            }
        ]
    },
    {
        id: 15,
        name: "Who Signs the Block",
        player: {
            x: 0.88,
            y: 0.74
        },
        arcGates: [
            {
                x: 0.5403,
                y: 0.2965,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0
            },
            {
                x: 0.7137,
                y: 0.3268,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0
            }
        ],
        slippageClouds: [
            {
                x: 0.8197,
                y: 0.459,
                radius: 0.06
            },
            {
                x: 0.2564,
                y: 0.304,
                radius: 0.06
            }
        ],
        settlementZone: {
            x: 0.09,
            y: 0.36,
            width: 0.1,
            height: 0.13
        },
        barriers: [
            {
                x: 0.6511,
                y: 0.4704,
                width: 0.01,
                height: 0.3,
                size: "large",
                rotation: 178
            }
        ],
        lifeRestores: []
    },
    {
        id: 16,
        name: "Correspondent",
        player: {
            x: 0.86,
            y: 0.12
        },
        arcGates: [
            {
                x: 0.1985,
                y: 0.4876,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0
            },
            {
                x: 0.2924,
                y: 0.411,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0
            },
            {
                x: 0.6403,
                y: 0.2393,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0
            }
        ],
        slippageClouds: [
            {
                x: 0.326,
                y: 0.3254,
                radius: 0.06
            }
        ],
        settlementZone: {
            x: 0.07,
            y: 0.74,
            width: 0.1,
            height: 0.13
        },
        barriers: [
            {
                x: 0.2794,
                y: 0.5705,
                width: 0.01,
                height: 0.3,
                size: "large",
                rotation: 127
            },
            {
                x: 0.3987,
                y: -0.0169,
                width: 0.01,
                height: 0.2,
                size: "medium",
                rotation: 125
            }
        ],
        lifeRestores: []
    },
    {
        id: 17,
        name: "Institutional Traffic",
        player: {
            x: 0.08,
            y: 0.74
        },
        arcGates: [
            {
                x: 0.7209,
                y: 0.2815,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0
            },
            {
                x: 0.3278,
                y: 0.2348,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0
            }
        ],
        slippageClouds: [
            {
                x: 0.2528,
                y: 0.5204,
                radius: 0.06
            },
            {
                x: 0.8155,
                y: 0.4552,
                radius: 0.06
            }
        ],
        settlementZone: {
            x: 0.85,
            y: 0.66,
            width: 0.1,
            height: 0.13
        },
        barriers: [
            {
                x: 0.3283,
                y: 0.4801,
                width: 0.01,
                height: 0.3,
                size: "large",
                rotation: 9
            }
        ],
        lifeRestores: [
            {
                x: 0.2662,
                y: 0.3617,
                radius: 0.022
            }
        ]
    },
    {
        id: 18,
        name: "No Take-Backs",
        player: {
            x: 0.1,
            y: 0.82
        },
        arcGates: [
            {
                x: 0.2359,
                y: 0.6822,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0
            },
            {
                x: 0.3074,
                y: 0.6366,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0
            },
            {
                x: 0.3802,
                y: 0.5517,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0
            }
        ],
        slippageClouds: [
            {
                x: 0.6468,
                y: 0.4419,
                radius: 0.06
            }
        ],
        settlementZone: {
            x: 0.84,
            y: 0.3,
            width: 0.1,
            height: 0.12
        },
        barriers: [
            {
                x: 0.2542,
                y: 0.453,
                width: 0.01,
                height: 0.2,
                size: "medium",
                rotation: 300
            }
        ],
        lifeRestores: []
    },
    {
        id: 19,
        name: "Road to Mainnet",
        player: {
            x: 0.07,
            y: 0.8
        },
        arcGates: [
            {
                x: 0.638,
                y: 0.285,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0
            },
            {
                x: 0.3048,
                y: 0.3751,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0
            },
            {
                x: 0.377,
                y: 0.2813,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0
            }
        ],
        slippageClouds: [
            {
                x: 0.2364,
                y: 0.4656,
                radius: 0.06
            },
            {
                x: 0.236,
                y: 0.6081,
                radius: 0.06
            }
        ],
        settlementZone: {
            x: 0.86,
            y: 0.55,
            width: 0.09,
            height: 0.12
        },
        barriers: [
            {
                x: 0.3824,
                y: 0.4562,
                width: 0.01,
                height: 0.3,
                size: "large",
                rotation: 346
            }
        ],
        lifeRestores: [
            {
                x: 0.8016,
                y: 0.3754,
                radius: 0.022
            }
        ]
    },
    {
        id: 20,
        name: "Final Settlement",
        player: {
            x: 0.08,
            y: 0.8
        },
        arcGates: [
            {
                x: 0.20686264192962137,
                y: 0.19081044198505814,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0
            },
            {
                x: 0.26686263977543945,
                y: 0.2565638650718407,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0
            }
        ],
        slippageClouds: [
            {
                x: 0.6480390966782839,
                y: 0.3504973266243873,
                radius: 0.06
            },
            {
                x: 0.6833332130581768,
                y: 0.366935682396083,
                radius: 0.06
            },
            {
                x: 0.6145096861173854,
                y: 0.40685740355591526,
                radius: 0.06
            }
        ],
        settlementZone: {
            x: 0.82,
            y: 0.7,
            width: 0.1,
            height: 0.13
        },
        barriers: [
            {
                x: 0.39568616456204886,
                y: 0.5360159131906669,
                width: 0.01,
                height: 0.3,
                size: "large",
                rotation: 120
            },
            {
                x: 0.7398037992660056,
                y: 0.6367334501147257,
                width: 0.01,
                height: 0.3,
                size: "large",
                rotation: 210
            },
            {
                x: 0.5227449835296637,
                y: 0.22107788274470727,
                width: 0.01,
                height: 0.3,
                size: "large",
                rotation: 0
            },
            {
                x: 0.9409802626313956,
                y: 0.601508402032521,
                width: 0.01,
                height: 0.12,
                size: "small",
                rotation: 165
            }
        ],
        lifeRestores: []
    }
];

// Level Manager
class LevelManager {
    constructor() {
        this.levels = [...DEFAULT_LEVELS];
        this.currentLevelIndex = 0;
        this.loadCustomLevels();
    }

    // Load community levels (user-submitted approved levels)
    loadCommunityLevels() {
        try {
            // Check if COMMUNITY_LEVELS is defined (from communityLevels.js)
            if (typeof COMMUNITY_LEVELS !== 'undefined' && Array.isArray(COMMUNITY_LEVELS)) {
                // Start with community levels
                this.levels = [...COMMUNITY_LEVELS];
                this.currentLevelIndex = 0;
                
                // Also merge custom levels from localStorage if any
                const saved = localStorage.getItem('usdc_launch_custom_levels');
                if (saved) {
                    const customLevels = JSON.parse(saved);
                    const maxId = Math.max(...this.levels.map(l => l.id), 0);
                    customLevels.forEach((level, idx) => {
                        level.id = maxId + idx + 1;
                        this.levels.push(level);
                    });
                }
                
                console.log(`Loaded ${this.levels.length} community levels`);
            } else {
                // No community levels available
                this.levels = [];
                this.currentLevelIndex = 0;
                console.warn('COMMUNITY_LEVELS not found. Make sure communityLevels.js is loaded.');
            }
        } catch (e) {
            console.error('Error loading community levels:', e);
            this.levels = [];
            this.currentLevelIndex = 0;
        }
    }

    // Load default levels (original game levels)
    loadDefaultLevels() {
        this.levels = [...DEFAULT_LEVELS];
        this.currentLevelIndex = 0;
        this.loadCustomLevels();
    }

    // Load custom levels from localStorage
    loadCustomLevels() {
        try {
            const saved = localStorage.getItem('usdc_launch_custom_levels');
            if (saved) {
                const customLevels = JSON.parse(saved);
                // Merge custom levels (they will have higher IDs)
                const maxId = Math.max(...this.levels.map(l => l.id), 0);
                customLevels.forEach((level, idx) => {
                    level.id = maxId + idx + 1;
                    this.levels.push(level);
                });
            }
        } catch (e) {
            console.error('Error loading custom levels:', e);
        }
    }

    // Save custom level
    saveCustomLevel(level) {
        try {
            // Check if this is a new level (not in DEFAULT_LEVELS)
            const isNewLevel = !DEFAULT_LEVELS.find(l => l.id === level.id);
            
            if (isNewLevel) {
                // Add new level to DEFAULT_LEVELS array
                DEFAULT_LEVELS.push(JSON.parse(JSON.stringify(level))); // Deep copy
                // Also update this.levels array
                const existingIndex = this.levels.findIndex(l => l.id === level.id);
                if (existingIndex >= 0) {
                    this.levels[existingIndex] = level;
                } else {
                    this.levels.push(level);
                }
            } else {
                // Update existing level in DEFAULT_LEVELS
                const index = DEFAULT_LEVELS.findIndex(l => l.id === level.id);
                if (index >= 0) {
                    DEFAULT_LEVELS[index] = JSON.parse(JSON.stringify(level)); // Deep copy
                }
                // Also update this.levels array
                const existingIndex = this.levels.findIndex(l => l.id === level.id);
                if (existingIndex >= 0) {
                    this.levels[existingIndex] = level;
                }
            }
            
            return true;
        } catch (e) {
            console.error('Error saving custom level:', e);
            return false;
        }
    }

    // Get current level
    getCurrentLevel() {
        return this.levels[this.currentLevelIndex] || null;
    }

    // Get all levels
    getAllLevels() {
        return this.levels;
    }

    // Get level by ID
    getLevelById(id) {
        return this.levels.find(l => l.id === id);
    }

    // Advance to next level
    nextLevel() {
        if (this.currentLevelIndex < this.levels.length - 1) {
            this.currentLevelIndex++;
            return true;
        }
        return false; // No more levels
    }

    // Set current level
    setCurrentLevel(index) {
        if (index >= 0 && index < this.levels.length) {
            this.currentLevelIndex = index;
            return true;
        }
        return false;
    }

    // Add new level
    addLevel(level) {
        const maxId = Math.max(...this.levels.map(l => l.id), 0);
        level.id = maxId + 1;
        this.levels.push(level);
        // Also add to DEFAULT_LEVELS
        DEFAULT_LEVELS.push(JSON.parse(JSON.stringify(level))); // Deep copy
        return level.id;
    }

    // Delete level (can't delete original default levels with id <= 10)
    deleteLevel(id) {
        // Can't delete original default levels (ids 1-10)
        if (id <= 10) {
            return false;
        }
        
        const index = this.levels.findIndex(l => l.id === id);
        if (index >= 0) {
            this.levels.splice(index, 1);
            
            // Remove from DEFAULT_LEVELS if it exists there
            const defaultIndex = DEFAULT_LEVELS.findIndex(l => l.id === id);
            if (defaultIndex >= 0) {
                DEFAULT_LEVELS.splice(defaultIndex, 1);
            }
            
            // Adjust current level index if needed
            if (this.currentLevelIndex >= this.levels.length) {
                this.currentLevelIndex = Math.max(0, this.levels.length - 1);
            }
            
            return true;
        }
        return false;
    }
}

// Export function to generate JavaScript code for DEFAULT_LEVELS
function exportDEFAULT_LEVELS() {
    function formatValue(value, indent = 0) {
        const indentStr = '    '.repeat(indent);
        if (value === null || value === undefined) {
            return 'null';
        }
        if (typeof value === 'string') {
            return `"${value.replace(/"/g, '\\"')}"`;
        }
        if (typeof value === 'number') {
            return value.toString();
        }
        if (typeof value === 'boolean') {
            return value.toString();
        }
        if (Array.isArray(value)) {
            if (value.length === 0) {
                return '[]';
            }
            let result = '[\n';
            value.forEach((item, index) => {
                result += indentStr + '    ' + formatValue(item, indent + 1);
                if (index < value.length - 1) {
                    result += ',';
                }
                result += '\n';
            });
            result += indentStr + ']';
            return result;
        }
        if (typeof value === 'object') {
            const keys = Object.keys(value);
            if (keys.length === 0) {
                return '{}';
            }
            let result = '{\n';
            keys.forEach((key, index) => {
                result += indentStr + `    ${key}: ` + formatValue(value[key], indent + 1);
                if (index < keys.length - 1) {
                    result += ',';
                }
                result += '\n';
            });
            result += indentStr + '}';
            return result;
        }
        return String(value);
    }
    
    let code = 'const DEFAULT_LEVELS = [\n';
    DEFAULT_LEVELS.forEach((level, index) => {
        code += '    ' + formatValue(level, 1);
        if (index < DEFAULT_LEVELS.length - 1) {
            code += ',';
        }
        code += '\n';
    });
    code += '];';
    
    return code;
}

// Export for use in game.js (browser and Node.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DEFAULT_LEVELS, LevelManager, exportDEFAULT_LEVELS };
}
// Make DEFAULT_LEVELS and export function accessible globally in browser
if (typeof window !== 'undefined') {
    window.DEFAULT_LEVELS = DEFAULT_LEVELS;
    window.exportDEFAULT_LEVELS = exportDEFAULT_LEVELS;
}

