import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Question, ShuffledQuestion, Test, TestCategory, TestAttempt } from "../types";

const SAVED_TEST_STATE_KEY = 'jee_mock_test_saved_state';
const TEST_ATTEMPTS_KEY = 'jee_mock_test_attempts';

const sampleQuestions: Question[] = [
// White Mock Test 1
{ id: 1, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1VypMXlWqcUFk3AHY15R5QQsr-xKhB0RZ&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 2, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1g1NuHqJrUZVkwN14484udRStI-8_hMIE&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 3, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1esGjNMzajetl-BrKhQUnAYoxY4jDy6Lq&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 4, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=183VWs6PZFsWQAgEMmRqlRRxsqpqed_Yb&sz=w2000", optionA: "d", optionB: "c", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 5, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1RU_qpgh_Yy-w5OXzjhnJuE-obYSw5Umv&sz=w2000", optionA: "d", optionB: "c", optionC: "b", optionD: "a", correctOption: "d" },
{ id: 6, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1rO8wSalEivEH_PI1jjooc0mRq6zl0wM3&sz=w2000", optionA: "a", optionB: "d", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 7, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1SasY_kxIm--jquZolsp1WQ88sWHEPP7t&sz=w2000", optionA: "b", optionB: "c", optionC: "e", optionD: "d", correctOption: "d" },
{ id: 8, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1O_6FpeJkAk0iWM_qZwVC2zZ-qX9oeA85&sz=w2000", optionA: "c", optionB: "a", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 9, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1RK3pH9UstXGy2lHhzMrKMu8f2zRirMqc&sz=w2000", optionA: "a", optionB: "c", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 10, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1m0OD2ilJbLshhBaaxyUq2Wa4Wu3p6NzK&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 11, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1vVlM4PW5sDYqHFvP0uUtyFOISQukyuRo&sz=w2000", optionA: "d", optionB: "a", optionC: "b", optionD: "c", correctOption: "d" },
{ id: 12, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=11JdQCUHE7G8YsCDnX3QET26wriSxzu_g&sz=w2000", optionA: "c", optionB: "a", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 13, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1eEkYC62dfhc4BGeHRpZLHHJrcoMwYqDv&sz=w2000", optionA: "c", optionB: "d", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 14, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pqnDJ1JPTSHu6Z2Bbu2XyxSfDo5PRvqS&sz=w2000", optionA: "c", optionB: "b", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 15, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1QXocpweOsbgXMIm_LLQhzPT_y8fjysbm&sz=w2000", optionA: "a", optionB: "c", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 16, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=14ooAQ8T53l0iph1imesi3zNHmAyFavxN&sz=w2000", optionA: "a", optionB: "d", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 17, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oLpMJJVz3ar8i_8vG2IAAJEucxrmnB9U&sz=w2000", optionA: "d", optionB: "b", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 18, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1m_KGPW6dMnCQ1PyfQrI3F-3qxaK29f3L&sz=w2000", optionA: "d", optionB: "c", optionC: "b", optionD: "a", correctOption: "d" },
{ id: 19, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1hYG_KZWsmdDwSyHCaHuRVsJJFUWoFysQ&sz=w2000", optionA: "a", optionB: "c", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 20, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1tRCsqC7-9s76pDz_lfJGYmQ4fMvQawlA&sz=w2000", optionA: "a", optionB: "b", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 21, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1x8lqczFMZ796GisgSn3kFVbdsfQS0_sE&sz=w2000", optionA: "c", optionB: "a", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 22, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1jLjcPdxlyIS7GE6dxObjN_4qHOmi2pQ6&sz=w2000", optionA: "a", optionB: "d", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 23, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1DZRHMjR3OOX9bs_aPgAoHOwok7eFR6xP&sz=w2000", optionA: "d", optionB: "b", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 24, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1fAB4CSVWfeyiykrJJw02Az_4sE4Ie8NR&sz=w2000", optionA: "a", optionB: "d", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 25, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1FgJknVGgdB7I41fzwLENV5twjkinU5cR&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 26, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=11cLxQNh2WN55OBvTZ42qfQnjEqezr0SJ&sz=w2000", optionA: "c", optionB: "b", optionC: "a", optionD: "d", correctOption: "d" },
{ id: 27, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1JY6QUP_PWNr4C-seIybAr6mDLl3-PtyF&sz=w2000", optionA: "b", optionB: "c", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 28, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1ZxfJOcu-2zqdKnYOmZcSMYvpCiNMwe0m&sz=w2000", optionA: "a", optionB: "d", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 29, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=16kZyqGgAQhw7dipSnewVA7-Dybc9NqOF&sz=w2000", optionA: "a", optionB: "c", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 30, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1Xpt4YMo8KDpqUOcEIcEw2QxMJ4klomWD&sz=w2000", optionA: "d", optionB: "c", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 31, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1gLV3OzQjZJXYSDWqaryQrU167P503ONL&sz=w2000", optionA: "d", optionB: "a", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 32, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1sYz9X_Q_Hfrd2bFrZAOZodelHHdrw3tl&sz=w2000", optionA: "c", optionB: "d", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 33, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1_Min3hbZ8oqBlklB-9muqLj0XKX2jdUM&sz=w2000", optionA: "d", optionB: "b", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 34, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1h6NKOan28Oj984Po1E9R2GGNfRAILyrD&sz=w2000", optionA: "c", optionB: "a", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 35, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1y9-GEc4S1jDyS1WNL5OqFTRWoibym8L9&sz=w2000", optionA: "d", optionB: "b", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 36, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=12SSfmqi0BxeHjj6TGrfTvpsE_RjzhVih&sz=w2000", optionA: "c", optionB: "b", optionC: "a", optionD: "d", correctOption: "d" },
{ id: 37, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1eUjVa7v_ON7N6s_qfEn0PRpt6tlZg0Nh&sz=w2000", optionA: "c", optionB: "d", optionC: "b", optionD: "a", correctOption: "d" },
{ id: 38, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1nVDvolkMBU5QnCu4ZXje5fKtj99ljcAs&sz=w2000", optionA: "d", optionB: "c", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 39, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1wCFi9rQOalR-ywFlazS9mbE7gUp3Upoi&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 40, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1TCW7C9tbN9Ws1TyylcKhxRsCmU9T_AwF&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 41, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=19JYrLFSFg08Hxg4k40euxlKctlqRoNLa&sz=w2000", optionA: "a", optionB: "c", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 42, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1fu0j-xT12g6vT_HoZ7GqYpPUWiDmcp_N&sz=w2000", optionA: "a", optionB: "d", optionC: "b", optionD: "c", correctOption: "d" },
{ id: 43, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1UsmoIMZxUn48fFR4ZlZqKaQSd-OldWg4&sz=w2000", optionA: "c", optionB: "d", optionC: "b", optionD: "a", correctOption: "d" },
{ id: 44, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1xezvzlWJ81q1Rc_lhxmykRiMRVVCm6zF&sz=w2000", optionA: "d", optionB: "c", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 45, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1Pw8aavzx2Rz_oSr_fiJmf50s1jIQKKw5&sz=w2000", optionA: "a", optionB: "b", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 46, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1Q4qTzI2x5tkw4OCdihq7PF-yfkskIueU&sz=w2000", optionA: "a", optionB: "b", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 47, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oRfvIWl7vg2-d_CsDdJsVrjUSZ5AJYaI&sz=w2000", optionA: "b", optionB: "c", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 48, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1-gdOS-wTg3k2gvntbeFHD2G6MaBAIhTi&sz=w2000", optionA: "c", optionB: "d", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 49, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1QbMImyiuiUIXdkd-hILGWlQ_jyrfuZkH&sz=w2000", optionA: "a", optionB: "b", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 50, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1Yt_e3KTNJ51UaG6_NTM23YCjCyKMTfEd&sz=w2000", optionA: "b", optionB: "a", optionC: "c", optionD: "d", correctOption: "d" },
// White Mock Test 2
{ id: 1, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1xPjLBdih8zVmjToRKcnJJ18lWBicYqUM&sz=w2000", optionA: "c", optionB: "d", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 2, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1NqqRVH6TCFKdJyN26hSqRVLbbf9j0pDu&sz=w2000", optionA: "c", optionB: "a", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 3, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1l9KaRSHHRWsaFlJh7XdqWUBiKgbeHAk1&sz=w2000", optionA: "b", optionB: "d", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 4, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1WGyEA6gw8Y4It3R-GVykoMN8p8sqSW8B&sz=w2000", optionA: "a", optionB: "d", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 5, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1A37WOiMTsCeWa09_0PygE_rkIsyBruc8&sz=w2000", optionA: "a", optionB: "b", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 6, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1JJxqZM6cwY8ivaSpFAQkMV7uzDH9L_Ds&sz=w2000", optionA: "b", optionB: "d", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 7, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=128y9qu5OkbiYJ8ddIB8euJ-tTGEBZmj1&sz=w2000", optionA: "b", optionB: "c", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 8, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=10_qd_T2kZ5hDgvBNIV3MbwCqU7cmHvM5&sz=w2000", optionA: "c", optionB: "a", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 9, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1-1Xl2gi9tSJwEohR4Nf6MEG-SOAv1eht&sz=w2000", optionA: "c", optionB: "a", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 10, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=18ubetrGqW3vrfyh6PWigzD-nTdHtRPmv&sz=w2000", optionA: "d", optionB: "a", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 11, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1QACPSrLpyUY2oVnoQks8ymKlki01OqCN&sz=w2000", optionA: "a", optionB: "b", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 12, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1VYDcOciMZCn6B-ohPAuUsGcZ5ngAIcmy&sz=w2000", optionA: "d", optionB: "c", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 13, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1H1DLZt7PHKs859TuZU6dcHI7kYHvx_HD&sz=w2000", optionA: "c", optionB: "a", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 14, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1CKDKst8y2V2P3pME0Vs8NBvJyLU_M7sT&sz=w2000", optionA: "b", optionB: "d", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 15, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1Nf5SWvGJDdNUxAuJUCz6-fOs1V61pVeV&sz=w2000", optionA: "d", optionB: "b", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 16, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1q_iUa8AY_FzYu19awcFWevB9bNW28VHa&sz=w2000", optionA: "d", optionB: "a", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 17, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=13fBs3dz43Xa_YkouXwTAEIcP7u0ayZQG&sz=w2000", optionA: "a", optionB: "c", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 18, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1OMbZlkUaoa8ju_InqWB23swV7c-3NfVE&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 19, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1r3CYUGnRMCrbaM3o2O8DRMySeK367Cj6&sz=w2000", optionA: "d", optionB: "b", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 20, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1IVJlpjcTDwqg7rXEZdbNkUS03TN0aD1j&sz=w2000", optionA: "d", optionB: "b", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 21, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=16JeJ3Mtce9fBIp5--Fyj2e2JTt_a-u26&sz=w2000", optionA: "d", optionB: "b", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 22, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1zD-H_zgajc3dmm-ZsOLf5tBje2C4hlX5&sz=w2000", optionA: "b", optionB: "d", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 23, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=192Id1ZtTeYN9SB3Az6-2IWLAcurLnz6O&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 24, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1js-nTcU7Lkm-5YoUoY_UL4HMGyledTVO&sz=w2000", optionA: "a", optionB: "c", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 25, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1eQ5Vzds11vdTG0p5t2rYIprmofd_H88Y&sz=w2000", optionA: "d", optionB: "b", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 26, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=12h8gV1KUCsozGIqW0DE0Wmq7iq0m_MUL&sz=w2000", optionA: "c", optionB: "a", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 27, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1ZhpanAYKtgxIMCu0PiNep6kUZdARICJ2&sz=w2000", optionA: "b", optionB: "d", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 28, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=13i0zzImzV623VU7qSMqlgKv8oWVbU59F&sz=w2000", optionA: "b", optionB: "c", optionC: "a", optionD: "d", correctOption: "d" },
{ id: 29, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=16rIZMZ7l1PFBKnsFZmo8AZfXyi8AyfmR&sz=w2000", optionA: "b", optionB: "d", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 30, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1w2iUfXSpODNp7dSb7NIf3_Z475YdSxUb&sz=w2000", optionA: "a", optionB: "d", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 31, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1FAw31Ao0bNCrpKLO0-hCv64pMVOBXYME&sz=w2000", optionA: "a", optionB: "c", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 32, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1n9JVKMnZ81FM0PLw0k93WFBPwMAC7xpD&sz=w2000", optionA: "d", optionB: "c", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 33, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1nS3T3l8AxDqLYWgqX0bAOCVcXYFVz3A6&sz=w2000", optionA: "d", optionB: "a", optionC: "b", optionD: "c", correctOption: "d" },
{ id: 34, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1p_YJ-Ka0M3xN6svADD5pVuMxKOdARBrS&sz=w2000", optionA: "a", optionB: "b", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 35, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1uTKCwESMAOzR4iWqpslWUpOqqemM3qUH&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 36, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=15FRSWKXrAwR7Esi0SrcG05rLaCAUWm1d&sz=w2000", optionA: "c", optionB: "b", optionC: "a", optionD: "d", correctOption: "d" },
{ id: 37, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=17grS0Wph1ZJgx8T2Kaz_Z_5nPsC3f9E_&sz=w2000", optionA: "d", optionB: "b", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 38, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1hP1MNUzT3Lg4eh86-nyRm7MRDjDGRvr9&sz=w2000", optionA: "c", optionB: "a", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 39, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1m-mMr4SdjkZ-dHTljG8OXSb3RxQA3Wcu&sz=w2000", optionA: "b", optionB: "d", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 40, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1wUbnAgnLeyQ3HyKYp4YdUw1ykJtGAulB&sz=w2000", optionA: "c", optionB: "a", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 41, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1ftZYPk4i5HsXN2nEvVZ-41AQd-_xDqJt&sz=w2000", optionA: "b", optionB: "c", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 42, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1Mv6QU_e8aztJlVWyL-r9QWyGlmMqmzZv&sz=w2000", optionA: "a", optionB: "d", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 43, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1EpMIGvqEiP09_BVRkjV4bzGJJlhVvVBK&sz=w2000", optionA: "d", optionB: "a", optionC: "b", optionD: "c", correctOption: "d" },
{ id: 44, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1bhkLr86ApM1SRcRwMsMCcOCggDULViTb&sz=w2000", optionA: "a", optionB: "b", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 45, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1On2oDcoIq47zf1E1XwVbfWs8cgh77SJS&sz=w2000", optionA: "d", optionB: "c", optionC: "b", optionD: "a", correctOption: "d" },
{ id: 46, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1vtlpWeoixUJ8Vo4gThy8vw53c1K8FQm3&sz=w2000", optionA: "b", optionB: "c", optionC: "a", optionD: "d", correctOption: "d" },
{ id: 47, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1shCcOTU-8RGaotLX7pJx2nPbtHpEvMnh&sz=w2000", optionA: "c", optionB: "d", optionC: "b", optionD: "a", correctOption: "d" },
{ id: 48, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=17mK6eYRKQlz2nUrdW9sIrNcZvaSN0kxa&sz=w2000", optionA: "a", optionB: "d", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 49, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1kagnsuuWUi2QqbKYx_Uu7Ke-vXNGwCeQ&sz=w2000", optionA: "b", optionB: "d", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 50, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oWW-Ae3438YOaCtB_jmokHHq8fpv500K&sz=w2000", optionA: "c", optionB: "b", optionC: "d", optionD: "a", correctOption: "d" },

// JEE B.Arch PYQ 2025 April Attempt
{ id: 1, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1nqwR8KC6VO2WdQUZH03T5Jby0roMongI&sz=w2000", optionA: "d", optionB: "c", optionC: "b", optionD: "a", correctOption: "d" },
{ id: 2, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1nv6vQXogWLOlIiulRtK4UflEfuaffW9c&sz=w2000", optionA: "d", optionB: "b", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 3, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1nxxhg4VWTN9lmKbbRSsEUCHO_oaANfNG&sz=w2000", optionA: "c", optionB: "d", optionC: "b", optionD: "a", correctOption: "d" },
{ id: 4, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1nzRza3Y0LDn6j7nMX1xl4SjBIzBlFtZk&sz=w2000", optionA: "a", optionB: "c", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 5, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1o-JTkKfaKe4z-jT4ku6Ji4r5-eGOzm52&sz=w2000", optionA: "b", optionB: "a", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 6, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1o3C4Aboztv6paPy56xKTGYvGohrp4Hmk&sz=w2000", optionA: "c", optionB: "b", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 7, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1o4gkBxB5GhAKnjsrCTaKN0-iP1uql1hn&sz=w2000", optionA: "a", optionB: "b", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 8, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1o8oNDjmWRcim3DEVuKe1R73uPyNVO3uU&sz=w2000", optionA: "b", optionB: "d", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 9, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1o97ZYCf_OLHTmtjBvZDbpEw2JdSqbyqU&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 10, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oHWnYR0EqcTnndkQ4D4-ro29hpuEF6yV&sz=w2000", optionA: "d", optionB: "a", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 11, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oP699Fjm2uAZyD__MhQlejWn5zk48bml&sz=w2000", optionA: "c", optionB: "d", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 12, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oPSF9ZbJ_Qa4yJEeCdlo0cCsuAG4-_P_&sz=w2000", optionA: "a", optionB: "c", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 13, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oTdCAsbeAfcEjk3X43h0nWof-8i_e8ea&sz=w2000", optionA: "b", optionB: "c", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 14, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oYlARBq4ddYercqKE7Y3nCghZ79yCh2R&sz=w2000", optionA: "c", optionB: "a", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 15, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1o_C2-HX8zHV5Dc_c4fnt4bZ4fKjPkBt-&sz=w2000", optionA: "a", optionB: "c", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 16, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oahJnyEerL9HWFjyU4YRj_FRTtRL1sbZ&sz=w2000", optionA: "b", optionB: "c", optionC: "a", optionD: "d", correctOption: "d" },
{ id: 17, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oc022o9nuT739rTm7PK6tFbL5Lv3UW1O&sz=w2000", optionA: "a", optionB: "c", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 18, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oi7jOfJGqQQK7b58x50HSZJyNPj1VeMv&sz=w2000", optionA: "d", optionB: "a", optionC: "b", optionD: "c", correctOption: "d" },
{ id: 19, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1onHwHvcSrZzQsZ2NjAneT95ZPKenRP-4&sz=w2000", optionA: "d", optionB: "a", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 20, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1otdEsWhCSD0la91jePMOmMKRsjZGdY49&sz=w2000", optionA: "a", optionB: "d", optionC: "b", optionD: "c", correctOption: "d" },
{ id: 21, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1ou3-HOQ89z6BnXHulhxDGs6V0oSgZfKO&sz=w2000", optionA: "c", optionB: "d", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 22, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1ouvwjWB_YZ6-F5b938THmWt4wutMA8Dd&sz=w2000", optionA: "c", optionB: "b", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 23, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oyail-YweH2hKoa77TPjGNxNvzF2E9Y-&sz=w2000", optionA: "b", optionB: "d", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 24, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1p3VcWUio3rmQk49Wraj9cKSNfoTfkl9-&sz=w2000", optionA: "b", optionB: "d", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 25, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pGeOqt4B7wmKBDouegIbF8y05S1pDDr0&sz=w2000", optionA: "a", optionB: "c", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 26, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pUQHV3dv_LUJaxDsupDI8jkuz382JdFj&sz=w2000", optionA: "c", optionB: "b", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 27, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pVKWkhunQOiMq6oAusKVqEFxMkReSZdy&sz=w2000", optionA: "a", optionB: "c", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 28, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pXKQzT5s0aFKcpECMvSYZYguN1Nwhl-x&sz=w2000", optionA: "c", optionB: "b", optionC: "a", optionD: "d", correctOption: "d" },
{ id: 29, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pXo1nkUxVXgR26-BcFmd34APzCw2lSDY&sz=w2000", optionA: "c", optionB: "a", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 30, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1peKsqUDiTvl5rxx8_of6ls0KtLZgtNZJ&sz=w2000", optionA: "a", optionB: "b", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 31, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pes36ciHNjb8ambJVLyPU6ZoAj5T8rnb&sz=w2000", optionA: "b", optionB: "d", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 32, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pm-QHJXRQnypEiLrU_ZlVcT8avSyI4-1&sz=w2000", optionA: "d", optionB: "a", optionC: "b", optionD: "c", correctOption: "d" },
{ id: 33, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pvlATMjW2RVAbJJktBU-bYqVEIwMGgfJ&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 34, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1px8DfxlQnggcIfm2-K_bxynM04_7URZl&sz=w2000", optionA: "b", optionB: "c", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 35, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pyFpJJfc67Hj78QHJGvELs6EtzjbOzLF&sz=w2000", optionA: "a", optionB: "b", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 36, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1q--Dw79tgHDBFIVLdQ6eRXgQMvcLamnG&sz=w2000", optionA: "a", optionB: "c", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 37, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1q2GMwNMYY9ZLHP8UHmZa0X_JtuAk68qe&sz=w2000", optionA: "c", optionB: "b", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 38, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qBXoSw9dWHDQyxeHAU7iHX2Sk6fMv1cm&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 39, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qCOeHUNfAT_isj5IW18R_OxIUeOesytE&sz=w2000", optionA: "b", optionB: "c", optionC: "a", optionD: "d", correctOption: "d" },
{ id: 40, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qJsB7mjQxZxErd3-YaSTwPEhradtfhMv&sz=w2000", optionA: "b", optionB: "d", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 41, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qWiHdnLsWGGKdh9zMy2SoSMQmhi11fRJ&sz=w2000", optionA: "b", optionB: "a", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 42, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qXeYmu75J9tbn6ZzQrNY5BQ2w91xX085&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 43, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qZ6ZJENWWfRTUYsvkEA8wJiLhtXkXHty&sz=w2000", optionA: "b", optionB: "a", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 44, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qleWJBoVkk4fupcrjAgVJAk3LYuPX8Q_&sz=w2000", optionA: "b", optionB: "d", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 45, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qp3282dSKw03-o3EYO05uhxh5hCkSVX0&sz=w2000", optionA: "c", optionB: "a", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 46, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qp4j3RPF-NQmO9siVf8YDV7LXWhyAUbN&sz=w2000", optionA: "b", optionB: "c", optionC: "a", optionD: "d", correctOption: "d" },
{ id: 47, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qrce24dYt3HlSqjGnRWbBGZLnLKgPc8C&sz=w2000", optionA: "c", optionB: "d", optionC: "b", optionD: "a", correctOption: "d" },
{ id: 48, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qtUAFt7ZRQTKlwJsFCW0esRorYblZ5Yy&sz=w2000", optionA: "c", optionB: "a", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 49, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qtbOC6kN5ZVbnwI3Wo_BMthYgzats4j2&sz=w2000", optionA: "c", optionB: "b", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 50, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qxuTec8eNTT0xZ3nC5jpbv86TYP3Br6a&sz=w2000", optionA: "a", optionB: "b", optionC: "d", optionD: "c", correctOption: "d" },
// White Mock Test 1 rank
{ id: 1, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1VypMXlWqcUFk3AHY15R5QQsr-xKhB0RZ&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 2, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1g1NuHqJrUZVkwN14484udRStI-8_hMIE&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 3, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1esGjNMzajetl-BrKhQUnAYoxY4jDy6Lq&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 4, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=183VWs6PZFsWQAgEMmRqlRRxsqpqed_Yb&sz=w2000", optionA: "d", optionB: "c", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 5, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1RU_qpgh_Yy-w5OXzjhnJuE-obYSw5Umv&sz=w2000", optionA: "d", optionB: "c", optionC: "b", optionD: "a", correctOption: "d" },
{ id: 6, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1rO8wSalEivEH_PI1jjooc0mRq6zl0wM3&sz=w2000", optionA: "a", optionB: "d", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 7, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1SasY_kxIm--jquZolsp1WQ88sWHEPP7t&sz=w2000", optionA: "b", optionB: "c", optionC: "e", optionD: "d", correctOption: "d" },
{ id: 8, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1O_6FpeJkAk0iWM_qZwVC2zZ-qX9oeA85&sz=w2000", optionA: "c", optionB: "a", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 9, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1RK3pH9UstXGy2lHhzMrKMu8f2zRirMqc&sz=w2000", optionA: "a", optionB: "c", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 10, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1m0OD2ilJbLshhBaaxyUq2Wa4Wu3p6NzK&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 11, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1vVlM4PW5sDYqHFvP0uUtyFOISQukyuRo&sz=w2000", optionA: "d", optionB: "a", optionC: "b", optionD: "c", correctOption: "d" },
{ id: 12, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=11JdQCUHE7G8YsCDnX3QET26wriSxzu_g&sz=w2000", optionA: "c", optionB: "a", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 13, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1eEkYC62dfhc4BGeHRpZLHHJrcoMwYqDv&sz=w2000", optionA: "c", optionB: "d", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 14, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pqnDJ1JPTSHu6Z2Bbu2XyxSfDo5PRvqS&sz=w2000", optionA: "c", optionB: "b", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 15, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1QXocpweOsbgXMIm_LLQhzPT_y8fjysbm&sz=w2000", optionA: "a", optionB: "c", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 16, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=14ooAQ8T53l0iph1imesi3zNHmAyFavxN&sz=w2000", optionA: "a", optionB: "d", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 17, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oLpMJJVz3ar8i_8vG2IAAJEucxrmnB9U&sz=w2000", optionA: "d", optionB: "b", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 18, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1m_KGPW6dMnCQ1PyfQrI3F-3qxaK29f3L&sz=w2000", optionA: "d", optionB: "c", optionC: "b", optionD: "a", correctOption: "d" },
{ id: 19, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1hYG_KZWsmdDwSyHCaHuRVsJJFUWoFysQ&sz=w2000", optionA: "a", optionB: "c", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 20, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1tRCsqC7-9s76pDz_lfJGYmQ4fMvQawlA&sz=w2000", optionA: "a", optionB: "b", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 21, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1x8lqczFMZ796GisgSn3kFVbdsfQS0_sE&sz=w2000", optionA: "c", optionB: "a", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 22, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1jLjcPdxlyIS7GE6dxObjN_4qHOmi2pQ6&sz=w2000", optionA: "a", optionB: "d", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 23, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1DZRHMjR3OOX9bs_aPgAoHOwok7eFR6xP&sz=w2000", optionA: "d", optionB: "b", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 24, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1fAB4CSVWfeyiykrJJw02Az_4sE4Ie8NR&sz=w2000", optionA: "a", optionB: "d", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 25, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1FgJknVGgdB7I41fzwLENV5twjkinU5cR&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 26, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=11cLxQNh2WN55OBvTZ42qfQnjEqezr0SJ&sz=w2000", optionA: "c", optionB: "b", optionC: "a", optionD: "d", correctOption: "d" },
{ id: 27, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1JY6QUP_PWNr4C-seIybAr6mDLl3-PtyF&sz=w2000", optionA: "b", optionB: "c", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 28, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1ZxfJOcu-2zqdKnYOmZcSMYvpCiNMwe0m&sz=w2000", optionA: "a", optionB: "d", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 29, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=16kZyqGgAQhw7dipSnewVA7-Dybc9NqOF&sz=w2000", optionA: "a", optionB: "c", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 30, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1Xpt4YMo8KDpqUOcEIcEw2QxMJ4klomWD&sz=w2000", optionA: "d", optionB: "c", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 31, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1gLV3OzQjZJXYSDWqaryQrU167P503ONL&sz=w2000", optionA: "d", optionB: "a", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 32, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1sYz9X_Q_Hfrd2bFrZAOZodelHHdrw3tl&sz=w2000", optionA: "c", optionB: "d", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 33, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1_Min3hbZ8oqBlklB-9muqLj0XKX2jdUM&sz=w2000", optionA: "d", optionB: "b", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 34, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1h6NKOan28Oj984Po1E9R2GGNfRAILyrD&sz=w2000", optionA: "c", optionB: "a", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 35, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1y9-GEc4S1jDyS1WNL5OqFTRWoibym8L9&sz=w2000", optionA: "d", optionB: "b", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 36, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=12SSfmqi0BxeHjj6TGrfTvpsE_RjzhVih&sz=w2000", optionA: "c", optionB: "b", optionC: "a", optionD: "d", correctOption: "d" },
{ id: 37, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1eUjVa7v_ON7N6s_qfEn0PRpt6tlZg0Nh&sz=w2000", optionA: "c", optionB: "d", optionC: "b", optionD: "a", correctOption: "d" },
{ id: 38, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1nVDvolkMBU5QnCu4ZXje5fKtj99ljcAs&sz=w2000", optionA: "d", optionB: "c", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 39, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1wCFi9rQOalR-ywFlazS9mbE7gUp3Upoi&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 40, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1TCW7C9tbN9Ws1TyylcKhxRsCmU9T_AwF&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 41, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=19JYrLFSFg08Hxg4k40euxlKctlqRoNLa&sz=w2000", optionA: "a", optionB: "c", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 42, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1fu0j-xT12g6vT_HoZ7GqYpPUWiDmcp_N&sz=w2000", optionA: "a", optionB: "d", optionC: "b", optionD: "c", correctOption: "d" },
{ id: 43, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1UsmoIMZxUn48fFR4ZlZqKaQSd-OldWg4&sz=w2000", optionA: "c", optionB: "d", optionC: "b", optionD: "a", correctOption: "d" },
{ id: 44, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1xezvzlWJ81q1Rc_lhxmykRiMRVVCm6zF&sz=w2000", optionA: "d", optionB: "c", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 45, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1Pw8aavzx2Rz_oSr_fiJmf50s1jIQKKw5&sz=w2000", optionA: "a", optionB: "b", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 46, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1Q4qTzI2x5tkw4OCdihq7PF-yfkskIueU&sz=w2000", optionA: "a", optionB: "b", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 47, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oRfvIWl7vg2-d_CsDdJsVrjUSZ5AJYaI&sz=w2000", optionA: "b", optionB: "c", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 48, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1-gdOS-wTg3k2gvntbeFHD2G6MaBAIhTi&sz=w2000", optionA: "c", optionB: "d", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 49, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1QbMImyiuiUIXdkd-hILGWlQ_jyrfuZkH&sz=w2000", optionA: "a", optionB: "b", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 50, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1Yt_e3KTNJ51UaG6_NTM23YCjCyKMTfEd&sz=w2000", optionA: "b", optionB: "a", optionC: "c", optionD: "d", correctOption: "d" },
// JEE B.Arch PYQ 2025 April Attempt rank
{ id: 1, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1nqwR8KC6VO2WdQUZH03T5Jby0roMongI&sz=w2000", optionA: "d", optionB: "c", optionC: "b", optionD: "a", correctOption: "d" },
{ id: 2, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1nv6vQXogWLOlIiulRtK4UflEfuaffW9c&sz=w2000", optionA: "d", optionB: "b", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 3, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1nxxhg4VWTN9lmKbbRSsEUCHO_oaANfNG&sz=w2000", optionA: "c", optionB: "d", optionC: "b", optionD: "a", correctOption: "d" },
{ id: 4, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1nzRza3Y0LDn6j7nMX1xl4SjBIzBlFtZk&sz=w2000", optionA: "a", optionB: "c", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 5, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1o-JTkKfaKe4z-jT4ku6Ji4r5-eGOzm52&sz=w2000", optionA: "b", optionB: "a", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 6, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1o3C4Aboztv6paPy56xKTGYvGohrp4Hmk&sz=w2000", optionA: "c", optionB: "b", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 7, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1o4gkBxB5GhAKnjsrCTaKN0-iP1uql1hn&sz=w2000", optionA: "a", optionB: "b", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 8, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1o8oNDjmWRcim3DEVuKe1R73uPyNVO3uU&sz=w2000", optionA: "b", optionB: "d", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 9, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1o97ZYCf_OLHTmtjBvZDbpEw2JdSqbyqU&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 10, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oHWnYR0EqcTnndkQ4D4-ro29hpuEF6yV&sz=w2000", optionA: "d", optionB: "a", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 11, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oP699Fjm2uAZyD__MhQlejWn5zk48bml&sz=w2000", optionA: "c", optionB: "d", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 12, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oPSF9ZbJ_Qa4yJEeCdlo0cCsuAG4-_P_&sz=w2000", optionA: "a", optionB: "c", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 13, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oTdCAsbeAfcEjk3X43h0nWof-8i_e8ea&sz=w2000", optionA: "b", optionB: "c", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 14, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oYlARBq4ddYercqKE7Y3nCghZ79yCh2R&sz=w2000", optionA: "c", optionB: "a", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 15, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1o_C2-HX8zHV5Dc_c4fnt4bZ4fKjPkBt-&sz=w2000", optionA: "a", optionB: "c", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 16, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oahJnyEerL9HWFjyU4YRj_FRTtRL1sbZ&sz=w2000", optionA: "b", optionB: "c", optionC: "a", optionD: "d", correctOption: "d" },
{ id: 17, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oc022o9nuT739rTm7PK6tFbL5Lv3UW1O&sz=w2000", optionA: "a", optionB: "c", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 18, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oi7jOfJGqQQK7b58x50HSZJyNPj1VeMv&sz=w2000", optionA: "d", optionB: "a", optionC: "b", optionD: "c", correctOption: "d" },
{ id: 19, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1onHwHvcSrZzQsZ2NjAneT95ZPKenRP-4&sz=w2000", optionA: "d", optionB: "a", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 20, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1otdEsWhCSD0la91jePMOmMKRsjZGdY49&sz=w2000", optionA: "a", optionB: "d", optionC: "b", optionD: "c", correctOption: "d" },
{ id: 21, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1ou3-HOQ89z6BnXHulhxDGs6V0oSgZfKO&sz=w2000", optionA: "c", optionB: "d", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 22, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1ouvwjWB_YZ6-F5b938THmWt4wutMA8Dd&sz=w2000", optionA: "c", optionB: "b", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 23, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oyail-YweH2hKoa77TPjGNxNvzF2E9Y-&sz=w2000", optionA: "b", optionB: "d", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 24, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1p3VcWUio3rmQk49Wraj9cKSNfoTfkl9-&sz=w2000", optionA: "b", optionB: "d", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 25, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pGeOqt4B7wmKBDouegIbF8y05S1pDDr0&sz=w2000", optionA: "a", optionB: "c", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 26, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pUQHV3dv_LUJaxDsupDI8jkuz382JdFj&sz=w2000", optionA: "c", optionB: "b", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 27, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pVKWkhunQOiMq6oAusKVqEFxMkReSZdy&sz=w2000", optionA: "a", optionB: "c", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 28, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pXKQzT5s0aFKcpECMvSYZYguN1Nwhl-x&sz=w2000", optionA: "c", optionB: "b", optionC: "a", optionD: "d", correctOption: "d" },
{ id: 29, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pXo1nkUxVXgR26-BcFmd34APzCw2lSDY&sz=w2000", optionA: "c", optionB: "a", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 30, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1peKsqUDiTvl5rxx8_of6ls0KtLZgtNZJ&sz=w2000", optionA: "a", optionB: "b", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 31, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pes36ciHNjb8ambJVLyPU6ZoAj5T8rnb&sz=w2000", optionA: "b", optionB: "d", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 32, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pm-QHJXRQnypEiLrU_ZlVcT8avSyI4-1&sz=w2000", optionA: "d", optionB: "a", optionC: "b", optionD: "c", correctOption: "d" },
{ id: 33, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pvlATMjW2RVAbJJktBU-bYqVEIwMGgfJ&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 34, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1px8DfxlQnggcIfm2-K_bxynM04_7URZl&sz=w2000", optionA: "b", optionB: "c", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 35, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pyFpJJfc67Hj78QHJGvELs6EtzjbOzLF&sz=w2000", optionA: "a", optionB: "b", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 36, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1q--Dw79tgHDBFIVLdQ6eRXgQMvcLamnG&sz=w2000", optionA: "a", optionB: "c", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 37, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1q2GMwNMYY9ZLHP8UHmZa0X_JtuAk68qe&sz=w2000", optionA: "c", optionB: "b", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 38, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qBXoSw9dWHDQyxeHAU7iHX2Sk6fMv1cm&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 39, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qCOeHUNfAT_isj5IW18R_OxIUeOesytE&sz=w2000", optionA: "b", optionB: "c", optionC: "a", optionD: "d", correctOption: "d" },
{ id: 40, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qJsB7mjQxZxErd3-YaSTwPEhradtfhMv&sz=w2000", optionA: "b", optionB: "d", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 41, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qWiHdnLsWGGKdh9zMy2SoSMQmhi11fRJ&sz=w2000", optionA: "b", optionB: "a", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 42, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qXeYmu75J9tbn6ZzQrNY5BQ2w91xX085&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 43, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qZ6ZJENWWfRTUYsvkEA8wJiLhtXkXHty&sz=w2000", optionA: "b", optionB: "a", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 44, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qleWJBoVkk4fupcrjAgVJAk3LYuPX8Q_&sz=w2000", optionA: "b", optionB: "d", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 45, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qp3282dSKw03-o3EYO05uhxh5hCkSVX0&sz=w2000", optionA: "c", optionB: "a", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 46, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qp4j3RPF-NQmO9siVf8YDV7LXWhyAUbN&sz=w2000", optionA: "b", optionB: "c", optionC: "a", optionD: "d", correctOption: "d" },
{ id: 47, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qrce24dYt3HlSqjGnRWbBGZLnLKgPc8C&sz=w2000", optionA: "c", optionB: "d", optionC: "b", optionD: "a", correctOption: "d" },
{ id: 48, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qtUAFt7ZRQTKlwJsFCW0esRorYblZ5Yy&sz=w2000", optionA: "c", optionB: "a", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 49, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qtbOC6kN5ZVbnwI3Wo_BMthYgzats4j2&sz=w2000", optionA: "c", optionB: "b", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 50, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qxuTec8eNTT0xZ3nC5jpbv86TYP3Br6a&sz=w2000", optionA: "a", optionB: "b", optionC: "d", optionD: "c", correctOption: "d" },
// JEE B.Arch PYQ 2025 April Attempt dheya
{ id: 1, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1nqwR8KC6VO2WdQUZH03T5Jby0roMongI&sz=w2000", optionA: "d", optionB: "c", optionC: "b", optionD: "a", correctOption: "d" },
{ id: 2, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1nv6vQXogWLOlIiulRtK4UflEfuaffW9c&sz=w2000", optionA: "d", optionB: "b", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 3, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1nxxhg4VWTN9lmKbbRSsEUCHO_oaANfNG&sz=w2000", optionA: "c", optionB: "d", optionC: "b", optionD: "a", correctOption: "d" },
{ id: 4, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1nzRza3Y0LDn6j7nMX1xl4SjBIzBlFtZk&sz=w2000", optionA: "a", optionB: "c", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 5, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1o-JTkKfaKe4z-jT4ku6Ji4r5-eGOzm52&sz=w2000", optionA: "b", optionB: "a", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 6, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1o3C4Aboztv6paPy56xKTGYvGohrp4Hmk&sz=w2000", optionA: "c", optionB: "b", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 7, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1o4gkBxB5GhAKnjsrCTaKN0-iP1uql1hn&sz=w2000", optionA: "a", optionB: "b", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 8, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1o8oNDjmWRcim3DEVuKe1R73uPyNVO3uU&sz=w2000", optionA: "b", optionB: "d", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 9, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1o97ZYCf_OLHTmtjBvZDbpEw2JdSqbyqU&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 10, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oHWnYR0EqcTnndkQ4D4-ro29hpuEF6yV&sz=w2000", optionA: "d", optionB: "a", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 11, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oP699Fjm2uAZyD__MhQlejWn5zk48bml&sz=w2000", optionA: "c", optionB: "d", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 12, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oPSF9ZbJ_Qa4yJEeCdlo0cCsuAG4-_P_&sz=w2000", optionA: "a", optionB: "c", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 13, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oTdCAsbeAfcEjk3X43h0nWof-8i_e8ea&sz=w2000", optionA: "b", optionB: "c", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 14, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oYlARBq4ddYercqKE7Y3nCghZ79yCh2R&sz=w2000", optionA: "c", optionB: "a", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 15, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1o_C2-HX8zHV5Dc_c4fnt4bZ4fKjPkBt-&sz=w2000", optionA: "a", optionB: "c", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 16, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oahJnyEerL9HWFjyU4YRj_FRTtRL1sbZ&sz=w2000", optionA: "b", optionB: "c", optionC: "a", optionD: "d", correctOption: "d" },
{ id: 17, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oc022o9nuT739rTm7PK6tFbL5Lv3UW1O&sz=w2000", optionA: "a", optionB: "c", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 18, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oi7jOfJGqQQK7b58x50HSZJyNPj1VeMv&sz=w2000", optionA: "d", optionB: "a", optionC: "b", optionD: "c", correctOption: "d" },
{ id: 19, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1onHwHvcSrZzQsZ2NjAneT95ZPKenRP-4&sz=w2000", optionA: "d", optionB: "a", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 20, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1otdEsWhCSD0la91jePMOmMKRsjZGdY49&sz=w2000", optionA: "a", optionB: "d", optionC: "b", optionD: "c", correctOption: "d" },
{ id: 21, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1ou3-HOQ89z6BnXHulhxDGs6V0oSgZfKO&sz=w2000", optionA: "c", optionB: "d", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 22, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1ouvwjWB_YZ6-F5b938THmWt4wutMA8Dd&sz=w2000", optionA: "c", optionB: "b", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 23, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oyail-YweH2hKoa77TPjGNxNvzF2E9Y-&sz=w2000", optionA: "b", optionB: "d", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 24, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1p3VcWUio3rmQk49Wraj9cKSNfoTfkl9-&sz=w2000", optionA: "b", optionB: "d", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 25, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pGeOqt4B7wmKBDouegIbF8y05S1pDDr0&sz=w2000", optionA: "a", optionB: "c", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 26, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pUQHV3dv_LUJaxDsupDI8jkuz382JdFj&sz=w2000", optionA: "c", optionB: "b", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 27, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pVKWkhunQOiMq6oAusKVqEFxMkReSZdy&sz=w2000", optionA: "a", optionB: "c", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 28, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pXKQzT5s0aFKcpECMvSYZYguN1Nwhl-x&sz=w2000", optionA: "c", optionB: "b", optionC: "a", optionD: "d", correctOption: "d" },
{ id: 29, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pXo1nkUxVXgR26-BcFmd34APzCw2lSDY&sz=w2000", optionA: "c", optionB: "a", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 30, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1peKsqUDiTvl5rxx8_of6ls0KtLZgtNZJ&sz=w2000", optionA: "a", optionB: "b", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 31, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pes36ciHNjb8ambJVLyPU6ZoAj5T8rnb&sz=w2000", optionA: "b", optionB: "d", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 32, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pm-QHJXRQnypEiLrU_ZlVcT8avSyI4-1&sz=w2000", optionA: "d", optionB: "a", optionC: "b", optionD: "c", correctOption: "d" },
{ id: 33, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pvlATMjW2RVAbJJktBU-bYqVEIwMGgfJ&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 34, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1px8DfxlQnggcIfm2-K_bxynM04_7URZl&sz=w2000", optionA: "b", optionB: "c", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 35, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pyFpJJfc67Hj78QHJGvELs6EtzjbOzLF&sz=w2000", optionA: "a", optionB: "b", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 36, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1q--Dw79tgHDBFIVLdQ6eRXgQMvcLamnG&sz=w2000", optionA: "a", optionB: "c", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 37, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1q2GMwNMYY9ZLHP8UHmZa0X_JtuAk68qe&sz=w2000", optionA: "c", optionB: "b", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 38, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qBXoSw9dWHDQyxeHAU7iHX2Sk6fMv1cm&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 39, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qCOeHUNfAT_isj5IW18R_OxIUeOesytE&sz=w2000", optionA: "b", optionB: "c", optionC: "a", optionD: "d", correctOption: "d" },
{ id: 40, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qJsB7mjQxZxErd3-YaSTwPEhradtfhMv&sz=w2000", optionA: "b", optionB: "d", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 41, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qWiHdnLsWGGKdh9zMy2SoSMQmhi11fRJ&sz=w2000", optionA: "b", optionB: "a", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 42, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qXeYmu75J9tbn6ZzQrNY5BQ2w91xX085&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 43, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qZ6ZJENWWfRTUYsvkEA8wJiLhtXkXHty&sz=w2000", optionA: "b", optionB: "a", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 44, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qleWJBoVkk4fupcrjAgVJAk3LYuPX8Q_&sz=w2000", optionA: "b", optionB: "d", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 45, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qp3282dSKw03-o3EYO05uhxh5hCkSVX0&sz=w2000", optionA: "c", optionB: "a", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 46, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qp4j3RPF-NQmO9siVf8YDV7LXWhyAUbN&sz=w2000", optionA: "b", optionB: "c", optionC: "a", optionD: "d", correctOption: "d" },
{ id: 47, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qrce24dYt3HlSqjGnRWbBGZLnLKgPc8C&sz=w2000", optionA: "c", optionB: "d", optionC: "b", optionD: "a", correctOption: "d" },
{ id: 48, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qtUAFt7ZRQTKlwJsFCW0esRorYblZ5Yy&sz=w2000", optionA: "c", optionB: "a", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 49, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qtbOC6kN5ZVbnwI3Wo_BMthYgzats4j2&sz=w2000", optionA: "c", optionB: "b", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 50, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qxuTec8eNTT0xZ3nC5jpbv86TYP3Br6a&sz=w2000", optionA: "a", optionB: "b", optionC: "d", optionD: "c", correctOption: "d" },


];

const DEFAULT_TEST_DURATION = 3600;

export const testCategories: TestCategory[] = [
  {
    id: "white",
    name: "White Mock Tests",
    icon: "⚪",
    color: "bg-white border-gray-300",
    description: "Comprehensive mock tests",
  },
  {
    id: "blue",
    name: "Blue Mock Tests",
    icon: "🔵",
    color: "bg-blue-50 border-blue-300",
    description: "Advanced practice tests",
  },
  {
    id: "grey",
    name: "Grey Mock Tests",
    icon: "⚫",
    color: "bg-gray-50 border-gray-300",
    description: "Standard difficulty tests",
  },
  {
    id: "pyq",
    name: "PYQ (2005-2025)",
    icon: "📚",
    color: "bg-yellow-50 border-yellow-300",
    description: "Previous Year Questions",
  },
  {
    id: "latest",
    name: "Latest Pattern",
    icon: "🆕",
    color: "bg-green-50 border-green-300",
    description: "New test pattern",
  },
];
// ==========================================
// 📝 ADD YOUR TESTS HERE - ORGANIZED BY COURSE
// ==========================================

const initialTests: Test[] = [
  // FOUNDATION
  {
    id: 'foundation-white-mock-test-1',
    name: 'foundation-white-mock-test-1',
    description: 'Mock test based on Actual PYQ',
    duration: DEFAULT_TEST_DURATION,
    questions: sampleQuestions.slice(0, 50),
    category: 'white',
    course: 'foundation',
  },
  {
    id: 'foundation-white-mock-test-2',
    name: 'foundation-white-mock-test-2',
    description: 'Mock test based on Actual PYQ',
    duration: DEFAULT_TEST_DURATION,
    questions: sampleQuestions.slice(50, 100),
    category: 'white',
    course: 'foundation',
  },

  {
    id: 'foundation-pyq-2025-april',
    name: 'JEE B.Arch PYQ 2025 April Attempt',
    description: 'Solve Actual PYQ from that Year',
    duration: DEFAULT_TEST_DURATION,
    questions: sampleQuestions.slice(100, 150),
    category: 'pyq',
    course: 'foundation',
  },

  // RANK BOOSTER
  {
    id: 'rank-booster-white-mock-test-1',
    name: 'White Mock Test 1',
    description: 'Mock test based on Actual PYQ',
    duration: DEFAULT_TEST_DURATION,
    questions: sampleQuestions.slice(150, 200),
    category: 'white',
    course: 'rank_booster',
  },
  {
    id: 'rank-booster-pyq-2025-april',
    name: 'JEE B.Arch PYQ 2025 April Attempt',
    description: 'Solve Actual PYQ from that Year',
    duration: DEFAULT_TEST_DURATION,
    questions: sampleQuestions.slice(200, 250),
    category: 'pyq',
    course: 'rank_booster',
  },

  // DHEYA
  {
    id: 'dheya-pyq-2025-april',
    name: 'JEE B.Arch PYQ 2025 April Attempt',
    description: 'Solve Actual PYQ from that Year',
    duration: DEFAULT_TEST_DURATION,
    questions: sampleQuestions.slice(250, 300),
    category: 'pyq',
    course: 'dheya',
  },
];

export function shuffleOptions(question: Question): ShuffledQuestion {
  const options = [
    { text: question.optionA, originalKey: "a" },
    { text: question.optionB, originalKey: "b" },
    { text: question.optionC, originalKey: "c" },
    { text: question.optionD, originalKey: "d" },
  ];
  const shuffled = [...options];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const correctIndex = shuffled.findIndex(
    (opt) => opt.originalKey === question.correctOption,
  );
  return {
    ...question,
    shuffledOptions: shuffled,
    correctIndex,
  };
}

interface SavedTestState {
  testId: string;
  userEmail: string;
  answers: Record<number, number>;
  markedForReview: Record<number, boolean>;
  visitedQuestions: number[];
  currentQuestion: number;
  timeLeft: number;
  shuffledQuestions: ShuffledQuestion[];
  violations: string[];
  tabSwitchCount: number;
  savedAt: number;
}

interface TestContextType {
  tests: Test[];
  selectedTest: Test | null;
  testStarted: boolean;
  questions: ShuffledQuestion[];
  currentQuestion: number;
  answers: Record<number, number>;
  markedForReview: Record<number, boolean>;
  visitedQuestions: Set<number>;
  timeLeft: number;
  testCompleted: boolean;
  showResults: boolean;
  violations: string[];
  tabSwitchCount: number;
  fullscreenExitCount: number;
  isFullscreen: boolean;
  screenshotBlocked: boolean;
  hasSavedState: boolean;
  savedStateInfo: { testName: string; timeLeft: number; savedAt: Date } | null;
  setTests: React.Dispatch<React.SetStateAction<Test[]>>;
  setSelectedTest: React.Dispatch<React.SetStateAction<Test | null>>;
  selectTest: (test: Test) => void;
  startTest: () => boolean;
  resumeTest: () => boolean;
  clearSavedState: () => void;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<number>>;
  handleAnswer: (questionId: number, answerIndex: number) => void;
  clearResponse: () => void;
  handleSaveAndNext: () => void;
  handleMarkAndNext: () => void;
  handleSubmit: () => void;
  restartTest: () => void;
  handleQuestionNavigation: (idx: number) => void;
  addViolation: (message: string) => void;
  setTabSwitchCount: React.Dispatch<React.SetStateAction<number>>;
  setFullscreenExitCount: React.Dispatch<React.SetStateAction<number>>;
  setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
  setTestCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  setShowResults: React.Dispatch<React.SetStateAction<boolean>>;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  setScreenshotBlocked: React.Dispatch<React.SetStateAction<boolean>>;
  getStatusCounts: () => {
    answered: number;
    visitedNotAnswered: number;
    notVisited: number;
    markedForReviewCount: number;
    answeredMarked: number;
  };
  calculateScore: () => {
    correct: number;
    incorrect: number;
    unattempted: number;
    totalMarks: number;
    maxMarks: number;
  };
  addTest: (
    name: string,
    description: string,
    duration: number,
  ) => { success: boolean; message: string };
  deleteTest: (testId: string) => void;
  testAttempts: TestAttempt[];
  getStudentAttempts: (studentEmail: string) => TestAttempt[];
  getAllAttempts: () => TestAttempt[];
  saveTestAttempt: (studentEmail: string) => void;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export function TestProvider({ children }: { children: ReactNode }) {
  const [tests, setTests] = useState<Test[]>(initialTests);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  const [questions, setQuestions] = useState<ShuffledQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<
    Record<number, boolean>
  >({});
  const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(
    new Set([0]),
  );
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TEST_DURATION);
  const [testCompleted, setTestCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [violations, setViolations] = useState<string[]>([]);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [fullscreenExitCount, setFullscreenExitCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [screenshotBlocked, setScreenshotBlocked] = useState(false);
  const [savedStateData, setSavedStateData] = useState<SavedTestState | null>(null);
  const [testAttempts, setTestAttempts] = useState<TestAttempt[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(TEST_ATTEMPTS_KEY);
      if (saved) {
        setTestAttempts(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading test attempts:', e);
    }
  }, []);

  const saveTestAttempt = useCallback((studentEmail: string) => {
    if (!selectedTest || questions.length === 0) return;
    
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    questions.forEach((q) => {
      if (answers[q.id] !== undefined) {
        if (answers[q.id] === q.correctIndex) {
          correct++;
        } else {
          incorrect++;
        }
      } else {
        unattempted++;
      }
    });
    const totalMarks = correct * 4 - incorrect * 1;
    const timeTaken = selectedTest.duration - timeLeft;

    const attempt: TestAttempt = {
      id: 'attempt_' + Date.now(),
      studentEmail,
      testId: selectedTest.id,
      testName: selectedTest.name,
      score: totalMarks,
      totalQuestions: questions.length,
      correctAnswers: correct,
      wrongAnswers: incorrect,
      unattempted,
      timeTaken,
      totalTime: selectedTest.duration,
      violations,
      tabSwitchCount,
      submittedAt: Date.now()
    };

    setTestAttempts(prev => {
      const updated = [...prev, attempt];
      try {
        localStorage.setItem(TEST_ATTEMPTS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving test attempt:', e);
      }
      return updated;
    });
  }, [selectedTest, questions, answers, timeLeft, violations, tabSwitchCount]);

  const getStudentAttempts = useCallback((studentEmail: string): TestAttempt[] => {
    return testAttempts.filter(a => a.studentEmail === studentEmail).sort((a, b) => b.submittedAt - a.submittedAt);
  }, [testAttempts]);

  const getAllAttempts = useCallback((): TestAttempt[] => {
    return [...testAttempts].sort((a, b) => b.submittedAt - a.submittedAt);
  }, [testAttempts]);

  const loadSavedState = useCallback(() => {
    try {
      const saved = localStorage.getItem(SAVED_TEST_STATE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as SavedTestState;
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        if (parsed.savedAt > oneHourAgo && parsed.timeLeft > 0) {
          setSavedStateData(parsed);
          return;
        } else {
          localStorage.removeItem(SAVED_TEST_STATE_KEY);
        }
      }
    } catch (e) {
      console.error('Error reading saved test state:', e);
    }
    setSavedStateData(null);
  }, []);

  useEffect(() => {
    loadSavedState();
  }, [loadSavedState]);

  const savedTest = savedStateData ? tests.find(t => t.id === savedStateData.testId) : null;

  const hasSavedState = !!savedStateData && !!savedTest && !testStarted;
  const savedStateInfo = savedStateData && savedTest && !testStarted ? {
    testName: savedTest.name,
    timeLeft: savedStateData.timeLeft,
    savedAt: new Date(savedStateData.savedAt)
  } : null;

  const saveTestState = useCallback(() => {
    if (testStarted && !testCompleted && selectedTest && questions.length > 0) {
      const stateToSave: SavedTestState = {
        testId: selectedTest.id,
        userEmail: '',
        answers,
        markedForReview,
        visitedQuestions: Array.from(visitedQuestions),
        currentQuestion,
        timeLeft,
        shuffledQuestions: questions,
        violations,
        tabSwitchCount,
        savedAt: Date.now()
      };
      try {
        localStorage.setItem(SAVED_TEST_STATE_KEY, JSON.stringify(stateToSave));
      } catch (e) {
        console.error('Error saving test state:', e);
      }
    }
  }, [testStarted, testCompleted, selectedTest, questions, answers, markedForReview, visitedQuestions, currentQuestion, timeLeft, violations, tabSwitchCount]);

  const clearSavedState = useCallback(() => {
    try {
      localStorage.removeItem(SAVED_TEST_STATE_KEY);
      setSavedStateData(null);
    } catch (e) {
      console.error('Error clearing saved state:', e);
    }
  }, []);

  useEffect(() => {
    if (testStarted && !testCompleted) {
      const interval = setInterval(saveTestState, 5000);
      return () => clearInterval(interval);
    }
  }, [testStarted, testCompleted, saveTestState]);

  useEffect(() => {
    if (testStarted && !testCompleted) {
      saveTestState();
    }
  }, [answers, markedForReview, currentQuestion, saveTestState, testStarted, testCompleted]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (testStarted && !testCompleted) {
        saveTestState();
      }
    };
    const handleVisibilityChange = () => {
      if (document.hidden && testStarted && !testCompleted) {
        saveTestState();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [testStarted, testCompleted, saveTestState]);

  const addViolation = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setViolations((prev) => [...prev, `${timestamp}: ${message}`]);
  };

  const selectTest = (test: Test) => {
    setSelectedTest(test);
    setTimeLeft(test.duration);
    setQuestions([]);
    setCurrentQuestion(0);
    setAnswers({});
    setMarkedForReview({});
    setVisitedQuestions(new Set([0]));
    setTestCompleted(false);
    setShowResults(false);
    setViolations([]);
    setTabSwitchCount(0);
    setFullscreenExitCount(0);
    setScreenshotBlocked(false);
    setTestStarted(false);
  };

  const startTest = (): boolean => {
    if (
      selectedTest &&
      selectedTest.questions &&
      selectedTest.questions.length > 0
    ) {
      try {
        clearSavedState();
        setSavedStateData(null);
        const shuffled = selectedTest.questions.map((q) => shuffleOptions(q));
        setQuestions(shuffled);
        setTestStarted(true);
        setCurrentQuestion(0);
        setAnswers({});
        setMarkedForReview({});
        setVisitedQuestions(new Set([0]));
        setTimeLeft(selectedTest.duration);
        setTestCompleted(false);
        setShowResults(false);
        setViolations([]);
        setTabSwitchCount(0);
        setFullscreenExitCount(0);
        setScreenshotBlocked(false);
        return true;
      } catch (error) {
        console.error("Error starting test:", error);
        return false;
      }
    }
    return false;
  };

  const resumeTest = (): boolean => {
    if (!savedStateData) return false;
    
    const test = tests.find(t => t.id === savedStateData.testId);
    if (!test) return false;
    
    try {
      setSelectedTest(test);
      setQuestions(savedStateData.shuffledQuestions);
      setAnswers(savedStateData.answers);
      setMarkedForReview(savedStateData.markedForReview);
      setVisitedQuestions(new Set(savedStateData.visitedQuestions));
      setCurrentQuestion(savedStateData.currentQuestion);
      setTimeLeft(savedStateData.timeLeft);
      setViolations(savedStateData.violations || []);
      setTabSwitchCount(savedStateData.tabSwitchCount || 0);
      setTestStarted(true);
      setTestCompleted(false);
      setShowResults(false);
      setFullscreenExitCount(0);
      setScreenshotBlocked(false);
      setSavedStateData(null);
      return true;
    } catch (error) {
      console.error("Error resuming test:", error);
      clearSavedState();
      return false;
    }
  };

  const handleAnswer = (questionId: number, answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
  };

  const clearResponse = () => {
    const qId = questions[currentQuestion]?.id;
    if (qId !== undefined) {
      setAnswers((prev) => {
        const newAnswers = { ...prev };
        delete newAnswers[qId];
        return newAnswers;
      });
    }
  };

  const handleSaveAndNext = () => {
    if (currentQuestion < questions.length - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      setVisitedQuestions((prev) => new Set(prev).add(nextQuestion));
    }
  };

  const handleMarkAndNext = () => {
    const qId = questions[currentQuestion]?.id;
    if (qId !== undefined) {
      setMarkedForReview((prev) => ({ ...prev, [qId]: true }));
      if (currentQuestion < questions.length - 1) {
        const nextQuestion = currentQuestion + 1;
        setCurrentQuestion(nextQuestion);
        setVisitedQuestions((prev) => new Set(prev).add(nextQuestion));
      }
    }
  };

  const handleSubmit = () => {
    const unansweredCount = questions.length - Object.keys(answers).length;
    let confirmMessage = "Are you sure you want to submit the test?";
    if (unansweredCount > 0) {
      confirmMessage = `You have ${unansweredCount} unanswered question(s). Are you sure you want to submit?`;
    }
    const confirmed = window.confirm(confirmMessage);
    if (confirmed) {
      clearSavedState();
      setTestCompleted(true);
      setShowResults(true);
    }
  };

  const restartTest = () => {
    setTestStarted(false);
    setSelectedTest(null);
    setQuestions([]);
    setCurrentQuestion(0);
    setAnswers({});
    setMarkedForReview({});
    setVisitedQuestions(new Set([0]));
    setTimeLeft(DEFAULT_TEST_DURATION);
    setTestCompleted(false);
    setShowResults(false);
    setViolations([]);
    setTabSwitchCount(0);
    setFullscreenExitCount(0);
    setScreenshotBlocked(false);
  };

  const handleQuestionNavigation = (idx: number) => {
    setCurrentQuestion(idx);
    setVisitedQuestions((prev) => new Set(prev).add(idx));
  };

  const getStatusCounts = () => {
    let answered = 0;
    let visitedNotAnswered = 0;
    let notVisited = 0;
    let markedForReviewCount = 0;
    let answeredMarked = 0;
    questions.forEach((q, idx) => {
      const isAnswered = answers[q.id] !== undefined;
      const isMarked = markedForReview[q.id];
      const isVisited = visitedQuestions.has(idx);
      if (isAnswered && isMarked) {
        answeredMarked++;
      } else if (isAnswered) {
        answered++;
      } else if (isMarked) {
        markedForReviewCount++;
      } else if (isVisited) {
        visitedNotAnswered++;
      } else {
        notVisited++;
      }
    });
    return {
      answered,
      visitedNotAnswered,
      notVisited,
      markedForReviewCount,
      answeredMarked,
    };
  };

  const calculateScore = () => {
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    questions.forEach((q) => {
      if (answers[q.id] !== undefined) {
        if (answers[q.id] === q.correctIndex) {
          correct++;
        } else {
          incorrect++;
        }
      } else {
        unattempted++;
      }
    });
    const totalMarks = correct * 4 - incorrect * 1;
    const maxMarks = questions.length * 4;
    return { correct, incorrect, unattempted, totalMarks, maxMarks };
  };

  const addTest = (
    name: string,
    description: string,
    duration: number,
  ): { success: boolean; message: string } => {
    if (!name.trim()) {
      return { success: false, message: "Please enter test name" };
    }
    if (isNaN(duration) || duration <= 0) {
      return { success: false, message: "Please enter a valid duration" };
    }
    const newTest: Test = {
      id: "test" + Date.now(),
      name: name.trim(),
      description: description.trim() || "No description",
      duration: duration * 60,
      questions: sampleQuestions,
    };
    setTests((prev) => [...prev, newTest]);
    return {
      success: true,
      message: `Test "${newTest.name}" added successfully!`,
    };
  };

  const deleteTest = (testId: string) => {
    setTests((prev) => prev.filter((t) => t.id !== testId));
  };

  return (
    <TestContext.Provider
      value={{
        tests,
        selectedTest,
        testStarted,
        questions,
        currentQuestion,
        answers,
        markedForReview,
        visitedQuestions,
        timeLeft,
        testCompleted,
        showResults,
        violations,
        tabSwitchCount,
        fullscreenExitCount,
        isFullscreen,
        screenshotBlocked,
        hasSavedState,
        savedStateInfo,
        setTests,
        setSelectedTest,
        selectTest,
        startTest,
        resumeTest,
        clearSavedState,
        setCurrentQuestion,
        handleAnswer,
        clearResponse,
        handleSaveAndNext,
        handleMarkAndNext,
        handleSubmit,
        restartTest,
        handleQuestionNavigation,
        addViolation,
        setTabSwitchCount,
        setFullscreenExitCount,
        setIsFullscreen,
        setTestCompleted,
        setShowResults,
        setTimeLeft,
        setScreenshotBlocked,
        getStatusCounts,
        calculateScore,
        addTest,
        deleteTest,
        testAttempts,
        getStudentAttempts,
        getAllAttempts,
        saveTestAttempt,
      }}
    >
      {children}
    </TestContext.Provider>
  );
}

export function useTest() {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error("useTest must be used within a TestProvider");
  }
  return context;
}

export { DEFAULT_TEST_DURATION };

/*
==========================================
📝 HOW TO ADD MORE TESTS
==========================================

Just copy your existing test format and add the 'course' field:

FOUNDATION TEST (₹6,000):
{ id: 'Test Name', name: 'Test Name', description: '...', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(X, Y), category: 'white', course: 'foundation' },

RANK BOOSTER TEST (₹99):
{ id: 'Test Name', name: 'Test Name', description: '...', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(X, Y), category: 'grey', course: 'rank_booster' },

DHEYA TEST (FREE):
{ id: 'Test Name', name: 'Test Name', description: '...', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(X, Y), category: 'white', course: 'dheya' },

*/