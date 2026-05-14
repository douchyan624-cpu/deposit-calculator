/* ============================================
   儲值滿額贈計算工具 - 核心邏輯 v3 (Refactored)
   ============================================ */

const GAME_VIP_DATA = {
    game_a: {
        label: '大滿貫（紅鑽）',
        currencyNote: '道具單位：紅鑽',
        noVip: true,
        platforms: {
            official: { label: '非iOS', amounts: [30, 60, 150, 300, 450, 900, 1500, 3000, 5000, 10000, 20000, 30000] },
            ios: { label: 'iOS', amounts: [33, 70, 170, 330, 490, 990, 1690, 3290, 5490, 10000, 20000, 30000] },
        },
    },
    mahjong2: {
        label: '競技麻將2（鑽石/金幣）',
        currencyNote: '儲值後獲得對應品項',
        noVip: true,
        noPlatformDiff: false,
        platforms: {
            official: {
                label: '官網',
                depositItemMeta: {
                    diamonds: [
                        { amount: 70, qty: 70, bonus: 0, unit: '鑽石' },
                        { amount: 170, qty: 170, bonus: 0, unit: '鑽石' },
                        { amount: 330, qty: 330, bonus: 0, unit: '鑽石' },
                        { amount: 490, qty: 490, bonus: 0, unit: '鑽石' },
                        { amount: 670, qty: 670, bonus: 0, unit: '鑽石' },
                        { amount: 990, qty: 1040, bonus: 5, unit: '鑽石' },
                        { amount: 1690, qty: 1859, bonus: 10, unit: '鑽石' },
                        { amount: 2490, qty: 2860, bonus: 15, unit: '鑽石' },
                        { amount: 3290, qty: 3948, bonus: 20, unit: '鑽石' },
                        { amount: 5000, qty: 6250, bonus: 25, unit: '鑽石' },
                        { amount: 10000, qty: 140000, bonus: 40, unit: '鑽石' }
                    ],
                    coins: [
                        { amount: 70, qty: 70000000, bonus: 0, unit: '金幣' },
                        { amount: 170, qty: 170000000, bonus: 0, unit: '金幣' },
                        { amount: 330, qty: 330000000, bonus: 0, unit: '金幣' },
                        { amount: 490, qty: 490000000, bonus: 0, unit: '金幣' },
                        { amount: 670, qty: 703500000, bonus: 5, unit: '金幣' },
                        { amount: 990, qty: 1039500000, bonus: 5, unit: '金幣' },
                        { amount: 1690, qty: 1859000000, bonus: 10, unit: '金幣' },
                        { amount: 2490, qty: 2739000000, bonus: 10, unit: '金幣' },
                        { amount: 3290, qty: 3619000000, bonus: 10, unit: '金幣' }
                    ]
                }
            },
            win_apk: { label: 'Web版', depositItemMeta: _mahjong2OldMeta() },
            android: { label: '安卓', depositItemMeta: _mahjong2OldMeta() },
            ios: { label: 'iOS', depositItemMeta: _mahjong2OldMeta() },
        },
    },
    star_3_in_1: {
        label: '明星三缺一（紅利點數）',
        currencyNote: '紅利點數已於遊戲內獲得',
        noVip: true,
        noPlatformDiff: false,
        platforms: {
            mobile_web: {
                label: '非iOS',
                depositItemMeta: {
                    diamonds: [30, 50, 90, 100, 150, 250, 300, 500, 600, 800, 1000, 1500, 2000, 3000, 5000, 6000, 10000, 20000].map(v => ({ amount: v, qty: v, unit: '鑽石' })),
                    icoins: [
                        { amount: 30, qty: 3000 }, { amount: 50, qty: 5000 }, { amount: 90, qty: 9000 },
                        { amount: 100, qty: 10000 }, { amount: 150, qty: 15000 }, { amount: 250, qty: 25000 },
                        { amount: 300, qty: 30000 }, { amount: 500, qty: 50000 }, { amount: 600, qty: 60000 },
                        { amount: 800, qty: 80000 }, { amount: 1000, qty: 100000 }, { amount: 1500, qty: 150000 },
                        { amount: 2000, qty: 200000 }, { amount: 3000, qty: 300000 }, { amount: 5000, qty: 500000 },
                        { amount: 6000, qty: 600000 }, { amount: 10000, qty: 1000000 }, { amount: 20000, qty: 2000000 }
                    ].map(v => ({ ...v, unit: 'i幣' }))
                }
            },
            ios: {
                label: 'iOS',
                depositItemMeta: {
                    diamonds: [130, 330, 730, 1650, 3290, 6000].map(v => ({ amount: v, qty: v, unit: '鑽石' })),
                    icoins: [
                        { amount: 130, qty: 13000 }, { amount: 330, qty: 33000 }, { amount: 730, qty: 73000 },
                        { amount: 1650, qty: 165000 }, { amount: 3290, qty: 329000 }, { amount: 6000, qty: 600000 }
                    ].map(v => ({ ...v, unit: 'i幣' }))
                }
            }
        },
    },
};

function _gameAVip() {
    return {
        0: [30, 60, 150, 300, 450, 900, 1500, 3000],
        1: [30, 60, 150, 300, 450, 900, 1500, 3000],
        2: [60, 150, 300, 450, 900, 1500, 3000, 5000],
        3: [60, 150, 300, 450, 900, 1500, 3000, 5000],
        4: [150, 300, 450, 900, 1500, 3000, 5000, 10000, 20000, 30000],
        5: [150, 300, 450, 900, 1500, 3000, 5000, 10000, 20000, 30000],
        6: [150, 300, 450, 900, 1500, 3000, 5000, 10000, 20000, 30000],
    };
}

function _gameAVipFixed() {
    const amounts = [30, 60, 150, 300, 450, 900, 1500, 3000, 5000, 10000, 20000, 30000];
    const vipObj = {};
    for (let i = 0; i <= 6; i++) vipObj[i] = amounts;
    return vipObj;
}

function _gameAVipIOS() {
    return {
        0: [33, 70, 170, 330, 490, 990, 1690, 3290],
        1: [33, 70, 170, 330, 490, 990, 1690, 3290],
        2: [70, 170, 330, 490, 990, 1690, 3290, 5490],
        3: [70, 170, 330, 490, 990, 1690, 3290, 5490],
        4: [170, 330, 490, 990, 1690, 3290, 5490, 10000, 20000, 30000],
        5: [170, 330, 490, 990, 1690, 3290, 5490, 10000, 20000, 30000],
        6: [170, 330, 490, 990, 1690, 3290, 5490, 10000, 20000, 30000],
    };
}

function _mahjong2Vip() {
    const amounts = [70, 170, 330, 490, 670, 990, 1690, 2490, 3290];
    const vipObj = {};
    for (let i = 0; i <= 6; i++) vipObj[i] = amounts;
    return vipObj;
}

