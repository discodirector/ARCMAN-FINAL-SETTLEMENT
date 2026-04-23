// Educational Info Screens Data
// Info screens appear after levels 1, 3, 5, 7, 9 in Tournament mode

const INFO_SCREENS = [
    {
        id: 1, // After level 1
        text: "Arc is a Layer-1 blockchain designed as infrastructure for onchain economic activity. It focuses on payments, settlement, and financial applications rather than niche use cases."
    },
    {
        id: 2, // After level 3
        text: "On Arc, transaction fees are paid using a stablecoin instead of a volatile token. USDC is used as gas, making costs immediately understandable in dollars."
    },
    {
        id: 3, // After level 5
        text: "Using a stablecoin as gas removes exposure to market volatility. As a result, transaction fees remain stable and predictable."
    },
    {
        id: 4, // After level 7
        text: "Arc is developed within the ecosystem of Circle. The same company issues USDC and builds infrastructure for digital finance."
    },
    {
        id: 5, // After level 9
        text: "Arc was designed for real financial use cases such as payments, clearing, FX, and asset tokenization. This focus positions it as a foundational layer for the stablecoin economy."
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { INFO_SCREENS };
}
if (typeof window !== 'undefined') {
    window.INFO_SCREENS = INFO_SCREENS;
}
