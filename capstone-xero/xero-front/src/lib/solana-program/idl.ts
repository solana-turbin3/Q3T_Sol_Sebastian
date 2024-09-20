export type Xero = {
    "address": "E7s9u89mMuVGULoSnY6PA1yLkcAev8MeTMxxA33pskFo",
    "metadata": {
      "name": "xero",
      "version": "0.1.0",
      "spec": "0.1.0",
      "description": "Created with Anchor"
    },
    "instructions": [
      {
        "name": "buyShares",
        "discriminator": [
          40,
          239,
          138,
          154,
          8,
          37,
          106,
          108
        ],
        "accounts": [
          {
            "name": "investor",
            "writable": true,
            "signer": true
          },
          {
            "name": "investmentFund",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    102,
                    117,
                    110,
                    100
                  ]
                },
                {
                  "kind": "arg",
                  "path": "fundName"
                },
                {
                  "kind": "arg",
                  "path": "manager"
                }
              ]
            }
          },
          {
            "name": "sharesMint",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    115,
                    104,
                    97,
                    114,
                    101,
                    115
                  ]
                },
                {
                  "kind": "account",
                  "path": "investmentFund"
                }
              ]
            }
          },
          {
            "name": "investorFundAta",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "investor"
                },
                {
                  "kind": "const",
                  "value": [
                    6,
                    221,
                    246,
                    225,
                    215,
                    101,
                    161,
                    147,
                    217,
                    203,
                    225,
                    70,
                    206,
                    235,
                    121,
                    172,
                    28,
                    180,
                    133,
                    237,
                    95,
                    91,
                    55,
                    145,
                    58,
                    140,
                    245,
                    133,
                    126,
                    255,
                    0,
                    169
                  ]
                },
                {
                  "kind": "account",
                  "path": "sharesMint"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ]
              }
            }
          },
          {
            "name": "investorStablecoinAta",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "investor"
                },
                {
                  "kind": "const",
                  "value": [
                    6,
                    221,
                    246,
                    225,
                    215,
                    101,
                    161,
                    147,
                    217,
                    203,
                    225,
                    70,
                    206,
                    235,
                    121,
                    172,
                    28,
                    180,
                    133,
                    237,
                    95,
                    91,
                    55,
                    145,
                    58,
                    140,
                    245,
                    133,
                    126,
                    255,
                    0,
                    169
                  ]
                },
                {
                  "kind": "account",
                  "path": "stablecoinMint"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ]
              }
            }
          },
          {
            "name": "stablecoinMint",
            "writable": true
          },
          {
            "name": "fundStablecoinVault",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "investmentFund"
                },
                {
                  "kind": "const",
                  "value": [
                    6,
                    221,
                    246,
                    225,
                    215,
                    101,
                    161,
                    147,
                    217,
                    203,
                    225,
                    70,
                    206,
                    235,
                    121,
                    172,
                    28,
                    180,
                    133,
                    237,
                    95,
                    91,
                    55,
                    145,
                    58,
                    140,
                    245,
                    133,
                    126,
                    255,
                    0,
                    169
                  ]
                },
                {
                  "kind": "account",
                  "path": "stablecoinMint"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ]
              }
            }
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          },
          {
            "name": "tokenProgram",
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "associatedTokenProgram",
            "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          }
        ],
        "args": [
          {
            "name": "fundName",
            "type": "string"
          },
          {
            "name": "manager",
            "type": "pubkey"
          },
          {
            "name": "investedAmount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "cancelRedeemShares",
        "discriminator": [
          4,
          221,
          73,
          102,
          215,
          75,
          213,
          181
        ],
        "accounts": [
          {
            "name": "investor",
            "writable": true,
            "signer": true
          },
          {
            "name": "investmentFund",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    102,
                    117,
                    110,
                    100
                  ]
                },
                {
                  "kind": "arg",
                  "path": "fundName"
                },
                {
                  "kind": "arg",
                  "path": "manager"
                }
              ]
            }
          },
          {
            "name": "shareRedemption",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    114,
                    101,
                    100,
                    101,
                    109,
                    112,
                    116,
                    105,
                    111,
                    110
                  ]
                },
                {
                  "kind": "account",
                  "path": "investmentFund"
                },
                {
                  "kind": "account",
                  "path": "investor"
                }
              ]
            }
          },
          {
            "name": "sharesMint",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    115,
                    104,
                    97,
                    114,
                    101,
                    115
                  ]
                },
                {
                  "kind": "account",
                  "path": "investmentFund"
                }
              ]
            }
          },
          {
            "name": "investorFundAta",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "investor"
                },
                {
                  "kind": "const",
                  "value": [
                    6,
                    221,
                    246,
                    225,
                    215,
                    101,
                    161,
                    147,
                    217,
                    203,
                    225,
                    70,
                    206,
                    235,
                    121,
                    172,
                    28,
                    180,
                    133,
                    237,
                    95,
                    91,
                    55,
                    145,
                    58,
                    140,
                    245,
                    133,
                    126,
                    255,
                    0,
                    169
                  ]
                },
                {
                  "kind": "account",
                  "path": "sharesMint"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ]
              }
            }
          },
          {
            "name": "redemptionVault",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "investmentFund"
                },
                {
                  "kind": "const",
                  "value": [
                    6,
                    221,
                    246,
                    225,
                    215,
                    101,
                    161,
                    147,
                    217,
                    203,
                    225,
                    70,
                    206,
                    235,
                    121,
                    172,
                    28,
                    180,
                    133,
                    237,
                    95,
                    91,
                    55,
                    145,
                    58,
                    140,
                    245,
                    133,
                    126,
                    255,
                    0,
                    169
                  ]
                },
                {
                  "kind": "account",
                  "path": "sharesMint"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ]
              }
            }
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          },
          {
            "name": "tokenProgram",
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "associatedTokenProgram",
            "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          }
        ],
        "args": [
          {
            "name": "fundName",
            "type": "string"
          },
          {
            "name": "manager",
            "type": "pubkey"
          }
        ]
      },
      {
        "name": "initializeFund",
        "discriminator": [
          212,
          42,
          24,
          245,
          146,
          141,
          78,
          198
        ],
        "accounts": [
          {
            "name": "manager",
            "writable": true,
            "signer": true
          },
          {
            "name": "investmentFund",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    102,
                    117,
                    110,
                    100
                  ]
                },
                {
                  "kind": "arg",
                  "path": "fundName"
                },
                {
                  "kind": "account",
                  "path": "manager"
                }
              ]
            }
          },
          {
            "name": "stablecoinMint"
          },
          {
            "name": "fundStablecoinVault",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "investmentFund"
                },
                {
                  "kind": "const",
                  "value": [
                    6,
                    221,
                    246,
                    225,
                    215,
                    101,
                    161,
                    147,
                    217,
                    203,
                    225,
                    70,
                    206,
                    235,
                    121,
                    172,
                    28,
                    180,
                    133,
                    237,
                    95,
                    91,
                    55,
                    145,
                    58,
                    140,
                    245,
                    133,
                    126,
                    255,
                    0,
                    169
                  ]
                },
                {
                  "kind": "account",
                  "path": "stablecoinMint"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ]
              }
            }
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          },
          {
            "name": "tokenProgram",
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "associatedTokenProgram",
            "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          }
        ],
        "args": [
          {
            "name": "fundName",
            "type": "string"
          },
          {
            "name": "stablecoinPubkey",
            "type": "pubkey"
          },
          {
            "name": "assetsAmount",
            "type": "u64"
          },
          {
            "name": "liabilitiesAmount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "initializeFundMint",
        "discriminator": [
          141,
          122,
          190,
          203,
          129,
          73,
          36,
          134
        ],
        "accounts": [
          {
            "name": "manager",
            "writable": true,
            "signer": true
          },
          {
            "name": "investmentFund",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    102,
                    117,
                    110,
                    100
                  ]
                },
                {
                  "kind": "arg",
                  "path": "fundName"
                },
                {
                  "kind": "account",
                  "path": "manager"
                }
              ]
            }
          },
          {
            "name": "sharesMint",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    115,
                    104,
                    97,
                    114,
                    101,
                    115
                  ]
                },
                {
                  "kind": "account",
                  "path": "investmentFund"
                }
              ]
            }
          },
          {
            "name": "managerSharesAta",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "manager"
                },
                {
                  "kind": "const",
                  "value": [
                    6,
                    221,
                    246,
                    225,
                    215,
                    101,
                    161,
                    147,
                    217,
                    203,
                    225,
                    70,
                    206,
                    235,
                    121,
                    172,
                    28,
                    180,
                    133,
                    237,
                    95,
                    91,
                    55,
                    145,
                    58,
                    140,
                    245,
                    133,
                    126,
                    255,
                    0,
                    169
                  ]
                },
                {
                  "kind": "account",
                  "path": "sharesMint"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ]
              }
            }
          },
          {
            "name": "sharesRedemptionVault",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "investmentFund"
                },
                {
                  "kind": "const",
                  "value": [
                    6,
                    221,
                    246,
                    225,
                    215,
                    101,
                    161,
                    147,
                    217,
                    203,
                    225,
                    70,
                    206,
                    235,
                    121,
                    172,
                    28,
                    180,
                    133,
                    237,
                    95,
                    91,
                    55,
                    145,
                    58,
                    140,
                    245,
                    133,
                    126,
                    255,
                    0,
                    169
                  ]
                },
                {
                  "kind": "account",
                  "path": "sharesMint"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ]
              }
            }
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          },
          {
            "name": "tokenProgram",
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "associatedTokenProgram",
            "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          }
        ],
        "args": [
          {
            "name": "fundName",
            "type": "string"
          },
          {
            "name": "initialShares",
            "type": "u64"
          }
        ]
      },
      {
        "name": "processInvestment",
        "discriminator": [
          211,
          80,
          3,
          218,
          236,
          177,
          86,
          151
        ],
        "accounts": [
          {
            "name": "manager",
            "writable": true,
            "signer": true
          },
          {
            "name": "investmentFund",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    102,
                    117,
                    110,
                    100
                  ]
                },
                {
                  "kind": "arg",
                  "path": "fundName"
                },
                {
                  "kind": "account",
                  "path": "manager"
                }
              ]
            }
          },
          {
            "name": "investment",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    105,
                    110,
                    118,
                    101,
                    115,
                    116,
                    109,
                    101,
                    110,
                    116
                  ]
                },
                {
                  "kind": "arg",
                  "path": "investmentIdentifier"
                },
                {
                  "kind": "account",
                  "path": "investmentFund"
                }
              ]
            }
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "fundName",
            "type": "string"
          },
          {
            "name": "investmentIdentifier",
            "type": "string"
          }
        ]
      },
      {
        "name": "processShareRedemption",
        "discriminator": [
          150,
          11,
          243,
          96,
          33,
          163,
          113,
          128
        ],
        "accounts": [
          {
            "name": "manager",
            "writable": true,
            "signer": true
          },
          {
            "name": "investor",
            "writable": true
          },
          {
            "name": "investmentFund",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    102,
                    117,
                    110,
                    100
                  ]
                },
                {
                  "kind": "arg",
                  "path": "fundName"
                },
                {
                  "kind": "account",
                  "path": "manager"
                }
              ]
            }
          },
          {
            "name": "shareRedemption",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    114,
                    101,
                    100,
                    101,
                    109,
                    112,
                    116,
                    105,
                    111,
                    110
                  ]
                },
                {
                  "kind": "account",
                  "path": "investmentFund"
                },
                {
                  "kind": "account",
                  "path": "investor"
                }
              ]
            }
          },
          {
            "name": "sharesMint",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    115,
                    104,
                    97,
                    114,
                    101,
                    115
                  ]
                },
                {
                  "kind": "account",
                  "path": "investmentFund"
                }
              ]
            }
          },
          {
            "name": "redemptionVault",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "investmentFund"
                },
                {
                  "kind": "const",
                  "value": [
                    6,
                    221,
                    246,
                    225,
                    215,
                    101,
                    161,
                    147,
                    217,
                    203,
                    225,
                    70,
                    206,
                    235,
                    121,
                    172,
                    28,
                    180,
                    133,
                    237,
                    95,
                    91,
                    55,
                    145,
                    58,
                    140,
                    245,
                    133,
                    126,
                    255,
                    0,
                    169
                  ]
                },
                {
                  "kind": "account",
                  "path": "sharesMint"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ]
              }
            }
          },
          {
            "name": "investorStablecoinAta",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "investor"
                },
                {
                  "kind": "const",
                  "value": [
                    6,
                    221,
                    246,
                    225,
                    215,
                    101,
                    161,
                    147,
                    217,
                    203,
                    225,
                    70,
                    206,
                    235,
                    121,
                    172,
                    28,
                    180,
                    133,
                    237,
                    95,
                    91,
                    55,
                    145,
                    58,
                    140,
                    245,
                    133,
                    126,
                    255,
                    0,
                    169
                  ]
                },
                {
                  "kind": "account",
                  "path": "stablecoinMint"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ]
              }
            }
          },
          {
            "name": "stablecoinMint",
            "writable": true
          },
          {
            "name": "fundStablecoinVault",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "investmentFund"
                },
                {
                  "kind": "const",
                  "value": [
                    6,
                    221,
                    246,
                    225,
                    215,
                    101,
                    161,
                    147,
                    217,
                    203,
                    225,
                    70,
                    206,
                    235,
                    121,
                    172,
                    28,
                    180,
                    133,
                    237,
                    95,
                    91,
                    55,
                    145,
                    58,
                    140,
                    245,
                    133,
                    126,
                    255,
                    0,
                    169
                  ]
                },
                {
                  "kind": "account",
                  "path": "stablecoinMint"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ]
              }
            }
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          },
          {
            "name": "tokenProgram",
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "associatedTokenProgram",
            "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          }
        ],
        "args": [
          {
            "name": "fundName",
            "type": "string"
          }
        ]
      },
      {
        "name": "redeemShares",
        "discriminator": [
          239,
          154,
          224,
          89,
          240,
          196,
          42,
          187
        ],
        "accounts": [
          {
            "name": "investor",
            "writable": true,
            "signer": true
          },
          {
            "name": "investmentFund",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    102,
                    117,
                    110,
                    100
                  ]
                },
                {
                  "kind": "arg",
                  "path": "fundName"
                },
                {
                  "kind": "arg",
                  "path": "manager"
                }
              ]
            }
          },
          {
            "name": "shareRedemption",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    114,
                    101,
                    100,
                    101,
                    109,
                    112,
                    116,
                    105,
                    111,
                    110
                  ]
                },
                {
                  "kind": "account",
                  "path": "investmentFund"
                },
                {
                  "kind": "account",
                  "path": "investor"
                }
              ]
            }
          },
          {
            "name": "sharesMint",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    115,
                    104,
                    97,
                    114,
                    101,
                    115
                  ]
                },
                {
                  "kind": "account",
                  "path": "investmentFund"
                }
              ]
            }
          },
          {
            "name": "investorFundAta",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "investor"
                },
                {
                  "kind": "const",
                  "value": [
                    6,
                    221,
                    246,
                    225,
                    215,
                    101,
                    161,
                    147,
                    217,
                    203,
                    225,
                    70,
                    206,
                    235,
                    121,
                    172,
                    28,
                    180,
                    133,
                    237,
                    95,
                    91,
                    55,
                    145,
                    58,
                    140,
                    245,
                    133,
                    126,
                    255,
                    0,
                    169
                  ]
                },
                {
                  "kind": "account",
                  "path": "sharesMint"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ]
              }
            }
          },
          {
            "name": "redemptionVault",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "investmentFund"
                },
                {
                  "kind": "const",
                  "value": [
                    6,
                    221,
                    246,
                    225,
                    215,
                    101,
                    161,
                    147,
                    217,
                    203,
                    225,
                    70,
                    206,
                    235,
                    121,
                    172,
                    28,
                    180,
                    133,
                    237,
                    95,
                    91,
                    55,
                    145,
                    58,
                    140,
                    245,
                    133,
                    126,
                    255,
                    0,
                    169
                  ]
                },
                {
                  "kind": "account",
                  "path": "sharesMint"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ]
              }
            }
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          },
          {
            "name": "tokenProgram",
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "associatedTokenProgram",
            "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          }
        ],
        "args": [
          {
            "name": "fundName",
            "type": "string"
          },
          {
            "name": "manager",
            "type": "pubkey"
          },
          {
            "name": "sharesToRedeem",
            "type": "u64"
          }
        ]
      },
      {
        "name": "registerInvestment",
        "discriminator": [
          148,
          8,
          16,
          183,
          1,
          114,
          184,
          224
        ],
        "accounts": [
          {
            "name": "manager",
            "writable": true,
            "signer": true
          },
          {
            "name": "investmentFund",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    102,
                    117,
                    110,
                    100
                  ]
                },
                {
                  "kind": "arg",
                  "path": "fundName"
                },
                {
                  "kind": "account",
                  "path": "manager"
                }
              ]
            }
          },
          {
            "name": "investment",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    105,
                    110,
                    118,
                    101,
                    115,
                    116,
                    109,
                    101,
                    110,
                    116
                  ]
                },
                {
                  "kind": "arg",
                  "path": "identifier"
                },
                {
                  "kind": "account",
                  "path": "investmentFund"
                }
              ]
            }
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "fundName",
            "type": "string"
          },
          {
            "name": "identifier",
            "type": "string"
          },
          {
            "name": "investedAmount",
            "type": "u64"
          },
          {
            "name": "interestRate",
            "type": "u64"
          },
          {
            "name": "maturityDate",
            "type": "i64"
          }
        ]
      },
      {
        "name": "registerLiability",
        "discriminator": [
          217,
          239,
          0,
          152,
          109,
          226,
          50,
          113
        ],
        "accounts": [
          {
            "name": "manager",
            "writable": true,
            "signer": true
          },
          {
            "name": "investmentFund",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    102,
                    117,
                    110,
                    100
                  ]
                },
                {
                  "kind": "arg",
                  "path": "fundName"
                },
                {
                  "kind": "account",
                  "path": "manager"
                }
              ]
            }
          },
          {
            "name": "liability",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    108,
                    105,
                    97,
                    98,
                    105,
                    108,
                    105,
                    116,
                    121
                  ]
                },
                {
                  "kind": "arg",
                  "path": "identifier"
                },
                {
                  "kind": "account",
                  "path": "investmentFund"
                }
              ]
            }
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "fundName",
            "type": "string"
          },
          {
            "name": "identifier",
            "type": "string"
          },
          {
            "name": "liabilityAmount",
            "type": "u64"
          },
          {
            "name": "category",
            "type": {
              "defined": {
                "name": "liabilityCategory"
              }
            }
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "investment",
        "discriminator": [
          175,
          134,
          9,
          175,
          115,
          153,
          39,
          28
        ]
      },
      {
        "name": "investmentFund",
        "discriminator": [
          78,
          214,
          194,
          148,
          84,
          68,
          33,
          7
        ]
      },
      {
        "name": "liability",
        "discriminator": [
          165,
          153,
          121,
          103,
          48,
          223,
          72,
          248
        ]
      },
      {
        "name": "shareRedemption",
        "discriminator": [
          113,
          201,
          254,
          86,
          220,
          206,
          222,
          224
        ]
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "invalidStringLength",
        "msg": "string provided is too long or too short"
      },
      {
        "code": 6001,
        "name": "invalidInitialShareValue",
        "msg": "share value invalid for mint initialization"
      },
      {
        "code": 6002,
        "name": "arithmeticError",
        "msg": "calculation failed"
      }
    ],
    "types": [
      {
        "name": "investment",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "investmentFund",
              "type": "pubkey"
            },
            {
              "name": "investedAmount",
              "type": "u64"
            },
            {
              "name": "interestRate",
              "type": "u64"
            },
            {
              "name": "initDate",
              "type": "i64"
            },
            {
              "name": "maturityDate",
              "type": "i64"
            },
            {
              "name": "identifier",
              "type": "string"
            }
          ]
        }
      },
      {
        "name": "investmentFund",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "assetsAmount",
              "type": "u64"
            },
            {
              "name": "liabilitiesAmount",
              "type": "u64"
            },
            {
              "name": "sharesMintBump",
              "type": {
                "option": "u8"
              }
            },
            {
              "name": "redemptionVault",
              "type": {
                "option": "pubkey"
              }
            },
            {
              "name": "manager",
              "type": "pubkey"
            },
            {
              "name": "stablecoinMint",
              "type": "pubkey"
            },
            {
              "name": "name",
              "type": "string"
            }
          ]
        }
      },
      {
        "name": "liability",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "investmentFund",
              "type": "pubkey"
            },
            {
              "name": "liabilityAmount",
              "type": "u64"
            },
            {
              "name": "creationDate",
              "type": "i64"
            },
            {
              "name": "category",
              "type": {
                "defined": {
                  "name": "liabilityCategory"
                }
              }
            },
            {
              "name": "identifier",
              "type": "string"
            }
          ]
        }
      },
      {
        "name": "liabilityCategory",
        "type": {
          "kind": "enum",
          "variants": [
            {
              "name": "accountsPayable"
            },
            {
              "name": "loansPayable"
            },
            {
              "name": "wagesPayable"
            },
            {
              "name": "taxesPayable"
            },
            {
              "name": "other"
            }
          ]
        }
      },
      {
        "name": "shareRedemption",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "investor",
              "type": "pubkey"
            },
            {
              "name": "investmentFund",
              "type": "pubkey"
            },
            {
              "name": "sharesToRedeem",
              "type": "u64"
            },
            {
              "name": "creationDate",
              "type": "i64"
            },
            {
              "name": "shareValue",
              "type": "u64"
            }
          ]
        }
      }
    ]
  };
  