function _mahjong2OldMeta() {
    return {
        diamonds: [70, 170, 330, 490, 670, 990, 1690, 2490, 3290].map(v => ({ amount: v, qty: v, unit: '鑽石' })),
        coins: [
            { amount: 70, qty: 70000000 },
            { amount: 170, qty: 170000000 },
            { amount: 330, qty: 330000000 },
            { amount: 490, qty: 490000000 },
            { amount: 670, qty: 670000000 },
            { amount: 990, qty: 990000000 },
            { amount: 1690, qty: 1690000000 },
            { amount: 2490, qty: 2490000000 },
            { amount: 3290, qty: 3290000000 },
        ].map(v => ({ ...v, unit: '金幣' }))
    };
}

const STORAGE_KEY = 'deposit_calculator_data_v3';

// ===== 1. State Management =====
let appState = {
    activities: [],
    currentActivityId: null,
    sessions: {},
};

let currentPage = 1;
const PAGE_SIZE = 20;

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
}

function createDefaultActivity(name, game) {
    return {
        id: generateId(),
        name: name,
        game: game || 'game_a',
        threshold: 1000,
        thresholdItemQty: 1,
        enableGlobalBonus: false,
        globalBonusMin: 0,
        globalBonusMax: 10,
        globalBonusStep: 1,
        enableChannelBonus: false,
        channelBonusRate: 5,
        // 滿貫大亨紅鑽加成
        enableGameABonus: false,
        gameABonusMin: 0,
        gameABonusMax: 10,
        gameABonusStep: 1,
        enableGameAFixedBonus: false,
        gameAFixedBonusRate: 5,
        enableGameAChannelBonus: false,
        gameAChannelBonusRate: 5,
        // 道具額外加贈
        enableExtraItemBonus: false,
        extraItemBonusMap: {}, // amount (string) -> bonusQty (number)
    };
}

function createDefaultSession() {
    return {
        initialAssets: 0,
        initialItems: 0,
        vipLevel: 0,
        platform: 'win_apk',
        depositType: 'diamonds',
        records: [],
    };
}

function getCurrentActivity() {
    return appState.activities.find(a => a.id === appState.currentActivityId) || null;
}

const GAME_CURRENCIES = {
    game_a: [{ id: 'default', label: '紅鑽', short: '紅鑽' }],
    mahjong2: [{ id: 'diamonds', label: '鑽石', short: '鑽石' }, { id: 'coins', label: '金幣', short: '金幣' }],
    star_3_in_1: [
        { id: 'diamonds', label: '鑽石', short: '鑽石' },
        { id: 'icoins', label: 'i幣', short: 'i幣' }
    ]
};

function getCurrentSession() {
    if (!appState.currentActivityId) return null;
    let session = appState.sessions[appState.currentActivityId];
    if (!session) {
        session = createDefaultSession();
        appState.sessions[appState.currentActivityId] = session;
    }
    // Backward compatibility & conversion to object
    if (typeof session.initialAssets !== 'object' || session.initialAssets === null) {
        session.initialAssets = { default: session.initialAssets || 0 };
    }
    return session;
}

// ===== 2. Storage =====
function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) { console.warn('Failed to save state:', e); }
}

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            appState = JSON.parse(raw);
        }
    } catch (e) { console.warn('Failed to load state:', e); }
}

// ===== 3. Logic & Calculations =====
function computeRecords(session, threshold, itemQty) {
    let cumulativeDeposit = 0;
    itemQty = itemQty || 1;

    // Copy initial assets into an isolated state object
    let currentAssets = { ...session.initialAssets };
    let totalBonusItems = 0;
    const computed = [];

    for (let i = 0; i < session.records.length; i++) {
        const rec = session.records[i];
        const baseAssets = rec.baseAssets !== undefined ? rec.baseAssets : rec.depositAmount;
        const cType = rec.currencyType || 'default';
        const cUnit = rec.currencyUnit || '';

        const prevCumulative = cumulativeDeposit;
        cumulativeDeposit += rec.depositAmount;

        if (currentAssets[cType] === undefined) {
            currentAssets[cType] = 0;
        }
        currentAssets[cType] += baseAssets + rec.bonusAssets;

        totalBonusItems += rec.bonusItems;

        const prevMilestone = threshold > 0 ? Math.floor(prevCumulative / threshold) : 0;
        const currMilestone = threshold > 0 ? Math.floor(cumulativeDeposit / threshold) : 0;
        const newMilestoneItems = (currMilestone - prevMilestone) * itemQty;

        computed.push({
            ...rec,
            index: i + 1,
            depositAmount: rec.depositAmount,
            baseAssets: baseAssets,
            bonusAssets: rec.bonusAssets,
            bonusItems: rec.bonusItems,
            depositedAssets: baseAssets + rec.bonusAssets,
            assetsAfter: currentAssets[cType],
            currencyType: cType,
            currencyUnit: cUnit,
            cumulativeDeposit: cumulativeDeposit,
            newMilestoneItems: newMilestoneItems,
            totalMilestoneItems: currMilestone * itemQty,
            totalItems: session.initialItems + currMilestone * itemQty + totalBonusItems,
        });
    }

    const totalMilestoneItems = threshold > 0 ? Math.floor(cumulativeDeposit / threshold) * itemQty : 0;
    const nextMilestoneAt = threshold > 0 ? (Math.floor(cumulativeDeposit / threshold) + 1) * threshold : 0;
    const nextMilestoneDiff = threshold > 0 ? nextMilestoneAt - cumulativeDeposit : 0;

    return {
        computed,
        currentAssets,
        cumulativeDeposit,
        totalMilestoneItems,
        totalItems: session.initialItems + totalMilestoneItems + totalBonusItems,
        nextMilestoneDiff,
    };
}

function formatNumber(n) {
    return Number(n).toLocaleString('zh-TW');
}


// ===== 4. UI References =====
const $ = (id) => document.getElementById(id);
const els = {
    activitySelectWrapper: $('activity-select-wrapper'),
    activitySelectDisplay: $('activity-select-display'),
    activitySelectText: $('activity-select-text'),
    activitySelectDropdown: $('activity-select-dropdown'),

    btnNewActivity: $('btn-new-activity'),
    btnEditActivity: $('btn-edit-activity'),
    btnDeleteActivity: $('btn-delete-activity'),
    noActivityPlaceholder: $('no-activity-placeholder'),
    mainContent: $('main-content'),

    thresholdAmount: $('threshold-amount'),
    initialAssetsContainer: $('initial-assets-container'),
    initialItems: $('initial-items'),
    vipSelect: $('vip-select'),
    platformSelect: $('platform-select'),
    vipLevelRow: $('vip-level-row'),
    platformRow: $('platform-row'),
    depositTypeRow: $('deposit-type-row'),
    depositTypeSelect: $('deposit-type-select'),

    enableGlobalBonus: $('enable-global-bonus'),
    bonusMergedCard: $('bonus-merged-card'),
    globalBonusSettings: $('global-bonus-settings'),
    globalBonusMin: $('global-bonus-min'),
    globalBonusMax: $('global-bonus-max'),
    globalBonusStep: $('global-bonus-step'),

    enableChannelBonus: $('enable-channel-bonus'),
    channelBonusSettings: $('channel-bonus-settings'),
    channelBonusRate: $('channel-bonus-rate'),

    depositButtons: $('deposit-buttons'),
    currencyNote: $('currency-note'),
    customAmount: $('custom-amount'),
    btnCustomDeposit: $('btn-custom-deposit'),

    currentAssetsDisplay: $('current-assets-display'),
    currentDepositDetail: $('current-deposit-detail'),
    currentDepositDisplay: $('current-deposit-display'),
    currentBonusDisplay: $('current-bonus-display'),
    nextMilestoneDisplay: $('next-milestone-display'),
    nextMilestoneDisplayCard: $('next-milestone-display-card'),
    currentBonusItemsDisplay: $('current-bonus-items-display'),
    totalItemsDisplay: $('total-items-display'),
    milestoneProgressFill: $('milestone-progress-fill'),
    milestoneProgressFillCard: $('milestone-progress-fill-card'),
    statusGrid: $('status-premium-grid'),
    cardDiamonds: $('status-card-diamonds'),
    cardCoins: $('status-card-coins'),
    statusCardMilestone: $('status-card-milestone'),
    milestoneDetailItem: $('milestone-detail-item'),
    valueDiamonds: $('value-diamonds'),
    labelDiamonds: $('label-diamonds'),
    valueCoins: $('value-coins'),
    labelCoins: $('label-coins'),

    recordTbody: $('record-tbody'),
    emptyRecords: $('empty-records'),
    tableWrapper: $('table-wrapper'),
    selectAllRecords: $('select-all-records'),
    btnDeleteSelected: $('btn-delete-selected'),
    btnUndo: $('btn-undo'),
    btnClear: $('btn-clear'),

    paginationBar: $('pagination-bar'),
    pageNumbers: $('page-numbers'),
    pageInfo: $('page-info'),
    btnPageFirst: $('btn-page-first'),
    btnPagePrev: $('btn-page-prev'),
    btnPageNext: $('btn-page-next'),
    btnPageLast: $('btn-page-last'),

    activityModal: $('activity-modal'),
    activityNameInput: $('activity-name-input'),
    activityGameInput: $('activity-game-input'),
    activityModalSave: $('activity-modal-save'),
    activityModalCancel: $('activity-modal-cancel'),
    activityModalClose: $('activity-modal-close'),

    verificationModal: $('verification-modal'),
    verifyBaseAmount: $('verify-base-amount'),
    verifyOptionList: $('verify-option-list'),
    verificationModalCancel: $('verification-modal-cancel'),
    verificationModalClose: $('verification-modal-close'),

    confirmModal: $('confirm-modal'),
    confirmMessage: $('confirm-message'),
    confirmYes: $('confirm-yes'),
    confirmNo: $('confirm-no'),

    verifyPointOptionsContainer: $('verify-point-options-container'),
    verifyPointGrid: $('verify-point-grid'),

    // 滿貫大亨紅鑽加成 DOM
    bonusGameACard: $('bonus-gamea-card'),
    enableGameABonus: $('enable-gamea-bonus'),
    gameABonusSettings: $('gamea-bonus-settings'),
    gameABonusMin: $('gamea-bonus-min'),
    gameABonusMax: $('gamea-bonus-max'),
    gameABonusStep: $('gamea-bonus-step'),
    enableGameAFixedBonus: $('enable-gamea-fixed-bonus'),
    gameAFixedBonusSettings: $('gamea-fixed-bonus-settings'),
    gameAFixedBonusRate: $('gamea-fixed-bonus-rate'),

    // 道具額外加贈 DOM
    enableExtraItemBonus: $('enable-extra-item-bonus'),
    extraItemSettings: $('extra-item-settings'),
    extraItemList: $('extra-item-list'),
};

// ===== 5. UI Rendering =====
function renderMainVisibility() {
    const hasActivity = !!getCurrentActivity();
    els.noActivityPlaceholder.style.display = hasActivity ? 'none' : 'block';
    els.mainContent.style.display = hasActivity ? 'grid' : 'none';
}