export const IDL = {
    "address": "E7s9u89mMuVGULoSnY6PA1yLkcAev8MeTMxxA33pskFo",
    "metadata": {
      "name": "xero",
      "version": "0.1.0",
      "spec": "0.1.0",
      "description": "Created with Anchor"
    },
    "instructions": [
      {
        "name": "buy_shares",
        "discriminator": [
          40,
          239,
          138,
          154,
          8,
          37,
          106,
          108
        ],
        "accounts": [
          {
            "name": "investor",
            "writable": true,
            "signer": true
          },
          {
            "name": "investment_fund",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    102,
                    117,
                    110,
                    100
                  ]
                },
                {
                  "kind": "arg",
                  "path": "fund_name"
                },
                {
                  "kind": "arg",
                  "path": "manager"
                }
              ]
            }
          },
          {
            "name": "shares_mint",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    115,
                    104,
                    97,
                    114,
                    101,
                    115
                  ]
                },
                {
                  "kind": "account",
                  "path": "investment_fund"
                }
              ]
            }
          },
          {
            "name": "investor_fund_ata",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "investor"
                },
                {
                  "kind": "const",
                  "value": [
                    6,
                    221,
                    246,
                    225,
                    215,
                    101,
                    161,
                    147,
                    217,
                    203,
                    225,
                    70,
                    206,
                    235,
                    121,
                    172,
                    28,
                    180,
                    133,
                    237,
                    95,
                    91,
                    55,
                    145,
                    58,
                    140,
                    245,
                    133,
                    126,
                    255,
                    0,
                    169
                  ]
                },
                {
                  "kind": "account",
                  "path": "shares_mint"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ]
              }
            }
          },
          {
            "name": "investor_stablecoin_ata",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "investor"
                },
                {
                  "kind": "const",
                  "value": [
                    6,
                    221,
                    246,
                    225,
                    215,
                    101,
                    161,
                    147,
                    217,
                    203,
                    225,
                    70,
                    206,
                    235,
                    121,
                    172,
                    28,
                    180,
                    133,
                    237,
                    95,
                    91,
                    55,
                    145,
                    58,
                    140,
                    245,
                    133,
                    126,
                    255,
                    0,
                    169
                  ]
                },
                {
                  "kind": "account",
                  "path": "stablecoin_mint"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ]
              }
            }
          },
          {
            "name": "stablecoin_mint",
            "writable": true
          },
          {
            "name": "fund_stablecoin_vault",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "investment_fund"
                },
                {
                  "kind": "const",
                  "value": [
                    6,
                    221,
                    246,
                    225,
                    215,
                    101,
                    161,
                    147,
                    217,
                    203,
                    225,
                    70,
                    206,
                    235,
                    121,
                    172,
                    28,
                    180,
                    133,
                    237,
                    95,
                    91,
                    55,
                    145,
                    58,
                    140,
                    245,
                    133,
                    126,
                    255,
                    0,
                    169
                  ]
                },
                {
                  "kind": "account",
                  "path": "stablecoin_mint"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ]
              }
            }
          },
          {
            "name": "system_program",
            "address": "11111111111111111111111111111111"
          },
          {
            "name": "token_program",
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "associated_token_program",
            "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          }
        ],
        "args": [
          {
            "name": "_fund_name",
            "type": "string"
          },
          {
            "name": "manager",
            "type": "pubkey"
          },
          {
            "name": "invested_amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "cancel_redeem_shares",
        "discriminator": [
          4,
          221,
          73,
          102,
          215,
          75,
          213,
          181
        ],
        "accounts": [
          {
            "name": "investor",
            "writable": true,
            "signer": true
          },
          {
            "name": "investment_fund",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    102,
                    117,
                    110,
                    100
                  ]
                },
                {
                  "kind": "arg",
                  "path": "fund_name"
                },
                {
                  "kind": "arg",
                  "path": "manager"
                }
              ]
            }
          },
          {
            "name": "share_redemption",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    114,
                    101,
                    100,
                    101,
                    109,
                    112,
                    116,
                    105,
                    111,
                    110
                  ]
                },
                {
                  "kind": "account",
                  "path": "investment_fund"
                },
                {
                  "kind": "account",
                  "path": "investor"
                }
              ]
            }
          },
          {
            "name": "shares_mint",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    115,
                    104,
                    97,
                    114,
                    101,
                    115
                  ]
                },
                {
                  "kind": "account",
                  "path": "investment_fund"
                }
              ]
            }
          },
          {
            "name": "investor_fund_ata",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "investor"
                },
                {
                  "kind": "const",
                  "value": [
                    6,
                    221,
                    246,
                    225,
                    215,
                    101,
                    161,
                    147,
                    217,
                    203,
                    225,
                    70,
                    206,
                    235,
                    121,
                    172,
                    28,
                    180,
                    133,
                    237,
                    95,
                    91,
                    55,
                    145,
                    58,
                    140,
                    245,
                    133,
                    126,
                    255,
                    0,
                    169
                  ]
                },
                {
                  "kind": "account",
                  "path": "shares_mint"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ]
              }
            }
          },
          {
            "name": "redemption_vault",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "investment_fund"
                },
                {
                  "kind": "const",
                  "value": [
                    6,
                    221,
                    246,
                    225,
                    215,
                    101,
                    161,
                    147,
                    217,
                    203,
                    225,
                    70,
                    206,
                    235,
                    121,
                    172,
                    28,
                    180,
                    133,
                    237,
                    95,
                    91,
                    55,
                    145,
                    58,
                    140,
                    245,
                    133,
                    126,
                    255,
                    0,
                    169
                  ]
                },
                {
                  "kind": "account",
                  "path": "shares_mint"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ]
              }
            }
          },
          {
            "name": "system_program",
            "address": "11111111111111111111111111111111"
          },
          {
            "name": "token_program",
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "associated_token_program",
            "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          }
        ],
        "args": [
          {
            "name": "_fund_name",
            "type": "string"
          },
          {
            "name": "manager",
            "type": "pubkey"
          }
        ]
      },
      {
        "name": "initialize_fund",
        "discriminator": [
          212,
          42,
          24,
          245,
          146,
          141,
          78,
          198
        ],
        "accounts": [
          {
            "name": "manager",
            "writable": true,
            "signer": true
          },
          {
            "name": "investment_fund",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    102,
                    117,
                    110,
                    100
                  ]
                },
                {
                  "kind": "arg",
                  "path": "fund_name"
                },
                {
                  "kind": "account",
                  "path": "manager"
                }
              ]
            }
          },
          {
            "name": "stablecoin_mint"
          },
          {
            "name": "fund_stablecoin_vault",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "investment_fund"
                },
                {
                  "kind": "const",
                  "value": [
                    6,
                    221,
                    246,
                    225,
                    215,
                    101,
                    161,
                    147,
                    217,
                    203,
                    225,
                    70,
                    206,
                    235,
                    121,
                    172,
                    28,
                    180,
                    133,
                    237,
                    95,
                    91,
                    55,
                    145,
                    58,
                    140,
                    245,
                    133,
                    126,
                    255,
                    0,
                    169
                  ]
                },
                {
                  "kind": "account",
                  "path": "stablecoin_mint"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ]
              }
            }
          },
          {
            "name": "system_program",
            "address": "11111111111111111111111111111111"
          },
          {
            "name": "token_program",
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "associated_token_program",
            "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          }
        ],
        "args": [
          {
            "name": "fund_name",
            "type": "string"
          },
          {
            "name": "stablecoin_pubkey",
            "type": "pubkey"
          },
          {
            "name": "assets_amount",
            "type": "u64"
          },
          {
            "name": "liabilities_amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "initialize_fund_mint",
        "discriminator": [
          141,
          122,
          190,
          203,
          129,
          73,
          36,
          134
        ],
        "accounts": [
          {
            "name": "manager",
            "writable": true,
            "signer": true
          },
          {
            "name": "investment_fund",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    102,
                    117,
                    110,
                    100
                  ]
                },
                {
                  "kind": "arg",
                  "path": "fund_name"
                },
                {
                  "kind": "account",
                  "path": "manager"
                }
              ]
            }
          },
          {
            "name": "shares_mint",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    115,
                    104,
                    97,
                    114,
                    101,
                    115
                  ]
                },
                {
                  "kind": "account",
                  "path": "investment_fund"
                }
              ]
            }
          },
          {
            "name": "manager_shares_ata",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "manager"
                },
                {
                  "kind": "const",
                  "value": [
                    6,
                    221,
                    246,
                    225,
                    215,
                    101,
                    161,
                    147,
                    217,
                    203,
                    225,
                    70,
                    206,
                    235,
                    121,
                    172,
                    28,
                    180,
                    133,
                    237,
                    95,
                    91,
                    55,
                    145,
                    58,
                    140,
                    245,
                    133,
                    126,
                    255,
                    0,
                    169
                  ]
                },
                {
                  "kind": "account",
                  "path": "shares_mint"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ]
              }
            }
          },
          {
            "name": "shares_redemption_vault",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "investment_fund"
                },
                {
                  "kind": "const",
                  "value": [
                    6,
                    221,
                    246,
                    225,
                    215,
                    101,
                    161,
                    147,
                    217,
                    203,
                    225,
                    70,
                    206,
                    235,
                    121,
                    172,
                    28,
                    180,
                    133,
                    237,
                    95,
                    91,
                    55,
                    145,
                    58,
                    140,
                    245,
                    133,
                    126,
                    255,
                    0,
                    169
                  ]
                },
                {
                  "kind": "account",
                  "path": "shares_mint"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ]
              }
            }
          },
          {
            "name": "system_program",
            "address": "11111111111111111111111111111111"
          },
          {
            "name": "token_program",
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "associated_token_program",
            "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          }
        ],
        "args": [
          {
            "name": "fund_name",
            "type": "string"
          },
          {
            "name": "initial_shares",
            "type": "u64"
          }
        ]
      },
      {
        "name": "process_investment",
        "discriminator": [
          211,
          80,
          3,
          218,
          236,
          177,
          86,
          151
        ],
        "accounts": [
          {
            "name": "manager",
            "writable": true,
            "signer": true
          },
          {
            "name": "investment_fund",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    102,
                    117,
                    110,
                    100
                  ]
                },
                {
                  "kind": "arg",
                  "path": "fund_name"
                },
                {
                  "kind": "account",
                  "path": "manager"
                }
              ]
            }
          },
          {
            "name": "investment",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    105,
                    110,
                    118,
                    101,
                    115,
                    116,
                    109,
                    101,
                    110,
                    116
                  ]
                },
                {
                  "kind": "arg",
                  "path": "investment_identifier"
                },
                {
                  "kind": "account",
                  "path": "investment_fund"
                }
              ]
            }
          },
          {
            "name": "system_program",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "_fund_name",
            "type": "string"
          },
          {
            "name": "_investment_identifier",
            "type": "string"
          }
        ]
      },
      {
        "name": "process_share_redemption",
        "discriminator": [
          150,
          11,
          243,
          96,
          33,
          163,
          113,
          128
        ],
        "accounts": [
          {
            "name": "manager",
            "writable": true,
            "signer": true
          },
          {
            "name": "investor",
            "writable": true
          },
          {
            "name": "investment_fund",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    102,
                    117,
                    110,
                    100
                  ]
                },
                {
                  "kind": "arg",
                  "path": "fund_name"
                },
                {
                  "kind": "account",
                  "path": "manager"
                }
              ]
            }
          },
          {
            "name": "share_redemption",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    114,
                    101,
                    100,
                    101,
                    109,
                    112,
                    116,
                    105,
                    111,
                    110
                  ]
                },
                {
                  "kind": "account",
                  "path": "investment_fund"
                },
                {
                  "kind": "account",
                  "path": "investor"
                }
              ]
            }
          },
          {
            "name": "shares_mint",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    115,
                    104,
                    97,
                    114,
                    101,
                    115
                  ]
                },
                {
                  "kind": "account",
                  "path": "investment_fund"
                }
              ]
            }
          },
          {
            "name": "redemption_vault",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "investment_fund"
                },
                {
                  "kind": "const",
                  "value": [
                    6,
                    221,
                    246,
                    225,
                    215,
                    101,
                    161,
                    147,
                    217,
                    203,
                    225,
                    70,
                    206,
                    235,
                    121,
                    172,
                    28,
                    180,
                    133,
                    237,
                    95,
                    91,
                    55,
                    145,
                    58,
                    140,
                    245,
                    133,
                    126,
                    255,
                    0,
                    169
                  ]
                },
                {
                  "kind": "account",
                  "path": "shares_mint"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ]
              }
            }
          },
          {
            "name": "investor_stablecoin_ata",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "investor"
                },
                {
                  "kind": "const",
                  "value": [
                    6,
                    221,
                    246,
                    225,
                    215,
                    101,
                    161,
                    147,
                    217,
                    203,
                    225,
                    70,
                    206,
                    235,
                    121,
                    172,
                    28,
                    180,
                    133,
                    237,
                    95,
                    91,
                    55,
                    145,
                    58,
                    140,
                    245,
                    133,
                    126,
                    255,
                    0,
                    169
                  ]
                },
                {
                  "kind": "account",
                  "path": "stablecoin_mint"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ]
              }
            }
          },
          {
            "name": "stablecoin_mint",
            "writable": true
          },
          {
            "name": "fund_stablecoin_vault",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "investment_fund"
                },
                {
                  "kind": "const",
                  "value": [
                    6,
                    221,
                    246,
                    225,
                    215,
                    101,
                    161,
                    147,
                    217,
                    203,
                    225,
                    70,
                    206,
                    235,
                    121,
                    172,
                    28,
                    180,
                    133,
                    237,
                    95,
                    91,
                    55,
                    145,
                    58,
                    140,
                    245,
                    133,
                    126,
                    255,
                    0,
                    169
                  ]
                },
                {
                  "kind": "account",
                  "path": "stablecoin_mint"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ]
              }
            }
          },
          {
            "name": "system_program",
            "address": "11111111111111111111111111111111"
          },
          {
            "name": "token_program",
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "associated_token_program",
            "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          }
        ],
        "args": [
          {
            "name": "_fund_name",
            "type": "string"
          }
        ]
      },
      {
        "name": "redeem_shares",
        "discriminator": [
          239,
          154,
          224,
          89,
          240,
          196,
          42,
          187
        ],
        "accounts": [
          {
            "name": "investor",
            "writable": true,
            "signer": true
          },
          {
            "name": "investment_fund",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    102,
                    117,
                    110,
                    100
                  ]
                },
                {
                  "kind": "arg",
                  "path": "fund_name"
                },
                {
                  "kind": "arg",
                  "path": "manager"
                }
              ]
            }
          },
          {
            "name": "share_redemption",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    114,
                    101,
                    100,
                    101,
                    109,
                    112,
                    116,
                    105,
                    111,
                    110
                  ]
                },
                {
                  "kind": "account",
                  "path": "investment_fund"
                },
                {
                  "kind": "account",
                  "path": "investor"
                }
              ]
            }
          },
          {
            "name": "shares_mint",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    115,
                    104,
                    97,
                    114,
                    101,
                    115
                  ]
                },
                {
                  "kind": "account",
                  "path": "investment_fund"
                }
              ]
            }
          },
          {
            "name": "investor_fund_ata",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "investor"
                },
                {
                  "kind": "const",
                  "value": [
                    6,
                    221,
                    246,
                    225,
                    215,
                    101,
                    161,
                    147,
                    217,
                    203,
                    225,
                    70,
                    206,
                    235,
                    121,
                    172,
                    28,
                    180,
                    133,
                    237,
                    95,
                    91,
                    55,
                    145,
                    58,
                    140,
                    245,
                    133,
                    126,
                    255,
                    0,
                    169
                  ]
                },
                {
                  "kind": "account",
                  "path": "shares_mint"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ]
              }
            }
          },
          {
            "name": "redemption_vault",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "investment_fund"
                },
                {
                  "kind": "const",
                  "value": [
                    6,
                    221,
                    246,
                    225,
                    215,
                    101,
                    161,
                    147,
                    217,
                    203,
                    225,
                    70,
                    206,
                    235,
                    121,
                    172,
                    28,
                    180,
                    133,
                    237,
                    95,
                    91,
                    55,
                    145,
                    58,
                    140,
                    245,
                    133,
                    126,
                    255,
                    0,
                    169
                  ]
                },
                {
                  "kind": "account",
                  "path": "shares_mint"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ]
              }
            }
          },
          {
            "name": "system_program",
            "address": "11111111111111111111111111111111"
          },
          {
            "name": "token_program",
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "associated_token_program",
            "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          }
        ],
        "args": [
          {
            "name": "_fund_name",
            "type": "string"
          },
          {
            "name": "_manager",
            "type": "pubkey"
          },
          {
            "name": "shares_to_redeem",
            "type": "u64"
          }
        ]
      },
      {
        "name": "register_investment",
        "discriminator": [
          148,
          8,
          16,
          183,
          1,
          114,
          184,
          224
        ],
        "accounts": [
          {
            "name": "manager",
            "writable": true,
            "signer": true
          },
          {
            "name": "investment_fund",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    102,
                    117,
                    110,
                    100
                  ]
                },
                {
                  "kind": "arg",
                  "path": "fund_name"
                },
                {
                  "kind": "account",
                  "path": "manager"
                }
              ]
            }
          },
          {
            "name": "investment",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    105,
                    110,
                    118,
                    101,
                    115,
                    116,
                    109,
                    101,
                    110,
                    116
                  ]
                },
                {
                  "kind": "arg",
                  "path": "identifier"
                },
                {
                  "kind": "account",
                  "path": "investment_fund"
                }
              ]
            }
          },
          {
            "name": "system_program",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "_fund_name",
            "type": "string"
          },
          {
            "name": "identifier",
            "type": "string"
          },
          {
            "name": "invested_amount",
            "type": "u64"
          },
          {
            "name": "interest_rate",
            "type": "u64"
          },
          {
            "name": "maturity_date",
            "type": "i64"
          }
        ]
      },
      {
        "name": "register_liability",
        "discriminator": [
          217,
          239,
          0,
          152,
          109,
          226,
          50,
          113
        ],
        "accounts": [
          {
            "name": "manager",
            "writable": true,
            "signer": true
          },
          {
            "name": "investment_fund",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    102,
                    117,
                    110,
                    100
                  ]
                },
                {
                  "kind": "arg",
                  "path": "fund_name"
                },
                {
                  "kind": "account",
                  "path": "manager"
                }
              ]
            }
          },
          {
            "name": "liability",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    108,
                    105,
                    97,
                    98,
                    105,
                    108,
                    105,
                    116,
                    121
                  ]
                },
                {
                  "kind": "arg",
                  "path": "identifier"
                },
                {
                  "kind": "account",
                  "path": "investment_fund"
                }
              ]
            }
          },
          {
            "name": "system_program",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "_fund_name",
            "type": "string"
          },
          {
            "name": "identifier",
            "type": "string"
          },
          {
            "name": "liability_amount",
            "type": "u64"
          },
          {
            "name": "category",
            "type": {
              "defined": {
                "name": "LiabilityCategory"
              }
            }
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "Investment",
        "discriminator": [
          175,
          134,
          9,
          175,
          115,
          153,
          39,
          28
        ]
      },
      {
        "name": "InvestmentFund",
        "discriminator": [
          78,
          214,
          194,
          148,
          84,
          68,
          33,
          7
        ]
      },
      {
        "name": "Liability",
        "discriminator": [
          165,
          153,
          121,
          103,
          48,
          223,
          72,
          248
        ]
      },
      {
        "name": "ShareRedemption",
        "discriminator": [
          113,
          201,
          254,
          86,
          220,
          206,
          222,
          224
        ]
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "InvalidStringLength",
        "msg": "string provided is too long or too short"
      },
      {
        "code": 6001,
        "name": "InvalidInitialShareValue",
        "msg": "share value invalid for mint initialization"
      },
      {
        "code": 6002,
        "name": "ArithmeticError",
        "msg": "calculation failed"
      }
    ],
    "types": [
      {
        "name": "Investment",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "investment_fund",
              "type": "pubkey"
            },
            {
              "name": "invested_amount",
              "type": "u64"
            },
            {
              "name": "interest_rate",
              "type": "u64"
            },
            {
              "name": "init_date",
              "type": "i64"
            },
            {
              "name": "maturity_date",
              "type": "i64"
            },
            {
              "name": "identifier",
              "type": "string"
            }
          ]
        }
      },
      {
        "name": "InvestmentFund",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "assets_amount",
              "type": "u64"
            },
            {
              "name": "liabilities_amount",
              "type": "u64"
            },
            {
              "name": "shares_mint_bump",
              "type": {
                "option": "u8"
              }
            },
            {
              "name": "redemption_vault",
              "type": {
                "option": "pubkey"
              }
            },
            {
              "name": "manager",
              "type": "pubkey"
            },
            {
              "name": "stablecoin_mint",
              "type": "pubkey"
            },
            {
              "name": "name",
              "type": "string"
            }
          ]
        }
      },
      {
        "name": "Liability",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "investment_fund",
              "type": "pubkey"
            },
            {
              "name": "liability_amount",
              "type": "u64"
            },
            {
              "name": "creation_date",
              "type": "i64"
            },
            {
              "name": "category",
              "type": {
                "defined": {
                  "name": "LiabilityCategory"
                }
              }
            },
            {
              "name": "identifier",
              "type": "string"
            }
          ]
        }
      },
      {
        "name": "LiabilityCategory",
        "type": {
          "kind": "enum",
          "variants": [
            {
              "name": "AccountsPayable"
            },
            {
              "name": "LoansPayable"
            },
            {
              "name": "WagesPayable"
            },
            {
              "name": "TaxesPayable"
            },
            {
              "name": "Other"
            }
          ]
        }
      },
      {
        "name": "ShareRedemption",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "investor",
              "type": "pubkey"
            },
            {
              "name": "investment_fund",
              "type": "pubkey"
            },
            {
              "name": "shares_to_redeem",
              "type": "u64"
            },
            {
              "name": "creation_date",
              "type": "i64"
            },
            {
              "name": "share_value",
              "type": "u64"
            }
          ]
        }
      }
    ]
  }