function renderSettings() {
    const activity = getCurrentActivity();
    const session = getCurrentSession();
    if (!activity || !session) return;

    els.thresholdAmount.value = activity.threshold;

    // Render dynamic asset inputs
    els.initialAssetsContainer.innerHTML = '';
    const gameCurrencies = GAME_CURRENCIES[activity.game] || GAME_CURRENCIES['game_a'];
    gameCurrencies.forEach(currency => {
        const row = document.createElement('div');
        row.className = 'setting-row';
        row.innerHTML = `
            <label for="initial-assets-${currency.id}">${currency.label}</label>
            <input type="number" id="initial-assets-${currency.id}" data-type="${currency.id}" min="0" value="${session.initialAssets[currency.id] || 0}" class="input-field no-spin initial-asset-input">
        `;
        els.initialAssetsContainer.appendChild(row);
    });
    // Re-attach input restriction events for new dynamic ones
    els.initialAssetsContainer.querySelectorAll('.initial-asset-input').forEach(enforcePositiveInteger);

    els.initialItems.value = session.initialItems;
    els.vipSelect.value = session.vipLevel;
    // 依目前遙戲動態產生平台選項
    const gameInfo = GAME_VIP_DATA[activity.game];
    if (gameInfo && gameInfo.platforms) {
        els.platformSelect.innerHTML = Object.entries(gameInfo.platforms)
            .map(([key, plat]) => `<option value="${key}">${plat.label}</option>`)
            .join('');
        if (!gameInfo.platforms[session.platform]) {
            session.platform = Object.keys(gameInfo.platforms)[0];
            saveState();
        }
    }
    els.platformSelect.value = session.platform;
    els.depositTypeSelect.value = session.depositType;

    els.enableGlobalBonus.checked = activity.enableGlobalBonus;
    els.globalBonusSettings.style.display = activity.enableGlobalBonus ? 'flex' : 'none';
    els.globalBonusMin.value = activity.globalBonusMin;
    els.globalBonusMax.value = activity.globalBonusMax;
    els.globalBonusStep.value = activity.globalBonusStep;

    els.enableChannelBonus.checked = activity.enableChannelBonus || false;
    els.channelBonusSettings.style.display = activity.enableChannelBonus ? 'flex' : 'none';
    els.channelBonusRate.value = activity.channelBonusRate !== undefined ? activity.channelBonusRate : 5;

    const isMahjong2 = activity.game === 'mahjong2';
    const isStar3in1 = activity.game === 'star_3_in_1';
    const isGameA = activity.game === 'game_a';
    // 隱藏VIP：滿貫大亨、麻將2、明星三缺一都不需要
    els.vipLevelRow.style.display = 'none';
    els.platformRow.style.display = 'flex';
    els.depositTypeRow.style.display = (isMahjong2 || isStar3in1) ? 'flex' : 'none';

    if (isStar3in1) {
        const options = `
            <option value="diamonds">鑽石</option>
            <option value="icoins">i幣</option>
        `;
        if (els.depositTypeSelect.innerHTML !== options) {
            els.depositTypeSelect.innerHTML = options;
            els.depositTypeSelect.value = session.depositType || 'diamonds';
        }
    } else if (isMahjong2) {
        const options = `
            <option value="diamonds">鑽石</option>
            <option value="coins">金幣</option>
        `;
        if (els.depositTypeSelect.innerHTML !== options) {
            els.depositTypeSelect.innerHTML = options;
            els.depositTypeSelect.value = session.depositType || 'diamonds';
        }
    }

    // Toggle custom threshold UI for star_3_in_1 - REMOVED, now using default
    const defaultThresholdRow = document.getElementById('default-threshold-row');
    const star3ThresholdRow = document.getElementById('star3-threshold-row');
    if (defaultThresholdRow) defaultThresholdRow.style.display = 'block';
    if (star3ThresholdRow) star3ThresholdRow.style.display = 'none';

    // Show/hide merged bonus card (star_3_in_1 only)
    if (els.bonusMergedCard) els.bonusMergedCard.style.display = isStar3in1 ? 'block' : 'none';

    // Show/hide game_a bonus card (滿貫大亨 only)
    if (els.bonusGameACard) {
        els.bonusGameACard.style.display = isGameA ? 'block' : 'none';
        if (isGameA) {
            els.enableGameABonus.checked = activity.enableGameABonus || false;
            els.gameABonusSettings.style.display = activity.enableGameABonus ? 'flex' : 'none';
            els.gameABonusMin.value = activity.gameABonusMin !== undefined ? activity.gameABonusMin : 0;
            els.gameABonusMax.value = activity.gameABonusMax !== undefined ? activity.gameABonusMax : 10;
            els.gameABonusStep.value = activity.gameABonusStep !== undefined ? activity.gameABonusStep : 1;

            els.enableGameAFixedBonus.checked = activity.enableGameAFixedBonus || false;
            els.gameAFixedBonusSettings.style.display = activity.enableGameAFixedBonus ? 'flex' : 'none';
            els.gameAFixedBonusRate.value = activity.gameAFixedBonusRate !== undefined ? activity.gameAFixedBonusRate : 5;

            // 渠道加成
            const chkEl = document.getElementById('enable-gamea-channel-bonus');
            const chkSet = document.getElementById('gamea-channel-bonus-settings');
            const chkRate = document.getElementById('gamea-channel-bonus-rate');
            if (chkEl) chkEl.checked = activity.enableGameAChannelBonus || false;
            if (chkSet) chkSet.style.display = activity.enableGameAChannelBonus ? 'flex' : 'none';
            if (chkRate) chkRate.value = activity.gameAChannelBonusRate !== undefined ? activity.gameAChannelBonusRate : 5;
        }
    }
    // 同步門檻道具數
    const tiqEl = document.getElementById('threshold-item-qty');
    if (tiqEl) tiqEl.value = activity.thresholdItemQty !== undefined ? activity.thresholdItemQty : 1;
    const s3iqEl = document.getElementById('star3-threshold-item-qty');
    if (s3iqEl) s3iqEl.value = activity.thresholdItemQty !== undefined ? activity.thresholdItemQty : 1;

    // 道具額外加贈渲染
    if (els.enableExtraItemBonus) {
        els.enableExtraItemBonus.checked = activity.enableExtraItemBonus || false;
        els.extraItemSettings.style.display = activity.enableExtraItemBonus ? 'block' : 'none';

        if (activity.enableExtraItemBonus) {
            const gameInfo = GAME_VIP_DATA[activity.game];
            let allAmounts = [];

            if (gameInfo && gameInfo.platforms) {
                Object.values(gameInfo.platforms).forEach(plat => {
                    if (isMahjong2 || isStar3in1) {
                        // Aggregate from all deposit types (diamonds, coins, etc)
                        if (plat.depositItemMeta) {
                            Object.values(plat.depositItemMeta).forEach(metaList => {
                                metaList.forEach(m => allAmounts.push(m.amount));
                            });
                        }
                    } else {
                        // Aggregate from amounts or vip amounts
                        if (plat.amounts) allAmounts.push(...plat.amounts);
                        if (plat.vip) {
                            Object.values(plat.vip).forEach(vAmts => allAmounts.push(...vAmts));
                        }
                    }
                });
            }

            const uniqueAmounts = [...new Set(allAmounts)].sort((a, b) => a - b);
            els.extraItemList.innerHTML = '';

            if (uniqueAmounts.length === 0) {
                els.extraItemList.innerHTML = '<p style="text-align:center;color:var(--text-muted);font-size:0.9rem;padding:1rem;">無可用儲值項</p>';
            } else {
                uniqueAmounts.forEach(amt => {
                    const row = document.createElement('div');
                    row.className = 'setting-row';
                    row.style.gap = '0.5rem';
                    row.style.marginBottom = '0.5rem';
                    const bonusVal = activity.extraItemBonusMap?.[amt] || 0;

                    row.innerHTML = `
                        <label style="min-width: 80px; font-size: 0.9rem;">${amt} 元</label>
                        <div class="input-with-unit" style="flex: 1;">
                            <input type="number" class="input-field no-spin extra-item-input" 
                                   data-amount="${amt}" value="${bonusVal}" min="0" 
                                   style="padding: 0.4rem 0.6rem; font-size: 0.9rem;">
                            <span class="unit" style="font-size: 0.85rem;">個</span>
                        </div>
                    `;
                    els.extraItemList.appendChild(row);
                });

                els.extraItemList.querySelectorAll('.extra-item-input').forEach(input => {
                    input.onchange = (e) => {
                        const amt = e.target.dataset.amount;
                        const qty = parseInt(e.target.value) || 0;
                        if (!activity.extraItemBonusMap) activity.extraItemBonusMap = {};
                        activity.extraItemBonusMap[amt] = qty;
                        saveState();
                    };
                    enforcePositiveInteger(input);
                });
            }
        }
    }
}

function renderDepositButtons() {
    const activity = getCurrentActivity();
    const session = getCurrentSession();
    if (!activity || !session) return;

    const gameInfo = GAME_VIP_DATA[activity.game];
    const platform = session.platform;
    const vip = session.vipLevel;
    const isMahjong2 = activity.game === 'mahjong2';
    const isStar3in1 = activity.game === 'star_3_in_1';

    els.currencyNote.textContent = gameInfo?.currencyNote || '';
    els.depositButtons.innerHTML = '';

    let amounts = [];
    let itemsMeta = [];

    if (isStar3in1 || isMahjong2) {
        const type = session.depositType || 'diamonds';
        itemsMeta = gameInfo.platforms[platform]?.depositItemMeta?.[type] || [];
        amounts = itemsMeta.map(m => m.amount);
    } else {
        // game_a: 直接用 amounts 陣列，不分 VIP
        amounts = gameInfo?.platforms?.[platform]?.amounts || gameInfo?.platforms?.[platform]?.vip?.[vip] || [];
    }

    if (amounts.length === 0) {
        els.depositButtons.innerHTML = '<div class="empty-state" style="grid-column: 1/-1; padding: 2rem; color: var(--text-muted);">🚩 儲值品項待提供，可使用下方的客製化儲值進行計算</div>';
        return;
    }

    const curType = (isStar3in1 || isMahjong2) ? (session.depositType || 'diamonds') : 'default';
    const currencyInfo = GAME_CURRENCIES[activity.game]?.find(c => c.id === curType);
    const curUnit = currencyInfo ? currencyInfo.short : '';

    amounts.forEach(amount => {
        const btn = document.createElement('button');
        btn.className = 'deposit-btn';

        let baseAssets = amount;
        let builtInBonusAssets = 0;

        if (isMahjong2 || isStar3in1) {
            const meta = itemsMeta.find(m => m.amount === amount);
            if (!meta) return;

            if (meta.qty) {
                if (meta.bonus) {
                    baseAssets = Math.round(meta.qty / (1 + meta.bonus / 100));
                    builtInBonusAssets = meta.qty - baseAssets;
                } else {
                    baseAssets = meta.qty;
                    builtInBonusAssets = 0;
                }
            }

            let star3BonusLabel = '';
            if (isStar3in1 && activity.enableChannelBonus) {
                const channelRate = activity.channelBonusRate !== undefined ? activity.channelBonusRate : 5;
                if (channelRate > 0) {
                    const bonusPoints = Math.floor(amount * (channelRate / 100));
                    if (bonusPoints > 0) {
                        star3BonusLabel = `<span class="bonus-label" style="font-size:0.8rem; padding:0.2rem 0.5rem; top:-14px; right:-12px; background:var(--accent-pink); border-color:var(--accent-pink); color:#fff; box-shadow:0 0 10px rgba(244,114,182,0.4);">+${bonusPoints} 點數</span>`;
                    }
                }
            }

            btn.innerHTML = `
                ${meta.bonus ? `<span class="bonus-label">+${meta.bonus}%</span>` : ''}
                ${star3BonusLabel}
                <span class="ntd-amount">${amount} NTD</span>
                <span class="asset-amount">${formatNumber(meta.qty)} ${meta.unit}</span>
            `;
        } else {
            let gameABonusLabel = '';
            if (activity.game === 'game_a') {
                const fixedRate = activity.enableGameAFixedBonus ? (activity.gameAFixedBonusRate !== undefined ? activity.gameAFixedBonusRate : 5) : 0;
                const channelRate = activity.enableGameAChannelBonus ? (activity.gameAChannelBonusRate !== undefined ? activity.gameAChannelBonusRate : 5) : 0;
                const totalRate = fixedRate + channelRate;
                if (totalRate > 0) {
                    const bonusAssets = Math.floor(amount * (totalRate / 100));
                    if (bonusAssets > 0) {
                        gameABonusLabel = `<span class="bonus-label" style="font-size:0.8rem; padding:0.2rem 0.5rem; top:-14px; right:-12px;">+${bonusAssets} 紅鑽</span>`;
                    }
                }
            }
            btn.innerHTML = `
                ${gameABonusLabel}
                <span class="amount">${formatNumber(amount)}</span>
            `;
        }

        btn.addEventListener('click', () => handleDepositTrigger(amount, baseAssets, builtInBonusAssets, curType, curUnit));
        els.depositButtons.appendChild(btn);
    });
}

function renderAll() {
    buildCustomSelectOptions();
    renderMainVisibility();
    if (getCurrentActivity()) {
        renderSettings();
        renderDepositButtons();
        renderStatus();
        renderRecords();
    }
}

function renderStatus() {
    const activity = getCurrentActivity();
    const session = getCurrentSession();
    if (!activity || !session) return;

    renderDepositButtons();
    const result = computeRecords(session, activity.threshold, activity.thresholdItemQty || 1);

    // --- Update Premium Status Cards ---
    let gameCurrencies = GAME_CURRENCIES[activity.game] || GAME_CURRENCIES['game_a'];
    if ((activity.game === 'star_3_in_1' || activity.game === 'mahjong2') && session.depositType) {
        gameCurrencies = gameCurrencies.filter(c => c.id === session.depositType);
    }

    // If only 1 major currency (plus total card = 2 cards), center them
    if (els.statusGrid) {
        if (gameCurrencies.length === 1) {
            els.statusGrid.classList.add('centered-grid');
        } else {
            els.statusGrid.classList.remove('centered-grid');
        }
    }

    if (els.cardDiamonds && els.valueDiamonds) {
        // First currency always goes to cardDiamonds
        const c0 = gameCurrencies[0];
        if (els.labelDiamonds) els.labelDiamonds.textContent = `當前${c0.short}`;
        els.valueDiamonds.textContent = formatNumber(result.currentAssets[c0.id] || 0);

        // Second currency (if any) goes to cardCoins
        if (gameCurrencies.length > 1 && els.cardCoins && els.valueCoins) {
            const c1 = gameCurrencies[1];
            els.cardCoins.style.display = 'flex';
            if (els.labelCoins) els.labelCoins.textContent = `當前${c1.short}`;
            els.valueCoins.textContent = formatNumber(result.currentAssets[c1.id] || 0);
        } else if (els.cardCoins) {
            els.cardCoins.style.display = 'none';
        }
    }

    // --- Update Common Status Fields ---
    if (els.currentDepositDetail) els.currentDepositDetail.style.display = 'flex';
    const lastRecord = session.records.length > 0 ? session.records[session.records.length - 1] : null;
    if (els.currentDepositDisplay) els.currentDepositDisplay.textContent = lastRecord ? formatNumber(lastRecord.depositAmount) : '0';

    // All games now use the card layout for milestone to align with "Total Items"
    if (els.statusCardMilestone) els.statusCardMilestone.style.display = 'flex';
    if (els.milestoneDetailItem) els.milestoneDetailItem.style.display = 'none';

    if (els.currentBonusDisplay) {
        const lastRecord = session.records.length > 0 ? session.records[session.records.length - 1] : null;
        els.currentBonusDisplay.textContent = lastRecord ? formatNumber(lastRecord.bonusAssets) : '0';
    }

    if (els.nextMilestoneDisplay) els.nextMilestoneDisplay.textContent = formatNumber(result.nextMilestoneDiff);
    if (els.nextMilestoneDisplayCard) els.nextMilestoneDisplayCard.textContent = formatNumber(result.nextMilestoneDiff);
    if (els.currentBonusItemsDisplay) {
        const lastRecord = session.records.length > 0 ? session.records[session.records.length - 1] : null;
        els.currentBonusItemsDisplay.textContent = lastRecord ? formatNumber(lastRecord.bonusItems) : '0';
    }
    if (els.totalItemsDisplay) els.totalItemsDisplay.textContent = formatNumber(result.totalItems);

    // --- Update Progress Bar ---
    if (activity.threshold > 0) {
        const progress = Math.min(100, Math.max(0, ((activity.threshold - result.nextMilestoneDiff) / activity.threshold) * 100));
        if (els.milestoneProgressFill) els.milestoneProgressFill.style.width = `${progress}%`;
        if (els.milestoneProgressFillCard) els.milestoneProgressFillCard.style.width = `${progress}%`;
    } else {
        if (els.milestoneProgressFill) els.milestoneProgressFill.style.width = '0%';
        if (els.milestoneProgressFillCard) els.milestoneProgressFillCard.style.width = '0%';
    }
}

function renderRecords() {
    const activity = getCurrentActivity();
    const session = getCurrentSession();
    if (!activity || !session) return;

    const { computed } = computeRecords(session, activity.threshold, activity.thresholdItemQty || 1);
    els.emptyRecords.style.display = computed.length ? 'none' : 'block';
    els.tableWrapper.style.display = computed.length ? 'block' : 'none';
    els.btnUndo.disabled = !computed.length;
    els.btnClear.disabled = !computed.length;

    const totalPages = Math.max(1, Math.ceil(computed.length / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;
    const start = (currentPage - 1) * PAGE_SIZE;
    const slice = computed.slice().reverse().slice(start, start + PAGE_SIZE);

    els.recordTbody.innerHTML = '';
    slice.forEach(rec => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="col-check"><input type="checkbox" data-index="${rec.index - 1}"></td>
            <td>${rec.index}</td>
            <td>${formatNumber(rec.depositAmount)}</td>
            <td><span style="color: var(--accent-cyan); font-weight: bold;">${formatNumber(rec.depositedAssets)}</span>${rec.currencyUnit ? ' <span style="font-size:0.85em;color:var(--text-muted)">' + rec.currencyUnit + '</span>' : ''}</td>
            <td>${rec.bonusAssets > 0 ? '<span style="color: var(--accent-green); font-weight: bold;">+' + formatNumber(rec.bonusAssets) + '</span>' + (rec.currencyUnit ? ' <span style="font-size:0.85em;color:var(--text-muted)">' + rec.currencyUnit + '</span>' : '') : '-'}</td>
            <td class="${rec.newMilestoneItems > 0 ? 'milestone-new' : ''}">${rec.newMilestoneItems > 0 ? '+' + rec.newMilestoneItems : '-'}</td>
            <td>${rec.bonusItems > 0 ? '<span style="color: var(--accent-amber); font-weight: bold;">+' + formatNumber(rec.bonusItems) + '</span>' : '-'}</td>
            <td>${formatNumber(rec.cumulativeDeposit)}</td>
            <td>${formatNumber(rec.totalMilestoneItems)}</td>
            <td class="col-total">${formatNumber(rec.totalItems)}</td>
        `;
        els.recordTbody.appendChild(tr);
    });

    els.paginationBar.style.display = totalPages > 1 ? 'flex' : 'none';
    els.pageInfo.textContent = `第 ${currentPage} / ${totalPages} 頁 (共 ${computed.length} 筆)`;
    els.btnPageFirst.disabled = currentPage === 1;
    els.btnPagePrev.disabled = currentPage === 1;
    els.btnPageNext.disabled = currentPage >= totalPages;
    els.btnPageLast.disabled = currentPage >= totalPages;

    // Reset multi-select states on re-render
    els.selectAllRecords.checked = false;
    els.btnDeleteSelected.disabled = true;
}

// ===== 6. Deposit Handling =====
function handleDepositTrigger(amount, baseAssets = amount, builtInBonusAssets = 0, currencyType = null, currencyUnit = null) {
    const activity = getCurrentActivity();
    const session = getCurrentSession();
    const isGameA = activity.game === 'game_a';

    // Resolve defaults for multi-currency games if not provided
    if (!currencyType) {
        currencyType = (activity.game === 'mahjong2' || activity.game === 'star_3_in_1') ? (session.depositType || 'diamonds') : 'default';
    }
    if (currencyUnit === null) {
        const currencyInfo = GAME_CURRENCIES[activity.game]?.find(c => c.id === currencyType);
        currencyUnit = currencyInfo ? currencyInfo.short : '';
    }

    // Determine which bonus system to use
    const hasRandomBonus = isGameA ? activity.enableGameABonus : activity.enableGlobalBonus;
    const hasFixedBonus = isGameA ? activity.enableGameAFixedBonus : false;
    const fixedRate = isGameA ? (activity.gameAFixedBonusRate !== undefined ? activity.gameAFixedBonusRate : 5) : 0;
    // 渠道加成 (game_a 或 star3in1)
    const channelRate = isGameA
        ? (activity.enableGameAChannelBonus ? (activity.gameAChannelBonusRate !== undefined ? activity.gameAChannelBonusRate : 5) : 0)
        : (activity.enableChannelBonus ? (activity.channelBonusRate !== undefined ? activity.channelBonusRate : 5) : 0);

    // 道具額外加贈
    let extraBonusItems = 0;
    if (activity.enableExtraItemBonus && activity.extraItemBonusMap) {
        extraBonusItems = activity.extraItemBonusMap[amount] || 0;
    }

    if (hasRandomBonus) {
        openVerificationModal(amount, baseAssets, builtInBonusAssets, currencyType, currencyUnit, extraBonusItems);
    } else {
        const fixedBonusAssets = (hasFixedBonus && fixedRate)
            ? Math.floor(baseAssets * (fixedRate / 100))
            : 0;
        const channelBonusAssets = channelRate
            ? Math.floor(baseAssets * (channelRate / 100))
            : 0;
        addRecord(amount, baseAssets, builtInBonusAssets + fixedBonusAssets + channelBonusAssets, extraBonusItems, currencyType, currencyUnit);
    }
}

function openVerificationModal(amount, baseAssets = amount, builtInBonusAssets = 0, currencyType = 'default', currencyUnit = '', extraBonusItems = 0) {
    const activity = getCurrentActivity();
    const isStar3in1 = activity.game === 'star_3_in_1';
    const isGameA = activity.game === 'game_a';
    els.verifyBaseAmount.textContent = formatNumber(amount);
    els.verifyOptionList.innerHTML = '';

    // Update modal instruction text
    const instruction = document.querySelector('#verification-modal .modal-instruction');
    if (instruction) {
        if (isStar3in1) {
            instruction.textContent = '請選擇遊戲實際顯示的冬季紅利點數結果：';
        } else if (isGameA) {
            instruction.textContent = '請選取遊戲畫面上實際出現的紅鑽加成結果：';
        } else {
            instruction.textContent = '請選取遊戲畫面上實際出現的結果：';
        }
    }

    // Pick bonus parameters depending on game type
    let baseMin, baseMax, step, channelBonusRate;
    if (isGameA) {
        baseMin = activity.gameABonusMin !== undefined ? activity.gameABonusMin : 0;
        baseMax = activity.gameABonusMax !== undefined ? activity.gameABonusMax : 10;
        step = activity.gameABonusStep || 1;
        // 固定加成 + 渠道加成 合計為 channelBonusRate
        const fixedPart = (activity.enableGameAFixedBonus) ? (activity.gameAFixedBonusRate !== undefined ? activity.gameAFixedBonusRate : 5) : 0;
        const chPart = (activity.enableGameAChannelBonus) ? (activity.gameAChannelBonusRate !== undefined ? activity.gameAChannelBonusRate : 5) : 0;
        channelBonusRate = fixedPart + chPart;
    } else {
        baseMin = activity.globalBonusMin !== undefined ? activity.globalBonusMin : 0;
        baseMax = activity.globalBonusMax !== undefined ? activity.globalBonusMax : 10;
        step = activity.globalBonusStep || 1;
        channelBonusRate = (activity.enableChannelBonus) ? (activity.channelBonusRate !== undefined ? activity.channelBonusRate : 5) : 0;
    }

    for (let p = baseMin; p <= baseMax; p += step) {
        const totalP = p + channelBonusRate;
        const modalBonusAssets = Math.floor(baseAssets * (totalP / 100));
        const totalAssets = baseAssets + builtInBonusAssets + modalBonusAssets;
        const btn = document.createElement('div');
        btn.className = 'verify-btn';

        let extraText = extraBonusItems > 0 ? ` (+${extraBonusItems}道具)` : '';

        if (isStar3in1) {
            const rateLabel = channelBonusRate > 0
                ? `+${totalP}% (${p}%隨機 + ${channelBonusRate}%渠道加贈)${extraText}`
                : `+${totalP}% 隨機加成${extraText}`;
            btn.innerHTML = `
                <span class="verify-amount">${formatNumber(totalAssets)} 點</span>
                <span class="verify-label">${rateLabel}</span>
            `;
        } else if (isGameA) {
            const rateLabel = channelBonusRate > 0
                ? `+${totalP}% (${p}%隨機 + ${channelBonusRate}%固定加成)${extraText}`
                : `+${totalP}% 隨機加成${extraText}`;
            btn.innerHTML = `
                <span class="verify-amount">${formatNumber(totalAssets)} 紅鑽</span>
                <span class="verify-label">${rateLabel}</span>
            `;
        } else {
            btn.innerHTML = `
                <span class="verify-amount">${formatNumber(totalAssets)}</span>
                <span class="verify-label">+${totalP}% (${p}%隨機 + ${channelBonusRate}%渠道)${extraText}</span>
            `;
        }
        btn.onclick = () => {
            addRecord(amount, baseAssets, builtInBonusAssets + modalBonusAssets, extraBonusItems, currencyType, currencyUnit);
            closeVerificationModal();
        };
        els.verifyOptionList.appendChild(btn);
    }
    els.verificationModal.style.display = 'flex';
}

function closeVerificationModal() { els.verificationModal.style.display = 'none'; }

function addRecord(amount, baseAssets, bonusAssets, bonusItems, currencyType = 'default', currencyUnit = '') {
    const session = getCurrentSession();
    session.records.push({ depositAmount: amount, baseAssets, bonusAssets, bonusItems, currencyType, currencyUnit });
    saveState();
    renderStatus();
    currentPage = 1;
    renderRecords();
}

// ===== 7. Custom Activity Select =====
function buildCustomSelectOptions() {
    const dropdown = els.activitySelectDropdown;
    dropdown.innerHTML = '';
    if (appState.activities.length === 0) {
        els.activitySelectText.textContent = '— 請先新增活動 —';
        const opt = document.createElement('div');
        opt.className = 'custom-select-option';
        opt.style.cursor = 'default';
        opt.style.color = 'var(--text-muted)';
        opt.textContent = '— 請先新增活動 —';
        dropdown.appendChild(opt);
    } else {
        const current = getCurrentActivity();
        els.activitySelectText.textContent = current ? current.name : '— 請選擇活動 —';
        appState.activities.forEach(a => {
            const opt = document.createElement('div');
            opt.className = 'custom-select-option' + (a.id === appState.currentActivityId ? ' selected' : '');
            opt.textContent = a.name;
            opt.onclick = () => {
                appState.currentActivityId = a.id;
                saveState();
                renderAll();
                els.activitySelectDropdown.classList.remove('open');
            };
            dropdown.appendChild(opt);
        });
    }
}

// Input restrictions
const enforcePositiveInteger = (input) => {
    input.addEventListener('keydown', (e) => {
        if (['e', 'E', '+', '-', '.'].includes(e.key)) {
            e.preventDefault();
        }
    });
    input.addEventListener('paste', (e) => {
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');
        if (/[^0-9]/.test(pastedText)) {
            e.preventDefault();
        }
    });
    input.addEventListener('input', (e) => {
        if (e.target.value < 0) e.target.value = Math.abs(e.target.value);
    });
};

// ===== 8. Event Listeners =====
function initEvents() {
    // Activity Select
    els.activitySelectDisplay.onclick = (e) => {
        e.stopPropagation();
        els.activitySelectDropdown.classList.toggle('open');
    };
    els.activitySelectDropdown.onclick = (e) => e.stopPropagation();
    document.onclick = () => els.activitySelectDropdown.classList.remove('open');

    // Card Collapse Logic
    document.querySelectorAll('.card-header').forEach(header => {
        header.onclick = (e) => {
            const card = header.closest('.card');
            if (card) {
                card.classList.toggle('collapsed');
            }
        };
    });

    [els.thresholdAmount, els.initialItems, els.customAmount].forEach(enforcePositiveInteger);

    // Modals
    els.btnNewActivity.onclick = () => openActivityModal('new');
    els.btnEditActivity.onclick = () => openActivityModal('edit');
    els.btnDeleteActivity.onclick = () => openConfirmModal('確定刪除此活動及其紀錄嗎？', () => {
        appState.activities = appState.activities.filter(a => a.id !== appState.currentActivityId);
        delete appState.sessions[appState.currentActivityId];
        appState.currentActivityId = appState.activities.length ? appState.activities[0].id : null;
        saveState(); renderAll();
    });

    els.activityModalSave.onclick = () => {
        const name = els.activityNameInput.value.trim();
        const game = els.activityGameInput.value;
        if (!name) return;

        let activity = getCurrentActivity();
        if (!activity || els.activityModal.dataset.mode === 'new') {
            activity = createDefaultActivity(name, game);
            appState.activities.push(activity);
            appState.currentActivityId = activity.id;
        } else {
            activity.name = name;
            activity.game = game;
        }
        saveState();
        els.activityModal.style.display = 'none';
        renderAll();
    };
    els.activityModalCancel.onclick = els.activityModalClose.onclick = () => els.activityModal.style.display = 'none';

    // Settings sync
    els.thresholdAmount.onchange = () => { getCurrentActivity().threshold = parseInt(els.thresholdAmount.value) || 0; saveState(); renderStatus(); renderRecords(); };
    // 門檻道具數
    document.getElementById('threshold-item-qty').onchange = (e) => { getCurrentActivity().thresholdItemQty = parseInt(e.target.value) || 1; saveState(); renderStatus(); renderRecords(); };
    const s3iq = document.getElementById('star3-threshold-item-qty');
    if (s3iq) s3iq.onchange = (e) => { getCurrentActivity().thresholdItemQty = parseInt(e.target.value) || 1; saveState(); renderStatus(); renderRecords(); };
    // 滿貫大亨渠道加成
    const chkEl = document.getElementById('enable-gamea-channel-bonus');
    const chkRate = document.getElementById('gamea-channel-bonus-rate');
    if (chkEl) chkEl.onchange = () => { getCurrentActivity().enableGameAChannelBonus = chkEl.checked; saveState(); renderSettings(); renderDepositButtons(); };
    if (chkRate) chkRate.onchange = () => { getCurrentActivity().gameAChannelBonusRate = parseFloat(chkRate.value) || 0; saveState(); renderDepositButtons(); };
    els.initialAssetsContainer.onchange = (e) => {
        if (e.target.classList.contains('initial-asset-input')) {
            const type = e.target.dataset.type;
            getCurrentSession().initialAssets[type] = parseInt(e.target.value) || 0;
            saveState();
            renderStatus();
            renderRecords();
        }
    };
    els.initialItems.onchange = () => { getCurrentSession().initialItems = parseInt(els.initialItems.value) || 0; saveState(); renderStatus(); renderRecords(); };
    els.vipSelect.onchange = () => { getCurrentSession().vipLevel = parseInt(els.vipSelect.value); saveState(); renderDepositButtons(); };
    els.platformSelect.onchange = () => { getCurrentSession().platform = els.platformSelect.value; saveState(); renderDepositButtons(); };
    els.depositTypeSelect.onchange = () => { getCurrentSession().depositType = els.depositTypeSelect.value; saveState(); renderDepositButtons(); renderStatus(); };

    // Global Bonus settings
    els.enableGlobalBonus.onchange = () => { getCurrentActivity().enableGlobalBonus = els.enableGlobalBonus.checked; saveState(); renderSettings(); };
    els.globalBonusMin.onchange = () => { getCurrentActivity().globalBonusMin = parseFloat(els.globalBonusMin.value) || 0; saveState(); };
    els.globalBonusMax.onchange = () => { getCurrentActivity().globalBonusMax = parseFloat(els.globalBonusMax.value) || 0; saveState(); };
    els.globalBonusStep.onchange = () => { getCurrentActivity().globalBonusStep = parseFloat(els.globalBonusStep.value) || 1; saveState(); };

    // Channel Bonus settings
    els.enableChannelBonus.onchange = () => { getCurrentActivity().enableChannelBonus = els.enableChannelBonus.checked; saveState(); renderSettings(); renderDepositButtons(); };
    els.channelBonusRate.onchange = () => { getCurrentActivity().channelBonusRate = parseFloat(els.channelBonusRate.value) || 0; saveState(); renderDepositButtons(); };

    // 滿貫大亨紅鑽加成 settings
    els.enableGameABonus.onchange = () => { getCurrentActivity().enableGameABonus = els.enableGameABonus.checked; saveState(); renderSettings(); };
    els.gameABonusMin.onchange = () => { getCurrentActivity().gameABonusMin = parseFloat(els.gameABonusMin.value) || 0; saveState(); };
    els.gameABonusMax.onchange = () => { getCurrentActivity().gameABonusMax = parseFloat(els.gameABonusMax.value) || 0; saveState(); };
    els.gameABonusStep.onchange = () => { getCurrentActivity().gameABonusStep = parseFloat(els.gameABonusStep.value) || 1; saveState(); };
    els.enableGameAFixedBonus.onchange = () => { getCurrentActivity().enableGameAFixedBonus = els.enableGameAFixedBonus.checked; saveState(); renderSettings(); renderDepositButtons(); };
    els.gameAFixedBonusRate.onchange = () => { getCurrentActivity().gameAFixedBonusRate = parseFloat(els.gameAFixedBonusRate.value) || 0; saveState(); renderDepositButtons(); };
    els.enableExtraItemBonus.onchange = () => { getCurrentActivity().enableExtraItemBonus = els.enableExtraItemBonus.checked; saveState(); renderSettings(); };

    // Deposit
    els.btnCustomDeposit.onclick = () => { const val = parseInt(els.customAmount.value); if (val) { handleDepositTrigger(val); els.customAmount.value = ''; } };
    els.verificationModalCancel.onclick = els.verificationModalClose.onclick = closeVerificationModal;

    // Record actions
    const changePage = (step) => {
        const session = getCurrentSession();
        if (!session) return;
        const totalPages = Math.max(1, Math.ceil(session.records.length / PAGE_SIZE));
        let newPage = currentPage;
        if (step === 'first') newPage = 1;
        else if (step === 'prev') newPage = Math.max(1, currentPage - 1);
        else if (step === 'next') newPage = Math.min(totalPages, currentPage + 1);
        else if (step === 'last') newPage = totalPages;

        if (newPage !== currentPage) {
            currentPage = newPage;
            renderRecords();
        }
    };
    els.btnPageFirst.onclick = () => changePage('first');
    els.btnPagePrev.onclick = () => changePage('prev');
    els.btnPageNext.onclick = () => changePage('next');
    els.btnPageLast.onclick = () => changePage('last');

    els.selectAllRecords.onchange = (e) => {
        const checkboxes = els.recordTbody.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = e.target.checked);
        els.btnDeleteSelected.disabled = !e.target.checked || checkboxes.length === 0;
    };

    els.recordTbody.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const allBoxes = els.recordTbody.querySelectorAll('input[type="checkbox"]');
            const checkedBoxes = els.recordTbody.querySelectorAll('input[type="checkbox"]:checked');
            els.selectAllRecords.checked = (allBoxes.length > 0 && allBoxes.length === checkedBoxes.length);
            els.btnDeleteSelected.disabled = checkedBoxes.length === 0;
        }
    });

    els.btnDeleteSelected.onclick = () => {
        const checkedBoxes = els.recordTbody.querySelectorAll('input[type="checkbox"]:checked');
        if (!checkedBoxes.length) return;

        openConfirmModal(`確定刪除這 ${checkedBoxes.length} 筆紀錄？`, () => {
            const session = getCurrentSession();
            const indices = Array.from(checkedBoxes).map(cb => parseInt(cb.dataset.index)).sort((a, b) => b - a);
            indices.forEach(idx => session.records.splice(idx, 1));

            saveState();
            renderStatus();
            renderRecords();
        });
    };

    els.btnUndo.onclick = () => { getCurrentSession().records.pop(); saveState(); renderStatus(); renderRecords(); };
    els.btnClear.onclick = () => openConfirmModal('確定清空所有紀錄？', () => { getCurrentSession().records = []; saveState(); renderStatus(); renderRecords(); });

    // Confirm Modal
    els.confirmYes.onclick = () => { els.confirmModal.style.display = 'none'; if (els.confirmModal._callback) els.confirmModal._callback(); };
    els.confirmNo.onclick = () => els.confirmModal.style.display = 'none';
}

function openActivityModal(mode) {
    els.activityModal.dataset.mode = mode;
    const activity = getCurrentActivity();
    els.activityNameInput.value = mode === 'edit' ? activity.name : '';
    els.activityGameInput.value = mode === 'edit' ? activity.game : 'game_a';
    els.activityModal.style.display = 'flex';
}

function openConfirmModal(msg, cb) {
    els.confirmMessage.textContent = msg;
    els.confirmModal._callback = cb;
    els.confirmModal.style.display = 'flex';
}

// ===== 9. Initialization =====
function init() {
    loadState();
    initEvents();
    renderAll();
}

window.onload = init;
